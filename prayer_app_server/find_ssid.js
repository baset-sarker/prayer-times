const wifi = require('node-wifi');

// Initialize wifi module
// iface: null sets it to the default wireless interface
wifi.init({
  iface: null
});

// Get current WiFi connection details
wifi.getCurrentConnections((error, currentConnections) => {
  if (error) {
    console.error('Error retrieving WiFi connections:', error);
    return;
  }

  if (currentConnections.length === 0) {
    console.log('No active WiFi connection found.');
    return;
  }

  // The currentConnections array may contain multiple entries,
  // but typically you'll get one active connection.
  currentConnections.forEach(connection => {
    console.log(`Connected SSID: ${connection.ssid}`);
    // Additional information is available in the connection object
    // such as signal level, frequency, security type, etc.
  });
});


// const { exec } = require('child_process');

// exec('iwgetid -r', (error, stdout, stderr) => {
//   if (error) {
//     console.error(`Error executing iwgetid: ${error}`);
//     return;
//   }

//   const ssid = stdout.trim();
//   if (ssid) {
//     console.log(`Connected SSID: ${ssid}`);
//   } else {
//     console.log('No SSID detected.');
//   }
// });
