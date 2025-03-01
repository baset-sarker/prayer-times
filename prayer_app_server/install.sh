#! /bin/bash
# sudo apt update && sudo apt upgrade -y
# curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -
# sudo apt install -y nodejs
which node
which npm
node --version
npm --version

# for electron to get display
# sudo apt update
# sudo apt install xserver-xorg x11-xserver-utils xinit


# sudo systemctl disable prayer_app.service
# sudo cp prayer_app.service /etc/systemd/system/prayer_app.service
# sudo systemctl daemon-reload
# sudo systemctl enable prayer_app.service
# sudo systemctl start prayer_app.service
# sudo systemctl status prayer_app.service

sudo systemctl disable data_pull.service
sudo cp data_pull.service /etc/systemd/system/data_pull.service
sudo systemctl daemon-reload
sudo systemctl enable data_pull.service
sudo systemctl start data_pull.service
sudo systemctl status data_pull.service


# user video permission
#sudo usermod -aG video pi