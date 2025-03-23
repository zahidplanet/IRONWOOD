const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Launching Electron application...');

// Use the local electron from node_modules with absolute path
const electronPath = path.join(__dirname, 'node_modules', '.bin', 'electron');
console.log(`Using electron at: ${electronPath}`);

// Start Electron with proper environment variables and flags to prevent crashes
const electronProcess = spawn(electronPath, [
  // Disable GPU acceleration to prevent crashes
  '--disable-gpu',
  '--disable-software-rasterizer',
  '.'
], {
  stdio: 'inherit',
  env: { 
    ...process.env, 
    NEXT_DEV_PORT: '3000',
    ELECTRON_START_URL: 'http://localhost:3000',
    NODE_ENV: 'development',
    ELECTRON_ENABLE_LOGGING: '1'
  }
});

electronProcess.on('close', (code) => {
  console.log(`Electron process exited with code ${code}`);
  process.exit(code);
});

// Handle process exit
const cleanup = () => {
  electronProcess.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup); 