#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// Kill existing processes
console.log('🧹 Cleaning up existing processes...');
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
  // Ignore errors if no processes to kill
}

// Main function to fix Next.js
async function fixNextJs() {
  const nextServerPath = path.join(__dirname, 'node_modules', 'next', 'dist', 'server', 'next-server.js');
  
  if (!fs.existsSync(nextServerPath)) {
    console.error('❌ Could not find Next.js server file');
    process.exit(1);
  }
  
  // 1. Patch the Next.js server file to not require middleware-manifest.json
  console.log('🔧 Patching Next.js server...');
  let serverContent = fs.readFileSync(nextServerPath, 'utf8');
  
  // Find the getMiddlewareManifest method to replace it
  if (serverContent.includes('getMiddlewareManifest')) {
    // Replace with a version that doesn't require the file
    const newContent = serverContent.replace(
      /getMiddlewareManifest\(\)\s*\{[^}]*\}/s,
      `getMiddlewareManifest() { 
        // Return empty manifest
        return { 
          version: 1, 
          sortedMiddleware: [], 
          middleware: {}, 
          functions: {}, 
          pages: {} 
        }; 
      }`
    );
    
    if (newContent !== serverContent) {
      fs.writeFileSync(nextServerPath, newContent);
      console.log('✅ Successfully patched Next.js server');
    } else {
      console.log('⚠️ Could not patch getMiddlewareManifest method');
    }
  } else {
    console.log('⚠️ Could not find getMiddlewareManifest in Next.js server');
  }
  
  // 2. Create required directories and files
  console.log('📁 Creating required directories and files...');
  
  // Ensure all needed directories exist
  const dirs = [
    ['.next', 'server'], 
    ['out', 'server'], 
    ['src', 'pages'], 
    ['src', 'app']
  ];
  
  dirs.forEach(dirParts => {
    const dirPath = path.join(__dirname, ...dirParts);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    }
  });
  
  // Create empty middleware-manifest.json in multiple locations
  const manifest = {
    version: 1,
    sortedMiddleware: [],
    middleware: {},
    functions: {},
    pages: {}
  };
  
  const manifestLocations = [
    path.join(__dirname, '.next', 'server', 'middleware-manifest.json'),
    path.join(__dirname, 'out', 'server', 'middleware-manifest.json')
  ];
  
  manifestLocations.forEach(location => {
    fs.writeFileSync(location, JSON.stringify(manifest, null, 2));
    fs.chmodSync(location, 0o644); // Ensure readable permissions
    console.log(`Created manifest at: ${location}`);
  });
  
  // 3. Create minimal error components required by Next.js
  const errorComponents = {
    '_error.js': `
import React from 'react';

function Error({ statusCode }) {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>{statusCode ? \`Error: \${statusCode}\` : 'An error occurred'}</h1>
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
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
`,
    'index.js': `
import React from 'react';

export default function Home() {
  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        background: 'linear-gradient(to right, #0070f3, #9333ea)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        IRONWOOD Dashboard
      </h1>
      <p>Welcome to the dashboard. The application is now loading...</p>
    </div>
  );
}
`
  };
  
  // Create the error components
  Object.entries(errorComponents).forEach(([filename, content]) => {
    const filePath = path.join(__dirname, 'src', 'pages', filename);
    fs.writeFileSync(filePath, content.trim());
    console.log(`Created component: ${filePath}`);
  });
  
  // 4. Create a minimal Electron main file
  console.log('📝 Creating simplified Electron main file...');
  const electronDir = path.join(__dirname, 'electron');
  if (!fs.existsSync(electronDir)) {
    fs.mkdirSync(electronDir, { recursive: true });
  }
  
  const electronMainPath = path.join(electronDir, 'minimal-main.js');
  const electronMainContent = `
// Minimal Electron main file
const { app, BrowserWindow } = require('electron');

// Disable hardware acceleration to prevent GPU crashes
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');

// Main window reference
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#1a1a1a',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Only show window when content is loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('Window is now visible');
  });

  // Load the URL - simple and direct
  const url = 'http://localhost:3000';
  console.log('Loading URL:', url);
  mainWindow.loadURL(url);
  
  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create window when Electron is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  app.quit();
});
`;

  fs.writeFileSync(electronMainPath, electronMainContent);
  console.log(`✅ Created minimal Electron main file at ${electronMainPath}`);
  
  // 5. Now run Next.js in development mode
  console.log('🚀 Starting Next.js development server...');
  const nextProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, BROWSER: 'none' }
  });
  
  // 6. Wait for Next.js to fully start before launching Electron
  console.log('⌛ Waiting for Next.js server to fully start (20s)...');
  await new Promise(resolve => setTimeout(resolve, 20000));
  
  // 7. Now start Electron pointing to our minimal main file
  console.log('🚀 Starting Electron with minimal configuration...');
  const electronProcess = spawn('npx', [
    'electron',
    '-r',
    './electron/minimal-main.js'
  ], {
    stdio: 'inherit',
    env: { ...process.env, ELECTRON_ENABLE_LOGGING: '1' }
  });
  
  // 8. Handle process exit properly
  electronProcess.on('close', (code) => {
    console.log(`Electron process exited with code ${code}`);
    nextProcess.kill();
    process.exit(0);
  });
  
  nextProcess.on('close', (code) => {
    console.log(`Next.js process exited with code ${code}`);
    try { electronProcess.kill(); } catch (e) {}
    process.exit(0);
  });
  
  // Handle CTRL+C and other termination signals
  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      console.log('Cleaning up processes...');
      try { nextProcess.kill(); } catch (e) {}
      try { electronProcess.kill(); } catch (e) {}
      process.exit(0);
    });
  });
}

// Run the main function
fixNextJs().catch(err => {
  console.error('Error:', err);
  process.exit(1);
}); 