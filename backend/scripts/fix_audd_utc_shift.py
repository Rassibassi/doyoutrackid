"""One-off repair: shift tracks stored 3 hours too early back into place.

AudD switched its stream "timestamp" from UTC+3 to UTC on 2026-10-12 16:26
UTC, while app.py still treated it as UTC+3. Tracks received since then were
stored with played_datetime 3 hours early (and sometimes the previous
played_date). Correct tracks are played ~seconds before they are received,
broken ones exactly 3 hours before, so each item is detected by that lag.

played_date/played_datetime are the table's keys, so every fixed track is
written as a new item and then its old item is deleted. AudD timestamps sit
on a fixed grid, so a fixed key can equal the old key of another shifted
track; processing latest first frees each key before it is reused, and the
conditional put never overwrites an existing item. Re-running is safe: fixed
items no longer have the 3 hour lag.

Usage (from backend/, with AWS_PROFILE set):
    python scripts/fix_audd_utc_shift.py                    # dry run, read only
    python scripts/fix_audd_utc_shift.py --apply --backup FILE.json
"""
import argparse
import json
import sys
import time
from datetime import date, datetime, timedelta

import boto3
import pytz
from boto3.dynamodb.conditions import Key

FIRST_AFFECTED_DATE = date(2026, 10, 12)
SHIFT = timedelta(hours=3)
# table is provisioned with 5 WCU; leave room for live AudD callbacks
SECONDS_PER_WRITE = 0.4
datetime_format = "%Y-%m-%d %H:%M:%S%z"
date_format = "%Y-%m-%d"
london_tz = pytz.timezone("Europe/London")


def table_name_from_config():
    with open(".chalice/config.json") as f:
        return json.load(f)["environment_variables"]["DYNAMODB_TABLE"]


def is_shifted(item):
    played = datetime.strptime(item["played_datetime"], datetime_format)
    received = datetime.strptime(item["received_datetime"], datetime_format)
    lag = received - played
    return SHIFT - timedelta(minutes=30) < lag < SHIFT + timedelta(minutes=30)


def fixed_copy(item):
    played = datetime.strptime(item["played_datetime"], datetime_format)
    played = (played + SHIFT).astimezone(london_tz)
    return {
        **item,
        "played_date": played.strftime(date_format),
        "played_datetime": played.strftime(datetime_format),
    }


def query_day(table, day):
    kwargs = {"KeyConditionExpression": Key("played_date").eq(day)}
    while True:
        response = table.query(**kwargs)
        yield from response["Items"]
        if "LastEvaluatedKey" not in response:
            return
        kwargs["ExclusiveStartKey"] = response["LastEvaluatedKey"]


def query_since_first_affected(table, until):
    day = FIRST_AFFECTED_DATE
    while day <= until:
        yield from query_day(table, day.isoformat())
        day += timedelta(days=1)


def key_of(item):
    return (item["played_date"], item["played_datetime"])


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--apply", action="store_true", help="write the fix")
    parser.add_argument("--backup", help="JSON file for the original items")
    args = parser.parse_args(argv)
    if args.apply and not args.backup:
        parser.error("--apply needs --backup")

    table = boto3.resource("dynamodb").Table(table_name_from_config())
    today_london = datetime.now(london_tz).date()
    items = list(query_since_first_affected(table, today_london))
    shifted = [i for i in items if is_shifted(i)]

    # landing on the old key of another shifted item is fine (it moves away
    # first), landing on a correct item is not
    correct_keys = {key_of(i) for i in items if not is_shifted(i)}
    collisions = {key_of(fixed_copy(i)) for i in shifted} & correct_keys
    if collisions:
        print(f"ABORT: fixed keys collide with correct items: {sorted(collisions)}")
        return 1

    per_day = {}
    for item in shifted:
        per_day[item["played_date"]] = per_day.get(item["played_date"], 0) + 1
    for day, count in sorted(per_day.items()):
        print(f"{day}: {count} tracks 3h early")
    moved_day = [i for i in shifted if fixed_copy(i)["played_date"] != i["played_date"]]
    print(f"total: {len(shifted)} tracks, {len(moved_day)} of them move to the next day")
    for item in shifted[:3]:
        fixed = fixed_copy(item)
        print(f"  {item['played_datetime']} -> {fixed['played_datetime']}  "
              f"{item['artist']} - {item['title']}")

    if not args.apply:
        print("dry run, nothing written. Use --apply --backup FILE.json to fix.")
        return 0

    with open(args.backup, "w") as f:
        json.dump(shifted, f, default=str, indent=1)
    print(f"backed up {len(shifted)} original items to {args.backup}")

    latest_first = sorted(
        shifted,
        key=lambda i: datetime.strptime(i["played_datetime"], datetime_format),
        reverse=True,
    )
    for n, item in enumerate(latest_first, 1):
        table.put_item(
            Item=fixed_copy(item),
            ConditionExpression="attribute_not_exists(played_datetime)",
        )
        time.sleep(SECONDS_PER_WRITE)
        table.delete_item(Key=dict(zip(["played_date", "played_datetime"], key_of(item))))
        time.sleep(SECONDS_PER_WRITE)
        if n % 100 == 0:
            print(f"  {n}/{len(shifted)} fixed", flush=True)
    print(f"fixed {len(shifted)} tracks")
    return 0


if __name__ == "__main__":
    sys.exit(main())
