const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        fullscreen: true,
        width: 19920,
        height: 1080,
        // frame: true, // Hides the top bar
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Add the preload script
            contextIsolation: true,
            nodeIntegration: true,
        },
        autoHideMenuBar: true,
    });

    mainWindow.loadURL('http://localhost:3000'); // Load the server URL
    
     // Listen for the 'Esc' key to exit full-screen mode
    mainWindow.webContents.on('before-input-event', (event, input) => {
        if (input.key === 'Escape' && input.type === 'keyDown') {
            if (mainWindow.isFullScreen()) {
                mainWindow.setFullScreen(false); // Exit full-screen mode
                mainWindow = null;
            }
        }
    });

  
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
