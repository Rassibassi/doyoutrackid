import csv
import logging
import os
import re
from datetime import date, datetime
from functools import partial
from io import StringIO

import boto3
import pytz
from boto3.dynamodb.conditions import Key
from chalice import Chalice, CORSConfig, Response

# from ENV vars
# import secrets; print(secrets.token_urlsafe(24))
AUDD_CALLBACK_SECRET = os.environ["AUDD_CALLBACK_SECRET"]
DYNAMODB_TABLE = os.environ["DYNAMODB_TABLE"]

# chalice app
app = Chalice(app_name="doyoutrackid")
app.log.setLevel(logging.DEBUG)
cors_config = CORSConfig(allow_origin="*")

# dynamo db
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(DYNAMODB_TABLE)

# misc
date_format = "%Y-%m-%d"
datetime_format = "%Y-%m-%d %H:%M:%S%z"
audd_datetime_format = "%Y-%m-%d %H:%M:%S"

# regex sub partial to remove everything that
# is in brackets "() []" and
# are non alphanumeric characters but
# keep spaces
clean_string = partial(re.sub, re.compile(r"\([^)]*\)|\[[^)]*\]|[^a-zA-Z0-9\s]"), "")

london_tz = pytz.timezone("Europe/London")
audd_tz = pytz.timezone("Etc/GMT-3")


# helper functions
def as_london(datetime_obj):
    return datetime_obj.astimezone(london_tz)


def get_tracks_of(start_date_obj, end_date_obj=None, reverse=True):
    if end_date_obj is None:
        # query database table for entries of date_obj, single day
        filtering_exp = Key("played_date").eq(start_date_obj.strftime(date_format))
        db_response = table.query(KeyConditionExpression=filtering_exp)

    else:
        # scan database table for entries of date_obj, range of days
        filtering_exp = Key("played_date").between(
            start_date_obj.strftime(date_format), end_date_obj.strftime(date_format)
        )
        db_response = table.scan(FilterExpression=filtering_exp)

    # sort by datetime
    db_response["Items"].sort(
        reverse=reverse,
        key=lambda item: datetime.strptime(item["played_datetime"], datetime_format),
    )

    return db_response["Items"]


def is_duplicate(track_a, track_b, compare_keys=["artist", "title"]):
    return all(
        clean_string(track_a[key]).strip() == clean_string(track_b[key]).strip()
        for key in compare_keys
    )


def any_duplicate(new_track, tracks_of_today):
    return any(is_duplicate(new_track, saved_track) for saved_track in tracks_of_today)


# lambda functions
@app.route("/archive/{day}/{month}/{year}", methods=["GET"], cors=cors_config)
def archive(day, month, year):
    day_string = f"{year}-{month}-{day}"
    requested_day = datetime.strptime(day_string, date_format)
    tracks_of_requested_day = get_tracks_of(requested_day, reverse=False)

    return {"message": f"{day_string} played tracks", "tracks": tracks_of_requested_day}


@app.route("/today", methods=["GET"], cors=cors_config)
def today():
    today = date.today()
    tracks_of_today = get_tracks_of(today)

    return {"message": "today's played tracks", "tracks": tracks_of_today}


@app.route(
    "/csv/{sday}/{smonth}/{syear}/{eday}/{emonth}/{eyear}",
    methods=["GET"],
    cors=cors_config,
)
def as_csv(sday, smonth, syear, eday, emonth, eyear):
    start_day_string = f"{syear}-{smonth}-{sday}"
    end_day_string = f"{eyear}-{emonth}-{eday}"

    start_requested_day = datetime.strptime(start_day_string, date_format)
    end_requested_day = datetime.strptime(end_day_string, date_format)

    # adds leading zeros to day and month
    start_day_string = start_requested_day.strftime(date_format)
    end_day_string = end_requested_day.strftime(date_format)
    filename = f"{start_day_string}_{end_day_string}.csv"

    headers = {
        "Content-Type": "text/csv",
        "Content-Disposition": f"attachment; filename={filename}",
    }

    tracks = get_tracks_of(
        start_requested_day, end_date_obj=end_requested_day, reverse=False
    )

    fieldnames = set()
    for track in tracks:
        fieldnames.update(list(track.keys()))
    fieldnames = list(fieldnames)

    string_io = StringIO()
    if isinstance(tracks, list) and len(tracks) > 0:
        writer = csv.DictWriter(string_io, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(tracks)
        csv_string = string_io.getvalue()
    else:
        csv_string = ""

    return Response(body=csv_string, headers=headers)


@app.route(
    f"/{AUDD_CALLBACK_SECRET}",
    methods=["POST"],
    cors=cors_config,
    content_types=["application/json"],
)
def audd_callback():
    response = app.current_request.json_body

    if response["status"] == "success":
        result = response["result"]

        now_london = as_london(datetime.now())
        audd_datetime = datetime.strptime(result["timestamp"], audd_datetime_format)
        audd_london = as_london(audd_tz.localize(audd_datetime))

        # choose track with highest score
        n_results = len(result["results"])
        result["results"].sort(
            reverse=True,
            key=lambda item: item["score"],
        )
        new_track = result["results"][0]
        app.log.debug(f"new_track: {new_track}")

        # get latest tracks from database to check if duplicate
        tracks_of_today = get_tracks_of(date.today())

        # check for duplicate here
        if tracks_of_today and any_duplicate(new_track, tracks_of_today):
            return {"message": "this was a duplicate"}
        else:
            # write new track into database
            item = {
                "received_datetime": now_london.strftime(datetime_format),
                "played_date": audd_london.strftime(date_format),
                "played_datetime": audd_london.strftime(datetime_format),
                "out_of": n_results,
            }
            item.update(new_track)
            table.put_item(Item=item)

            return {"message": "added new track"}
    else:
        error = response["notification"]["notification_message"]
        app.log.debug(error)

        return {"message": f"AUDD error: {error}"}
