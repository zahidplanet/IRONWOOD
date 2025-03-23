const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');
const http = require('http');

// -- Configuration --
const NEXT_PORT = 3000;
const WAIT_TIMEOUT = 60000; // 60 seconds max to wait for Next.js
const CHECK_INTERVAL = 1000; // Check every second

// Terminal colors
const log = {
  info: (msg) => console.log(`\x1b[36m${msg}\x1b[0m`),
  success: (msg) => console.log(`\x1b[32m${msg}\x1b[0m`),
  error: (msg) => console.log(`\x1b[31m${msg}\x1b[0m`),
  warn: (msg) => console.log(`\x1b[33m${msg}\x1b[0m`),
  plain: (msg) => console.log(msg)
};

// -- Clean up processes --
log.info("🧹 Cleaning up any existing processes...");

try {
  if (process.platform === 'darwin' || process.platform === 'linux') {
    execSync('pkill -f electron || true');
    execSync('pkill -f "next dev" || true');
    execSync('lsof -i:3000 -t | xargs kill -9 || true');
  } else if (process.platform === 'win32') {
    execSync('taskkill /F /IM electron.exe /T || echo No electron processes');
    execSync('taskkill /F /FI "WINDOWTITLE eq next dev" || echo No next processes');
  }
  log.success("✅ Cleanup completed");
} catch (err) {
  log.warn(`⚠️ Cleanup error (non-critical): ${err.message}`);
}

// -- Create minimal Next.js app --
log.info("📁 Setting up minimal Next.js app...");

// Create pages directory if it doesn't exist
const pagesDir = path.join(__dirname, 'pages');
if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
  log.success("Created pages directory");
}

// Create a simple home page
const indexPath = path.join(pagesDir, 'index.js');
const indexContent = `
import React from 'react';

export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#121212',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h1 style={{
        fontSize: '3rem',
        background: 'linear-gradient(to right, #0070f3, #9333ea)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1rem'
      }}>
        IRONWOOD
      </h1>
      <p>Healthcare Dashboard System</p>
      <div style={{ 
        marginTop: '2rem',
        padding: '1.5rem',
        borderRadius: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        maxWidth: '500px'
      }}>
        <p>Next.js is running successfully!</p>
        <p>Status: 
          <span style={{ color: '#4caf50', fontWeight: 'bold' }}> ONLINE</span>
        </p>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(indexPath, indexContent);
log.success("✅ Created minimal Next.js app");

// -- Create minimal Electron app --
log.info("📁 Setting up minimal Electron app...");

const electronDir = path.join(__dirname, 'electron');
if (!fs.existsSync(electronDir)) {
  fs.mkdirSync(electronDir, { recursive: true });
}

const mainPath = path.join(electronDir, 'main-minimal.js');
const mainContent = `
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const http = require('http');

// Prevent GPU crashes
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');

let mainWindow;
const NEXT_PORT = 3000;

// Check if Next.js is running
function checkNextJs() {
  return new Promise((resolve) => {
    const req = http.get(\`http://localhost:\${NEXT_PORT}\`, (res) => {
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Create window with loading screen
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#121212',
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Show when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load Next.js app
  const startUrl = \`http://localhost:\${NEXT_PORT}\`;
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Try connecting to Next.js until it responds
async function connectToNextJs() {
  console.log('Checking if Next.js is running...');
  
  const isRunning = await checkNextJs();
  if (isRunning) {
    console.log('Next.js is running. Starting Electron app...');
    createWindow();
    return;
  }
  
  console.log('Next.js is not running yet. Please start it with "npm run dev" in another terminal.');
  process.exit(1);
}

app.on('ready', connectToNextJs);

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

fs.writeFileSync(mainPath, mainContent);
log.success("✅ Created minimal Electron app");

// -- Create middleware manifest files --
log.info("📁 Creating middleware manifest files...");

const manifestDirs = [
  path.join(__dirname, '.next', 'server'),
  path.join(__dirname, 'out', 'server')
];

const manifest = {
  version: 1,
  sortedMiddleware: [],
  middleware: {},
  functions: {},
  pages: {}
};

manifestDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, 'middleware-manifest.json'), JSON.stringify(manifest, null, 2));
});

log.success("✅ Created middleware manifest files");

// -- Check Next.js server --
function checkNextJsRunning() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${NEXT_PORT}`, (res) => {
      resolve(true);
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// -- Start Next.js --
async function startNextJs() {
  log.info("🚀 Starting Next.js...");
  
  // Check if Next.js is already running
  const isRunning = await checkNextJsRunning();
  if (isRunning) {
    log.success("✅ Next.js is already running");
    return true;
  }
  
  return new Promise(resolve => {
    // Start Next.js in a new terminal
    try {
      if (process.platform === 'darwin') {
        execSync(`osascript -e 'tell app "Terminal" to do script "cd \\"${process.cwd()}\\" && npm run dev"'`);
        log.success("✅ Started Next.js in a new terminal window");
      } else if (process.platform === 'win32') {
        execSync(`start cmd.exe /K "cd /d "${process.cwd()}" && npm run dev"`);
        log.success("✅ Started Next.js in a new command prompt");
      } else {
        // Linux
        execSync(`xterm -e 'cd "${process.cwd()}" && npm run dev' &`);
        log.success("✅ Started Next.js in a new terminal window");
      }
      
      // Wait for Next.js to be ready
      log.info("⏳ Waiting for Next.js to be ready...");
      
      let elapsed = 0;
      const interval = setInterval(async () => {
        if (elapsed > WAIT_TIMEOUT) {
          clearInterval(interval);
          log.error("❌ Timed out waiting for Next.js");
          resolve(false);
          return;
        }
        
        elapsed += CHECK_INTERVAL;
        
        const running = await checkNextJsRunning();
        if (running) {
          clearInterval(interval);
          log.success(`✅ Next.js is ready (after ${elapsed/1000} seconds)`);
          resolve(true);
        } else {
          process.stdout.write(".");
        }
      }, CHECK_INTERVAL);
      
    } catch (error) {
      log.error(`❌ Failed to start Next.js: ${error.message}`);
      log.warn("Please start it manually with: npm run dev");
      resolve(false);
    }
  });
}

// -- Start Electron --
function startElectron() {
  log.info("🚀 Starting Electron...");
  
  const electronProcess = spawn('npx', ['electron', mainPath], {
    stdio: 'inherit',
    env: {
      ...process.env,
      ELECTRON_ENABLE_LOGGING: '1'
    }
  });
  
  electronProcess.on('error', (error) => {
    log.error(`❌ Failed to start Electron: ${error.message}`);
    log.warn("Try running it manually: npx electron electron/main-minimal.js");
  });
  
  return new Promise(resolve => {
    electronProcess.on('close', (code) => {
      if (code === 0) {
        log.success("✅ Electron closed gracefully");
      } else {
        log.warn(`⚠️ Electron closed with code ${code}`);
      }
      resolve();
    });
  });
}

// -- Main function --
async function main() {
  log.plain("\n====================================");
  log.plain("   IRONWOOD - Clean Start Solution   ");
  log.plain("====================================\n");
  
  const nextJsStarted = await startNextJs();
  
  if (nextJsStarted) {
    // Give Next.js a moment to fully initialize
    log.info("⏳ Giving Next.js a moment to fully initialize...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await startElectron();
  } else {
    log.error("❌ Could not start Next.js. Please check for errors.");
    log.info("\nSuggestion: Try running this script again or use these commands separately:");
    log.plain("  1. npm run dev              (in one terminal)");
    log.plain("  2. npx electron electron/main-minimal.js  (in another terminal)");
  }
}

// Start the main process
main(); 