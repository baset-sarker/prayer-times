#!/bin/bash

# Delay before starting the apps (e.g., 10 seconds)
sleep 10

# Start Node.js app
cd /home/pi/prayer-times/prayer_app_server
npm start &

# Delay before starting Electron app (e.g., 5 seconds)
sleep 5


# Set display
export DISPLAY=:0

# Start Electron app
cd /home/pi/prayer-times/electron-prayer-app
npm start &