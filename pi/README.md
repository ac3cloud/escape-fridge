# Escape Booth - pi

The bits that run on the raspberry pi


## Development

Set up some environment variables

* Setup your environment based on output from API deployment TODO: Fix this to integrate more seamlessly
* Set a unique thing name

```
# .env.production.local
API_URL=https://k9eigljayb.execute-api.ap-southeast-2.amazonaws.com/production
THING_NAME=pi-johnf

```

Start the app

```
yarn
yarn run dev
```
