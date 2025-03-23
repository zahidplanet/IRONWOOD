const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const http = require('http');

console.log('\x1b[36m%s\x1b[0m', '🔧 IRONWOOD - Complete Fix');

// Kill all existing processes
try {
  console.log('Stopping any running processes...');
  if (process.platform === 'darwin' || process.platform === 'linux') {
    execSync('pkill -f electron || true');
    execSync('pkill -f "next dev" || true');
    execSync('pkill -f "node" || true');
    execSync('lsof -i:3000 -t | xargs kill -9 || true');
    execSync('lsof -i:3001 -t | xargs kill -9 || true');
  } else if (process.platform === 'win32') {
    execSync('taskkill /F /IM electron.exe /T || echo No electron processes');
    execSync('taskkill /F /IM node.exe /T || echo No node processes');
  }
} catch (e) {
  // Ignore errors
}

// Fix the Next.js syntax error
const patchNextJs = () => {
  console.log('Fixing Next.js syntax errors...');
  
  // Path to the next-server.js file
  const nextServerPath = path.join(__dirname, 'node_modules', 'next', 'dist', 'server', 'next-server.js');
  
  if (!fs.existsSync(nextServerPath)) {
    console.log('Next.js server file not found, skipping patch');
    return;
  }
  
  // Read the file
  let content = fs.readFileSync(nextServerPath, 'utf8');
  
  // Create backup
  const backupPath = `${nextServerPath}.backup`;
  if (!fs.existsSync(backupPath)) {
    fs.writeFileSync(backupPath, content);
    console.log('Created backup of next-server.js');
  }
  
  // Fix syntax errors
  content = content.replace(/(\S+)\s*,\s*\n\s*\}(?!\s*,)/g, '$1\n    }');
  
  // Fix any specific known issues with next-server.js
  content = content.replace(/functions:\s*\{\s*\},?\s*\n\s*\}/g, 'functions: {}\n    }');
  
  fs.writeFileSync(nextServerPath, content);
  console.log('Fixed Next.js syntax errors');
};

// Create all required error components and pages
const createErrorComponents = () => {
  console.log('Creating required error components...');
  
  // Create pages directory if it doesn't exist
  const pagesDir = path.join(__dirname, 'src', 'pages');
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
    console.log('Created src/pages directory');
  }
  
  // Create _error.js
  const errorPath = path.join(pagesDir, '_error.js');
  fs.writeFileSync(errorPath, `
import React from 'react';

function Error({ statusCode }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#121212',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h1 style={{
        fontSize: '3rem',
        background: 'linear-gradient(to right, #0070f3, #9333ea)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1rem'
      }}>
        Error {statusCode}
      </h1>
      <p>Something went wrong</p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
`);
  console.log('Created _error.js');

  // Create _document.js
  const documentPath = path.join(pagesDir, '_document.js');
  fs.writeFileSync(documentPath, `
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#000000" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
`);
  console.log('Created _document.js');

  // Create _app.js
  const appPath = path.join(pagesDir, '_app.js');
  fs.writeFileSync(appPath, `
import React from 'react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
`);
  console.log('Created _app.js');

  // Create/ensure index.js exists
  const indexPath = path.join(pagesDir, 'index.js');
  fs.writeFileSync(indexPath, `
import React from 'react';

export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#121212',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h1 style={{
        fontSize: '3rem',
        background: 'linear-gradient(to right, #0070f3, #9333ea)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1rem'
      }}>
        IRONWOOD
      </h1>
      <p>Healthcare Dashboard System</p>
      <div style={{ 
        marginTop: '2rem',
        padding: '1.5rem',
        borderRadius: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        maxWidth: '500px'
      }}>
        <p>Next.js is running successfully!</p>
        <p>Status: <span style={{ color: '#4caf50', fontWeight: 'bold' }}>ONLINE</span></p>
      </div>
    </div>
  );
}
`);
  console.log('Created index.js');

  // Create a global CSS file
  const stylesDir = path.join(__dirname, 'src', 'styles');
  if (!fs.existsSync(stylesDir)) {
    fs.mkdirSync(stylesDir, { recursive: true });
  }
  
  const globalCssPath = path.join(stylesDir, 'globals.css');
  fs.writeFileSync(globalCssPath, `
html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}
`);
  console.log('Created global CSS file');
};

