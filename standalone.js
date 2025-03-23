const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

console.log('🛑 Stopping all existing processes...');
try {
  if (process.platform === 'darwin' || process.platform === 'linux') {
    execSync('pkill -f electron || true');
    execSync('pkill -f next || true');
    execSync('pkill -f node || true');
  } else {
    execSync('taskkill /F /IM electron.exe /T', { stdio: 'ignore' });
    execSync('taskkill /F /IM node.exe /T', { stdio: 'ignore' });
  }
} catch (e) {
  // Ignore errors
}

// Create a simple static HTML file that Electron can load directly
console.log('📝 Creating static HTML file...');
const htmlContent = `
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
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            background: linear-gradient(to right, #0070f3, #9333ea);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
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
        }
        .button {
            background-color: #0070f3;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 20px;
            font-size: 1rem;
        }
        .button:hover {
            background-color: #0060df;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>IRONWOOD</h1>
        <p>Welcome to the IRONWOOD dashboard</p>
        <div class="loader"></div>
        <p id="status">Loading dashboard...</p>
        <button class="button" onclick="startApp()">Launch Next.js App</button>
    </div>

    <script>
        // Function to launch the Next.js app
        function startApp() {
            document.getElementById('status').textContent = 'Launching Next.js app...';
            
            // Open Next.js app in a new window
            const nextWindow = window.open('http://localhost:3000', '_blank', 'width=1200,height=800');
            
            if (nextWindow) {
                document.getElementById('status').textContent = 'Next.js app launched successfully!';
            } else {
                document.getElementById('status').textContent = 'Failed to launch. Please check if popup blocker is enabled.';
            }
        }
        
        // Check if Next.js is running
        function checkNextJs() {
            fetch('http://localhost:3000', { mode: 'no-cors' })
                .then(() => {
                    document.getElementById('status').textContent = 'Next.js server is running. Click the button to launch the app.';
                })
                .catch(() => {
                    document.getElementById('status').textContent = 'Waiting for Next.js server to start...';
                    setTimeout(checkNextJs, 2000);
                });
        }
        
        // Start checking
        setTimeout(checkNextJs, 2000);
    </script>
</body>
</html>
`;

const htmlPath = path.join(__dirname, 'electron-app.html');
fs.writeFileSync(htmlPath, htmlContent);
console.log(`✅ Created static HTML file at ${htmlPath}`);

// Create a minimal Electron main file
console.log('📝 Creating minimal Electron main file...');
const electronDir = path.join(__dirname, 'electron');
if (!fs.existsSync(electronDir)) {
  fs.mkdirSync(electronDir, { recursive: true });
}

const electronMainPath = path.join(electronDir, 'standalone-main.js');
const electronMainContent = `
// Minimal standalone Electron main file
const { app, BrowserWindow } = require('electron');
const path = require('path');

// Disable hardware acceleration to prevent GPU crashes
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#121212',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load the HTML file directly - no Next.js needed for the initial view
  const htmlPath = path.join(__dirname, '..', 'electron-app.html');
  console.log('Loading HTML file:', htmlPath);
  mainWindow.loadFile(htmlPath);
  
  // Open DevTools for debugging
  // mainWindow.webContents.openDevTools();
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
`;

fs.writeFileSync(electronMainPath, electronMainContent);
console.log(`✅ Created minimal Electron main file at ${electronMainPath}`);

// Create a script to start Next.js separately
console.log('📝 Creating Next.js starter script...');
const nextStarterPath = path.join(__dirname, 'start-next.js');
const nextStarterContent = `
const { spawn } = require('child_process');

console.log('🚀 Starting Next.js development server in separate process...');
spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  detached: true
});
`;

fs.writeFileSync(nextStarterPath, nextStarterContent);
console.log(`✅ Created Next.js starter script at ${nextStarterPath}`);

// Start the Electron app independently
console.log('🚀 Starting Electron standalone app...');

const electronProcess = spawn('npx', [
  'electron',
  '-r',
  './electron/standalone-main.js'
], {
  stdio: 'inherit',
  env: { ...process.env, ELECTRON_ENABLE_LOGGING: '1' }
});

electronProcess.on('close', (code) => {
  console.log(`Electron process exited with code ${code}`);
  process.exit(0);
});

// Start Next.js in a separate process (non-blocking)
console.log('🚀 Starting Next.js server in separate process...');
const nextProcess = spawn('node', ['start-next.js'], {
  detached: true,
  stdio: 'ignore'
});

// Don't wait for Next.js process
nextProcess.unref();

console.log('✅ Both processes started. Next.js will continue running in the background.');
console.log('⚠️ You may need to close the Node.js process manually when done.'); 