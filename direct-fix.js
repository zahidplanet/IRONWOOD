const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

console.log('🔧 Starting Direct Fix...');

// 1. Make sure we start fresh - kill any running processes
try {
  console.log('Killing any existing processes...');
  if (process.platform === 'darwin' || process.platform === 'linux') {
    execSync('pkill -f electron || true');
    execSync('pkill -f node || true');
  } else if (process.platform === 'win32') {
    execSync('taskkill /F /IM electron.exe /T', { stdio: 'ignore' });
    execSync('taskkill /F /IM node.exe /T', { stdio: 'ignore' });
  }
} catch (e) {
  console.log('No processes to kill');
}

// 2. Create all required directories and files BEFORE starting Next.js
const dirs = [
  path.join(__dirname, '.next'),
  path.join(__dirname, '.next', 'server'),
  path.join(__dirname, 'out'),
  path.join(__dirname, 'out', 'server'),
  path.join(__dirname, 'src'),
  path.join(__dirname, 'src', 'pages'),
  path.join(__dirname, 'src', 'app')
];

// Create directories with proper permissions
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true, mode: 0o755 });
  }
});

// 3. Create middleware-manifest.json in BOTH possible locations
const manifestContent = JSON.stringify({
  version: 1,
  sortedMiddleware: [],
  middleware: {},
  functions: {},
  pages: {}
}, null, 2);

const manifestPaths = [
  path.join(__dirname, '.next', 'server', 'middleware-manifest.json'),
  path.join(__dirname, 'out', 'server', 'middleware-manifest.json')
];

manifestPaths.forEach(manifestPath => {
  console.log(`Creating manifest file at: ${manifestPath}`);
  fs.writeFileSync(manifestPath, manifestContent, { mode: 0o644 });
  
  // Verify file was written correctly
  if (fs.existsSync(manifestPath)) {
    console.log(`✅ Successfully created ${manifestPath}`);
    // Make it readable by any process
    fs.chmodSync(manifestPath, 0o644);
  } else {
    console.error(`❌ Failed to create ${manifestPath}`);
  }
});

// 4. Create error pages
const errorPages = {
  // Pages Router error pages
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
  '404.js': `
import React from 'react';

export default function Custom404() {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#333'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404 - Page Not Found</h1>
      <p>The page you're looking for does not exist.</p>
    </div>
  );
}
`,
  '500.js': `
import React from 'react';

export default function Custom500() {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#333'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>500 - Server Error</h1>
      <p>Sorry, an unexpected error occurred on the server.</p>
    </div>
  );
}
`
};

Object.entries(errorPages).forEach(([filename, content]) => {
  const filePath = path.join(__dirname, 'src', 'pages', filename);
  console.log(`Creating error page: ${filePath}`);
  fs.writeFileSync(filePath, content.trim(), { mode: 0o644 });
  
  if (fs.existsSync(filePath)) {
    console.log(`✅ Successfully created ${filePath}`);
  } else {
    console.error(`❌ Failed to create ${filePath}`);
  }
});

// 5. Create a custom Electron main file that's simpler
const mainPath = path.join(__dirname, 'electron', 'simple-main.js');
const mainContent = `
// Simple Electron main file
const { app, BrowserWindow } = require('electron');
const path = require('path');

// Force disable GPU
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // Only show when loaded
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  const url = 'http://localhost:3000';
  console.log('Loading URL:', url);
  
  // Show window when content has loaded
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
  });
  
  mainWindow.loadURL(url);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
`;

fs.writeFileSync(mainPath, mainContent, { mode: 0o644 });
console.log(`✅ Created simple Electron main file at ${mainPath}`);

// 6. Now run the development server first
console.log('🚀 Starting Next.js development server...');
const nextProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, BROWSER: 'none' }
});

// 7. Wait for the server to start
console.log('⌛ Waiting for Next.js server to start (15 seconds)...');
setTimeout(() => {
  // 8. Start Electron with our simplified main file
  console.log('🚀 Starting Electron application...');
  const electronProcess = spawn('npx', [
    '--no-install',
    'electron',
    '--disable-gpu',
    '-r',
    './electron/simple-main.js',
    '.'
  ], {
    stdio: 'inherit',
    env: { 
      ...process.env, 
      ELECTRON_ENABLE_LOGGING: '1'
    }
  });

  // 9. Handle cleanup
  electronProcess.on('close', (code) => {
    console.log(`Electron process exited with code ${code}`);
    nextProcess.kill();
    process.exit(code);
  });

  nextProcess.on('close', (code) => {
    console.log(`Next.js process exited with code ${code}`);
    try {
      electronProcess.kill();
    } catch (e) {}
    process.exit(code);
  });

  // Handle process exit
  const cleanup = () => {
    console.log('Cleaning up...');
    try {
      electronProcess.kill();
    } catch (e) {}
    
    try {
      nextProcess.kill();
    } catch (e) {}
    
    process.exit();
  };
  
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}, 15000); // Wait 15 seconds for the server to start properly 