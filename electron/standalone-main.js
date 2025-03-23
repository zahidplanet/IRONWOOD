
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');

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
const HTML_PATH = path.join(__dirname, '..', 'electron-ui.html');

// Check if a port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = http.createServer();
    server.once('error', () => {
      resolve(false);
    });
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

// Check if server is responding
function checkServerRunning() {
  return new Promise((resolve) => {
    http.get(`http://localhost:${PORT}`, (res) => {
      if (res.statusCode === 200) {
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
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    show: false
  });

  mainWindow.loadFile(HTML_PATH);
  
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('Window is now visible');
  });

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

// IPC handlers
ipcMain.on('start-next-server', async (event) => {
  const isAvailable = await isPortAvailable(PORT);
  
  if (!isAvailable) {
    event.sender.send('server-status', 'Port 3000 is already in use. Next.js might be running already.');
    
    // Check if it's actually our Next.js server
    const isRunning = await checkServerRunning();
    if (isRunning) {
      event.sender.send('server-ready');
    }
    return;
  }
  
  // Create start-next.js script if it doesn't exist
  const startNextPath = path.join(__dirname, '..', 'start-next.js');
  if (!fs.existsSync(startNextPath)) {
    const startNextContent = `
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Create middleware manifest if it doesn't exist
const manifestDirs = [
  path.join(__dirname, '.next', 'server'),
  path.join(__dirname, 'out', 'server'),
  path.join(__dirname, 'node_modules', '.next', 'server')
];

const manifestContent = JSON.stringify({
  version: 1,
  sortedMiddleware: [],
  middleware: {},
  functions: {},
  pages: {}
}, null, 2);

manifestDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const manifestPath = path.join(dir, 'middleware-manifest.json');
  fs.writeFileSync(manifestPath, manifestContent);
  console.log(\`Created middleware manifest at \${manifestPath}\`);
});

// Start Next.js dev server
console.log('Starting Next.js development server...');
const nextProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

process.on('SIGINT', () => {
  nextProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  nextProcess.kill('SIGTERM');
  process.exit(0);
});

nextProcess.on('close', (code) => {
  console.log(\`Next.js process exited with code \${code}\`);
  process.exit(code);
});
`;
    fs.writeFileSync(startNextPath, startNextContent);
  }
  
  // Start the Next.js server
  event.sender.send('server-status', 'Starting Next.js server...');
  
  // Use open terminal command to make it visible to user
  if (process.platform === 'darwin') {
    try {
      // On macOS, open a new terminal window
      execSync(`osascript -e 'tell app "Terminal" to do script "cd \"\${process.cwd()}\" && node start-next.js"'`);
      
      // Poll for server availability
      checkServerAvailability(event);
    } catch (error) {
      event.sender.send('server-status', `Error starting server: ${error.message}`);
    }
  } else {
    // On other platforms, use spawn
    nextServerProcess = spawn('node', ['start-next.js'], {
      detached: true,
      stdio: 'ignore'
    });
    
    nextServerProcess.unref();
    
    // Poll for server availability
    checkServerAvailability(event);
  }
});

async function checkServerAvailability(event) {
  event.sender.send('server-status', 'Waiting for Next.js server to start...');
  
  // Check every second for 60 seconds
  for (let i = 0; i < 60; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const isRunning = await checkServerRunning();
      if (isRunning) {
        event.sender.send('server-status', 'Next.js server is running!');
        event.sender.send('server-ready');
        return;
      }
    } catch (error) {
      // Continue checking
    }
    
    event.sender.send('server-status', `Waiting for Next.js server to start... (${i+1}s)`);
  }
  
  event.sender.send('server-status', 'Timed out waiting for server. Please check terminal for errors.');
}

ipcMain.on('check-server-status', async (event) => {
  try {
    const isRunning = await checkServerRunning();
    if (isRunning) {
      event.sender.send('server-already-running');
    }
  } catch (error) {
    // Server not running, do nothing
  }
});

ipcMain.on('open-in-browser', () => {
  shell.openExternal(`http://localhost:${PORT}`);
});

ipcMain.on('reload-app', () => {
  mainWindow.reload();
});
