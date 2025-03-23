const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up minimal Next.js + Electron app');

// Kill any running processes first
try {
  console.log('Stopping any existing processes...');
  if (process.platform === 'darwin' || process.platform === 'linux') {
    execSync('pkill -f electron || true');
    execSync('pkill -f "next dev" || true');
    execSync('lsof -i:3001 -t | xargs kill -9 || true');
  } else if (process.platform === 'win32') {
    execSync('taskkill /F /IM electron.exe /T || echo No electron processes');
    execSync('taskkill /F /IM node.exe /T || echo No node processes');
  }
} catch (e) {
  // Ignore errors
}

// Setup directories
const projectRoot = __dirname;
const appDir = path.join(projectRoot, 'minimal-app');

// Create directories
console.log('Creating minimal Next.js app...');
if (!fs.existsSync(appDir)) {
  fs.mkdirSync(appDir, { recursive: true });
}

const pagesDir = path.join(appDir, 'pages');
if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

// Create package.json
const packageJson = {
  name: "minimal-app",
  version: "1.0.0",
  private: true,
  scripts: {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001"
  },
  dependencies: {
    "next": "^13.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "electron": "^28.0.0"
  }
};

fs.writeFileSync(
  path.join(appDir, 'package.json'),
  JSON.stringify(packageJson, null, 2)
);

// Create simple index.js
fs.writeFileSync(
  path.join(pagesDir, 'index.js'),
  `import React from 'react';

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#121212',
      color: 'white',
      padding: '20px'
    }}>
      <h1 style={{
        background: 'linear-gradient(to right, #0070f3, #8a2be2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '3rem',
        marginBottom: '1rem'
      }}>
        IRONWOOD
      </h1>
      <p style={{
        fontSize: '1.5rem',
        marginBottom: '2rem'
      }}>
        Healthcare Dashboard System
      </p>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <p>Next.js + Electron running successfully!</p>
        <p style={{ color: '#4caf50', fontWeight: 'bold' }}>Status: ONLINE</p>
      </div>
    </div>
  );
}`
);

// Create minimal Electron main file
const electronDir = path.join(appDir, 'electron');
if (!fs.existsSync(electronDir)) {
  fs.mkdirSync(electronDir, { recursive: true });
}

fs.writeFileSync(
  path.join(electronDir, 'main.js'),
  `const { app, BrowserWindow } = require('electron');

// Disable hardware acceleration to prevent crashes
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

// URL to load
const nextUrl = 'http://localhost:3001';
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#121212',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  console.log(\`Loading URL: \${nextUrl}\`);
  
  // Handle load errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error(\`Failed to load: \${errorDescription} (\${errorCode})\`);
    if (errorCode === -102) { // CONNECTION_REFUSED
      console.log('Connection refused. Make sure Next.js is running on port 3001.');
      setTimeout(() => {
        console.log('Retrying...');
        mainWindow.loadURL(nextUrl);
      }, 3000);
    }
  });

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.loadURL(nextUrl);
  
  // Open DevTools
  mainWindow.webContents.openDevTools({ mode: 'detach' });
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});`
);

// Create app start instructions
console.log('\n===============================');
console.log('🎯 NEXT STEPS:');
console.log('===============================');
console.log('1. In a first terminal, run:');
console.log(`   cd ${appDir} && npx next dev -p 3001`);
console.log('\n2. In a second terminal, after Next.js starts, run:');
console.log(`   cd ${appDir} && npx electron electron/main.js`);
console.log('===============================\n');

// Open terminal windows
try {
  if (process.platform === 'darwin') {
    // Open first terminal for Next.js
    execSync(`osascript -e 'tell app "Terminal" to do script "cd \\"${appDir}\\" && npx next dev -p 3001"'`);
    
    // Open second terminal for Electron
    execSync(`osascript -e 'tell app "Terminal" to do script "cd \\"${appDir}\\" && echo \\"Wait for Next.js to start, then press Enter to launch Electron...\\" && read && npx electron electron/main.js"'`);
  } else if (process.platform === 'win32') {
    // Open first terminal for Next.js
    execSync(`start cmd.exe /K "cd /d "${appDir}" && npx next dev -p 3001"`);
    
    // Open second terminal for Electron
    execSync(`start cmd.exe /K "cd /d "${appDir}" && echo Wait for Next.js to start, then press Enter to launch Electron... && pause && npx electron electron/main.js"`);
  } else {
    console.log('Please open two terminal windows and follow the steps above.');
  }
  
  console.log('Terminals opened! Please follow the instructions in the terminal windows.');
} catch (error) {
  console.error('Error opening terminals:', error.message);
  console.log('Please open two terminal windows and follow the steps above.');
} 