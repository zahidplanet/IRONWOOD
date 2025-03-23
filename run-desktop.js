const { spawn } = require('child_process');
const path = require('path');
const net = require('net');

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
      spawn('lsof', ['-ti', `:${port}`, '|', 'xargs', 'kill', '-9'], { 
        shell: true, 
        stdio: 'ignore' 
      });
    } catch (e) {
      console.warn('Error killing process:', e);
    }
  }
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));
}

async function startApp() {
  const PORT = 3000;
  
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
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Start Electron with the local electron binary
  console.log('🚀 Starting Electron application...');
  const electronPath = path.join(__dirname, 'node_modules', '.bin', 'electron');
  console.log(`Using electron at: ${electronPath}`);
  
  const electronProcess = spawn(electronPath, [
    '--disable-gpu',
    '--disable-software-rasterizer',
    '-r',
    './electron/main-fixed.js',
    '.'
  ], {
    stdio: 'inherit',
    env: { 
      ...process.env, 
      NEXT_DEV_PORT: PORT.toString(),
      ELECTRON_START_URL: `http://localhost:${PORT}`,
      NODE_ENV: 'development',
      ELECTRON_ENABLE_LOGGING: '1'
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