const { contextBridge } = require('electron');

// Expose safe timer functionality to the renderer process
contextBridge.exposeInMainWorld('timerAPI', {
    setInterval: (callback, delay) => setInterval(callback, delay),
});
