const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

console.log('🛑 Stopping all existing processes...');
try {
  if (process.platform === 'darwin' || process.platform === 'linux') {
    execSync('pkill -f electron || true');
    execSync('pkill -f next || true');
    execSync('pkill -f node || true');
  } else {
    execSync('taskkill /F /IM electron.exe /T', { stdio: 'ignore' });
    execSync('taskkill /F /IM node.exe /T', { stdio: 'ignore' });
  }
} catch (e) {
  // Ignore errors
}

// Create a simple server to serve the Next.js content
const createNextServerScript = () => {
  console.log('📝 Creating Next.js server script...');
  const nextServerScript = `
  const fs = require('fs');
  const path = require('path');
  const { execSync, spawn } = require('child_process');
  
  // Create required directories
  console.log('Creating required directories...');
  const dirs = [
    path.join(__dirname, '.next', 'server'),
    path.join(__dirname, 'out', 'server')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Create middleware manifest
  const manifest = {
    version: 1,
    sortedMiddleware: [],
    middleware: {},
    functions: {},
    pages: {}
  };
  
  dirs.forEach(dir => {
    const manifestPath = path.join(dir, 'middleware-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(\`Created manifest at: \${manifestPath}\`);
  });
  
  // Correctly patch Next.js server file
  console.log('Patching Next.js server file...');
  try {
    const serverPath = path.join(__dirname, 'node_modules', 'next', 'dist', 'server', 'next-server.js');
    let content = fs.readFileSync(serverPath, 'utf8');
    
    // First check if we need to patch it
    if (content.includes('getMiddlewareManifest()')) {
      console.log('Server file needs patching...');
      
      // Replace the getMiddlewareManifest method with one that returns an empty manifest
      content = content.replace(
        /getMiddlewareManifest\(\) {[^}]*}/s,
        \`getMiddlewareManifest() {
          return {
            version: 1,
            sortedMiddleware: [],
            middleware: {},
            functions: {},
            pages: {}
          };
        }\`
      );
      
      fs.writeFileSync(serverPath, content);
      console.log('Successfully patched Next.js server file');
    } else {
      console.log('Server file is already patched or has a different structure');
    }
  } catch (error) {
    console.error('Error patching Next.js server file:', error);
  }
  
  // Create minimal error components
  console.log('Creating error components...');
  const pagesDir = path.join(__dirname, 'src', 'pages');
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
  }
  
  // Create _error.js
  fs.writeFileSync(
    path.join(pagesDir, '_error.js'),
    \`export default function Error({ statusCode }) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>{statusCode ? \\\`Error \\\${statusCode}\\\` : 'An error occurred'}</h1>
          <p>Sorry, there was a problem with the requested page.</p>
        </div>
      );
    }
    \`
  );
  
  // Create _document.js
  fs.writeFileSync(
    path.join(pagesDir, '_document.js'),
    \`import { Html, Head, Main, NextScript } from 'next/document';
    
    export default function Document() {
      return (
        <Html>
          <Head />
          <body>
            <Main />
            <NextScript />
          </body>
        </Html>
      );
    }
    \`
  );
  
  // Create index.js if it doesn't exist
  if (!fs.existsSync(path.join(pagesDir, 'index.js'))) {
    fs.writeFileSync(
      path.join(pagesDir, 'index.js'),
      \`export default function Home() {
        return (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1 style={{ 
              background: 'linear-gradient(to right, #0070f3, #9333ea)', 
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              IRONWOOD
            </h1>
            <p>Healthcare Dashboard System</p>
          </div>
        );
      }
      \`
    );
  }
  
  console.log('Starting Next.js dev server...');
  const nextProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });
  
  nextProcess.on('exit', (code) => {
    console.log(\`Next.js process exited with code \${code}\`);
  });
  `;
  
  const scriptPath = path.join(__dirname, 'start-next-server.js');
  fs.writeFileSync(scriptPath, nextServerScript);
  console.log(`✅ Created Next.js server script at ${scriptPath}`);
};

