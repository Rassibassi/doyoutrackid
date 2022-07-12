# Do You Track ID app

IDing the songs played on the do you radio show.

https://doyou.world/

https://doyoutrackid.com

## How to

Frontend: NextJS, development and package manager with `npm`. Deployment with Vercel.

Backend: Python, with Chalice from AWS.

Infrastructure: Python, DynamoDB from AWS with `aws-cdk`.

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
