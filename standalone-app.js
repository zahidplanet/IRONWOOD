const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

console.log('\x1b[36m%s\x1b[0m', '🚀 IRONWOOD - Standalone App Builder');

// Kill all existing processes to ensure clean start
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

// Create a standalone directory for our app
const STANDALONE_DIR = path.join(__dirname, 'ironwood-standalone');
if (!fs.existsSync(STANDALONE_DIR)) {
  fs.mkdirSync(STANDALONE_DIR, { recursive: true });
}

// Define the port Next.js will run on
const NEXT_PORT = 3001;

// Create a minimal Next.js app
const createMinimalNextApp = () => {
  console.log('Creating minimal Next.js app...');
  
  // Create necessary directories
  const pagesDir = path.join(STANDALONE_DIR, 'pages');
  const stylesDir = path.join(STANDALONE_DIR, 'styles');
  const publicDir = path.join(STANDALONE_DIR, 'public');
  
  [pagesDir, stylesDir, publicDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Create package.json
  const packageJson = {
    name: "ironwood-standalone",
    version: "1.0.0",
    private: true,
    scripts: {
      "dev": "next dev -p 3001",
      "build": "next build",
      "start": "next start -p 3001"
    },
    dependencies: {
      "next": "^13.1.0",
      "react": "^18.2.0",
      "react-dom": "^18.2.0"
    }
  };
  
  fs.writeFileSync(
    path.join(STANDALONE_DIR, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Create next.config.js
  fs.writeFileSync(
    path.join(STANDALONE_DIR, 'next.config.js'),
    `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
`
  );
  
  // Create _app.js
  fs.writeFileSync(
    path.join(pagesDir, '_app.js'),
    `import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
`
  );
  
  // Create _document.js
  fs.writeFileSync(
    path.join(pagesDir, '_document.js'),
    `import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
`
  );
  
  // Create index.js
  fs.writeFileSync(
    path.join(pagesDir, 'index.js'),
    `import React from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          <span className={styles.gradient}>IRONWOOD</span>
        </h1>
        <p className={styles.description}>
          Healthcare Dashboard System
        </p>
        
        <div className={styles.statusCard}>
          <p>Status: <span className={styles.online}>ONLINE</span></p>
          <p>Next.js + Electron successfully connected!</p>
        </div>
      </main>
    </div>
  )
}
`
  );
  
  // Create _error.js
  fs.writeFileSync(
    path.join(pagesDir, '_error.js'),
    `function Error({ statusCode }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      color: 'white',
      backgroundColor: '#121212',
    }}>
      <h1 style={{
        fontSize: '2rem',
        background: 'linear-gradient(to right, #0070f3, #8a2be2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        {statusCode
          ? \`Error: \${statusCode}\`
          : 'Application Error'}
      </h1>
      <p>Something went wrong</p>
    </div>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
`
  );
  
  // Create global CSS
  fs.writeFileSync(
    path.join(stylesDir, 'globals.css'),
    `html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  background-color: #121212;
  color: white;
}

* {
  box-sizing: border-box;
}
`
  );
  
  // Create Home module CSS
  fs.writeFileSync(
    path.join(stylesDir, 'Home.module.css'),
    `.container {
  padding: 0 2rem;
}

.main {
  min-height: 100vh;
  padding: 4rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title {
  margin: 0;
  line-height: 1.15;
  font-size: 4rem;
  font-weight: 700;
}

.gradient {
  background: linear-gradient(to right, #0070f3, #8a2be2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.description {
  margin: 1rem 0;
  line-height: 1.5;
  font-size: 1.5rem;
}

.statusCard {
  margin-top: 2.5rem;
  padding: 1.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.online {
  color: #4caf50;
  font-weight: bold;
}
`
  );
  
  console.log('Created minimal Next.js app files');
}

// Create a simple launcher for Electron
const createElectronFiles = () => {
  console.log('Creating Electron files...');
  
  const electronDir = path.join(STANDALONE_DIR, 'electron');
  if (!fs.existsSync(electronDir)) {
    fs.mkdirSync(electronDir, { recursive: true });
  }
  
  // Create electron main file
  fs.writeFileSync(
    path.join(electronDir, 'main.js'),
    `const { app, BrowserWindow } = require('electron');
const path = require('path');

// Disable hardware acceleration to prevent crashes
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

// Security warnings are noisy in dev
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

let mainWindow;
const NEXT_PORT = ${NEXT_PORT};

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

  const startUrl = \`http://localhost:\${NEXT_PORT}\`;
  console.log(\`Loading URL: \${startUrl}\`);
  
  mainWindow.loadURL(startUrl);
  
  // Uncomment for debugging
  // mainWindow.webContents.openDevTools();
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
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
`
  );
  
  // Create package.json for Electron part
  const electronPackageJson = {
    name: "ironwood-electron",
    version: "1.0.0",
    private: true,
    main: "electron/main.js",
    scripts: {
      "start": "electron ."
    },
    dependencies: {
      "electron": "^22.0.0"
    }
  };
  
  fs.writeFileSync(
    path.join(STANDALONE_DIR, 'electron-package.json'),
    JSON.stringify(electronPackageJson, null, 2)
  );
  
  console.log('Created Electron files');
}

// Create a combined launcher script
const createLauncherScript = () => {
  console.log('Creating launcher script...');
  
  fs.writeFileSync(
    path.join(STANDALONE_DIR, 'run.js'),
    `const { spawn } = require('child_process');
const http = require('http');

// Port Next.js will run on
const NEXT_PORT = ${NEXT_PORT};

// Run Next.js development server
console.log('Starting Next.js...');
const nextProcess = spawn('npx', ['next', 'dev', '-p', NEXT_PORT.toString()], {
  stdio: 'inherit'
});

// Function to check if Next.js is ready
function checkNextJs() {
  const request = http.get(\`http://localhost:\${NEXT_PORT}\`, (res) => {
    if (res.statusCode === 200) {
      console.log(\`Next.js is running on port \${NEXT_PORT}\`);
      console.log('Starting Electron...');
      
      // Start Electron
      const electronProcess = spawn('npx', ['electron', '.'], {
        stdio: 'inherit'
      });
      
      electronProcess.on('close', (code) => {
        console.log(\`Electron exited with code \${code}\`);
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
`
  );
  
  // Create a simple readme
  fs.writeFileSync(
    path.join(STANDALONE_DIR, 'README.md'),
    `# IRONWOOD Standalone

A minimal Electron + Next.js application that works independently of the main project.

## How to run

1. First, install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Then run the app:
   \`\`\`
   node run.js
   \`\`\`

This will start both Next.js and Electron.
`
  );
  
  console.log('Created launcher script');
}

// Install dependencies
const installDependencies = () => {
  console.log('Installing dependencies (this may take a minute)...');
  
  try {
    // Change to the standalone directory
    process.chdir(STANDALONE_DIR);
    
    // Install Next.js dependencies
    execSync('npm install', { stdio: 'inherit' });
    
    // Install Electron globally if not already installed
    try {
      execSync('npx electron --version', { stdio: 'ignore' });
    } catch (e) {
      console.log('Installing Electron...');
      execSync('npm install --no-save electron@latest', { stdio: 'inherit' });
    }
    
    console.log('Dependencies installed successfully');
  } catch (e) {
    console.error('Error installing dependencies:', e);
  } finally {
    // Change back to the original directory
    process.chdir(__dirname);
  }
}

// Create a combined launcher that can be easily executed
const createEasyLauncher = () => {
  console.log('Creating easy launcher script...');
  
  fs.writeFileSync(
    path.join(__dirname, 'start-ironwood.js'),
    `const { execSync } = require('child_process');
const path = require('path');

// Go to the standalone directory and run the app
const standaloneDir = path.join(__dirname, 'ironwood-standalone');
console.log('Changing to standalone directory:', standaloneDir);

try {
  execSync(\`cd "\${standaloneDir}" && node run.js\`, { 
    stdio: 'inherit',
    windowsHide: false
  });
} catch (e) {
  // If the command was interrupted by the user, don't show an error
  if (e.signal !== 'SIGINT') {
    console.error('Error running the app:', e);
  }
}
`
  );
  
  console.log('Created easy launcher script: start-ironwood.js');
}

// Main function to run everything
const main = async () => {
  try {
    // Create all necessary files
    createMinimalNextApp();
    createElectronFiles();
    createLauncherScript();
    
    // Install dependencies
    installDependencies();
    
    // Create the easy launcher
    createEasyLauncher();
    
    console.log('\n✅ Standalone app created successfully!');
    console.log('\nTo run the app, simply execute:');
    console.log('  node start-ironwood.js');
    console.log('\nThis will start both Next.js and Electron in standalone mode.');
  } catch (err) {
    console.error('Failed to create standalone app:', err);
    process.exit(1);
  }
};

// Run the main function
main(); 