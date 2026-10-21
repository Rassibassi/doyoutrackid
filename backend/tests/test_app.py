"""Tests for app.py routes with an in-memory stand-in for the DynamoDB table."""
import json
import os

import pytest

os.environ.setdefault("AWS_DEFAULT_REGION", "eu-central-1")
os.environ.setdefault("DYNAMODB_TABLE", "dummy-table")
os.environ.setdefault("AUDD_CALLBACK_SECRET", "test-secret")

import app  # noqa: E402
from chalice.test import Client  # noqa: E402


class FakeTable:
    def __init__(self):
        self.items = []

    def query(self, KeyConditionExpression):
        return {"Items": []}

    def put_item(self, Item):
        self.items.append(Item)


@pytest.fixture
def table(monkeypatch):
    fake = FakeTable()
    monkeypatch.setattr(app, "table", fake)
    return fake


def audd_callback_body(timestamp):
    return {
        "status": "success",
        "result": {
            "timestamp": timestamp,
            "results": [{"artist": "Bent", "title": "Magic Love", "score": 90}],
        },
    }


@pytest.mark.parametrize(
    "audd_timestamp, played_date, played_datetime",
    [
        # summer time: London is UTC+1
        ("2026-10-14 18:30:00", "2026-10-14", "2026-10-14 19:30:00+0100"),
        # after midnight in London must land on the next day
        ("2026-10-14 23:30:00", "2026-10-15", "2026-10-15 00:30:00+0100"),
        # winter time: London is UTC
        ("2026-12-01 18:30:00", "2026-12-01", "2026-12-01 18:30:00+0000"),
    ],
)
def test_audd_timestamp_is_utc(table, audd_timestamp, played_date, played_datetime):
    with Client(app.app) as client:
        response = client.http.post(
            f"/{app.AUDD_CALLBACK_SECRET}",
            headers={"Content-Type": "application/json"},
            body=json.dumps(audd_callback_body(audd_timestamp)),
        )
    assert response.json_body == {"message": "added new track"}
    [item] = table.items
    assert item["played_date"] == played_date
    assert item["played_datetime"] == played_datetime
