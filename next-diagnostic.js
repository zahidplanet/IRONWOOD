
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Create middleware manifest if it doesn't exist
const dirs = [
  path.join(__dirname, '.next', 'server'),
  path.join(__dirname, 'out', 'server')
];

const manifest = {
  version: 1,
  sortedMiddleware: [],
  middleware: {},
  functions: {},
  pages: {}
};

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, 'middleware-manifest.json'), JSON.stringify(manifest, null, 2));
});

// Start Next.js development server
console.log('Starting Next.js development server...');
const nextProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// Keep the process running
nextProcess.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code);
});
