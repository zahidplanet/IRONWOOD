const { spawn } = require('child_process');
const { execSync } = require('child_process');
const http = require('http');
const path = require('path');

console.log('🚀 IRONWOOD App Launcher');

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

// Function to check if server is ready
function checkServerReady(port, callback) {
  const MAX_RETRIES = 30; // Try for 30 seconds
  let retries = 0;
  
  const checkNext = function() {
    const req = http.get(`http://localhost:${port}`, (res) => {
      console.log(`✅ Next.js is running on port ${port}!`);
      callback(null);
    });
    
    req.on('error', (err) => {
      if (retries < MAX_RETRIES) {
        retries++;
        console.log(`Waiting for Next.js (attempt ${retries}/${MAX_RETRIES})...`);
        setTimeout(checkNext, 1000);
      } else {
        callback(new Error('Max retries reached, server not responding'));
      }
    });
    
    req.end();
  };
  
  checkNext();
}

// Start Next.js and Electron sequentially
function startServices() {
  const PORT = 3001;
  const standaloneDir = path.join(__dirname, 'ironwood-standalone');
  
  // Start Next.js
  console.log('Starting Next.js...');
  const nextProcess = spawn('npx', ['next', 'dev', '-p', PORT.toString()], {
    cwd: standaloneDir,
    env: { ...process.env, PORT: PORT.toString() },
    stdio: 'inherit'
  });
  
  // Log when Next.js exits
  nextProcess.on('exit', (code) => {
    console.log(`Next.js process exited with code ${code}`);
    process.exit(code);
  });
  
  // Start Electron when Next.js is ready
  checkServerReady(PORT, (err) => {
    if (err) {
      console.error('❌ Failed to start Next.js:', err.message);
      nextProcess.kill();
      process.exit(1);
    } else {
      console.log('Starting Electron...');
      
      const electronProcess = spawn('npx', ['electron', 'electron/main.js'], {
        cwd: standaloneDir,
        stdio: 'inherit'
      });
      
      // Log when Electron exits
      electronProcess.on('exit', (code) => {
        console.log(`Electron process exited with code ${code}`);
        nextProcess.kill();
        process.exit(code);
      });
      
      // Handle SIGINT for clean exits
      process.on('SIGINT', () => {
        console.log('Shutting down...');
        electronProcess.kill();
        nextProcess.kill();
        process.exit(0);
      });
    }
  });
}

// Start everything
startServices(); 