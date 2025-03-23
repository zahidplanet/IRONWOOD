
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const http = require('http');
const { spawn, execSync } = require('child_process');

// Disable hardware acceleration to prevent GPU crashes
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

let mainWindow;
let nextServerProcess = null;
const PORT = 3000;

// Check if Next.js server is running
async function checkServerRunning() {
  return new Promise((resolve) => {
    console.log('Checking if Next.js server is responding...');
    
    const req = http.get(`http://localhost:${PORT}`, (res) => {
      console.log(`Server responded with status code: ${res.statusCode}`);
      resolve(res.statusCode === 200 || res.statusCode === 404);
    });
    
    req.on('error', (err) => {
      console.log(`Server check error: ${err.message}`);
      resolve(false);
    });
    
    req.setTimeout(2000, () => {
      console.log('Server check timed out');
      req.destroy();
      resolve(false);
    });
  });
}

// Create the browser window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 750,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    show: false
  });

  mainWindow.loadFile(path.join(__dirname, 'electron-honest.html'));
  
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App ready event
app.on('ready', createWindow);

// Window closed event
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Activate event
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC events
ipcMain.on('check-server', async (event) => {
  try {
    const isRunning = await checkServerRunning();
    
    if (isRunning) {
      event.sender.send('server-status', {
        isRunning: true,
        message: 'Next.js server is running and responding!'
      });
    } else {
      event.sender.send('server-status', {
        isRunning: false,
        message: 'Next.js server is not running or not responding.'
      });
    }
  } catch (error) {
    event.sender.send('server-status', {
      isRunning: false,
      message: `Error checking server: ${error.message}`,
      error: true
    });
  }
});

ipcMain.on('start-server', async (event) => {
  try {
    // Check if server is already running
    const isAlreadyRunning = await checkServerRunning();
    
    if (isAlreadyRunning) {
      event.sender.send('server-status', {
        isRunning: true,
        message: 'Next.js server is already running!'
      });
      return;
    }
    
    event.sender.send('server-starting', {
      message: 'Starting Next.js server in a new terminal window...'
    });
    
    // Start Next.js in a new terminal window
    if (process.platform === 'darwin') {
      // On macOS, open a new terminal
      execSync(`osascript -e 'tell app "Terminal" to do script "cd \"${process.cwd()}\" && npm run dev"'`);
    } else {
      // On Windows/Linux
      const command = process.platform === 'win32' ? 
        `start cmd.exe /K "cd /d "${process.cwd()}" && npm run dev"` :
        `x-terminal-emulator -e 'cd "${process.cwd()}" && npm run dev'`;
      
      execSync(command, { shell: true });
    }
    
    // Poll for server availability
    let attempts = 0;
    const maxAttempts = 30;
    const interval = setInterval(async () => {
      attempts++;
      
      if (!mainWindow) {
        clearInterval(interval);
        return;
      }
      
      const isRunning = await checkServerRunning();
      
      if (isRunning) {
        clearInterval(interval);
        event.sender.send('server-status', {
          isRunning: true,
          message: 'Next.js server is now running!'
        });
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        event.sender.send('server-error', {
          message: `Next.js server did not start after ${maxAttempts} attempts. Check terminal for errors.`
        });
      } else {
        event.sender.send('server-starting', {
          message: `Waiting for Next.js server to start... (Attempt ${attempts}/${maxAttempts})`
        });
      }
    }, 1000);
    
  } catch (error) {
    event.sender.send('server-error', {
      message: `Error starting server: ${error.message}`
    });
  }
});

ipcMain.on('open-browser', (event) => {
  shell.openExternal(`http://localhost:${PORT}`);
  event.sender.send('browser-opened');
});
