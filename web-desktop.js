const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const http = require('http');

// ---- Configuration ----
const WORKSPACE_DIR = process.cwd();
const PORT = 3000;

console.log('🌟 IRONWOOD Healthcare Dashboard Launcher 🌟');

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
      backgroundColor: '#121212'
    }}>
      <h1 style={{ 
        fontSize: '2rem', 
        background: 'linear-gradient(to right, #0070f3, #9333ea)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        {statusCode ? \`Error \${statusCode}\` : 'An error occurred'}
      </h1>
      <p style={{ color: '#fff' }}>Please try again later</p>
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

// ---- Step 4: Create a beautiful UI for Electron ----
console.log('📝 Creating beautiful Electron UI...');
const htmlPath = path.join(WORKSPACE_DIR, 'electron-app.html');
createFile(htmlPath, `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IRONWOOD</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #121212;
      color: white;
    }
    .container {
      text-align: center;
      padding: 2rem;
      width: 100%;
      max-width: 600px;
    }
    h1 {
      font-size: 3.5rem;
      margin-bottom: 1rem;
      background: linear-gradient(to right, #0070f3, #9333ea);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradient 3s ease infinite;
      background-size: 200% 200%;
    }
    @keyframes gradient {
      0% {background-position: 0% 50%;}
      50% {background-position: 100% 50%;}
      100% {background-position: 0% 50%;}
    }
    .loader {
      display: inline-block;
      width: 50px;
      height: 50px;
      border: 5px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #0070f3;
      animation: spin 1s ease-in-out infinite;
      margin-top: 20px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    #status {
      margin-top: 20px;
      height: 60px;
    }
    .button {
      background: linear-gradient(to right, #0070f3, #6c5ce7);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 20px;
      font-size: 1rem;
      font-weight: bold;
      transition: all 0.2s ease;
    }
    .button.active {
      opacity: 1;
      pointer-events: all;
      box-shadow: 0 4px 12px rgba(0, 112, 243, 0.4);
    }
    .button.active:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 112, 243, 0.5);
    }
    .log-container {
      margin-top: 30px;
      background-color: #1e1e1e;
      border-radius: 5px;
      padding: 10px;
      font-family: monospace;
      text-align: left;
      height: 100px;
      overflow-y: auto;
      font-size: 0.8rem;
      color: #ccc;
    }
    .progress-container {
      width: 100%;
      height: 8px;
      background-color: #333;
      border-radius: 4px;
      margin-top: 20px;
      overflow: hidden;
    }
    .progress-bar {
      height: 100%;
      width: 0%;
      background: linear-gradient(to right, #0070f3, #9333ea);
      border-radius: 4px;
      transition: width 0.4s ease;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>IRONWOOD</h1>
    <p>Healthcare Dashboard System</p>
    <div class="loader"></div>
    <div class="progress-container">
      <div class="progress-bar" id="progress"></div>
    </div>
    <p id="status">Initializing Next.js server...</p>
    <button class="button active" id="launchBtn">Launch Next.js App</button>
    <div class="log-container" id="logs"></div>
  </div>

  <script>
    const { ipcRenderer } = require('electron');
    const statusEl = document.getElementById('status');
    const progressEl = document.getElementById('progress');
    const logsEl = document.getElementById('logs');
    const launchBtn = document.getElementById('launchBtn');
    let progress = 0;
    let serverReady = false;
    
    // Add log entry
    function addLog(message) {
      const logEntry = document.createElement('div');
      logEntry.textContent = message;
      logsEl.appendChild(logEntry);
      logsEl.scrollTop = logsEl.scrollHeight;
    }
    
    // Update progress bar
    function updateProgress(value) {
      progress = value;
      progressEl.style.width = \`\${progress}%\`;
    }
    
    // Function to launch the Next.js app
    function launchApp() {
      statusEl.textContent = 'Launching Next.js app...';
      addLog('Opening Next.js application in default browser...');
      
      // Tell the main process to open in browser
      ipcRenderer.send('open-in-browser');
    }
    
    // Register launch button click
    launchBtn.addEventListener('click', launchApp);
    
    // Listen for server status updates from main process
    ipcRenderer.on('server-status', (event, message) => {
      statusEl.textContent = message;
      addLog(message);
      
      if (message.includes('Next.js server is running!')) {
        serverReady = true;
        updateProgress(100);
      }
    });
    
    // Start with initial progress
    updateProgress(10);
    addLog('🚀 Checking Next.js server status...');
    
    // Tell main process to check server status
    ipcRenderer.send('check-server-status');
    
    // Poll for progress updates
    let progressUpdater = setInterval(() => {
      if (serverReady) {
        clearInterval(progressUpdater);
        return;
      }
      
      progress += 2;
      if (progress > 90) progress = 90;
      updateProgress(progress);
    }, 500);
  </script>
</body>
</html>
`);

// ---- Step 5: Create Electron main file ----
console.log('📝 Creating Electron main file...');
const electronDir = path.join(WORKSPACE_DIR, 'electron');
createDir(electronDir);

const electronMainPath = path.join(electronDir, 'responsive-main.js');
createFile(electronMainPath, `
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
    http.get(\`http://localhost:\${PORT}\`, (res) => {
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
  const nextStarterContent = \`
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
    console.log(\\\`Created middleware manifest at: \\\${manifestPath}\\\`);
  });
  
  // Start Next.js development server
  console.log('Starting Next.js development server...');
  const nextProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });
  
  nextProcess.on('close', (code) => {
    console.log(\\\`Next.js process exited with code \\\${code}\\\`);
    process.exit(code);
  });
  
  process.on('SIGINT', () => {
    nextProcess.kill('SIGINT');
    process.exit(0);
  });
  \`;
  
  fs.writeFileSync(nextStarterPath, nextStarterContent);
  
  // Start Next.js in separate terminal
  try {
    if (process.platform === 'darwin') {
      // On macOS, open a new terminal
      const terminalCmd = \`osascript -e 'tell app "Terminal" to do script "cd \\"\${process.cwd()}\\" && node next-starter.js"'\`;
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
        mainWindow.webContents.send('server-status', \`Waiting for Next.js server to start... (\${attempts}/\${maxAttempts})\`);
      }
    }, 1000);
    
  } catch (error) {
    console.error('Failed to start Next.js server:', error);
    if (mainWindow) {
      mainWindow.webContents.send('server-status', \`Error starting Next.js server: \${error.message}\`);
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
  shell.openExternal(\`http://localhost:\${PORT}\`);
});
`);

// ---- Step 6: Create launcher script ----
console.log('📝 Creating launcher script...');
const launcherPath = path.join(WORKSPACE_DIR, 'start-ironwood.js');

createFile(launcherPath, `
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting IRONWOOD Desktop App...');

// Find the Electron executable
function findElectronPath() {
  const relativePath = path.join(
    'node_modules',
    'electron',
    'dist',
    'Electron.app',
    'Contents',
    'MacOS',
    'Electron'
  );
  
  const absolutePath = path.join(process.cwd(), relativePath);
  
  if (fs.existsSync(absolutePath)) {
    return absolutePath;
  }
  
  // Fallback to using npx
  return 'npx';
}

// Get command to run Electron
function getElectronCommand() {
  const electronPath = findElectronPath();
  
  if (electronPath === 'npx') {
    return {
      command: 'npx',
      args: ['electron', '-r', path.join(process.cwd(), 'electron', 'responsive-main.js')]
    };
  }
  
  return {
    command: electronPath,
    args: ['-r', path.join(process.cwd(), 'electron', 'responsive-main.js')]
  };
}

// Launch the app
const { command, args } = getElectronCommand();

console.log(\`Running Electron with command: \${command} \${args.join(' ')}\`);

const electronProcess = spawn(command, args, {
  stdio: 'inherit',
  env: {
    ...process.env,
    ELECTRON_ENABLE_LOGGING: '1',
    NODE_ENV: 'development'
  }
});

electronProcess.on('error', (err) => {
  console.error('Failed to start Electron:', err);
  
  // Try fallback to npx if we tried with direct path first
  if (command !== 'npx') {
    console.log('Trying fallback to npx electron...');
    const fallbackProcess = spawn('npx', ['electron', '-r', path.join(process.cwd(), 'electron', 'responsive-main.js')], {
      stdio: 'inherit',
      env: {
        ...process.env,
        ELECTRON_ENABLE_LOGGING: '1',
        NODE_ENV: 'development'
      }
    });
    
    fallbackProcess.on('error', (fallbackErr) => {
      console.error('Fallback also failed:', fallbackErr);
    });
  }
});

electronProcess.on('close', (code) => {
  console.log(\`Electron process exited with code \${code}\`);
});
`);

// ---- Step 7: Launch the application ----
console.log('🚀 Starting IRONWOOD Desktop App...');

// Make scripts executable
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
      ELECTRON_ENABLE_LOGGING: '1',
      NODE_ENV: 'development'
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
console.log('1. Wait for the Next.js server to start automatically');
console.log('2. Once the server is ready, click "Launch Next.js App" to open in your browser');
console.log('3. You can also restart the app by running `node start-ironwood.js`'); 