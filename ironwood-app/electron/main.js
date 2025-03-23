const { app, BrowserWindow } = require('electron');
const path = require('path');
const net = require('net');

// Disable hardware acceleration to prevent crashes
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

// Security warnings are noisy in dev
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

let mainWindow;
const NEXT_PORT = 3001;
const MAX_RETRY_COUNT = 30;
let retryCount = 0;

function checkPort(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    
    const onError = () => {
      socket.destroy();
      resolve(false);
    };
    
    socket.setTimeout(1000);
    socket.on('error', onError);
    socket.on('timeout', onError);
    
    socket.connect(port, '127.0.0.1', () => {
      socket.destroy();
      resolve(true);
    });
  });
}

async function waitForNextJsServer() {
  while (retryCount < MAX_RETRY_COUNT) {
    console.log(`Checking if Next.js is running (attempt ${retryCount + 1}/${MAX_RETRY_COUNT})...`);
    const isPortOpen = await checkPort(NEXT_PORT);
    
    if (isPortOpen) {
      console.log('Next.js server is running!');
      return true;
    }
    
    console.log(`Next.js server not ready, waiting... (attempt ${retryCount + 1}/${MAX_RETRY_COUNT})`);
    retryCount++;
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.error(`Failed to connect to Next.js server after ${MAX_RETRY_COUNT} attempts`);
  return false;
}

async function createWindow() {
  // Wait for Next.js to be ready first
  const isNextReady = await waitForNextJsServer();
  if (!isNextReady) {
    console.error('Could not connect to Next.js server. Exiting...');
    app.quit();
    return;
  }
  
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
  
  const startUrl = `http://localhost:${NEXT_PORT}`;
  console.log(`Loading URL: ${startUrl}`);
  
  // Add error handling for page load
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error(`Failed to load: ${errorDescription} (${errorCode})`);
    
    if (!mainWindow.isDestroyed()) {
      setTimeout(() => {
        console.log('Retrying to load the URL...');
        mainWindow.loadURL(startUrl);
      }, 1000);
    }
  });
  
  // Show window when ready to render
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });
  
  try {
    await mainWindow.loadURL(startUrl);
    console.log('Page loaded successfully!');
  } catch (err) {
    console.error('Error loading page:', err);
  }
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null && app.isReady()) {
    createWindow();
  }
});