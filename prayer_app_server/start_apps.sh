#!/bin/bash


# Wait for X server to start (GUI)
until xset q &>/dev/null; do
  sleep 1
done

echo "$(date)  Starting Node.." >> /home/pi/start_apps.log
# Start Node.js app
cd /home/pi/prayer-times/prayer_app_server
npm start &

# Delay before starting Electron app (e.g., 5 seconds)
sleep 10


# Set display
# export DISPLAY=:0

# # Start Electron app
# cd /home/pi/prayer-times/electron-prayer-app
# npm start &

# Start Chromium in kiosk mode
echo "$(date)  Starting Chromium..." >> /home/pi/start_apps.log
chromium-browser  --kiosk http://localhost:3000 >> /home/pi/start_apps.log 2>&1 &