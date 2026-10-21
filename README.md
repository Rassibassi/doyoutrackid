# Do You Track ID app

IDing the songs played on the do you radio show.

https://doyou.world/

https://doyoutrackid.com

## How to

Frontend: NextJS, development and package manager with `npm`. Deployment with Vercel.

Backend: Python, with Chalice from AWS.

Infrastructure: Python, DynamoDB from AWS with `aws-cdk`.

## Deploying the backend

The frontend and users call the raw API Gateway URL
`https://3rqvxp6o77.execute-api.eu-central-1.amazonaws.com/api/`. Chalice only
keeps that URL if `backend/.chalice/deployed/dev.json` (git-ignored, keep a
backup!) points at it and you deploy to the same account and region.

```
cd backend
uv venv -p 3.13 .venv && uv pip install -p .venv/bin/python -r requirements-dev.txt
source .venv/bin/activate
export AWS_PROFILE=... AWS_DEFAULT_REGION=eu-central-1

python -m pytest tests                  # offline tests of the guard
python scripts/check_deploy_plan.py     # dry-run plan against AWS, must print OK
chalice deploy --stage dev
```

The Lambda runtime is taken from the Python version running `chalice`.

## AUDD configuration

```
curl https://api.audd.io/addStream/ \
    -F api_token='' \
    -F url='radio_url' \
    -F radio_id='1' \
    -F callbacks='before'

curl https://api.audd.io/deleteStream/ \
    -F api_token='' \
    -F radio_id='1'

curl https://api.audd.io/getStreams/ \
    -F api_token=''

curl https://api.audd.io/setCallbackUrl/ \
    -F api_token='' \
    -F url='secret_url'

curl https://api.audd.io/getCallbackUrl/ \
    -F api_token=''
```
