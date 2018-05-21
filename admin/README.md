The directory contains a number of admin utilities as well as the code for
updating the leader board.

# Leader board

The API for the leader board that is used by the application lives here. We keep
it separate as we don't want the participants changing this code. Also means we
can prevent challengers from updating the leader board in Dynamo DB directly :)

## setup
``` bash
yarn
```

## Deploy
``` bash
sls deploy
```

# Desktop Utilities

If you symlink all the scripts in the Desktop directory to the users Desktop you
will get icons for a number of useful scripts that can be used to quickly reset
the state of the challenge.

# Scripts

## bin/browser-tabs

Opens all the useful pages in the browser

## bin/full-reset

Run this at the start of the event

* Clears out the competition leader board

## bin/rebase-branches

Use this to rebase the challenge branches against any general code updates.

## bin/reset-pi

Resets the environment before each new challenge

* Asks for a challenge
* Resets code to the challenge branch
* Re-deploys the Lambda functions
* Kills all the C9 processes to reset C9 state
* Reminds you to reload C9 in browser

## bin/update-branches

Updates all the local challenge branches to be in sync with GitHub