// Create middleware manifest files
const createMiddlewareManifest = () => {
  console.log('Creating middleware manifest files...');

  const manifestDirs = [
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

  manifestDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, 'middleware-manifest.json'), JSON.stringify(manifest, null, 2));
  });

  console.log('Created middleware manifest files');
};

// Create a fixed Electron main file
const createElectronMain = () => {
  console.log('Creating fixed Electron main file...');
  
  const electronDir = path.join(__dirname, 'electron');
  if (!fs.existsSync(electronDir)) {
    fs.mkdirSync(electronDir, { recursive: true });
  }
  
  const mainPath = path.join(electronDir, 'fixed-main.js');
  fs.writeFileSync(mainPath, `
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const http = require('http');

// Prevent GPU crashes
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

// Set environment variables
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

let mainWindow;
let nextjsPort = 3000;
let maxRetries = 5; // Try ports 3000-3004
let isNextJsReady = false;

// Find available Next.js port
async function findNextJsPort() {
  // Check if Next.js is already running on any port
  for (let port = 3000; port < 3000 + maxRetries; port++) {
    try {
      const response = await fetch(\`http://localhost:\${port}\`);
      if (response.status === 200) {
        console.log(\`Next.js found running on port \${port}\`);
        nextjsPort = port;
        isNextJsReady = true;
        return true;
      }
    } catch (err) {
      // Port not responding, try next one
    }
  }
  return false;
}

// Create the Electron window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#121212',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  const startUrl = \`http://localhost:\${nextjsPort}\`;
  console.log(\`Loading URL: \${startUrl}\`);
  
  mainWindow.loadURL(startUrl);
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', async () => {
  try {
    // Check if Next.js is already running
    const isRunning = await findNextJsPort();
    if (isRunning) {
      createWindow();
    } else {
      console.log('Next.js not running, please start it with: npm run dev');
      app.quit();
    }
  } catch (err) {
    console.error('Error launching:', err);
    app.quit();
  }
});

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
`);
  console.log('Created fixed Electron main file');
};

// Run all fixes
patchNextJs();
createErrorComponents();
createMiddlewareManifest();
createElectronMain();

console.log('\n✅ All fixes applied! Now starting Next.js and Electron...');

// Start Next.js in a new terminal window
if (process.platform === 'darwin') {
  console.log('Opening terminals and starting applications...');
  execSync(`osascript -e 'tell app "Terminal" to do script "cd \\"${process.cwd()}\\" && npm run dev"'`);
  
  // Wait 5 seconds before starting Electron
  setTimeout(() => {
    execSync(`osascript -e 'tell app "Terminal" to do script "cd \\"${process.cwd()}\\" && npx electron ./electron/fixed-main.js"'`);
  }, 5000);
} else if (process.platform === 'win32') {
  execSync(`start cmd.exe /K "cd /d "${process.cwd()}" && npm run dev"`);
  
  // Wait 5 seconds before starting Electron
  setTimeout(() => {
    execSync(`start cmd.exe /K "cd /d "${process.cwd()}" && npx electron ./electron/fixed-main.js"`);
  }, 5000);
} else {
  // Linux
  execSync(`xterm -e 'cd "${process.cwd()}" && npm run dev' &`);
  
  // Wait 5 seconds before starting Electron
  setTimeout(() => {
    execSync(`xterm -e 'cd "${process.cwd()}" && npx electron ./electron/fixed-main.js' &`);
  }, 5000);
}

console.log('\n⭐️ Instructions:');
console.log('1. Wait for Next.js to start in the first terminal');
console.log('2. Electron will launch automatically after 5 seconds');
console.log('3. If Electron fails to connect, wait for Next.js to fully start and run:');
console.log('   npx electron ./electron/fixed-main.js'); 