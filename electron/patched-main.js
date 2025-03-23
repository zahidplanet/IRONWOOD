
    // Patched main.js for Electron
    const { app, BrowserWindow, ipcMain, Menu, shell, dialog } = require('electron');
    const path = require('path');
    
    // Force disable GPU
    app.disableHardwareAcceleration();
    app.commandLine.appendSwitch('disable-gpu');
    app.commandLine.appendSwitch('disable-software-rasterizer');
    app.commandLine.appendSwitch('disable-gpu-compositing');
    app.commandLine.appendSwitch('disable-gpu-rasterization');
    app.commandLine.appendSwitch('disable-gpu-sandbox');
    app.commandLine.appendSwitch('--no-sandbox');
    
    let mainWindow;
    let retryCount = 0;
    const MAX_RETRIES = 5;
    
    function createWindow() {
      // Create the browser window.
      mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
        },
        backgroundColor: '#121212',
        show: false, // Don't show until loaded
      });
    
      // Set up loading handler
      mainWindow.webContents.on('did-finish-load', () => {
        console.log('Page loaded, showing window');
        mainWindow.show();
      });
      
      // Set up error handling
      mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error(`Failed to load: ${errorDescription} (${errorCode})`);
        if (errorCode === -102 && retryCount < MAX_RETRIES) { // CONNECTION_REFUSED
          retryCount++;
          console.log(`Retrying... (${retryCount}/${MAX_RETRIES})`);
          setTimeout(() => {
            mainWindow.loadURL('http://localhost:3000');
          }, 1000);
        } else if (retryCount >= MAX_RETRIES) {
          dialog.showErrorBox('Connection Error', 
            `Could not connect to the Next.js development server.`);
        }
      });
    
      // Load URL
      const url = 'http://localhost:3000';
      console.log(`Loading URL: ${url}`);
      mainWindow.loadURL(url).catch(err => {
        console.error('Error loading URL:', err);
      });
    }
    
    app.whenReady().then(() => {
      createWindow();
    });
    
    app.on('window-all-closed', () => {
      app.quit();
    });
  