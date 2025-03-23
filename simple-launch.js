const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

console.log('🌟 IRONWOOD Healthcare Dashboard - Simple Launch 🌟');

// Stop existing processes
console.log('🛑 Stopping existing processes...');
try {
  execSync('pkill -f electron || true');
  execSync('pkill -f next || true');
  execSync('pkill -f node || true');
} catch (e) { /* ignore errors */ }

// Create middleware manifest files
console.log('📝 Creating middleware manifest files...');
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
  fs.writeFileSync(path.join(dir, 'middleware-manifest.json'), JSON.stringify(manifest, null, 2));
});

// Create HTML file
console.log('📝 Creating Electron HTML...');
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
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 112, 243, 0.5);
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
      width: 10%;
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
    <p id="status">Starting Next.js server...</p>
    <button id="openBrowser" class="button">Open in Browser</button>
  </div>

  <script>
    const { shell } = require('electron');
    const progressBar = document.getElementById('progress');
    const statusText = document.getElementById('status');
    const openButton = document.getElementById('openBrowser');
    
    // Animate progress bar
    let progress = 10;
    const progressInterval = setInterval(() => {
      progress += 3;
      if (progress >= 100) {
        clearInterval(progressInterval);
        progress = 100;
        statusText.textContent = 'Next.js server is ready!';
      }
      progressBar.style.width = progress + '%';
    }, 500);

    // Open browser button
    openButton.addEventListener('click', () => {
      shell.openExternal('http://localhost:3000');
    });
  </script>
</body>
</html>
`;

const htmlPath = path.join(__dirname, 'electron-app.html');
fs.writeFileSync(htmlPath, htmlContent);

// Create main.js
console.log('📝 Creating Electron main file...');
const mainJsContent = `
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

// Disable hardware acceleration to prevent GPU crashes
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'electron-app.html'));
  
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
`;

const mainJsPath = path.join(__dirname, 'simple-main.js');
fs.writeFileSync(mainJsPath, mainJsContent);

// Start Next.js in a new terminal on macOS
console.log('🚀 Starting Next.js server...');
if (process.platform === 'darwin') {
  try {
    execSync(`osascript -e 'tell app "Terminal" to do script "cd \\"${__dirname}\\" && npm run dev"'`);
  } catch (e) {
    console.error('Failed to open Terminal:', e);
  }
} else {
  // For non-macOS platforms
  const nextProcess = spawn('npm', ['run', 'dev'], {
    detached: true,
    stdio: 'ignore'
  });
  nextProcess.unref();
}

// Start Electron after a short delay
console.log('🚀 Starting Electron app...');
setTimeout(() => {
  const electronProcess = spawn('npx', ['electron', 'simple-main.js'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      ELECTRON_ENABLE_LOGGING: '1'
    }
  });

  electronProcess.on('error', (err) => {
    console.error('Failed to start Electron:', err);
  });
}, 2000);

console.log('✅ Launch process initiated!');
console.log('📘 How to use:');
console.log('1. Wait for the Next.js server to start in the new terminal window');
console.log('2. The Electron app will show the IRONWOOD dashboard');
console.log('3. Click "Open in Browser" to view the app in your browser'); 