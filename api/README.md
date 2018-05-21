# Escape Booth - api

Backend API for escape Booth
* Lambda functions

# IoT Button Setup

First you will need to create some certificates in AWS IoT

``` bash
bin/create-certs
```

Next you will need to re-configure your IoT button with the generated
certificates in the **certs** directory.

Create a copy of the config file and populate it with your button serial number
and the ARN of the certificate generated above.

``` bash
cp etc/config.json.example etc/config.json
vi etc/config.json
```

# Setup and Deploy

``` bash
yarn
yarn run deploy
```
