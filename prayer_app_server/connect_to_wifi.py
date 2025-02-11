#!/usr/bin/env python3
import subprocess
import time
import json
import os
import requests
import base64

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# How long (in seconds) to wait between connectivity checks
CHECK_INTERVAL = 10

# Path to the JSON file that contains the Wi‑Fi credentials
WIFI_CREDENTIALS_FILE = "wifi_credentials.json"
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
    if not os.path.exists(WIFI_CREDENTIALS_FILE):
        print(f"Credentials file '{WIFI_CREDENTIALS_FILE}' does not exist.")
        return {}
    try:
        with open(WIFI_CREDENTIALS_FILE, 'r') as f:
            credentials = json.load(f)

            return credentials
    except Exception as e:
        print("Error loading credentials file:", e)
        return {}

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
            ['nmcli', 'dev', 'wifi', 'connect', ssid, 'password', password],
            stderr=subprocess.STDOUT,
            universal_newlines=True
        )
        print("Connected successfully:", output)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Failed to connect to '{ssid}'.\nOutput: {e.output}")
        return False
    

def fetch_and_save_prayer_time(url):
    try:
        # Make the GET request to fetch data
        response = requests.get(url)
        
        # Check if the request was successful
        if response.status_code == 200:
            # Parse the JSON response
            data = response.json()

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
            print(f"Failed to fetch data. Status code: {response.status_code}")
    
    except Exception as e:
        print(f"An error occurred: {e}")

def main_loop():
    """
    Main loop:
      - Checks if the device is connected.
      - If not, scans for available networks.
      - Attempts to connect to any SSID found that exists in the JSON credentials.
    """

    while True:
        try:
            wifi_credentials = load_wifi_credentials()
            if not wifi_credentials:
                print("No Wi‑Fi credentials loaded. Please check your JSON file.")
                return
            
            if is_connected():
                print("Wi‑Fi is connected.")
                # call fetech data here and save it to the file
                fetch_and_save_prayer_time(DATA_LINK)
            else:
                print("Wi‑Fi not connected. Scanning for networks...")
                networks = scan_wifi()
                if networks:
                    print("Found networks:", networks)
                    connected = False
                    # Loop through the found networks and check if they are in our credentials
                    for ssid in networks:
                        for cred in wifi_credentials:
                            print(cred['name'], cred['password'])
                            if ssid == cred["name"]:
                                password = cred["password"]
                                password = deobfuscate_password(password)
                                print(f"Found credentials for '{ssid}'. Attempting to connect...")
                                if connect_to_wifi(ssid, password):
                                    connected = True
                                    break
                                else:
                                    print(f"Attempt to connect to '{ssid}' with the saved password failed.")
                    if not connected:
                        print("Could not connect to any network with the saved credentials.")
                else:
                    print("No networks found.")
        except Exception as e:
            print("An error occurred:", e)

        time.sleep(CHECK_INTERVAL)
 

if __name__ == '__main__':
    main_loop()