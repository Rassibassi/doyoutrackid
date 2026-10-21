"""Tests for scripts/fix_audd_utc_shift.py against an in-memory table."""
import json
import os
import sys

import pytest

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BACKEND_DIR, "scripts"))

import fix_audd_utc_shift as fix  # noqa: E402


class ConditionFailed(Exception):
    pass


class FakeTable:
    def __init__(self, items):
        self.items = {(i["played_date"], i["played_datetime"]): i for i in items}

    def query(self, KeyConditionExpression, **kwargs):
        day = KeyConditionExpression.get_expression()["values"][1]
        return {"Items": [i for k, i in self.items.items() if k[0] == day]}

    def put_item(self, Item, ConditionExpression=None):
        key = (Item["played_date"], Item["played_datetime"])
        if ConditionExpression and key in self.items:
            raise ConditionFailed(key)
        self.items[key] = Item

    def delete_item(self, Key):
        del self.items[(Key["played_date"], Key["played_datetime"])]


def track(title, played, received):
    return {
        "title": title,
        "artist": "a",
        "played_date": played[:10],
        "played_datetime": played,
        "received_datetime": received,
    }


@pytest.fixture
def run(monkeypatch, tmp_path):
    def run(items, *args):
        table = FakeTable(items)
        monkeypatch.setattr(fix.boto3, "resource", lambda name: type(
            "R", (), {"Table": lambda self, n: table})())
        monkeypatch.setattr(fix, "table_name_from_config", lambda: "t")
        monkeypatch.setattr(fix, "SECONDS_PER_WRITE", 0)
        code = fix.main(list(args) + ["--backup", str(tmp_path / "b.json")])
        return code, table
    return run


def test_fixes_shifted_tracks_and_keeps_correct_ones(run, tmp_path):
    items = [
        track("correct", "2026-10-12 15:00:00+0100", "2026-10-12 15:00:10+0100"),
        track("shifted", "2026-10-13 14:00:00+0100", "2026-10-13 17:00:10+0100"),
        # played 00:30 London, stored on the previous day
        track("next day", "2026-10-13 21:30:00+0100", "2026-10-14 00:30:10+0100"),
    ]
    code, table = run(items, "--apply")
    assert code == 0
    assert {(k[1], i["title"]) for k, i in table.items.items()} == {
        ("2026-10-12 15:00:00+0100", "correct"),
        ("2026-10-13 17:00:00+0100", "shifted"),
        ("2026-10-14 00:30:00+0100", "next day"),
    }
    assert ("2026-10-14", "2026-10-14 00:30:00+0100") in table.items
    assert len(json.load(open(tmp_path / "b.json"))) == 2


def test_chain_of_keys_3h_apart_loses_nothing(run):
    # b's fixed key is a's old key, a's fixed key is c's old key
    items = [
        track("b", "2026-10-13 08:00:00+0100", "2026-10-13 11:00:10+0100"),
        track("a", "2026-10-13 11:00:00+0100", "2026-10-13 14:00:10+0100"),
        track("c", "2026-10-13 14:00:00+0100", "2026-10-13 17:00:10+0100"),
    ]
    code, table = run(items, "--apply")
    assert code == 0
    assert {k[1]: i["title"] for k, i in table.items.items()} == {
        "2026-10-13 11:00:00+0100": "b",
        "2026-10-13 14:00:00+0100": "a",
        "2026-10-13 17:00:00+0100": "c",
    }


def test_rerun_changes_nothing(run):
    items = [track("s", "2026-10-13 14:00:00+0100", "2026-10-13 17:00:10+0100")]
    _, table = run(items, "--apply")
    fixed = dict(table.items)
    _, table = run(list(fixed.values()), "--apply")
    assert table.items == fixed


def test_aborts_when_landing_on_a_correct_track(run):
    items = [
        track("correct", "2026-10-13 17:00:00+0100", "2026-10-13 17:00:10+0100"),
        track("shifted", "2026-10-13 14:00:00+0100", "2026-10-13 17:00:10+0100"),
    ]
    code, table = run(items, "--apply")
    assert code == 1
    assert {i["title"] for i in table.items.values()} == {"correct", "shifted"}


def test_dry_run_writes_nothing(run):
    items = [track("s", "2026-10-13 14:00:00+0100", "2026-10-13 17:00:10+0100")]
    _, table = run(items)
    assert list(table.items.values()) == items
