
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting IRONWOOD Desktop App...');

// Define paths
const workspaceDir = process.cwd();
const electronPath = path.join(
  workspaceDir, 
  'node_modules', 
  'electron', 
  'dist',
  'Electron.app',
  'Contents',
  'MacOS',
  'Electron'
);

// Launch Electron with our custom main file
const electronProcess = spawn(electronPath, [
  '-r', 
  path.join(workspaceDir, 'electron', 'standalone-main.js')
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    ELECTRON_ENABLE_LOGGING: '1'
  }
});

electronProcess.on('error', (err) => {
  console.error('Failed to start Electron:', err);
});

electronProcess.on('close', (code) => {
  console.log(`Electron process exited with code ${code}`);
});
