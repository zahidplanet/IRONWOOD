const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const net = require('net');

// Create missing middleware-manifest.json file
async function createMiddlewareManifest() {
  // Create directories if they don't exist
  const outDir = path.join(__dirname, 'out');
  const serverDir = path.join(outDir, 'server');
  
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  if (!fs.existsSync(serverDir)) fs.mkdirSync(serverDir, { recursive: true });
  
  // Create empty middleware manifest
  const manifestPath = path.join(serverDir, 'middleware-manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    fs.writeFileSync(manifestPath, JSON.stringify({
      version: 1,
      sortedMiddleware: [],
      middleware: {},
      functions: {},
      pages: {}
    }, null, 2));
    console.log('✅ Created middleware-manifest.json');
  }
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
  
  // Fix middleware manifest
  await createMiddlewareManifest();
  
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
  
  // Start Next.js server
  console.log('🚀 Starting Next.js development server...');
  const nextProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, BROWSER: 'none' }
  });
  
  // Give the Next.js server time to start
  console.log('⌛ Waiting for Next.js server to start...');
  await new Promise(resolve => setTimeout(resolve, 7000));
  
  // Verify server is responding
  try {
    const http = require('http');
    await new Promise((resolve, reject) => {
      const req = http.get(`http://localhost:${PORT}`, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          console.log(`✅ Server is responding (Status: ${res.statusCode})`);
          resolve();
        } else {
          console.log(`⚠️ Server responded with status: ${res.statusCode}`);
          resolve(); // Continue anyway
        }
      });
      
      req.on('error', (err) => {
        console.log(`⚠️ Server check failed: ${err.message}`);
        resolve(); // Continue anyway
      });
      
      req.end();
    });
  } catch (e) {
    console.log('⚠️ Server check error:', e);
  }
  
  // Start Electron with the local electron binary (absolute path)
  console.log('🚀 Starting Electron application...');
  const electronPath = path.join(__dirname, 'node_modules', '.bin', 'electron');
  
  if (!fs.existsSync(electronPath)) {
    console.error(`❌ Electron not found at: ${electronPath}`);
    console.log('ℹ️ Falling back to npx electron...');
  }
  
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
        if (errorCode === -102) { // CONNECTION_REFUSED
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