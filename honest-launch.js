const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');
const http = require('http');

console.log('🔍 IRONWOOD - Honest Launcher');
console.log('This launcher will be 100% honest about what is happening.\n');

// Helper function to check if Next.js server is responding
function checkServerRunning(port = 3000) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}`, (res) => {
      resolve(true);
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    // Set timeout to avoid hanging
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Function to stop processes with visibility
async function stopProcesses() {
  console.log('Checking for running processes...');
  
  try {
    // Check if processes exist before trying to kill them
    const checkElectron = execSync('pgrep -f electron || echo "none"').toString().trim();
    const checkNext = execSync('pgrep -f "next dev" || echo "none"').toString().trim();
    const checkNode = execSync('pgrep -f node || echo "none"').toString().trim();
    
    if (checkElectron !== 'none') {
      console.log('- Found running Electron processes - stopping them');
      execSync('pkill -f electron || true');
    } else {
      console.log('- No Electron processes running');
    }
    
    if (checkNext !== 'none') {
      console.log('- Found running Next.js processes - stopping them');
      execSync('pkill -f "next dev" || true');
    } else {
      console.log('- No Next.js processes running');
    }
    
    // Check if server is still responding after kills
    const isServerStillRunning = await checkServerRunning();
    if (isServerStillRunning) {
      console.log('- Port 3000 is still in use. Finding and stopping the process...');
      execSync('lsof -i:3000 -t | xargs kill -9 || true');
    }
    
    // Double check port availability
    const isPortFree = await checkServerRunning() === false;
    if (isPortFree) {
      console.log('✅ Port 3000 is free and ready to use');
    } else {
      console.log('⚠️ Port 3000 is still in use - this may cause problems');
    }
  } catch (e) {
    console.log(`⚠️ Error while stopping processes: ${e.message}`);
  }
}

// Create middleware manifest files with visibility
function createManifestFiles() {
  console.log('\nChecking middleware manifest files...');
  
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
  
  let createdCount = 0;
  
  dirs.forEach(dir => {
    const manifestPath = path.join(dir, 'middleware-manifest.json');
    
    // Check if directory exists
    if (!fs.existsSync(dir)) {
      console.log(`- Creating directory: ${dir}`);
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (e) {
        console.log(`  ⚠️ Failed to create directory: ${e.message}`);
        return;
      }
    }
    
    // Check if manifest file exists
    if (!fs.existsSync(manifestPath)) {
      console.log(`- Creating manifest file: ${manifestPath}`);
      try {
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        createdCount++;
      } catch (e) {
        console.log(`  ⚠️ Failed to create manifest file: ${e.message}`);
      }
    } else {
      console.log(`- Manifest file already exists: ${manifestPath}`);
    }
  });
  
  if (createdCount > 0) {
    console.log(`✅ Created ${createdCount} middleware manifest files`);
  } else {
    console.log('✅ All middleware manifest files already exist');
  }
}

// Create HTML file
function createHtmlFile() {
  console.log('\nCreating Electron HTML interface...');
  
  const htmlPath = path.join(__dirname, 'electron-honest.html');
  
  // Check if HTML file already exists
  if (fs.existsSync(htmlPath)) {
    console.log(`- HTML file already exists at ${htmlPath}`);
    console.log('- Updating to latest version');
  }
  
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
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
      max-width: 650px;
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
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #0070f3;
      animation: spin 1s ease-in-out infinite;
      margin: 10px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .status-container {
      margin: 20px 0;
      padding: 15px;
      background-color: #1e1e1e;
      border-radius: 4px;
      text-align: left;
      min-height: 60px;
      max-height: 200px;
      overflow-y: auto;
    }
    .status-title {
      font-weight: bold;
      margin-bottom: 8px;
      color: #0070f3;
    }
    .status-msg {
      margin: 4px 0;
      font-size: 0.9rem;
    }
    .status-error {
      color: #ff4d4f;
    }
    .status-success {
      color: #52c41a;
    }
    .status-waiting {
      color: #faad14;
    }
    .button {
      background: linear-gradient(to right, #0070f3, #6c5ce7);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 5px;
      cursor: pointer;
      margin: 10px 5px;
      font-size: 1rem;
      font-weight: bold;
      transition: all 0.2s ease;
      opacity: 0.7;
      pointer-events: none;
    }
    .button.active {
      opacity: 1;
      pointer-events: all;
    }
    .button.active:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 112, 243, 0.5);
    }
    .button-container {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }
    .info-panel {
      margin-top: 20px;
      padding: 15px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      text-align: left;
      font-size: 0.85rem;
    }
    .info-panel h3 {
      margin-top: 0;
      color: #0070f3;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>IRONWOOD</h1>
    <p>Healthcare Dashboard System</p>
    
    <div class="status-container">
      <div class="status-title">Next.js Server Status:</div>
      <div id="nextjs-status" class="status-msg status-waiting">
        Checking server status...
      </div>
      <div id="nextjs-loader" class="loader" style="display: inline-block;"></div>
    </div>
    
    <div class="button-container">
      <button id="startButton" class="button">Start Next.js Server</button>
      <button id="openButton" class="button">Open in Browser</button>
      <button id="checkButton" class="button active">Check Status</button>
    </div>
    
    <div class="info-panel">
      <h3>Honest Status Information</h3>
      <p>This launcher transparently shows the real status of your application:</p>
      <ul>
        <li>No fake progress bars - only real status updates</li>
        <li>Server availability is actively checked</li>
        <li>Clear error messages when something goes wrong</li>
        <li>You control when to start services</li>
      </ul>
    </div>
  </div>

  <script>
    const { ipcRenderer } = require('electron');
    
    // DOM elements
    const nextJsStatus = document.getElementById('nextjs-status');
    const nextJsLoader = document.getElementById('nextjs-loader');
    const startButton = document.getElementById('startButton');
    const openButton = document.getElementById('openButton');
    const checkButton = document.getElementById('checkButton');
    
    // State
    let isServerRunning = false;
    let isCheckingServer = false;
    
    // Update status display
    function updateStatus(message, type = 'normal') {
      nextJsStatus.textContent = message;
      nextJsStatus.className = 'status-msg';
      
      if (type === 'error') {
        nextJsStatus.classList.add('status-error');
      } else if (type === 'success') {
        nextJsStatus.classList.add('status-success');
      } else if (type === 'waiting') {
        nextJsStatus.classList.add('status-waiting');
      }
    }
    
    // Show/hide loader
    function setLoading(isLoading) {
      nextJsLoader.style.display = isLoading ? 'inline-block' : 'none';
      isCheckingServer = isLoading;
    }
    
    // Update button states
    function updateButtons() {
      startButton.className = isServerRunning ? 'button' : 'button active';
      openButton.className = isServerRunning ? 'button active' : 'button';
      checkButton.className = isCheckingServer ? 'button' : 'button active';
    }
    
    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      checkServerStatus();
    });
    
    // Check server status
    function checkServerStatus() {
      if (isCheckingServer) return;
      
      setLoading(true);
      updateStatus('Checking Next.js server status...', 'waiting');
      updateButtons();
      
      ipcRenderer.send('check-server');
    }
    
    // Start Next.js server
    function startNextJsServer() {
      if (isServerRunning || isCheckingServer) return;
      
      setLoading(true);
      updateStatus('Starting Next.js server...', 'waiting');
      updateButtons();
      
      ipcRenderer.send('start-server');
    }
    
    // Open in browser
    function openInBrowser() {
      if (!isServerRunning) return;
      
      updateStatus('Opening application in browser...', 'waiting');
      ipcRenderer.send('open-browser');
    }
    
    // Button event listeners
    startButton.addEventListener('click', startNextJsServer);
    openButton.addEventListener('click', openInBrowser);
    checkButton.addEventListener('click', checkServerStatus);
    
    // IPC responses
    ipcRenderer.on('server-status', (event, data) => {
      setLoading(false);
      isServerRunning = data.isRunning;
      
      if (data.isRunning) {
        updateStatus('Next.js server is running and responding!', 'success');
      } else {
        updateStatus(data.message || 'Server is not running', data.error ? 'error' : 'normal');
      }
      
      updateButtons();
    });
    
    ipcRenderer.on('server-starting', (event, data) => {
      updateStatus(data.message || 'Starting server...', 'waiting');
    });
    
    ipcRenderer.on('server-error', (event, data) => {
      setLoading(false);
      updateStatus(data.message || 'Error starting server', 'error');
      updateButtons();
    });
    
    ipcRenderer.on('browser-opened', () => {
      updateStatus('Application opened in browser', 'success');
    });
  </script>
</body>
</html>
  `;
  
  try {
    fs.writeFileSync(htmlPath, htmlContent);
    console.log(`✅ Created HTML interface at ${htmlPath}`);
  } catch (e) {
    console.log(`⚠️ Failed to create HTML file: ${e.message}`);
  }
  
  return htmlPath;
}

