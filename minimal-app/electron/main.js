const { app, BrowserWindow } = require('electron');

// Disable hardware acceleration to prevent crashes
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

// URL to load
const nextUrl = 'http://localhost:3001';
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#121212',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  console.log(`Loading URL: ${nextUrl}`);
  
  // Handle load errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error(`Failed to load: ${errorDescription} (${errorCode})`);
    if (errorCode === -102) { // CONNECTION_REFUSED
      console.log('Connection refused. Make sure Next.js is running on port 3001.');
      setTimeout(() => {
        console.log('Retrying...');
        mainWindow.loadURL(nextUrl);
      }, 3000);
    }
  });

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.loadURL(nextUrl);
  
  // Open DevTools
  mainWindow.webContents.openDevTools({ mode: 'detach' });
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});