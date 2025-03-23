const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const http = require('http');

// Terminal colors for better visibility
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

console.log(`${colors.bold}${colors.blue}IRONWOOD Diagnostic Tool${colors.reset}`);
console.log(`${colors.cyan}This tool will diagnose exactly what's not working in your setup${colors.reset}\n`);

// ---- Utility Functions ----

// Safely execute a command and return the result
function safeExec(command, options = {}) {
  try {
    return { 
      success: true, 
      output: execSync(command, { ...options, encoding: 'utf8' }).toString().trim() 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      stderr: error.stderr?.toString().trim(),
      stdout: error.stdout?.toString().trim()
    };
  }
}

// Check if a port is available
function checkPort(port) {
  return new Promise((resolve) => {
    const server = http.createServer();
    server.once('error', () => {
      resolve({ inUse: true });
    });
    server.once('listening', () => {
      server.close();
      resolve({ inUse: false });
    });
    server.listen(port);
  });
}

// Check if Next.js is responding
function checkNextJs(port = 3000) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ 
          status: 'running', 
          statusCode: res.statusCode,
          isHtml: data.includes('<!DOCTYPE html>') || data.includes('<html')
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({ status: 'not-running', error: error.message });
    });
    
    req.setTimeout(2000, () => {
      req.destroy();
      resolve({ status: 'timeout' });
    });
  });
}

// Check if a package is installed
function checkPackage(packageName) {
  const packagePath = path.join(__dirname, 'node_modules', packageName);
  return fs.existsSync(packagePath);
}

// ---- Diagnostic Functions ----

// Check Node.js version
async function checkNodeVersion() {
  console.log(`${colors.bold}Checking Node.js version...${colors.reset}`);
  
  const result = safeExec('node --version');
  if (!result.success) {
    console.log(`${colors.red}✘ Failed to get Node.js version: ${result.error}${colors.reset}`);
    return false;
  }
  
  const version = result.output.replace('v', '');
  const major = parseInt(version.split('.')[0], 10);
  
  if (major < 14) {
    console.log(`${colors.red}✘ Node.js version ${version} is too old. Next.js requires Node.js 14 or newer.${colors.reset}`);
    return false;
  }
  
  console.log(`${colors.green}✓ Using Node.js ${version}${colors.reset}`);
  return true;
}

// Check Next.js installation
function checkNextInstallation() {
  console.log(`${colors.bold}Checking Next.js installation...${colors.reset}`);
  
  const hasNext = checkPackage('next');
  if (!hasNext) {
    console.log(`${colors.red}✘ Next.js is not installed. Run npm install next${colors.reset}`);
    return false;
  }
  
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.log(`${colors.red}✘ package.json not found${colors.reset}`);
    return false;
  }
  
  let packageJson;
  try {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  } catch (error) {
    console.log(`${colors.red}✘ Failed to parse package.json: ${error.message}${colors.reset}`);
    return false;
  }
  
  const nextVersion = packageJson.dependencies?.next || packageJson.devDependencies?.next;
  if (!nextVersion) {
    console.log(`${colors.yellow}⚠ Next.js is installed but not listed in package.json${colors.reset}`);
  } else {
    console.log(`${colors.green}✓ Next.js ${nextVersion} is installed${colors.reset}`);
  }
  
  // Check for dev script
  const hasDevScript = packageJson.scripts && packageJson.scripts.dev && packageJson.scripts.dev.includes('next');
  if (!hasDevScript) {
    console.log(`${colors.yellow}⚠ No 'dev' script found in package.json that runs Next.js${colors.reset}`);
  } else {
    console.log(`${colors.green}✓ Found dev script: ${packageJson.scripts.dev}${colors.reset}`);
  }
  
  return true;
}

