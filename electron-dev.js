const { exec } = require('child_process');
const waitOn = require('wait-on');
const electron = require('electron');
const path = require('path');

// Start Electron after Next.js server is ready
waitOn({
  resources: ['http://localhost:3000'],
  timeout: 30000, // 30 seconds
}).then(() => {
  console.log('Next.js server is ready, starting Electron...');
  
  const electronProcess = exec(`${electron} .`, {
    stdio: 'inherit'
  });
  
  electronProcess.stdout.on('data', (data) => {
    console.log(data);
  });
  
  electronProcess.stderr.on('data', (data) => {
    console.error(data);
  });
  
  electronProcess.on('close', (code) => {
    console.log(`Electron process exited with code ${code}`);
    process.exit(code);
  });
}).catch((err) => {
  console.error('Error waiting for Next.js server:', err);
  process.exit(1);
}); 