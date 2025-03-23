const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const net = require('net');

// Create required Next.js files
async function createRequiredFiles() {
  // Create directories if they don't exist
  const outDir = path.join(__dirname, 'out');
  const serverDir = path.join(outDir, 'server');
  const pagesDir = path.join(__dirname, 'src', 'pages');
  const appDir = path.join(__dirname, 'src', 'app');
  
  // Create the .next directory structure if it doesn't exist
  const dotNextDir = path.join(__dirname, '.next');
  const dotNextServerDir = path.join(dotNextDir, 'server');
  
  [outDir, serverDir, dotNextDir, dotNextServerDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
  
  // Create empty middleware manifest in both locations (for redundancy)
  const emptyManifest = {
    version: 1,
    sortedMiddleware: [],
    middleware: {},
    functions: {},
    pages: {}
  };
  
  const manifestPaths = [
    path.join(serverDir, 'middleware-manifest.json'),
    path.join(dotNextServerDir, 'middleware-manifest.json')
  ];
  
  manifestPaths.forEach(manifestPath => {
    if (!fs.existsSync(manifestPath)) {
      fs.writeFileSync(manifestPath, JSON.stringify(emptyManifest, null, 2));
      console.log(`✅ Created ${manifestPath}`);
    }
  });
  
  // Check if error components exist, create if needed
  const errorPages = [
    { path: path.join(pagesDir, '_error.js'), content: `
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
` },
    { path: path.join(pagesDir, '404.js'), content: `
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
` },
    { path: path.join(pagesDir, '500.js'), content: `
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
` }
  ];
  
  // Check if we're using app directory instead of pages
  let isAppDir = false;
  if (fs.existsSync(appDir)) {
    isAppDir = true;
    
    // For App Router, create not-found and error files
    errorPages.push(
      { path: path.join(appDir, 'not-found.js'), content: `
export default function NotFound() {
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
` },
      { path: path.join(appDir, 'error.js'), content: `
'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#333'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong!</h1>
      <p style={{ marginBottom: '1rem' }}>An unexpected error occurred.</p>
      <button
        onClick={() => reset()}
        style={{
          padding: '8px 16px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Try again
      </button>
    </div>
  );
}
` },
      { path: path.join(appDir, 'global-error.js'), content: `
'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: '#333'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong!</h1>
          <p style={{ marginBottom: '1rem' }}>A critical error occurred.</p>
          <button
            onClick={() => reset()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
` }
    );
  }
  
  errorPages.forEach(page => {
    const dir = path.dirname(page.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    if (!fs.existsSync(page.path)) {
      fs.writeFileSync(page.path, page.content.trim());
      console.log(`✅ Created ${page.path}`);
    }
  });
  
  console.log('✅ All required Next.js files created');
}

// Check if port is available
async function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
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

// Kill processes on port
async function killProcessOnPort(port) {
  console.log(`Attempting to kill process on port ${port}...`);
  if (process.platform === 'win32') {
    spawn('taskkill', ['/F', '/IM', 'node.exe'], { stdio: 'ignore' });
  } else {
    try {
      exec(`lsof -ti :${port} | xargs kill -9`, { stdio: 'ignore' });
    } catch (e) {
      console.warn('Error killing process:', e);
    }
  }
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));
}

