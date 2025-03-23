// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Menu, shell, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

// Disable GPU acceleration to prevent crashes
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
const appName = 'IRONWOOD Dashboard';

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
    // Use this to make the window look better on macOS
    titleBarStyle: 'hiddenInset',
    title: appName,
    backgroundColor: '#121212',
    show: false, // Don't show until loaded
  });

  // Create application menu
  createAppMenu();

  // Load the development server URL directly
  const devUrl = 'http://localhost:3000';
  console.log(`Loading URL: ${devUrl}`);
  
  // Set up error handling
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error(`Failed to load: ${errorDescription} (${errorCode})`);
    if (errorCode === -102) { // CONNECTION_REFUSED
      dialog.showErrorBox('Connection Error', 
        `Could not connect to the development server at ${devUrl}.\n\nPlease ensure the Next.js development server is running.`);
    }
  });

  // Ready to show when loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Try to load URL
  mainWindow.loadURL(devUrl).catch(err => {
    console.error('Error loading URL:', err);
  });
  
  // Only open DevTools in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object
    mainWindow = null;
  });
}

function createAppMenu() {
  const isMac = process.platform === 'darwin';
  
  const template = [
    // App menu (macOS only)
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    
    // File menu
    {
      label: 'File',
      submenu: [
        { 
          label: 'Export Data',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('menu-export-data');
          }
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    
    // View menu
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    
    // Help menu
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: async () => {
            await shell.openExternal('https://github.com/zahidpasha/IRONWOOD');
          }
        },
        {
          label: 'Report Issue',
          click: async () => {
            await shell.openExternal('https://github.com/zahidpasha/IRONWOOD/issues/new/choose');
          }
        }
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Handle startup errors
app.on('render-process-gone', (event, webContents, details) => {
  console.error('Render process gone:', details);
  dialog.showErrorBox('Application Error', 
    `The rendering process crashed unexpectedly.\nReason: ${details.reason}\nExitCode: ${details.exitCode}`);
});

app.on('child-process-gone', (event, details) => {
  console.error('Child process gone:', details);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers for communication between renderer and main process
ipcMain.handle('get-app-path', () => {
  return app.getPath('userData');
}); 