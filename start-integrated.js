const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting IRONWOOD Integrated System');

// Clean up processes first
try {
  console.log('Cleaning up existing processes...');
  if (process.platform === 'darwin' || process.platform === 'linux') {
    execSync('pkill -f electron || true');
    execSync('pkill -f "next dev" || true');
    execSync('pkill -f "python.*server.py" || true');
  } else if (process.platform === 'win32') {
    execSync('taskkill /F /IM electron.exe /T || echo No electron processes');
    execSync('taskkill /F /IM node.exe /T || echo No node processes');
    execSync('taskkill /F /FI "WINDOWTITLE eq Python" || echo No Python processes');
  }
} catch (e) {
  // Ignore errors
}

// Check if Python API exists
const pythonApiDir = path.join(__dirname, 'python-api');
if (!fs.existsSync(pythonApiDir)) {
  console.log('Python API directory not found. Please run "npm run setup-ai" first.');
  process.exit(1);
}

// Check if virtual environment exists
const venvDir = path.join(__dirname, 'venv');
const venvPython = process.platform === 'win32' 
  ? path.join(venvDir, 'Scripts', 'python.exe')
  : path.join(venvDir, 'bin', 'python');

if (!fs.existsSync(venvPython)) {
  console.log('Python virtual environment not found. Creating it now...');
  try {
    // Create a virtual environment
    console.log('Creating Python virtual environment...');
    execSync('python3 -m venv venv', { stdio: 'inherit' });
    
    // Install requirements
    console.log('Installing Python requirements...');
    const pipCmd = process.platform === 'win32'
      ? `${path.join(venvDir, 'Scripts', 'pip')}`
      : `${path.join(venvDir, 'bin', 'pip')}`;
    
    execSync(`${pipCmd} install -r python-api/requirements.txt`, { stdio: 'inherit' });
  } catch (error) {
    console.error('Error setting up Python environment:', error.message);
    console.log('You may need to manually set up the Python environment:');
    console.log('  python3 -m venv venv');
    console.log('  source venv/bin/activate  # On Windows: venv\\Scripts\\activate');
    console.log('  pip install -r python-api/requirements.txt');
    process.exit(1);
  }
}

// Start Python Flask API server
console.log('Starting Python API server...');
const pythonProcess = spawn(venvPython, ['server.py'], {
  cwd: pythonApiDir,
  stdio: 'pipe'
});

pythonProcess.stdout.on('data', (data) => {
  console.log(`[Python API] ${data.toString().trim()}`);
});

pythonProcess.stderr.on('data', (data) => {
  console.error(`[Python API Error] ${data.toString().trim()}`);
});

// Wait for Python server to start
setTimeout(() => {
  // Start the Next.js + Electron application
  console.log('Starting Next.js + Electron application...');
  
  // Use the auto-start.js script but skip setup
  const startProcess = spawn('node', ['auto-start.js', '--skip-setup'], {
    stdio: 'inherit'
  });
  
  // Handle exit
  process.on('SIGINT', () => {
    console.log('Shutting down all processes...');
    pythonProcess.kill();
    startProcess.kill();
    process.exit(0);
  });
}, 3000); // Give Python server 3 seconds to start 