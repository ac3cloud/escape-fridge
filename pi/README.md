# Escape Booth - pi

The bits that run on the raspberry pi

# Development

## Environment

Set up some environment variables

* API_URL comes from output of the deployment from admin directory
* IOT_HOST comes fro AWS console

Add to _.env.production.local_:
```
# .env.production.local
API_URL=https://XXXX.execute-api.ap-southeast-2.amazonaws.com/production
THING_NAME=pi-johnf
IOT_HOST=XXXX.iot.us-east-1.amazonaws.com
SERVICE=escape-fridge
```

## Set up IoT

``` bash
bin/setup-iot
```

## Start the app

```
yarn
yarn run dev
```
