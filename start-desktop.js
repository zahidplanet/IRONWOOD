const { exec } = require('child_process');
const path = require('path');

// Start Next.js server
console.log('🚀 Starting Next.js development server...');
const nextProcess = exec('npm run dev', {
  stdio: 'inherit',
  shell: true,
});

// Give the Next.js server time to start
setTimeout(() => {
  console.log('✅ Starting Electron...');
  
  // Start Electron with explicit environment variables
  const electronProcess = exec('ELECTRON_ENABLE_LOGGING=1 electron .', {
    env: { 
      ...process.env, 
      NEXT_DEV_PORT: '3000',
      ELECTRON_START_URL: 'http://localhost:3000',
      BROWSER: 'none'
    }
  });
  
  electronProcess.stdout.on('data', (data) => {
    console.log(`Electron: ${data}`);
  });
  
  electronProcess.stderr.on('data', (data) => {
    console.error(`Electron Error: ${data}`);
  });
  
  electronProcess.on('close', (code) => {
    console.log(`Electron process exited with code ${code}`);
    nextProcess.kill();
    process.exit(code);
  });
  
}, 5000); // Wait 5 seconds for Next.js to start

// Handle process exit
const cleanup = () => {
  try {
    nextProcess.kill();
  } catch (e) {
    console.error('Error killing Next.js process:', e);
  }
  
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup); 