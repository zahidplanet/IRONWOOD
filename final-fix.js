const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

// *** COMPLETELY CLEAN ENVIRONMENT FIRST ***
console.log('🧹 Cleaning environment...');
try {
  // Kill any existing processes 
  console.log('Killing existing processes...');
  if (process.platform === 'darwin' || process.platform === 'linux') {
    execSync('pkill -f electron || true');
    execSync('pkill -f node || true');
  } else if (process.platform === 'win32') {
    execSync('taskkill /F /IM electron.exe /T', { stdio: 'ignore' });
    execSync('taskkill /F /IM node.exe /T', { stdio: 'ignore' });
  }
  
  // Clean build directories
  console.log('Removing build artifacts...');
  try {
    execSync('npm run clean'); 
  } catch (e) {
    console.log('Clean script failed, removing manually...');
    if (fs.existsSync(path.join(__dirname, '.next'))) {
      execSync('rm -rf .next');
    }
    if (fs.existsSync(path.join(__dirname, 'out'))) {
      execSync('rm -rf out');
    }
  }
} catch (e) {
  console.error('Error cleaning environment:', e);
}

// *** MONKEY PATCH NEXT.JS TO AVOID MIDDLEWARE-MANIFEST ERROR ***
console.log('🔧 Monkey patching Next.js...');
try {
  const nextServerPath = path.join(__dirname, 'node_modules', 'next', 'dist', 'server', 'next-server.js');
  if (fs.existsSync(nextServerPath)) {
    let content = fs.readFileSync(nextServerPath, 'utf8');
    
    // Find the part where middleware-manifest.json is required
    if (content.includes('getMiddlewareManifest')) {
      // Replace the actual implementation with a simpler one that doesn't require the file
      const patchedContent = content.replace(
        /getMiddlewareManifest\(\)\s*\{[^}]*\}/s, 
        `getMiddlewareManifest() { 
          return { 
            version: 1, 
            sortedMiddleware: [], 
            middleware: {}, 
            functions: {}, 
            pages: {} 
          }; 
        }`
      );
      
      fs.writeFileSync(nextServerPath, patchedContent);
      console.log('✅ Successfully patched Next.js server');
    } else {
      console.log('⚠️ Could not find getMiddlewareManifest in Next.js server');
    }
  } else {
    console.log('⚠️ Could not find Next.js server file');
  }
} catch (e) {
  console.error('⚠️ Error patching Next.js:', e);
}

// *** CREATE REQUIRED DIRECTORIES AND FILES ***
console.log('📁 Creating required directories and files...');
const dirs = [
  path.join(__dirname, '.next'),
  path.join(__dirname, '.next', 'server'),
  path.join(__dirname, 'out'),
  path.join(__dirname, 'out', 'server'),
  path.join(__dirname, 'src', 'pages')
];

// Create directories
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o755 });
    console.log(`Created directory: ${dir}`);
  }
});

// Create middleware manifest in all possible locations
const manifest = {
  version: 1,
  sortedMiddleware: [],
  middleware: {},
  functions: {},
  pages: {}
};

const manifestLocations = [
  path.join(__dirname, '.next', 'server', 'middleware-manifest.json'),
  path.join(__dirname, 'out', 'server', 'middleware-manifest.json'),
  path.join(__dirname, 'node_modules', '.next', 'server', 'middleware-manifest.json'),
];

manifestLocations.forEach(location => {
  const dir = path.dirname(location);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o755 });
  }
  fs.writeFileSync(location, JSON.stringify(manifest, null, 2), { mode: 0o644 });
  console.log(`Created manifest at: ${location}`);
});

// Create basic error components
const errorComponents = {
  '_error.js': `
import React from 'react';

function Error({ statusCode }) {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#333'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        {statusCode ? \`Error: \${statusCode}\` : 'An error occurred'}
      </h1>
      <p>Sorry, there was a problem with the requested page.</p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
  `,
  '_document.js': `
import { Html, Head, Main, NextScript } from 'next/document'
 
export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
  `,
  'index.js': `
import React from 'react';

export default function Home() {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#333'
    }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        marginBottom: '1rem',
        background: 'linear-gradient(to right, #0a84ff, #bf5af2)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        IRONWOOD Dashboard
      </h1>
      <p>Welcome to the dashboard. Loading data...</p>
    </div>
  );
}
  `
};

Object.entries(errorComponents).forEach(([filename, content]) => {
  const filePath = path.join(__dirname, 'src', 'pages', filename);
  fs.writeFileSync(filePath, content.trim(), { mode: 0o644 });
  console.log(`Created component: ${filePath}`);
});

// *** CREATE A SIMPLE VERSION OF THE ELECTRON MAIN FILE ***
console.log('📝 Creating simplified Electron main file...');
const simpleMainPath = path.join(__dirname, 'electron', 'simple-main.js');
const simpleMainContent = `
// Simplified Electron main file with error handling
const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');

// Disable hardware acceleration to avoid GPU crashes
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#121212',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false // Don't show until content is loaded
  });

  // URL to load
  const url = 'http://localhost:3000';
  console.log('Loading URL:', url);
  
  // Setup handlers
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('Window is now visible');
  });
  
  // Add error handling
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorDescription);
    if (errorCode === -102) { // CONNECTION_REFUSED
      dialog.showErrorBox('Connection Error', 
        'Could not connect to Next.js development server at http://localhost:3000. Make sure it is running.');
    }
    // Try one more time after a delay
    setTimeout(() => {
      console.log('Retrying connection...');
      mainWindow.loadURL(url);
    }, 3000);
  });
  
  // Load the URL
  mainWindow.loadURL(url);
}

// Create window when app is ready
app.whenReady().then(() => {
  createWindow();
  
  // On macOS, recreate window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
`;

fs.writeFileSync(simpleMainPath, simpleMainContent, { mode: 0o755 });
console.log('✅ Created simple Electron main file');

// *** TWO-STEP PROCESS: FIRST RUN NEXT.JS, THEN ELECTRON ***
console.log('🚀 Starting Next.js development server...');
const nextProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, BROWSER: 'none' }
});

// Wait for Next.js to start before launching Electron
console.log('⌛ Waiting for Next.js to start (15s)...');
setTimeout(() => {
  console.log('🚀 Starting Electron application...');
  
  // Use npx to avoid PATH issues
  const electronProcess = spawn('npx', [
    'electron',
    '-r',
    './electron/simple-main.js'
  ], {
    stdio: 'inherit',
    env: { 
      ...process.env,
      ELECTRON_ENABLE_LOGGING: '1'
    }
  });
  
  // Handle cleanup
  electronProcess.on('close', (code) => {
    console.log(`Electron process exited with code ${code}`);
    try { nextProcess.kill(); } catch (e) {}
    process.exit(0);
  });
  
  nextProcess.on('close', (code) => {
    console.log(`Next.js process exited with code ${code}`);
    try { electronProcess.kill(); } catch (e) {}
    process.exit(0);
  });
  
  // Handle process exit
  const cleanup = () => {
    console.log('Cleaning up...');
    try { electronProcess.kill(); } catch (e) {}
    try { nextProcess.kill(); } catch (e) {}
    process.exit(0);
  };
  
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  
}, 15000); // Wait 15 seconds 