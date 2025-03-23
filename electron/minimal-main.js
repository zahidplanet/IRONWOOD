
// Minimal Electron main file
const { app, BrowserWindow } = require('electron');

// Disable hardware acceleration to prevent GPU crashes
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');

// Main window reference
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#1a1a1a',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Only show window when content is loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('Window is now visible');
  });

  // Load the URL - simple and direct
  const url = 'http://localhost:3000';
  console.log('Loading URL:', url);
  mainWindow.loadURL(url);
  
  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create window when Electron is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  app.quit();
});
