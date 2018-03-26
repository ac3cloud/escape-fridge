# Escape Booth - pi

The bits that run on the raspberry pi


## Development

Set up some environment variables

* Setup your environment based on output from API deployment TODO: Fix this to integrate more seamlessly
* Set a unique thing name

Add to _.env.production.local_:
```
# .env.production.local
API_URL=https://k9eigljayb.execute-api.ap-southeast-2.amazonaws.com/production
THING_NAME=pi-johnf
IOT_HOST=a13wgavph3aq68.iot.us-east-1.amazonaws.com
SERVICE=escape-booth
```
Add to _.env.production.local_ if you are not running on a PI:
```
NOPI=TRUE
```

Start the app

```
yarn
yarn run dev
```
