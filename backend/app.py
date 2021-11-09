import json
import logging
import os
import re
import shlex
import subprocess
from datetime import date, datetime
from functools import partial

import boto3
import pytz
import requests
from boto3.dynamodb.conditions import Key
from chalice import Chalice, CORSConfig, Cron

# from ENV vars
STREAM_URL = os.environ["STREAM_URL"]
AUDD_API_KEY = os.environ["AUDD_API_KEY"]
AUDD_URL = os.environ["AUDD_URL"]
FRONTEND_ORIGIN = os.environ["FRONTEND_ORIGIN"]
DYNAMODB_TABLE = os.environ["DYNAMODB_TABLE"]

# audd errors
AUDD_ERROR = {
    907: "#907 - Recognition the song is not yet released.",
    901: "#901 - No api_token passed.",
    900: "#900 - Wrong API token.",
    600: "#600 - Incorrect audio url.",
    700: "#700 - No file attached.",
    500: "#500 - Incorrect audio file.",
    400: "#400 - Too big audio file.",
    300: "#300 - Fingerprinting error.",
    100: "#100 - An unknown error. Contact audd.io.",
}

# variables for recording
record_time = 20
bps = 16000
max_retries = 4
ffmpeg_command = "/opt/bin/ffmpeg -i {} -f mp3 -t {} -"
command = shlex.split(ffmpeg_command.format(STREAM_URL, record_time))

# chalice app
app = Chalice(app_name="doyoutrackid")
app.log.setLevel(logging.DEBUG)
cors_config = CORSConfig(allow_origin=FRONTEND_ORIGIN)

# dynamo db
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(DYNAMODB_TABLE)

# misc
date_format = "%Y-%m-%d"
datetime_format = "%Y-%m-%d %H:%M:%S%z"

# regex sub partial to remove everything that
# is in brackets "() []" and
# are non alphanumeric characters but
# keep spaces
clean_string = partial(re.sub, re.compile(r"\([^)]*\)|\[[^)]*\]|[^a-zA-Z0-9\s]"), "")


# helper functions
def as_london(datetime_obj):
    return datetime_obj.astimezone(pytz.timezone("Europe/London"))


def get_tracks_of(date_obj, reverse=True):
    # get datetime objects from start and end of date_obj
    start_of_day = datetime.combine(date_obj, datetime.min.time())
    start_of_day = as_london(start_of_day)

    end_of_day = datetime.combine(date_obj, datetime.max.time())
    end_of_day = as_london(end_of_day)

    # scan database table for entries of date_obj
    fe = Key("played_datetime").between(
        start_of_day.strftime(datetime_format), end_of_day.strftime(datetime_format)
    )
    db_response = table.scan(FilterExpression=fe)

    # sort by datetime
    db_response["Items"].sort(
        reverse=reverse,
        key=lambda item: datetime.strptime(item["played_datetime"], datetime_format),
    )

    return db_response["Items"]


def check_duplicate(track_a, track_b, compare_keys=["artist", "title"]):
    return all(
        clean_string(track_a[key]).strip() == clean_string(track_b[key]).strip()
        for key in compare_keys
    )


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


@app.schedule(Cron("1/2", "9-11", "?", "*", "MON-FRI", "*"))
def use_ffmpeg(event):
    for retries in range(1, max_retries + 1):
        # datetime object for later
        now_london = as_london(datetime.now())

        # record stream and pipe bytes into byte object
        p = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        app.log.debug(f"len(p.stdout): {len(p.stdout)}")

        # check if something was recorded
        if len(p.stdout) < bps * record_time:
            app.log.debug(f"recording error, retrying... {retries}/{max_retries}")
            continue
        else:
            # request audd API with API key and recorded data
            result = requests.post(
                AUDD_URL, data={"api_token": AUDD_API_KEY}, files={"file": p.stdout}
            )
            audd_response = json.loads(result.text)

            app.log.debug(f"audd_response: {audd_response}")

            # audd error handling
            if audd_response["status"] == "error":
                error_code = int(audd_response["error"]["error_code"])
                error_message = audd_response["error"]["error_message"]
                error_message_short = AUDD_ERROR[error_code]

                # these two error codes are worth trying again
                if error_code == 300 or error_code == 500:
                    app.log.debug(f"audd error, retrying... {retries}/{max_retries}")
                    continue
                else:
                    return {"message": error_message_short}

            elif audd_response["status"] == "success" and audd_response["result"]:
                # get latest track from database to check if duplicate
                today = date.today()
                tracks_of_today = get_tracks_of(today)
                # get latest item from list if any, otherwise None
                latest_track = next(iter(tracks_of_today), None)
                new_track = audd_response["result"]

                app.log.debug(f"latest_track: {new_track}")
                app.log.debug(f"latest_track: {latest_track}")

                if latest_track is not None and check_duplicate(
                    new_track, latest_track
                ):
                    return {"message": "this was a duplicate"}
                else:
                    # write new track into database
                    item = {"played_datetime": now_london.strftime(datetime_format)}
                    item.update(new_track)
                    db_put_response = table.put_item(Item=item)
                    return {
                        "message": "added new track",
                        "item": item,
                        "database": db_put_response,
                    }

            else:
                return {"message": "could not find any id"}

    return {"message": f"tried it {max_retries} times"}
