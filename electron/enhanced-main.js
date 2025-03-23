
// Enhanced Electron main file with IPC
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

// Disable hardware acceleration to prevent GPU crashes
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');

let mainWindow = null;
let nextProcess = null;
let appWindow = null;

function createWindow() {
  // Create the loading window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#121212',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the HTML file
  const htmlPath = path.join(__dirname, '..', 'electron-app.html');
  console.log('Loading HTML file:', htmlPath);
  mainWindow.loadFile(htmlPath);
  
  // Open DevTools for debugging in development
  // mainWindow.webContents.openDevTools();
  
  mainWindow.on('closed', () => {
    mainWindow = null;
    
    // Close Next.js app window if open
    if (appWindow && !appWindow.isDestroyed()) {
      appWindow.close();
    }
    
    // Kill Next.js process when window is closed
    if (nextProcess) {
      try {
        process.kill(nextProcess.pid);
      } catch (e) {
        console.log('Error killing Next.js process:', e);
      }
    }
  });
}

// Start Next.js server
function startNextJs() {
  console.log('Starting Next.js server...');
  
  // Create middleware manifest to help with errors
  const fs = require('fs');
  const manifestDirs = [
    path.join(__dirname, '..', '.next', 'server'),
    path.join(__dirname, '..', 'out', 'server')
  ];
  
  const manifest = {
    version: 1,
    sortedMiddleware: [],
    middleware: {},
    functions: {},
    pages: {}
  };
  
  manifestDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, 'middleware-manifest.json'), JSON.stringify(manifest, null, 2));
  });
  
  // Start Next.js development server
  nextProcess = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, '..'),
    shell: true,
    env: { ...process.env, BROWSER: 'none' }
  });
  
  // Send output to renderer process
  nextProcess.stdout.on('data', (data) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('server-update', data.toString());
    }
    console.log(`Next.js stdout: ${data}`);
  });
  
  nextProcess.stderr.on('data', (data) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('server-update', data.toString());
    }
    console.error(`Next.js stderr: ${data}`);
  });
  
  nextProcess.on('close', (code) => {
    console.log(`Next.js process exited with code ${code}`);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('server-update', `Next.js server stopped with code ${code}`);
    }
  });
}

// Open Next.js app in new window
function openNextApp() {
  if (appWindow) {
    appWindow.focus();
    return;
  }
  
  appWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  
  appWindow.loadURL('http://localhost:3000');
  
  // Show window when content has loaded
  appWindow.once('ready-to-show', () => {
    appWindow.show();
  });
  
  appWindow.on('closed', () => {
    appWindow = null;
  });
}

// Create app when Electron is ready
app.whenReady().then(() => {
  createWindow();
  
  // Set up IPC handlers
  ipcMain.handle('start-nextjs', () => {
    startNextJs();
    return true;
  });
  
  ipcMain.handle('open-nextapp', () => {
    openNextApp();
    return true;
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