// Create Electron main file
function createMainFile() {
  console.log('\nCreating Electron main file...');
  
  const mainPath = path.join(__dirname, 'honest-main.js');
  
  if (fs.existsSync(mainPath)) {
    console.log(`- Main file already exists at ${mainPath}`);
    console.log('- Updating to latest version');
  }
  
  const mainContent = `
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
    
    const req = http.get(\`http://localhost:\${PORT}\`, (res) => {
      console.log(\`Server responded with status code: \${res.statusCode}\`);
      resolve(res.statusCode === 200 || res.statusCode === 404);
    });
    
    req.on('error', (err) => {
      console.log(\`Server check error: \${err.message}\`);
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
      message: \`Error checking server: \${error.message}\`,
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
      execSync(\`osascript -e 'tell app "Terminal" to do script "cd \\"\${process.cwd()}\\" && npm run dev"'\`);
    } else {
      // On Windows/Linux
      const command = process.platform === 'win32' ? 
        \`start cmd.exe /K "cd /d "\${process.cwd()}" && npm run dev"\` :
        \`x-terminal-emulator -e 'cd "\${process.cwd()}" && npm run dev'\`;
      
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
          message: \`Next.js server did not start after \${maxAttempts} attempts. Check terminal for errors.\`
        });
      } else {
        event.sender.send('server-starting', {
          message: \`Waiting for Next.js server to start... (Attempt \${attempts}/\${maxAttempts})\`
        });
      }
    }, 1000);
    
  } catch (error) {
    event.sender.send('server-error', {
      message: \`Error starting server: \${error.message}\`
    });
  }
});

ipcMain.on('open-browser', (event) => {
  shell.openExternal(\`http://localhost:\${PORT}\`);
  event.sender.send('browser-opened');
});
`;

  try {
    fs.writeFileSync(mainPath, mainContent);
    console.log(`✅ Created Electron main file at ${mainPath}`);
  } catch (e) {
    console.log(`⚠️ Failed to create main file: ${e.message}`);
  }
  
  return mainPath;
}

