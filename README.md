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

# Pi Setup

## Install node
```
# Greg to fill in

echo export PATH=/home/pi/node-v9.9.0-linux-armv7l/bin:$PATH >> .bashrc
```

## Setup ssh
```
echo  PasswordAuthentication no | sudo tee -a /etc/ssh/sshd_config
sudo ssh restart
```

## Install other bits
```
sudo apt-get install jq python-pip
sudo pip install awscli
```

## Fix camwera
```
echo 'v4l2-ctl --set-fmt-video=width=1920,height=1080' | sudo tee -a /etc/rc.local
```

## Usefule desktop links

```
cd
ln -s escape-fridge/admin/Desktop
```

## Routing

Configure router to port forward port 22 if pi doesn't have a public IP

## Dynamic DNS

Set it up for no-ip.com
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

# Environment Setup

Setup your AWS credentials in ~/.aws

* Check out this repo in home directory
```
git clone https://github.com/bulletproofnetworks/escape_booth escape-fridge
```

Setup reverse SSH tunnel (Only needed if no public IP or you can't port forward)
```
admin/bin/setup-tunnel
```

Setup Cloud9
* DO THIS AS THE pi-web USER
* Visit https://ap-southeast-1.console.aws.amazon.com/cloud9/home/create and create and SSH based cloud9
* NAME: pi
* TYPE: ssh
* ENVIRONMENT: ~/escape-fridge
* USERNAME: pi
* HOSTNAME: escapefridge.ddns.net
* add the public key to ~/.ssh/authorized_hosts
*
*  Choose following modules
*    * IDE
*    * CLI
*    * find
* 

* Open the browser
```
admin/bin/browser-tabs
```
