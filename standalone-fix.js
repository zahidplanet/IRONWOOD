const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// ---- Configuration ----
const WORKSPACE_DIR = process.cwd();
const NEXT_SERVER_PATH = path.join(WORKSPACE_DIR, 'node_modules/next/dist/server/next-server.js');
const ELECTRON_PATH = path.join(WORKSPACE_DIR, 'node_modules/electron/dist/Electron.app/Contents/MacOS/Electron');
const PORT = 3000;

console.log('🔧 IRONWOOD Desktop App Fix Tool 🔧');

// ---- Helper Functions ----
function createDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
    return true;
  }
  return false;
}

function createFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${filePath}`);
    return true;
  } catch (err) {
    console.error(`Error creating file ${filePath}:`, err);
    return false;
  }
}

function killProcesses() {
  console.log('🛑 Stopping all existing processes...');
  try {
    execSync('pkill -f electron || true');
    execSync('pkill -f next || true');
    execSync('pkill -f node || true');
  } catch (err) {
    // Ignore errors from kill commands
  }
}

// ---- Step 1: Clean up environment ----
killProcesses();

// ---- Step 2: Create middleware manifest files ----
console.log('📝 Creating required middleware files...');

// Create directories
createDir(path.join(WORKSPACE_DIR, '.next'));
createDir(path.join(WORKSPACE_DIR, '.next', 'server'));
createDir(path.join(WORKSPACE_DIR, 'out'));
createDir(path.join(WORKSPACE_DIR, 'out', 'server'));
createDir(path.join(WORKSPACE_DIR, 'node_modules', '.next', 'server'));

// Create middleware manifest content
const manifestContent = JSON.stringify({
  version: 1,
  sortedMiddleware: [],
  middleware: {},
  functions: {},
  pages: {}
}, null, 2);

// Create middleware manifest files in all possible locations
createFile(path.join(WORKSPACE_DIR, '.next', 'server', 'middleware-manifest.json'), manifestContent);
createFile(path.join(WORKSPACE_DIR, 'out', 'server', 'middleware-manifest.json'), manifestContent);
createFile(path.join(WORKSPACE_DIR, 'node_modules', '.next', 'server', 'middleware-manifest.json'), manifestContent);

// ---- Step 3: Create error components if they don't exist ----
console.log('📝 Creating required error components if needed...');

const errorComponentPath = path.join(WORKSPACE_DIR, 'src', 'pages', '_error.js');
if (!fs.existsSync(errorComponentPath)) {
  createFile(errorComponentPath, `
import React from 'react';

