# Escape Fridge

AWS Summit Sydney 2018 Escape Fridge

# WE WILL BE OPEN SOURCING THIS CODE SO BE CAREFUL ABOUT YOUR COMMITS

## Instructions

* The app has no error checking to make it more of a challenge
* There are glaring security holes in the app, please ignore them, this is not
  meant for production!

## Structure

Code is split up into a couple of directories

* pi - contains all the code that runs locally on the rasbperry pi
* api - contains the API for leaderboard etc as well as the lambda triggers
* admin - contains all the scripts that setup the different scenario
  environments

## Scenarios

* One git branch per scenario
* Each branch contains one commit which is the broken things in that scenario
* We constantly rebase all the branches against master
* Each scenario is setup in it's own admin account
* Each time a scenario is used we rebuild the while account by tearing down and
  building up the cloud formation
* an admin script on the pi rotates through the scenarios


# Environment Setup

* Add credentials to ~/.aws/credentials
```
[escape-fridge]
aws_access_key_id     = AK...
aws_secret_access_key = od...
```

* Default the region in ~/.aws/config
```
[profile escape-fridge]
region = ap-southeast-2
output = json
```

* Check out this repo in home directory
```
git clone https://github.com/bulletproofnetworks/escape_booth escape-fridge
```

* Setup Cloud9: Run the script and follow the instructions
```
admin/bin/setup-cloud9
```

* Open the browser
```
admin/bin/browser-tabs
```
