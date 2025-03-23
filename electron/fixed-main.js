
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const http = require('http');

// Prevent GPU crashes
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

// Set environment variables
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

let mainWindow;
let nextjsPort = 3000;
let maxRetries = 5; // Try ports 3000-3004
let isNextJsReady = false;

// Find available Next.js port
async function findNextJsPort() {
  // Check if Next.js is already running on any port
  for (let port = 3000; port < 3000 + maxRetries; port++) {
    try {
      const response = await fetch(`http://localhost:${port}`);
      if (response.status === 200) {
        console.log(`Next.js found running on port ${port}`);
        nextjsPort = port;
        isNextJsReady = true;
        return true;
      }
    } catch (err) {
      // Port not responding, try next one
    }
  }
  return false;
}

// Create the Electron window
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

  const startUrl = `http://localhost:${nextjsPort}`;
  console.log(`Loading URL: ${startUrl}`);
  
  mainWindow.loadURL(startUrl);
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', async () => {
  try {
    // Check if Next.js is already running
    const isRunning = await findNextJsPort();
    if (isRunning) {
      createWindow();
    } else {
      console.log('Next.js not running, please start it with: npm run dev');
      app.quit();
    }
  } catch (err) {
    console.error('Error launching:', err);
    app.quit();
  }
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
