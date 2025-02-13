#!/usr/bin/env python3
import subprocess
import time
import json
import os
import requests
import base64
from connect_to_mongodb import get_prayer_time_data

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# How long (in seconds) to wait between connectivity checks
CHECK_INTERVAL = 10

# Path to the JSON file that contains the Wi‑Fi credentials
WIFI_CREDENTIALS_FILE = "wifi_credentials.json"
WIFI_CREDENTIALS_BKP = "wifi_credentials.json.bkp"
PRAYER_TIMES_FILE = "prayer_times.json"
DATA_LINK = os.getenv("DATA_LINK")


def deobfuscate_password(encoded_password):
    # Decode the Base64 encoded password back to original
    decoded_password = base64.b64decode(encoded_password.encode()).decode()
    return decoded_password


def load_wifi_credentials():
    """
    Load Wi‑Fi credentials from a JSON file.
    The JSON should be a dictionary mapping SSID names to passwords.
    Returns a dictionary of credentials.
    """
    default_credentials = []

    if not os.path.exists(WIFI_CREDENTIALS_FILE):
        print(f"Credentials file '{WIFI_CREDENTIALS_FILE}' does not exist. Creating default credentials.")
        with open(WIFI_CREDENTIALS_FILE, 'w') as f:
            json.dump(default_credentials, f, indent=4)
        return default_credentials

    try:
        with open(WIFI_CREDENTIALS_FILE, 'r') as f:
            credentials = json.load(f)
            if not isinstance(credentials, list):  # Ensure it's the expected format
                raise ValueError("Invalid credentials format")
            return credentials
    except (json.JSONDecodeError, ValueError) as e:
        print("Invalid or corrupted credentials file. copy bkp credential:", e)
        with open(WIFI_CREDENTIALS_BKP, 'r') as f:
            credentials = json.load(f)
        with open(WIFI_CREDENTIALS_FILE, 'w') as f:
            json.dump(credentials, f, indent=4)
        return credentials
    
    except Exception as e:
        print("Error loading credentials file:", e)
        return default_credentials

def is_connected():
    """
    Check connectivity by pinging a public server.
    Returns True if ping is successful.
    """
    try:
        # Ping Google's DNS server once.
        subprocess.check_output(
            ['ping', '-c', '1', '8.8.8.8'],
            stderr=subprocess.STDOUT
        )
        return True
    except subprocess.CalledProcessError:
        return False

def scan_wifi():
    """
    Use nmcli to scan for Wi‑Fi networks.
    Returns a list of unique SSIDs.
    """
    try:
        # The '-t' option outputs in a terse (colon-delimited) format.
        # We ask only for the SSID field.
        result = subprocess.check_output(
            ['nmcli', '-t', '-f', 'SSID', 'dev', 'wifi'],
            universal_newlines=True
        )
        # Each line is an SSID (some lines might be empty)
        ssids = [line.strip() for line in result.splitlines() if line.strip()]
        # Remove duplicates and return the list
        return list(set(ssids))
    except Exception as e:
        print("Error scanning for Wi‑Fi networks:", e)
        return []

def connect_to_wifi(ssid, password):
    """
    Attempt to connect to the given SSID using nmcli and the provided password.
    Returns True if the connection attempt appears successful.
    """
    try:
        print(f"Attempting to connect to SSID: '{ssid}' using the saved password.")
        output = subprocess.check_output(
            ['nmcli', 'dev', 'wifi', 'connect', f'{ssid}', 'password', f'{password}'],
            stderr=subprocess.STDOUT,
            universal_newlines=True
        )
        print("Connected successfully:", output)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Failed to connect to '{ssid}'.\nOutput: {e.output}")
        return False
    

def fetch_and_save_prayer_time():
    try:
        # Make the GET request to fetch data
        #response = requests.get(url)
        data = get_prayer_time_data()
        # Check if the request was successful
        # if response.status_code == 200:
        #     # Parse the JSON response
        #     data = response.json()
        if data:
            # this is just for safety
            wifi_providers = data.get('wifi_providers', [])
            with open(WIFI_CREDENTIALS_FILE, 'w', encoding='utf-8') as file:
                json.dump(wifi_providers, file, indent=4, ensure_ascii=False)
            print("Wifi credentials has been written to wifi_credentials.json")


            # Remove the 'wifi_providers' key from the data 
            if 'wifi_providers' in data:
                del data['wifi_providers']    
            
            # Write the JSON data to a file
            with open(PRAYER_TIMES_FILE, 'w') as file:
                json.dump(data, file, indent=4, ensure_ascii=False)
            print("Prayer time data has been written to prayer_time.json")
        else:
            print(f"Failed to get data ")
    
    except Exception as e:
        print(f"An error occurred: {e}")

def write_to_log(message):
    dt = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    log_file = "data_pull.log"
    message = f"{dt} - {message}"
    with open(log_file, "a") as f:
        f.write(f"{message}\n")

def main_loop():
    dt = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    print(dt,"Script running...")
    """
    Main loop:
      - Checks if the device is connected.
      - If not, scans for available networks.
      - Attempts to connect to any SSID found that exists in the JSON credentials.
    """
    # first wait for 1 minute
    print("Waiting for 1 minute before starting the loop...")
    write_to_log("Waiting for 1 minute before starting the loop...")
    # time.sleep(60)

    loop_count = 0
    while True:

        try:
            if is_connected():
                print("Wi‑Fi is connected.")
                write_to_log("Wi‑Fi is connected.")
                # call fetech data here and save it to the file
                if loop_count % 3 == 0: # every 30 minutes
                    fetch_and_save_prayer_time()
                    write_to_log("Wi‑Fi is connected.")
                    loop_count == 0
            else:
                print("Wi‑Fi not connected. Scanning for networks...")
                wifi_credentials = load_wifi_credentials()
                if not wifi_credentials:
                    print("No Wi‑Fi credentials loaded. Please check your JSON file.")
                    return
                
                networks = scan_wifi()

                if networks:
                    print("Found networks:", networks)
                    
                    # Convert credentials list into a dictionary for faster lookup
                    cred_dict = {cred["name"]: cred["password"] for cred in wifi_credentials}

                    for ssid in networks:
                        if ssid in cred_dict:  # Check if SSID exists in our credentials
                            password = cred_dict[ssid]
                            print(f"Found credentials for '{ssid}'. Attempting to connect...")

                            if connect_to_wifi(ssid, password):
                                print(f"Successfully connected to '{ssid}'.")
                                break  # Stop trying once connected
                            else:
                                print(f"Attempt to connect to '{ssid}' failed.")
                                write_to_log(f"Attempt to connect to '{ssid}' failed.")
                    else:
                        print("Could not connect to any network with the saved credentials.")
                        write_to_log("Could not connect to any network with the saved credentials.")

                else:
                    print("No networks found.")
        except Exception as e:
            print("An error occurred:", e)
        loop_count += 1
        time.sleep(CHECK_INTERVAL)
 

if __name__ == '__main__':
    main_loop()