async function startApp() {
  const PORT = 3000;
  
  console.log('🔧 Setting up required files...');
  await createRequiredFiles();
  
  // Check if port is in use
  const portAvailable = await isPortAvailable(PORT);
  if (!portAvailable) {
    console.log(`Port ${PORT} is in use. Attempting to free it...`);
    await killProcessOnPort(PORT);
    
    // Check again
    const retryPortAvailable = await isPortAvailable(PORT);
    if (!retryPortAvailable) {
      console.error(`Port ${PORT} is still in use. Please close the application using it.`);
      process.exit(1);
    }
  }
  
  console.log(`✅ Port ${PORT} is available`);
  
  // Run build first to ensure all components are generated
  console.log('🔧 Building Next.js app...');
  try {
    await new Promise((resolve, reject) => {
      const buildProcess = spawn('npm', ['run', 'build'], {
        stdio: 'inherit',
        shell: true
      });
      
      buildProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          console.warn(`⚠️ Build process exited with code ${code}, continuing anyway...`);
          resolve();
        }
      });
    });
  } catch (e) {
    console.warn('⚠️ Build process failed, continuing anyway...', e);
  }
  
  // Start Next.js server
  console.log('🚀 Starting Next.js development server...');
  const nextProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, BROWSER: 'none' }
  });
  
  // Give the Next.js server time to start
  console.log('⌛ Waiting for Next.js server to start...');
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // Create a patched electron main file
  const patchedMainPath = path.join(__dirname, 'electron', 'patched-main.js');
  const mainCode = `
    // Patched main.js for Electron
    const { app, BrowserWindow, ipcMain, Menu, shell, dialog } = require('electron');
    const path = require('path');
    
    // Force disable GPU
    app.disableHardwareAcceleration();
    app.commandLine.appendSwitch('disable-gpu');
    app.commandLine.appendSwitch('disable-software-rasterizer');
    app.commandLine.appendSwitch('disable-gpu-compositing');
    app.commandLine.appendSwitch('disable-gpu-rasterization');
    app.commandLine.appendSwitch('disable-gpu-sandbox');
    app.commandLine.appendSwitch('--no-sandbox');
    
    let mainWindow;
    let retryCount = 0;
    const MAX_RETRIES = 5;
    
    function createWindow() {
      // Create the browser window.
      mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
        },
        backgroundColor: '#121212',
        show: false, // Don't show until loaded
      });
    
      // Set up loading handler
      mainWindow.webContents.on('did-finish-load', () => {
        console.log('Page loaded, showing window');
        mainWindow.show();
      });
      
      // Set up error handling
      mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error(\`Failed to load: \${errorDescription} (\${errorCode})\`);
        if (errorCode === -102 && retryCount < MAX_RETRIES) { // CONNECTION_REFUSED
          retryCount++;
          console.log(\`Retrying... (\${retryCount}/\${MAX_RETRIES})\`);
          setTimeout(() => {
            mainWindow.loadURL('http://localhost:3000');
          }, 1000);
        } else if (retryCount >= MAX_RETRIES) {
          dialog.showErrorBox('Connection Error', 
            \`Could not connect to the Next.js development server.\`);
        }
      });
    
      // Load URL
      const url = 'http://localhost:3000';
      console.log(\`Loading URL: \${url}\`);
      mainWindow.loadURL(url).catch(err => {
        console.error('Error loading URL:', err);
      });
    }
    
    app.whenReady().then(() => {
      createWindow();
    });
    
    app.on('window-all-closed', () => {
      app.quit();
    });
  `;
  
  fs.writeFileSync(patchedMainPath, mainCode);
  console.log('✅ Created patched Electron main file');
  
  // Run electron using npx to avoid PATH issues
  console.log('🚀 Starting Electron application...');
  const electronProcess = spawn('npx', [
    '--no-install',
    'electron',
    '--disable-gpu',
    '--disable-software-rasterizer',
    '--disable-gpu-compositing',
    '--disable-gpu-rasterization',
    '--disable-gpu-sandbox',
    '--no-sandbox',
    patchedMainPath
  ], {
    stdio: 'inherit',
    env: { 
      ...process.env, 
      ELECTRON_ENABLE_LOGGING: '1',
      ELECTRON_ENABLE_STACK_DUMPING: '1',
      NODE_ENV: 'development',
      BROWSER: 'none'
    }
  });
  
  electronProcess.on('close', (code) => {
    console.log(`Electron process exited with code ${code}`);
    nextProcess.kill();
    process.exit(code);
  });
  
  nextProcess.on('close', (code) => {
    console.log(`Next.js process exited with code ${code}`);
    electronProcess.kill();
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
}

// Start the application
startApp().catch(err => {
  console.error('Failed to start application:', err);
  process.exit(1);
}); 