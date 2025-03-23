const { spawn } = require('child_process');
const http = require('http');

// Port Next.js will run on
const NEXT_PORT = 3001;

// Run Next.js development server
console.log('Starting Next.js...');
const nextProcess = spawn('npx', ['next', 'dev', '-p', NEXT_PORT.toString()], {
  stdio: 'inherit'
});

// Function to check if Next.js is ready
function checkNextJs() {
  const request = http.get(`http://localhost:${NEXT_PORT}`, (res) => {
    if (res.statusCode === 200) {
      console.log(`Next.js is running on port ${NEXT_PORT}`);
      console.log('Starting Electron...');
      
      // Start Electron
      const electronProcess = spawn('npx', ['electron', '.'], {
        stdio: 'inherit'
      });
      
      electronProcess.on('close', (code) => {
        console.log(`Electron exited with code ${code}`);
        nextProcess.kill();
        process.exit();
      });
    } else {
      setTimeout(checkNextJs, 1000);
    }
  });
  
  request.on('error', () => {
    // Next.js not ready yet, try again
    setTimeout(checkNextJs, 1000);
  });
}

// Start checking after a short delay
setTimeout(checkNextJs, 3000);

// Ensure clean exit
process.on('SIGINT', () => {
  nextProcess.kill();
  process.exit();
});
