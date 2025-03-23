
const { app, BrowserWindow } = require('electron');
const path = require('path');

// Disable hardware acceleration to prevent crashes
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

// Security warnings are noisy in dev
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

let mainWindow;
const NEXT_PORT = 3001;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#121212',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  const startUrl = `http://localhost:${NEXT_PORT}`;
  console.log(`Loading URL: ${startUrl}`);
  
  mainWindow.loadURL(startUrl);
  
  // Uncomment for debugging
  // mainWindow.webContents.openDevTools();
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
  