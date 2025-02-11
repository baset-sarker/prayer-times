#! /bin/bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -
sudo apt install -y nodejs
which node
which npm
node --version
npm --version

# for electron to get display
sudo apt update
sudo apt install xserver-xorg x11-xserver-utils xinit
