const { exec } = require('child_process');

await function getSSID() {
  return new Promise((resolve, reject) => {
    exec('iwgetid -r', (error, stdout, stderr) => {
      if (error) {
        return reject(`Error executing iwgetid: ${error}`);
      }

      const ssid = stdout.trim();
      if (ssid) {
        resolve(ssid);
      } else {
        resolve(null);
      }
    });
  });
}

// exports.getSSID = getSSID;