// Check Electron installation
function checkElectronInstallation() {
  console.log(`${colors.bold}Checking Electron installation...${colors.reset}`);
  
  const hasElectron = checkPackage('electron');
  if (!hasElectron) {
    console.log(`${colors.red}✘ Electron is not installed. Run npm install electron${colors.reset}`);
    return false;
  }
  
  // Check if Electron binary exists
  const electronPaths = [
    path.join(__dirname, 'node_modules', '.bin', 'electron'),
    path.join(__dirname, 'node_modules', 'electron', 'dist', 'Electron.app', 'Contents', 'MacOS', 'Electron')
  ];
  
  let electronExecutable = null;
  for (const electronPath of electronPaths) {
    if (fs.existsSync(electronPath)) {
      electronExecutable = electronPath;
      break;
    }
  }
  
  if (!electronExecutable) {
    console.log(`${colors.yellow}⚠ Electron binary not found at expected paths${colors.reset}`);
  } else {
    console.log(`${colors.green}✓ Found Electron executable at ${electronExecutable}${colors.reset}`);
  }
  
  // Check for npx electron
  const npxResult = safeExec('npx electron --version', { stdio: 'pipe' });
  if (!npxResult.success) {
    console.log(`${colors.yellow}⚠ Could not run 'npx electron': ${npxResult.error}${colors.reset}`);
  } else {
    console.log(`${colors.green}✓ Can run Electron via npx: version ${npxResult.output}${colors.reset}`);
  }
  
  return true;
}

// Check middleware manifest
function checkMiddlewareManifest() {
  console.log(`${colors.bold}Checking middleware manifest...${colors.reset}`);
  
  const manifestPaths = [
    path.join(__dirname, '.next', 'server', 'middleware-manifest.json'),
    path.join(__dirname, 'out', 'server', 'middleware-manifest.json'),
    path.join(__dirname, 'node_modules', '.next', 'server', 'middleware-manifest.json')
  ];
  
  let foundManifests = 0;
  
  manifestPaths.forEach(manifestPath => {
    if (fs.existsSync(manifestPath)) {
      foundManifests++;
      console.log(`${colors.green}✓ Found manifest at ${manifestPath}${colors.reset}`);
      
      try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        if (!manifest.version || !manifest.middleware) {
          console.log(`${colors.yellow}⚠ Manifest at ${manifestPath} may be invalid${colors.reset}`);
        }
      } catch (error) {
        console.log(`${colors.red}✘ Failed to parse manifest at ${manifestPath}: ${error.message}${colors.reset}`);
      }
    } else {
      console.log(`${colors.yellow}⚠ No manifest found at ${manifestPath}${colors.reset}`);
    }
  });
  
  if (foundManifests === 0) {
    console.log(`${colors.red}✘ No middleware manifest files found${colors.reset}`);
    return false;
  }
  
  return true;
}

// Check port availability
async function checkPortAvailability() {
  console.log(`${colors.bold}Checking port availability...${colors.reset}`);
  
  const port = 3000;
  const portStatus = await checkPort(port);
  
  if (portStatus.inUse) {
    console.log(`${colors.yellow}⚠ Port ${port} is already in use${colors.reset}`);
    
    // Try to identify what's using the port
    const lsofResult = safeExec(`lsof -i:${port} -P -n`);
    if (lsofResult.success && lsofResult.output) {
      console.log(`${colors.yellow}Process using port ${port}:${colors.reset}`);
      console.log(lsofResult.output);
    }
    
    return false;
  }
  
  console.log(`${colors.green}✓ Port ${port} is available${colors.reset}`);
  return true;
}

