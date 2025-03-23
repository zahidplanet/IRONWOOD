const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

console.log('\x1b[36m%s\x1b[0m', '🚀 IRONWOOD - Reliable Launcher');

// Kill all existing processes to ensure clean start
try {
  console.log('Stopping any running processes...');
  if (process.platform === 'darwin' || process.platform === 'linux') {
    execSync('pkill -f electron || true');
    execSync('pkill -f "next dev" || true');
    execSync('pkill -f "node" || true');
    execSync('lsof -i:3000 -t | xargs kill -9 || true');
    execSync('lsof -i:3001 -t | xargs kill -9 || true');
  } else if (process.platform === 'win32') {
    execSync('taskkill /F /IM electron.exe /T || echo No electron processes');
    execSync('taskkill /F /IM node.exe /T || echo No node processes');
  }
} catch (e) {
  // Ignore errors
}

// Define the port Next.js will run on
const NEXT_PORT = 3001;

// Create a simple launcher for Electron
const createElectronLauncher = () => {
  const electronDir = path.join(__dirname, 'electron');
  if (!fs.existsSync(electronDir)) {
    fs.mkdirSync(electronDir, { recursive: true });
  }
  
  const launcherPath = path.join(electronDir, 'launcher.js');
  fs.writeFileSync(launcherPath, `
const { app, BrowserWindow } = require('electron');
const path = require('path');

// Disable hardware acceleration to prevent crashes
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

// Security warnings are noisy in dev
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

let mainWindow;
const NEXT_PORT = ${NEXT_PORT};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#121212',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  const startUrl = \`http://localhost:\${NEXT_PORT}\`;
  console.log(\`Loading URL: \${startUrl}\`);
  
  mainWindow.loadURL(startUrl);
  
  // Uncomment for debugging
  // mainWindow.webContents.openDevTools();
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
});

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
  `);
  
  console.log('Created Electron launcher with fixed port:', NEXT_PORT);
}

// Create and run the Next.js development server
const runNextJs = () => {
  return new Promise((resolve, reject) => {
    console.log(`Starting Next.js on port ${NEXT_PORT}...`);
    
    // Force specific port by setting env variable
    const env = { ...process.env, PORT: NEXT_PORT.toString() };
    
    const nextProcess = spawn('npx', ['next', 'dev', '-p', NEXT_PORT.toString()], {
      env,
      stdio: 'inherit'
    });
    
    // Wait for Next.js to be ready by polling the port
    const checkNextJs = () => {
      const request = http.get(`http://localhost:${NEXT_PORT}`, (res) => {
        if (res.statusCode === 200) {
          console.log(`✅ Next.js is running on port ${NEXT_PORT}`);
          resolve(nextProcess);
        } else {
          setTimeout(checkNextJs, 1000);
        }
      });
      
      request.on('error', (err) => {
        // Still starting up, try again
        setTimeout(checkNextJs, 1000);
      });
    };
    
    // Start checking after a short delay
    setTimeout(checkNextJs, 3000);
    
    nextProcess.on('error', (err) => {
      console.error('Failed to start Next.js:', err);
      reject(err);
    });
  });
};

// Start Electron after Next.js is ready
const runElectron = () => {
  console.log('Starting Electron...');
  
  const electronProcess = spawn('npx', ['electron', './electron/launcher.js'], {
    stdio: 'inherit'
  });
  
  electronProcess.on('error', (err) => {
    console.error('Failed to start Electron:', err);
  });
  
  return electronProcess;
};

// Ensure clean exit when the script is terminated
const cleanupOnExit = (nextProcess, electronProcess) => {
  process.on('SIGINT', () => {
    console.log('Shutting down...');
    if (electronProcess) electronProcess.kill();
    if (nextProcess) nextProcess.kill();
    process.exit();
  });
};

// Main function to run everything
const main = async () => {
  try {
    // Create the Electron launcher script
    createElectronLauncher();
    
    // Start Next.js and wait for it to be ready
    const nextProcess = await runNextJs();
    
    // Start Electron
    const electronProcess = runElectron();
    
    // Setup cleanup
    cleanupOnExit(nextProcess, electronProcess);
    
    console.log('\n⭐️ IRONWOOD is running!');
    console.log('Press Ctrl+C to stop all processes\n');
  } catch (err) {
    console.error('Failed to start IRONWOOD:', err);
    process.exit(1);
  }
};

// Run the main function
main(); 