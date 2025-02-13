#!/bin/bash
# Start Chromium in kiosk mode
#export DISPLAY=:0 && chromium-browser --no-sandbox --disable-gpu --kiosk https://www.google.com >> /home/pi/start_apps.log 2>&1 &
#chromium-browser  --kiosk http://localhost:3000 >> /home/pi/start_apps.log 2>&1 &
export DISPLAY=:0 && chromium-browser --no-sandbox --disable-gpu --kiosk http://localhost:3000