// Test starting Next.js
async function testStartNext() {
  console.log(`${colors.bold}Testing Next.js startup...${colors.reset}`);
  
  // Check if Next.js is already running
  const nextStatus = await checkNextJs();
  if (nextStatus.status === 'running') {
    console.log(`${colors.green}✓ Next.js is already running (Status: ${nextStatus.statusCode})${colors.reset}`);
    return true;
  }
  
  console.log(`${colors.cyan}Starting Next.js...${colors.reset}`);
  
  // Create a simple script to start Next.js
  const nextStarterPath = path.join(__dirname, 'next-diagnostic.js');
  const nextStarterContent = `
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
  console.log(\`Next.js process exited with code \${code}\`);
  process.exit(code);
});
`;

  fs.writeFileSync(nextStarterPath, nextStarterContent);
  
  // Try to start Next.js in a new terminal window
  console.log(`${colors.cyan}A new terminal window should open running Next.js...${colors.reset}`);
  
  if (process.platform === 'darwin') {
    const applescriptCmd = `osascript -e 'tell app "Terminal" to do script "cd \\"${__dirname}\\" && node next-diagnostic.js"'`;
    const terminalResult = safeExec(applescriptCmd);
    
    if (!terminalResult.success) {
      console.log(`${colors.red}✘ Failed to open Terminal: ${terminalResult.error}${colors.reset}`);
      console.log(`${colors.yellow}Try running 'node next-diagnostic.js' manually in a new terminal${colors.reset}`);
      return false;
    }
  } else {
    console.log(`${colors.yellow}Please open a new terminal and run: node next-diagnostic.js${colors.reset}`);
  }
  
  // Wait for Next.js to start
  console.log(`${colors.cyan}Waiting for Next.js to start (this may take a moment)...${colors.reset}`);
  
  for (let i = 0; i < 15; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const checkResult = await checkNextJs();
    if (checkResult.status === 'running') {
      console.log(`${colors.green}✓ Next.js started successfully! (Status: ${checkResult.statusCode})${colors.reset}`);
      return true;
    }
    
    process.stdout.write('.');
  }
  
  console.log(`\n${colors.red}✘ Next.js did not start within the expected time${colors.reset}`);
  console.log(`${colors.yellow}Check the terminal window for errors${colors.reset}`);
  return false;
}

