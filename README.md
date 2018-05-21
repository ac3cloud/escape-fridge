# Escape Fridge

Bulletproof Escape Fridge Challenge

# Caveats

* The application has little error checking to make it more of a challenge
* There are probably security holes in the app, this is mainly to keep the code
  simple for the challengers, this code is not supposed to be run in production!
  If you notice anything please file a bug though!

# Structure

Code is split up into a couple of directories

* admin - contains all the scripts that help administer the challenge
* api - contains the lambda triggers and cloudformation
* pi - contains all the code that runs locally on the raspberry pi

# Challenges

* The challenges are built on top of master in their own branches c1, c2 etc.
* Each branch consists of one commit which contains the broken things in that challenge
* We constantly rebase all the branches against master
* an admin script on the pi rotates through the scenarios and resets the environment

# Pi Setup

## Install node

You need to install a recent version of node as the one on Raspbian is quite old (at the time of writing)
Also note that the Raspbian is still a 32bit OS and not 64bit (for newer raspberry pis)
Make sure to get ARMv7 Linux binary from https://nodejs.org

``` bash
wget https://nodejs.org/dist/v9.11.1/node-v9.11.1-linux-armv7l.tar.xz
echo export PATH=/home/pi/node-v9.9.0-linux-armv7l/bin:$PATH >> .bashrc
```

## Setup ssh

Add your SSH keys, test them and then
**NOTE:** This is critical for security as the Pi will need port 22 open to AWS
to allow C9 access.

```
echo  PasswordAuthentication no | sudo tee -a /etc/ssh/sshd_config
sudo ssh restart
```

## Install other bits

```
sudo apt-get install jq python-pip
sudo pip install awscli
```

## Fix camera

```
echo 'v4l2-ctl --set-fmt-video=width=1920,height=1080' | sudo tee -a /etc/rc.local
```

## Useful Desktop links

```
cd
ln -s escape-fridge/admin/Desktop
```

## Routing

Configure router to port forward port 22 if pi doesn't have a public IP

## Dynamic DNS

An example for no-ip.com, you can use whatever you like. Replace EMAIL and PASS
below.

```
apt-get install ddclient
sudo dpkg-reconfigure ddclient

# /etc/ddclient.conf
protocol=dyndns2
server=dynupdate.no-ip.com
login=EMAIL
password=PASS
escapefridge.ddns.net
```

## Environment Setup

Set up your AWS credentials in ~/.aws

* Check out this repo in the home directory
```
cd ~
git clone https://github.com/bulletproofnetworks/escape-fridge
```

## Cloud9

Do this as the IAM pi-web user

* Visit https://ap-southeast-1.console.aws.amazon.com/cloud9/home/create and create an SSH based cloud9
** NAME: pi
** TYPE: ssh
** ENVIRONMENT: ~/escape-fridge
** USERNAME: pi
** HOSTNAME: escapefridge.ddns.net
* add the public key to ~/.ssh/authorized_hosts
* Choose following modules
** IDE
** CLI
** find

# Deploy stuff

``` bash
cd admin
yarn run deploy

cd ../api
yarn run deploy

cd ../pi
bin/setup-iot
```

# Before each new challenge

* Reset the environment

```
admin/bin/reset-pi
```

* Reset the browser

```
admin/bin/browser-tabs
```

# Development

You can run the pi code inside a docker container, this is useful for developing on platforms other than Linux.

```
docker run -it -p 3000:3000 -v ~/.aws:/root/.aws -v $(pwd):/app node:6.14 /bin/bash
```
