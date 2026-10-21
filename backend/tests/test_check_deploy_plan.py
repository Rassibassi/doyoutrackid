"""Offline tests for scripts/check_deploy_plan.py using a fake AWS client.

They prove the guard passes for the current deployment state and fails for
the situations that would make `chalice deploy` change the API URL.
"""
import json
import os
import shutil
import sys

import pytest

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BACKEND_DIR, "scripts"))

import check_deploy_plan as guard  # noqa: E402

ACCOUNT = "123456789012"
DEPLOYED_DEV = {
    "resources": [
        {
            "name": "api_handler_role",
            "resource_type": "iam_role",
            "role_arn": f"arn:aws:iam::{ACCOUNT}:role/doyoutrackid-v2-dev-api_handler",
            "role_name": "doyoutrackid-v2-dev-api_handler",
        },
        {
            "name": "api_handler",
            "resource_type": "lambda_function",
            "lambda_arn": f"arn:aws:lambda:eu-central-1:{ACCOUNT}"
            ":function:doyoutrackid-v2-dev",
        },
        {
            "name": "rest_api",
            "resource_type": "rest_api",
            "rest_api_id": guard.EXPECTED_REST_API_ID,
            "rest_api_url": guard.EXPECTED_URL,
        },
    ],
    "schema_version": "2.0",
    "backend": "api",
}


class FakeAWSClient:
    """Pretends the live resources exist (or not) in the account."""

    def __init__(self, rest_api_exists=True, lambda_exists=True):
        self.rest_api_exists = rest_api_exists
        self.lambda_exists = lambda_exists

    def get_rest_api(self, rest_api_id):
        if self.rest_api_exists and rest_api_id == guard.EXPECTED_REST_API_ID:
            return {"id": rest_api_id}
        return {}

    def lambda_function_exists(self, name):
        return self.lambda_exists

    def get_role_arn_for_name(self, name):
        return f"arn:aws:iam::{ACCOUNT}:role/{name}"


@pytest.fixture
def project(tmp_path, monkeypatch):
    """A copy of backend/ with dummy config and the real deployed state."""
    monkeypatch.setenv("AWS_DEFAULT_REGION", "eu-central-1")
    for name in ["app.py", "requirements.txt"]:
        shutil.copy(os.path.join(BACKEND_DIR, name), tmp_path / name)
    chalice_dir = tmp_path / ".chalice"
    (chalice_dir / "deployed").mkdir(parents=True)

    with open(os.path.join(BACKEND_DIR, ".chalice", "config.json.template")) as f:
        config = json.load(f)
    config["app_name"] = guard.EXPECTED_APP_NAME
    config["environment_variables"] = {
        "DYNAMODB_TABLE": "dummy-table",
        "AUDD_CALLBACK_SECRET": "dummy-secret",
    }
    (chalice_dir / "config.json").write_text(json.dumps(config))
    (chalice_dir / "policy.json").write_text(
        open(os.path.join(BACKEND_DIR, ".chalice", "policy.json.template")).read()
    )
    (chalice_dir / "deployed" / "dev.json").write_text(json.dumps(DEPLOYED_DEV))
    return tmp_path


def plan_problems(project, client):
    problems, _ = guard.check_plan(guard.compute_plan(str(project), client=client))
    return problems


def test_current_state_keeps_url(project):
    assert guard.check_local_files(str(project)) == []
    problems, info = guard.check_plan(
        guard.compute_plan(str(project), client=FakeAWSClient())
    )
    assert problems == []
    assert info["function_name"] == "doyoutrackid-v2-dev"
    assert info["runtime"] == f"python{sys.version_info.major}.{sys.version_info.minor}"


def test_missing_deployed_json_is_caught(project):
    os.remove(project / ".chalice" / "deployed" / "dev.json")
    assert any("missing" in p for p in guard.check_local_files(str(project)))
    assert any("import_rest_api" in p for p in plan_problems(project, FakeAWSClient()))


def test_api_not_found_in_account_or_region_is_caught(project):
    problems = plan_problems(project, FakeAWSClient(rest_api_exists=False))
    assert any("import_rest_api" in p for p in problems)


def test_new_lambda_is_caught(project):
    problems = plan_problems(project, FakeAWSClient(lambda_exists=False))
    assert any("create_function" in p for p in problems)


def test_renamed_app_is_caught(project):
    config_path = project / ".chalice" / "config.json"
    config = json.loads(config_path.read_text())
    config["app_name"] = "doyoutrackid-v3"
    config_path.write_text(json.dumps(config))
    assert any("app_name" in p for p in guard.check_local_files(str(project)))
