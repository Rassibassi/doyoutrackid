"""Pre-deploy guard: make sure `chalice deploy` keeps the live API URL.

Users (and the frontend) call the raw API Gateway URL, which is tied to one
REST API id. Chalice only reuses that API if .chalice/deployed/<stage>.json
points at it AND the API is found in the account/region you deploy with.
Otherwise it silently imports a brand new REST API with a new URL.

This script runs Chalice's own planner (the same code path as
`chalice deploy`) without executing anything, and fails if the plan would
create a new REST API, Lambda or role, delete anything, or target a
different API id.

Usage (from backend/):
    python scripts/check_deploy_plan.py            # local + AWS checks
    python scripts/check_deploy_plan.py --offline  # local file checks only
"""
import argparse
import json
import os
import sys

EXPECTED_REST_API_ID = "3rqvxp6o77"
EXPECTED_REGION = "eu-central-1"
EXPECTED_APP_NAME = "doyoutrackid-v2"
EXPECTED_API_GATEWAY_STAGE = "api"
STAGE = "dev"
EXPECTED_URL = (
    f"https://{EXPECTED_REST_API_ID}.execute-api.{EXPECTED_REGION}"
    f".amazonaws.com/{EXPECTED_API_GATEWAY_STAGE}/"
)

# API calls that mean "a new resource is created" or "something is removed"
FORBIDDEN_CALLS = {
    "import_rest_api": "would create a NEW REST API (new URL)",
    "create_function": "would create a NEW Lambda function",
    "create_role": "would create a NEW IAM role",
}
# Chalice issues this on every deploy when no reserved concurrency is set
ALLOWED_DELETE_CALLS = {"delete_function_concurrency"}

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def check_local_files(project_dir, stage=STAGE):
    """Check config.json and deployed/<stage>.json without touching AWS."""
    problems = []
    chalice_dir = os.path.join(project_dir, ".chalice")

    with open(os.path.join(chalice_dir, "config.json")) as f:
        config = json.load(f)
    if config.get("app_name") != EXPECTED_APP_NAME:
        problems.append(
            f"config.json app_name is {config.get('app_name')!r}, expected "
            f"{EXPECTED_APP_NAME!r} (resource names are derived from it)"
        )
    api_stage = config.get("stages", {}).get(stage, {}).get("api_gateway_stage")
    if api_stage != EXPECTED_API_GATEWAY_STAGE:
        problems.append(
            f"api_gateway_stage for stage {stage!r} is {api_stage!r}, expected "
            f"{EXPECTED_API_GATEWAY_STAGE!r} (it is part of the URL path)"
        )

    deployed_path = os.path.join(chalice_dir, "deployed", f"{stage}.json")
    if not os.path.exists(deployed_path):
        problems.append(
            f"{deployed_path} is missing: Chalice would create a new REST API. "
            "Restore it from a backup before deploying."
        )
        return problems

    with open(deployed_path) as f:
        deployed = json.load(f)
    rest_apis = [
        r for r in deployed.get("resources", []) if r["resource_type"] == "rest_api"
    ]
    if not rest_apis:
        problems.append(f"{deployed_path} has no rest_api resource")
    for r in rest_apis:
        if r.get("rest_api_id") != EXPECTED_REST_API_ID:
            problems.append(
                f"deployed rest_api_id is {r.get('rest_api_id')!r}, "
                f"expected {EXPECTED_REST_API_ID!r}"
            )
        if r.get("rest_api_url") != EXPECTED_URL:
            problems.append(
                f"deployed rest_api_url is {r.get('rest_api_url')!r}, "
                f"expected {EXPECTED_URL!r}"
            )
    return problems


class _CaptureExecutor:
    """Executor stand-in that records the plan instead of running it."""

    def __init__(self, client, ui):
        self.resource_values = []
        self.plan = None

    def execute(self, plan):
        self.plan = plan


def compute_plan(project_dir, stage=STAGE, client=None):
    """Return Chalice's deployment plan for `stage` without executing it.

    Mirrors chalice.deploy.deployer._create_deployer, but with an executor
    that only captures the plan. `client` can be injected for tests.
    """
    from chalice.awsclient import TypedAWSClient
    from chalice.cli.factory import CLIFactory
    from chalice.deploy import deployer
    from chalice.deploy.planner import PlanStage, RemoteState
    from chalice.deploy.swagger import TemplatedSwaggerGenerator
    from chalice.deploy.sweeper import ResourceSweeper
    from chalice.utils import UI, OSUtils

    factory = CLIFactory(project_dir, environ=os.environ)
    config = factory.create_config_obj(chalice_stage_name=stage)
    if client is None:
        client = TypedAWSClient(factory.create_botocore_session())

    osutils = OSUtils()
    executor = _CaptureExecutor(client, UI())
    d = deployer.Deployer(
        application_builder=deployer.ApplicationGraphBuilder(),
        deps_builder=deployer.DependencyBuilder(),
        build_stage=deployer.create_build_stage(
            osutils, UI(), TemplatedSwaggerGenerator(), config
        ),
        plan_stage=PlanStage(
            osutils=osutils,
            remote_state=RemoteState(client, config.deployed_resources(stage)),
        ),
        sweeper=ResourceSweeper(),
        executor=executor,
        recorder=deployer.NoopResultsRecorder(osutils=osutils),
    )
    d.deploy(config, chalice_stage_name=stage)
    return executor.plan


def check_plan(plan):
    """Return (problems, info) for a captured Chalice plan."""
    from chalice.deploy.models import APICall, StoreValue

    problems = []
    info = {}
    rest_api_ids = []
    for instruction in plan.instructions:
        if isinstance(instruction, APICall):
            name = instruction.method_name
            if name in FORBIDDEN_CALLS:
                problems.append(f"plan calls {name}: {FORBIDDEN_CALLS[name]}")
            elif name.startswith("delete_") and name not in ALLOWED_DELETE_CALLS:
                problems.append(f"plan calls {name} with {instruction.params}")
            if name == "update_function":
                info["runtime"] = instruction.params.get("runtime")
                info["function_name"] = instruction.params.get("function_name")
        elif isinstance(instruction, StoreValue) and instruction.name == "rest_api_id":
            rest_api_ids.append(instruction.value)

    if rest_api_ids != [EXPECTED_REST_API_ID]:
        problems.append(
            f"plan targets rest_api_id {rest_api_ids}, "
            f"expected [{EXPECTED_REST_API_ID!r}]"
        )
    return problems, info


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--offline", action="store_true", help="skip AWS checks")
    parser.add_argument("--stage", default=STAGE)
    args = parser.parse_args(argv)

    problems = check_local_files(BACKEND_DIR, args.stage)

    if not args.offline and not problems:
        import botocore.session

        region = botocore.session.get_session().get_config_variable("region")
        if region != EXPECTED_REGION:
            problems.append(
                f"AWS region is {region!r}, expected {EXPECTED_REGION!r}. "
                "Set AWS_DEFAULT_REGION / AWS_PROFILE."
            )
        else:
            plan_problems, info = check_plan(compute_plan(BACKEND_DIR, args.stage))
            problems += plan_problems
            print(f"plan: update {info.get('function_name')} -> {info.get('runtime')}")

    if problems:
        print("NOT SAFE TO DEPLOY:")
        for p in problems:
            print(f"  - {p}")
        return 1
    print(f"OK: deploy keeps {EXPECTED_URL}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
