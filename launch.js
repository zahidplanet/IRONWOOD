const { spawn } = require('child_process');
const electron = require('electron');
const path = require('path');

console.log('🚀 Launching Electron application...');

// Start Electron with proper environment variables
const electronProcess = spawn(electron, ['.'], {
  stdio: 'inherit',
  env: { 
    ...process.env, 
    NEXT_DEV_PORT: '3000',
    ELECTRON_START_URL: 'http://localhost:3000',
    NODE_ENV: 'development'
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