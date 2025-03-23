
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const http = require('http');

// Prevent GPU crashes
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');

let mainWindow;
const NEXT_PORT = 3000;

// Check if Next.js is running
function checkNextJs() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${NEXT_PORT}`, (res) => {
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Create window with loading screen
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#121212',
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Show when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load Next.js app
  const startUrl = `http://localhost:${NEXT_PORT}`;
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Try connecting to Next.js until it responds
async function connectToNextJs() {
  console.log('Checking if Next.js is running...');
  
  const isRunning = await checkNextJs();
  if (isRunning) {
    console.log('Next.js is running. Starting Electron app...');
    createWindow();
    return;
  }
  
  console.log('Next.js is not running yet. Please start it with "npm run dev" in another terminal.');
  process.exit(1);
}

app.on('ready', connectToNextJs);

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