// Test starting Electron
async function testStartElectron() {
  console.log(`${colors.bold}Testing Electron startup...${colors.reset}`);
  
  // Create a simple HTML file for Electron
  const htmlPath = path.join(__dirname, 'electron-diagnostic.html');
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>IRONWOOD Electron Test</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 40px;
      background-color: #121212;
      color: white;
      text-align: center;
    }
    h1 {
      font-size: 2.5rem;
      background: linear-gradient(to right, #0070f3, #9333ea);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .status {
      margin: 20px;
      padding: 15px;
      background-color: #1e1e1e;
      border-radius: 8px;
    }
    button {
      background: linear-gradient(to right, #0070f3, #6c5ce7);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1rem;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <h1>IRONWOOD Electron Test</h1>
  <div class="status">
    <p>If you can see this, Electron is running properly!</p>
    <p>Now we need to test if it can connect to Next.js.</p>
  </div>
  <button id="testNext">Test Next.js Connection</button>
  <div id="result" class="status" style="display: none;"></div>

  <script>
    const testBtn = document.getElementById('testNext');
    const resultDiv = document.getElementById('result');
    
    testBtn.addEventListener('click', async () => {
      resultDiv.style.display = 'block';
      resultDiv.innerHTML = 'Testing connection to Next.js...';
      
      try {
        const response = await fetch('http://localhost:3000/');
        const status = response.status;
        
        if (response.ok) {
          resultDiv.innerHTML = '<span style="color: #4caf50;">✓ Successfully connected to Next.js!</span>' + 
                               '<p>Status code: ' + status + '</p>';
        } else {
          resultDiv.innerHTML = '<span style="color: #ff9800;">⚠ Connected to Next.js, but got status code: ' + 
                               status + '</span>';
        }
      } catch (error) {
        resultDiv.innerHTML = '<span style="color: #f44336;">✘ Failed to connect to Next.js</span>' + 
                             '<p>' + error.message + '</p>' + 
                             '<p>Make sure Next.js is running on port 3000</p>';
      }
    });
  </script>
</body>
</html>
  `;
  
  fs.writeFileSync(htmlPath, htmlContent);
  
  // Create a minimal Electron main file
  const mainPath = path.join(__dirname, 'electron-diagnostic.js');
  const mainContent = `
const { app, BrowserWindow } = require('electron');
const path = require('path');

// Disable hardware acceleration to prevent GPU crashes
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'electron-diagnostic.html'));
  
  // Uncomment to open DevTools for debugging
  // mainWindow.webContents.openDevTools();
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
`;

  fs.writeFileSync(mainPath, mainContent);
  
  // Try starting Electron
  console.log(`${colors.cyan}Starting Electron...${colors.reset}`);
  
  const electronProcess = spawn('npx', ['electron', mainPath], {
    stdio: 'inherit',
    env: {
      ...process.env,
      ELECTRON_ENABLE_LOGGING: '1'
    }
  });
  
  electronProcess.on('error', (error) => {
    console.log(`${colors.red}✘ Failed to start Electron: ${error.message}${colors.reset}`);
    console.log(`${colors.yellow}Try running 'npx electron electron-diagnostic.js' manually${colors.reset}`);
    return false;
  });
  
  console.log(`${colors.yellow}Once Electron opens, click the "Test Next.js Connection" button${colors.reset}`);
  console.log(`${colors.yellow}This will test if Electron can connect to Next.js${colors.reset}`);
  
  return new Promise(resolve => {
    electronProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`${colors.green}✓ Electron closed successfully${colors.reset}`);
      } else {
        console.log(`${colors.red}✘ Electron closed with code ${code}${colors.reset}`);
      }
      resolve(code === 0);
    });
  });
}

// Main diagnostic function
async function runDiagnostics() {
  const results = [];
  
  results.push({ name: 'Node.js Version', passed: await checkNodeVersion() });
  results.push({ name: 'Next.js Installation', passed: checkNextInstallation() });
  results.push({ name: 'Electron Installation', passed: checkElectronInstallation() });
  results.push({ name: 'Middleware Manifest', passed: checkMiddlewareManifest() });
  results.push({ name: 'Port Availability', passed: await checkPortAvailability() });
  
  // Test Next.js startup
  const nextJsStarted = await testStartNext();
  results.push({ name: 'Next.js Startup', passed: nextJsStarted });
  
  // Test Electron startup only if Next.js started successfully
  if (nextJsStarted) {
    results.push({ name: 'Electron Startup', passed: await testStartElectron() });
  } else {
    results.push({ name: 'Electron Startup', skipped: true });
  }
  
  // Summary
  console.log(`\n${colors.bold}${colors.blue}Diagnostic Summary:${colors.reset}`);
  
  let allPassed = true;
  results.forEach(result => {
    if (result.skipped) {
      console.log(`${colors.yellow}⚠ ${result.name}: SKIPPED${colors.reset}`);
      allPassed = false;
    } else if (result.passed) {
      console.log(`${colors.green}✓ ${result.name}: PASSED${colors.reset}`);
    } else {
      console.log(`${colors.red}✘ ${result.name}: FAILED${colors.reset}`);
      allPassed = false;
    }
  });
  
  if (allPassed) {
    console.log(`\n${colors.green}${colors.bold}✓ All checks passed! Your environment should be able to run IRONWOOD.${colors.reset}`);
    console.log(`\n${colors.cyan}To start the application:${colors.reset}`);
    console.log(`1. Run 'npm run dev' in one terminal window`);
    console.log(`2. Run 'npx electron electron-diagnostic.js' in another terminal window`);
  } else {
    console.log(`\n${colors.red}${colors.bold}⚠ Some checks failed. Review the issues above.${colors.reset}`);
    
    console.log(`\n${colors.cyan}Common solutions:${colors.reset}`);
    console.log(`1. Make sure port 3000 is free: 'lsof -i:3000' then 'kill -9 <PID>'`);
    console.log(`2. Recreate middleware manifest files:
       mkdir -p .next/server out/server
       echo '{"version":1,"sortedMiddleware":[],"middleware":{},"functions":{},"pages":{}}' > .next/server/middleware-manifest.json
       echo '{"version":1,"sortedMiddleware":[],"middleware":{},"functions":{},"pages":{}}' > out/server/middleware-manifest.json`);
    console.log(`3. Reinstall dependencies: 'rm -rf node_modules && npm install'`);
    console.log(`4. Check package.json for correct scripts (should have "dev": "next dev")`);
  }
}

// Run the diagnostics
runDiagnostics(); 