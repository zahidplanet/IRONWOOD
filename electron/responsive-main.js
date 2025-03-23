
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

// Disable hardware acceleration to prevent GPU crashes
app.disableHardwareAcceleration();

// Add these command-line switches
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('disable-gpu-rasterization');
app.commandLine.appendSwitch('disable-gpu-sandbox');

let mainWindow;
let nextServerProcess = null;
const PORT = 3000;
const HTML_PATH = path.join(__dirname, '..', 'electron-app.html');

// Check if server is responding
function checkServerRunning() {
  return new Promise((resolve) => {
    http.get(`http://localhost:${PORT}`, (res) => {
      if (res.statusCode === 200 || res.statusCode === 404) {
        resolve(true);
      } else {
        resolve(false);
      }
    }).on('error', () => {
      resolve(false);
    });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  mainWindow.loadFile(HTML_PATH);
  
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

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

// Launch Next.js server
async function startNextServer() {
  if (nextServerProcess) {
    return;
  }
  
  // Send update to renderer
  if (mainWindow) {
    mainWindow.webContents.send('server-status', 'Starting Next.js server...');
  }
  
  // Create next.js starter file
  const nextStarterPath = path.join(__dirname, '..', 'next-starter.js');
  const nextStarterContent = `
  const fs = require('fs');
  const path = require('path');
  const { spawn } = require('child_process');
  
  // Create middleware manifest if it doesn't exist
  const dirs = [
    path.join(__dirname, '.next', 'server'),
    path.join(__dirname, 'out', 'server'),
    path.join(__dirname, 'node_modules', '.next', 'server')
  ];
  
  const manifest = {
    version: 1,
    sortedMiddleware: [],
    middleware: {},
    functions: {},
    pages: {}
  };
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const manifestPath = path.join(dir, 'middleware-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(\`Created middleware manifest at: \${manifestPath}\`);
  });
  
  // Start Next.js development server
  console.log('Starting Next.js development server...');
  const nextProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });
  
  nextProcess.on('close', (code) => {
    console.log(\`Next.js process exited with code \${code}\`);
    process.exit(code);
  });
  
  process.on('SIGINT', () => {
    nextProcess.kill('SIGINT');
    process.exit(0);
  });
  `;
  
  fs.writeFileSync(nextStarterPath, nextStarterContent);
  
  // Start Next.js in separate terminal
  try {
    if (process.platform === 'darwin') {
      // On macOS, open a new terminal
      const terminalCmd = `osascript -e 'tell app "Terminal" to do script "cd \"${process.cwd()}\" && node next-starter.js"'`;
      require('child_process').execSync(terminalCmd);
    } else {
      // On Windows/Linux just spawn detached
      nextServerProcess = spawn('node', ['next-starter.js'], {
        detached: true,
        stdio: 'ignore',
        shell: true
      });
      nextServerProcess.unref();
    }
    
    // Poll until server is available
    let attempts = 0;
    const maxAttempts = 30;
    
    const checkInterval = setInterval(async () => {
      attempts++;
      
      if (attempts > maxAttempts) {
        clearInterval(checkInterval);
        if (mainWindow) {
          mainWindow.webContents.send('server-status', 'Failed to start Next.js server after multiple attempts');
        }
        return;
      }
      
      const serverRunning = await checkServerRunning();
      
      if (serverRunning) {
        clearInterval(checkInterval);
        if (mainWindow) {
          mainWindow.webContents.send('server-status', 'Next.js server is running!');
        }
      } else if (mainWindow) {
        mainWindow.webContents.send('server-status', `Waiting for Next.js server to start... (${attempts}/${maxAttempts})`);
      }
    }, 1000);
    
  } catch (error) {
    console.error('Failed to start Next.js server:', error);
    if (mainWindow) {
      mainWindow.webContents.send('server-status', `Error starting Next.js server: ${error.message}`);
    }
  }
}

// IPC handlers
ipcMain.on('check-server-status', async (event) => {
  const isRunning = await checkServerRunning();
  
  if (isRunning) {
    event.sender.send('server-status', 'Next.js server is running!');
  } else {
    // Start the server if it's not running
    startNextServer();
  }
});

ipcMain.on('open-in-browser', () => {
  shell.openExternal(`http://localhost:${PORT}`);
});