function Error({ statusCode }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      backgroundColor: '#f7f7f7'
    }}>
      <h1 style={{ 
        fontSize: '2rem', 
        background: 'linear-gradient(90deg, #1a365d 0%, #2a4365 50%, #2c5282 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        {statusCode ? \`Error \${statusCode}\` : 'An error occurred'}
      </h1>
      <p>Please try again later</p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
`);
}

const documentComponentPath = path.join(WORKSPACE_DIR, 'src', 'pages', '_document.js');
if (!fs.existsSync(documentComponentPath)) {
  createFile(documentComponentPath, `
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
`);
}

// Create a standalone static HTML for Electron to display
console.log('📝 Creating standalone Electron UI...');
const htmlPath = path.join(WORKSPACE_DIR, 'electron-ui.html');
createFile(htmlPath, `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>IRONWOOD Healthcare Dashboard</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: #f7f7f7;
      color: #333;
      overflow: hidden;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      border-radius: 10px;
      background-color: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 80%;
      max-width: 600px;
    }
    .title {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      background: linear-gradient(90deg, #1a365d 0%, #2a4365 50%, #2c5282 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shine 2s infinite alternate;
    }
    .subtitle {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      text-align: center;
      color: #666;
    }
    .loader {
      border: 5px solid #f3f3f3;
      border-top: 5px solid #3498db;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 2s linear infinite;
      margin-bottom: 2rem;
    }
    .btn {
      padding: 12px 24px;
      background: linear-gradient(90deg, #1a365d 0%, #2a4365 50%, #2c5282 100%);
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 1rem;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
    }
    .btn:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }
    .status {
      margin-top: 1rem;
      font-size: 0.9rem;
      color: #666;
    }
    .hidden {
      display: none;
    }
    .instructions {
      margin-top: 2rem;
      padding: 1rem;
      background-color: #f0f7ff;
      border-radius: 4px;
      font-size: 0.9rem;
      width: 100%;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes shine {
      from {
        background-position: 0%;
      }
      to {
        background-position: 200%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="title">IRONWOOD</h1>
    <p class="subtitle">Healthcare Dashboard System</p>
    
    <div id="not-started">
      <p>The Next.js server is not running yet.</p>
      <button id="start-btn" class="btn">Start Next.js Server</button>
    </div>
    
    <div id="starting" class="hidden">
      <div class="loader"></div>
      <p>Starting Next.js server...</p>
      <p class="status" id="status-message">Initializing...</p>
    </div>
    
    <div id="running" class="hidden">
      <p>Server is running! 🎉</p>
      <button id="open-btn" class="btn">Open Dashboard in Browser</button>
      <button id="reload-btn" class="btn" style="background: #4CAF50; margin-top: 0.5rem;">Reload Electron App</button>
    </div>
    
    <div class="instructions">
      <p><strong>Instructions:</strong></p>
      <ol>
        <li>Click "Start Next.js Server" to initialize the server</li>
        <li>Wait for the server to start (this may take a minute)</li>
        <li>Once ready, click "Open Dashboard in Browser" to view your app</li>
      </ol>
      <p><strong>Note:</strong> The Next.js server will continue running in the background even if you close this window.</p>
    </div>
  </div>

  <script>
    const { ipcRenderer } = require('electron');
    
    // Elements
    const notStartedEl = document.getElementById('not-started');
    const startingEl = document.getElementById('starting');
    const runningEl = document.getElementById('running');
    const startBtn = document.getElementById('start-btn');
    const openBtn = document.getElementById('open-btn');
    const reloadBtn = document.getElementById('reload-btn');
    const statusMessage = document.getElementById('status-message');
    
    // Event listeners
    startBtn.addEventListener('click', () => {
      notStartedEl.classList.add('hidden');
      startingEl.classList.remove('hidden');
      
      // Tell main process to start Next.js
      ipcRenderer.send('start-next-server');
    });
    
    openBtn.addEventListener('click', () => {
      ipcRenderer.send('open-in-browser');
    });
    
    reloadBtn.addEventListener('click', () => {
      ipcRenderer.send('reload-app');
    });
    
    // Listen for server status updates
    ipcRenderer.on('server-status', (event, message) => {
      statusMessage.textContent = message;
    });
    
    // Listen for server ready event
    ipcRenderer.on('server-ready', () => {
      startingEl.classList.add('hidden');
      runningEl.classList.remove('hidden');
    });
    
    // Check if server is already running
    ipcRenderer.send('check-server-status');
    ipcRenderer.on('server-already-running', () => {
      notStartedEl.classList.add('hidden');
      runningEl.classList.remove('hidden');
    });
  </script>
</body>
</html>
`);

// ---- Step 4: Create Electron main file ----
console.log('📝 Creating Electron main file...');
const electronMainPath = path.join(WORKSPACE_DIR, 'electron', 'standalone-main.js');
createDir(path.join(WORKSPACE_DIR, 'electron'));

createFile(electronMainPath, `
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
    http.get(\`http://localhost:\${PORT}\`, (res) => {
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
    event.sender.send('server-status', 'Port ${PORT} is already in use. Next.js might be running already.');
    
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
    const startNextContent = \`
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
  console.log(\\\`Created middleware manifest at \\\${manifestPath}\\\`);
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
  console.log(\\\`Next.js process exited with code \\\${code}\\\`);
  process.exit(code);
});
\`;
    fs.writeFileSync(startNextPath, startNextContent);
  }
  
  // Start the Next.js server
  event.sender.send('server-status', 'Starting Next.js server...');
  
  // Use open terminal command to make it visible to user
  if (process.platform === 'darwin') {
    try {
      // On macOS, open a new terminal window
      execSync(\`osascript -e 'tell app "Terminal" to do script "cd \\\"\\\${process.cwd()}\\\" && node start-next.js"'\`);
      
      // Poll for server availability
      checkServerAvailability(event);
    } catch (error) {
      event.sender.send('server-status', \`Error starting server: \${error.message}\`);
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
    
    event.sender.send('server-status', \`Waiting for Next.js server to start... (\${i+1}s)\`);
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
  shell.openExternal(\`http://localhost:\${PORT}\`);
});

ipcMain.on('reload-app', () => {
  mainWindow.reload();
});
`);

// ---- Step 5: Create launcher script ----
console.log('📝 Creating launcher script...');
const launcherPath = path.join(WORKSPACE_DIR, 'ironwood-launcher.js');

createFile(launcherPath, `
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting IRONWOOD Desktop App...');

// Define paths
const workspaceDir = process.cwd();
const electronPath = path.join(
  workspaceDir, 
  'node_modules', 
  'electron', 
  'dist',
  'Electron.app',
  'Contents',
  'MacOS',
  'Electron'
);

// Launch Electron with our custom main file
const electronProcess = spawn(electronPath, [
  '-r', 
  path.join(workspaceDir, 'electron', 'standalone-main.js')
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    ELECTRON_ENABLE_LOGGING: '1'
  }
});

electronProcess.on('error', (err) => {
  console.error('Failed to start Electron:', err);
});

electronProcess.on('close', (code) => {
  console.log(\`Electron process exited with code \${code}\`);
});
`);

// ---- Step 6: Launch the application ----
console.log('🚀 Starting IRONWOOD Desktop App...');

// Make the launcher executable
try {
  execSync(`chmod +x ${launcherPath}`);
} catch (err) {
  console.error('Failed to make launcher executable:', err);
}

// Launch the app
try {
  const electronProcess = spawn('node', [launcherPath], {
    stdio: 'inherit',
    env: {
      ...process.env,
      ELECTRON_ENABLE_LOGGING: '1'
    }
  });

  electronProcess.on('error', (err) => {
    console.error('Failed to start launcher:', err);
  });
} catch (err) {
  console.error('Failed to launch the application:', err);
}

console.log('\n✅ Setup complete! The application should now be running.');
console.log('📘 How to use:');
console.log('1. Click "Start Next.js Server" in the Electron window');
console.log('2. A terminal window will open running the Next.js server');
console.log('3. Once the server is ready, click "Open Dashboard in Browser"');
console.log('4. You can also reload the Electron app if needed'); 