// Create a beautiful static HTML file for Electron
console.log('📝 Creating static HTML file...');
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IRONWOOD</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #121212;
            color: white;
        }
        .container {
            text-align: center;
            padding: 2rem;
            width: 100%;
            max-width: 600px;
        }
        h1 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
            background: linear-gradient(to right, #0070f3, #9333ea);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradient 3s ease infinite;
            background-size: 200% 200%;
        }
        @keyframes gradient {
            0% {background-position: 0% 50%;}
            50% {background-position: 100% 50%;}
            100% {background-position: 0% 50%;}
        }
        .loader {
            display: inline-block;
            width: 50px;
            height: 50px;
            border: 5px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #0070f3;
            animation: spin 1s ease-in-out infinite;
            margin-top: 20px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        #status {
            margin-top: 20px;
            min-height: 60px;
        }
        .button {
            background: linear-gradient(to right, #0070f3, #6c5ce7);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 20px;
            font-size: 1rem;
            font-weight: bold;
            transition: all 0.2s ease;
            opacity: 0.7;
        }
        .button.ready {
            opacity: 1;
            box-shadow: 0 4px 12px rgba(0, 112, 243, 0.4);
        }
        .button.ready:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 112, 243, 0.5);
        }
        .instructions {
            margin-top: 40px;
            padding: 15px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            font-size: 0.9rem;
            text-align: left;
        }
        code {
            background-color: rgba(0, 0, 0, 0.3);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>IRONWOOD</h1>
        <p>Healthcare Dashboard System</p>
        <div class="loader"></div>
        <p id="status">Welcome to IRONWOOD</p>
        <button class="button" id="startBtn" onclick="startServer()">Start Next.js Server</button>
        <button class="button" id="openBtn" onclick="openBrowser()" style="display: none;">Open Dashboard in Browser</button>
        
        <div class="instructions">
            <h3>Instructions:</h3>
            <p>1. Click "Start Next.js Server" to initialize the application server</p>
            <p>2. Wait for the server to start (this may take a moment)</p>
            <p>3. Once ready, click "Open Dashboard in Browser" to view the application</p>
            <p>4. To start the Next.js server manually, run: <code>node start-next-server.js</code></p>
            <p>5. The app will be available at: <code>http://localhost:3000</code></p>
        </div>
    </div>

    <script>
        const statusEl = document.getElementById('status');
        const startBtn = document.getElementById('startBtn');
        const openBtn = document.getElementById('openBtn');
        
        function startServer() {
            statusEl.textContent = 'Starting Next.js server...';
            startBtn.disabled = true;
            
            // Make a call to the backend to start the Next.js server
            fetch('http://localhost:3000', { mode: 'no-cors' })
                .then(() => {
                    // Server is already running
                    serverReady();
                })
                .catch(() => {
                    // Server needs to be started
                    statusEl.textContent = 'Opening terminal to start Next.js server...';
                    
                    // This will be handled by the terminal opener in main.js
                    window.api.startNextJs();
                    
                    // Start checking server status
                    checkServer();
                });
        }
        
        function checkServer() {
            fetch('http://localhost:3000', { mode: 'no-cors' })
                .then(() => {
                    serverReady();
                })
                .catch(() => {
                    statusEl.textContent = 'Waiting for Next.js server to start...';
                    setTimeout(checkServer, 3000);
                });
        }
        
        function serverReady() {
            statusEl.textContent = 'Next.js server is running! You can now open the dashboard.';
            startBtn.style.display = 'none';
            openBtn.style.display = 'inline-block';
            openBtn.classList.add('ready');
        }
        
        function openBrowser() {
            window.api.openBrowser('http://localhost:3000');
        }
    </script>
</body>
</html>
`;

const htmlPath = path.join(__dirname, 'electron-app.html');
fs.writeFileSync(htmlPath, htmlContent);
console.log(`✅ Created static HTML file at ${htmlPath}`);

// Create a minimal Electron main file
console.log('📝 Creating minimal Electron main file...');
const electronDir = path.join(__dirname, 'electron');
if (!fs.existsSync(electronDir)) {
  fs.mkdirSync(electronDir, { recursive: true });
}

const electronMainPath = path.join(electronDir, 'simple-main.js');
const electronMainContent = `
// Minimal standalone Electron main file
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { spawn, exec } = require('child_process');

// Disable hardware acceleration to prevent GPU crashes
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');

let mainWindow;

// Create the preload script for IPC communication
const fs = require('fs');
const preloadPath = path.join(__dirname, 'preload.js');
if (!fs.existsSync(preloadPath)) {
  const preloadContent = \`
    const { contextBridge, ipcRenderer } = require('electron');
    
    contextBridge.exposeInMainWorld('api', {
      startNextJs: () => ipcRenderer.invoke('start-nextjs'),
      openBrowser: (url) => ipcRenderer.invoke('open-browser', url)
    });
  \`;
  fs.writeFileSync(preloadPath, preloadContent);
  console.log('Created preload script for IPC');
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    backgroundColor: '#121212',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath
    }
  });

  // Load the HTML file directly - no Next.js needed for the initial view
  const htmlPath = path.join(__dirname, '..', 'electron-app.html');
  console.log('Loading HTML file:', htmlPath);
  mainWindow.loadFile(htmlPath);
  
  // Open DevTools for debugging in development
  // mainWindow.webContents.openDevTools();
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  
  // Set up IPC handlers
  ipcMain.handle('start-nextjs', async () => {
    console.log('Starting Next.js server via terminal...');
    
    // Determine correct terminal command based on platform
    let command;
    
    if (process.platform === 'darwin') {  // macOS
      command = 'open -a Terminal ' + path.join(__dirname, '..', 'start-next-server.js');
    } else if (process.platform === 'win32') {  // Windows
      command = 'start cmd.exe /K "node ' + path.join(__dirname, '..', 'start-next-server.js') + '"';
    } else {  // Linux
      command = 'x-terminal-emulator -e "node ' + path.join(__dirname, '..', 'start-next-server.js') + '"';
    }
    
    exec(command, (error) => {
      if (error) {
        console.error('Error opening terminal:', error);
        
        // Fallback - start without terminal
        console.log('Falling back to starting Next.js without terminal...');
        spawn('node', ['start-next-server.js'], {
          cwd: path.join(__dirname, '..'),
          detached: true,
          stdio: 'ignore',
          shell: true
        }).unref();
      }
    });
    
    return true;
  });
  
  ipcMain.handle('open-browser', async (_, url) => {
    shell.openExternal(url);
    return true;
  });
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
`;

fs.writeFileSync(electronMainPath, electronMainContent);
console.log(`✅ Created minimal Electron main file at ${electronMainPath}`);

// Create the Next.js server script
createNextServerScript();

// Start the Electron app
console.log('🚀 Starting Electron app...');

const electronProcess = spawn('npx', [
  'electron',
  '-r',
  './electron/simple-main.js'
], {
  stdio: 'inherit',
  env: { ...process.env, ELECTRON_ENABLE_LOGGING: '1' }
});

electronProcess.on('close', (code) => {
  console.log(`Electron process exited with code ${code}`);
  process.exit(0);
}); 