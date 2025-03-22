// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Menu, shell, dialog } = require('electron');
const path = require('path');
const serve = require('electron-serve');
const isDev = require('electron-is-dev');
const fs = require('fs');

const loadURL = serve({ directory: 'out' });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
const appName = 'IRONWOOD Dashboard';

// Check for available port - helps avoid port conflicts
async function findAvailablePort(startPort, endPort) {
  const net = require('net');
  let port = startPort;

  while (port <= endPort) {
    try {
      const server = net.createServer();
      await new Promise((resolve, reject) => {
        server.once('error', err => {
          server.close();
          if (err.code === 'EADDRINUSE') {
            port++;
            resolve(false);
          } else {
            reject(err);
          }
        });
        server.once('listening', () => {
          server.close();
          resolve(true);
        });
        server.listen(port);
      });
      return port;
    } catch (err) {
      console.error(`Error checking port ${port}:`, err);
      port++;
    }
  }
  return null; // No available ports found
}

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
    // Use this to make the window content look better on macOS
    titleBarStyle: 'hiddenInset',
    title: appName,
    backgroundColor: '#121212',
    show: false, // Hide until ready to show
  });

  // Create application menu
  createAppMenu();

  // and load the app
  if (isDev) {
    // Find an available port in development mode
    findAvailablePort(3000, 3010).then(port => {
      if (port) {
        console.log(`Found available port: ${port}`);
        const devUrl = `http://localhost:${port}`;
        process.env.NEXT_DEV_PORT = port;
        
        // Check if the port is ready before loading URL
        const waitOn = require('wait-on');
        const maxWaitTime = 30000; // 30 seconds
        
        // Show loading message
        mainWindow.loadFile(path.join(__dirname, 'loading.html'));
        
        waitOn({
          resources: [devUrl],
          timeout: maxWaitTime,
        }).then(() => {
          mainWindow.loadURL(devUrl);
          // Open DevTools in development mode
          mainWindow.webContents.openDevTools();
        }).catch(err => {
          console.error('Error waiting for dev server:', err);
          dialog.showErrorBox('Development Server Error', 
            `Could not connect to the Next.js development server.\n\nPlease ensure it's running on port ${port}.`);
        });
      } else {
        dialog.showErrorBox('Port Error', 'Could not find an available port between 3000-3010.');
      }
    });
  } else {
    loadURL(mainWindow);
  }

  // Show window when content has loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here. 