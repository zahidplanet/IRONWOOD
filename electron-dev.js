const { exec, spawn } = require('child_process');
const waitOn = require('wait-on');
const electron = require('electron');
const path = require('path');
const net = require('net');

// Find an available port between start and end
async function findAvailablePort(startPort, endPort) {
  for (let port = startPort; port <= endPort; port++) {
    try {
      const server = net.createServer();
      await new Promise((resolve, reject) => {
        server.once('error', err => {
          server.close();
          if (err.code === 'EADDRINUSE') {
            resolve(false);
          } else {
            reject(err);
          }
        });
        server.once('listening', () => {
          server.close();
          resolve(true);
        });
        server.listen(port);
      });
      return port;
    } catch (err) {
      console.error(`Error checking port ${port}:`, err);
    }
  }
  return null; // No available ports found
}

// Start the app
async function startApp() {
  try {
    // Find an available port
    const port = await findAvailablePort(3000, 3010);
    if (!port) {
      console.error('❌ Could not find an available port between 3000-3010');
      process.exit(1);
    }
    
    console.log(`🔍 Found available port: ${port}`);
    process.env.PORT = port;
    
    // Start Next.js dev server
    console.log('🚀 Starting Next.js development server...');
    const nextProcess = spawn('npm', ['run', 'dev', '--', '-p', port], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, BROWSER: 'none' }
    });
    
    console.log(`⌛ Waiting for Next.js server on port ${port}...`);
    
    // Wait for Next.js server to be ready
    await waitOn({
      resources: [`http://localhost:${port}`],
      timeout: 30000, // 30 seconds
    });
    
    console.log('✅ Next.js server is ready, starting Electron...');
    
    // Start Electron
    const electronProcess = spawn(electron, ['.'], {
      stdio: 'inherit',
      env: { ...process.env, NEXT_DEV_PORT: port.toString() }
    });
    
    // Handle process exit
    const cleanup = () => {
      electronProcess.kill();
      nextProcess.kill();
      process.exit();
    };
    
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    
    electronProcess.on('close', (code) => {
      console.log(`Electron process exited with code ${code}`);
      nextProcess.kill();
      process.exit(code);
    });
    
  } catch (err) {
    console.error('Error starting application:', err);
    process.exit(1);
  }
}

// Start the application
startApp(); 