// Main process
async function main() {
  try {
    // Stop any running processes
    await stopProcesses();
    
    // Create necessary files
    createManifestFiles();
    const htmlPath = createHtmlFile();
    const mainPath = createMainFile();
    
    // Start Electron
    console.log('\n🚀 Starting Electron application...');
    
    // Look for electron in node_modules
    let electronCmd = 'npx';
    let electronArgs = ['electron', mainPath];
    
    const electronExePath = path.join(
      __dirname,
      'node_modules',
      'electron',
      'dist',
      'Electron.app',
      'Contents',
      'MacOS',
      'Electron'
    );
    
    if (fs.existsSync(electronExePath)) {
      console.log('- Using local Electron executable');
      electronCmd = electronExePath;
      electronArgs = [mainPath];
    } else {
      console.log('- Using npx to run Electron');
    }
    
    console.log(`- Command: ${electronCmd} ${electronArgs.join(' ')}`);
    
    const electronProcess = spawn(electronCmd, electronArgs, {
      stdio: 'inherit',
      env: {
        ...process.env,
        ELECTRON_ENABLE_LOGGING: '1'
      }
    });
    
    electronProcess.on('error', (err) => {
      console.log(`\n⚠️ Failed to start Electron: ${err.message}`);
      console.log('- Trying alternative method with npx...');
      
      const fallbackProcess = spawn('npx', ['electron', mainPath], {
        stdio: 'inherit',
        env: {
          ...process.env,
          ELECTRON_ENABLE_LOGGING: '1'
        }
      });
      
      fallbackProcess.on('error', (fallbackErr) => {
        console.log(`\n❌ Fallback also failed: ${fallbackErr.message}`);
        console.log('\nPlease try manually running:');
        console.log('npx electron honest-main.js');
      });
    });
    
    console.log('\n✅ IRONWOOD honest launcher executed successfully');
    console.log('The application interface will show real-time status');
  } catch (error) {
    console.log(`\n❌ Error in honest launcher: ${error.message}`);
  }
}

// Run the main process
main(); 