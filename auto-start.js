const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('🚀 IRONWOOD All-in-One Launcher');

// Parse command line arguments
const args = process.argv.slice(2);
const skipSetup = args.includes('--skip-setup');

// Clean up processes first
try {
  console.log('Cleaning up existing processes...');
  if (process.platform === 'darwin' || process.platform === 'linux') {
    execSync('pkill -f electron || true');
    execSync('pkill -f "next dev" || true');
    execSync('lsof -i:3001 -t | xargs kill -9 || true');
  } else if (process.platform === 'win32') {
    execSync('taskkill /F /IM electron.exe /T || echo No electron processes');
    execSync('taskkill /F /IM node.exe /T || echo No node processes');
  }
} catch (e) {
  // Ignore errors
}

// Setup app directory
const appDir = path.join(__dirname, 'ironwood-app');
console.log(`Setting up in directory: ${appDir}`);

if (!skipSetup) {
  // Create directory structure
  const dirs = [
    path.join(appDir),
    path.join(appDir, 'pages'),
    path.join(appDir, 'components'),
    path.join(appDir, 'styles'),
    path.join(appDir, 'electron'),
    path.join(appDir, 'pages', 'api')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Create package.json
  console.log('Creating package.json...');
  const packageJson = {
    name: "ironwood-app",
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
    path.join(appDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Create Navigation component
  console.log('Creating application files...');
  fs.writeFileSync(
    path.join(appDir, 'components', 'Navigation.js'),
    `import React from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <div className={styles.navBrand}>
        <Link href="/" legacyBehavior>
          <a className={styles.navLink}>
            <span className={styles.gradient}>IRONWOOD</span>
          </a>
        </Link>
      </div>
      
      <div className={styles.navLinks}>
        <Link href="/" legacyBehavior>
          <a className={styles.navLink}>Dashboard</a>
        </Link>
        <Link href="/portfolio" legacyBehavior>
          <a className={styles.navLink}>AI Portfolio</a>
        </Link>
      </div>
    </nav>
  );
}`
  );

  // Create _app.js
  fs.writeFileSync(
    path.join(appDir, 'pages', '_app.js'),
    `import '../styles/globals.css';
import Navigation from '../components/Navigation';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navigation />
      <div style={{ paddingTop: '60px' }}>
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;`
  );

  // Create index.js
  fs.writeFileSync(
    path.join(appDir, 'pages', 'index.js'),
    `import React from 'react';
import styles from '../styles/Home.module.css';

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
  );
}`
  );

  // Create portfolio.js
  fs.writeFileSync(
    path.join(appDir, 'pages', 'portfolio.js'),
    `import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function Portfolio() {
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 0,
    holdings: [],
    recommendations: [],
    aiAnalysis: null
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // This will be connected to the AI system later
  const mockPortfolioData = {
    totalValue: 1000000,
    holdings: [
      { symbol: 'AAPL', shares: 100, value: 175000, allocation: 17.5 },
      { symbol: 'GOOGL', shares: 50, value: 150000, allocation: 15 },
      { symbol: 'MSFT', shares: 200, value: 200000, allocation: 20 }
    ],
    recommendations: [
      {
        action: 'BUY',
        symbol: 'NVDA',
        reason: 'Strong AI market position and growth potential',
        confidence: 0.85
      },
      {
        action: 'HOLD',
        symbol: 'AAPL',
        reason: 'Stable performance and market leadership',
        confidence: 0.75
      }
    ],
    aiAnalysis: {
      marketCondition: 'Bullish',
      riskLevel: 'Moderate',
      strategy: 'Growth with strategic AI/Tech focus'
    }
  };

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setPortfolioData(mockPortfolioData);
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            <span className={styles.gradient}>Loading Portfolio...</span>
          </h1>
          <div className={styles.loadingSpinner}></div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            <span className={styles.gradient}>Error</span>
          </h1>
          <p className={styles.description}>{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          <span className={styles.gradient}>AI Portfolio Manager</span>
        </h1>
        
        <div className={styles.portfolioGrid}>
          {/* Portfolio Summary */}
          <div className={styles.card}>
            <h2>Portfolio Overview</h2>
            <p>Total Value: \${portfolioData.totalValue.toLocaleString()}</p>
            <p>Risk Level: {portfolioData.aiAnalysis?.riskLevel}</p>
            <p>Market Condition: {portfolioData.aiAnalysis?.marketCondition}</p>
          </div>

          {/* Current Holdings */}
          <div className={styles.card}>
            <h2>Current Holdings</h2>
            <div className={styles.holdingsTable}>
              {portfolioData.holdings.map(holding => (
                <div key={holding.symbol} className={styles.holdingRow}>
                  <span>{holding.symbol}</span>
                  <span>{holding.shares} shares</span>
                  <span>\${holding.value.toLocaleString()}</span>
                  <span>{holding.allocation}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className={styles.card}>
            <h2>AI Recommendations</h2>
            {portfolioData.recommendations.map((rec, index) => (
              <div key={index} className={styles.recommendation}>
                <h3>{rec.action}: {rec.symbol}</h3>
                <p>{rec.reason}</p>
                <div className={styles.confidenceMeter}>
                  Confidence: {(rec.confidence * 100).toFixed(0)}%
                  <div 
                    className={styles.confidenceBar} 
                    style={{ width: \`\${rec.confidence * 100}%\` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Strategy Overview */}
          <div className={styles.card}>
            <h2>AI Strategy Analysis</h2>
            <p className={styles.strategy}>
              {portfolioData.aiAnalysis?.strategy}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}`
  );

  // Create globals.css
  fs.writeFileSync(
    path.join(appDir, 'styles', 'globals.css'),
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
}`
  );

  // Create Home.module.css
  fs.writeFileSync(
    path.join(appDir, 'styles', 'Home.module.css'),
    `.container {
  padding: 0 2rem;
  background-color: #121212;
  min-height: 100vh;
}

.main {
  min-height: 100vh;
  padding: 4rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.title {
  margin: 0;
  line-height: 1.15;
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 2rem;
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

/* Portfolio Styles */
.portfolioGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin-top: 2rem;
}

.card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  background: linear-gradient(to right, #0070f3, #8a2be2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.holdingsTable {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.holdingRow {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  font-size: 0.9rem;
}

.recommendation {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.recommendation h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #0070f3;
}

.confidenceMeter {
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.confidenceBar {
  height: 4px;
  background: linear-gradient(to right, #0070f3, #8a2be2);
  border-radius: 2px;
  margin-top: 4px;
  transition: width 0.3s ease;
}

.strategy {
  font-size: 1.1rem;
  line-height: 1.6;
}

.loadingSpinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #0070f3;
  animation: spin 1s ease-in-out infinite;
  margin: 2rem 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Navigation */
.nav {
  width: 100%;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navBrand {
  font-size: 1.5rem;
  font-weight: bold;
}

.navLinks {
  display: flex;
  gap: 2rem;
}

.navLink {
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.2s ease;
}

.navLink:hover {
  color: #0070f3;
}

/* Responsive Design */
@media (max-width: 768px) {
  .portfolioGrid {
    grid-template-columns: 1fr;
  }
  
  .title {
    font-size: 2.5rem;
  }
  
  .container {
    padding: 0 1rem;
  }
}`
  );

  // Create Electron main file
  fs.writeFileSync(
    path.join(appDir, 'electron', 'main.js'),
    `const { app, BrowserWindow } = require('electron');
const path = require('path');
const net = require('net');

// Disable hardware acceleration to prevent crashes
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

// Security warnings are noisy in dev
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

let mainWindow;
const NEXT_PORT = 3001;
const MAX_RETRY_COUNT = 30;
let retryCount = 0;

function checkPort(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    
    const onError = () => {
      socket.destroy();
      resolve(false);
    };
    
    socket.setTimeout(1000);
    socket.on('error', onError);
    socket.on('timeout', onError);
    
    socket.connect(port, '127.0.0.1', () => {
      socket.destroy();
      resolve(true);
    });
  });
}

async function waitForNextJsServer() {
  while (retryCount < MAX_RETRY_COUNT) {
    console.log(\`Checking if Next.js is running (attempt \${retryCount + 1}/\${MAX_RETRY_COUNT})...\`);
    const isPortOpen = await checkPort(NEXT_PORT);
    
    if (isPortOpen) {
      console.log('Next.js server is running!');
      return true;
    }
    
    console.log(\`Next.js server not ready, waiting... (attempt \${retryCount + 1}/\${MAX_RETRY_COUNT})\`);
    retryCount++;
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.error(\`Failed to connect to Next.js server after \${MAX_RETRY_COUNT} attempts\`);
  return false;
}

async function createWindow() {
  // Wait for Next.js to be ready first
  const isNextReady = await waitForNextJsServer();
  if (!isNextReady) {
    console.error('Could not connect to Next.js server. Exiting...');
    app.quit();
    return;
  }
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#121212',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  
  const startUrl = \`http://localhost:\${NEXT_PORT}\`;
  console.log(\`Loading URL: \${startUrl}\`);
  
  // Add error handling for page load
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error(\`Failed to load: \${errorDescription} (\${errorCode})\`);
    
    if (!mainWindow.isDestroyed()) {
      setTimeout(() => {
        console.log('Retrying to load the URL...');
        mainWindow.loadURL(startUrl);
      }, 1000);
    }
  });
  
  // Show window when ready to render
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });
  
  try {
    await mainWindow.loadURL(startUrl);
    console.log('Page loaded successfully!');
  } catch (err) {
    console.error('Error loading page:', err);
  }
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null && app.isReady()) {
    createWindow();
  }
});`
  );
}

// Install dependencies
console.log('Installing dependencies...');
process.chdir(appDir);
execSync('npm install', { stdio: 'inherit' });
execSync('npm install electron@latest --save-dev', { stdio: 'inherit' });

// Function to check if port is available
async function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = http.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

// Function to check if server is ready
function waitForServer(port, maxRetries = 30) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const checkServer = () => {
      attempts++;
      const req = http.get(`http://localhost:${port}`, (res) => {
        if (res.statusCode === 200) {
          console.log(`Next.js server is ready on port ${port}`);
          resolve(true);
        } else {
          retry();
        }
      });
      
      req.on('error', () => retry());
      req.end();
      
      function retry() {
        if (attempts < maxRetries) {
          console.log(`Waiting for server to be ready (${attempts}/${maxRetries})...`);
          setTimeout(checkServer, 1000);
        } else {
          reject(new Error(`Server not ready after ${maxRetries} attempts`));
        }
      }
    };
    
    checkServer();
  });
}

// Main function to orchestrate the processes
async function main() {
  if (!skipSetup) {
    // Install dependencies if needed
    console.log('Checking for node_modules directory...');
    if (!fs.existsSync(path.join(appDir, 'node_modules'))) {
      console.log('Installing dependencies...');
      execSync('npm install', {
        cwd: appDir,
        stdio: 'inherit'
      });
    }
  }

  // Start the Next.js development server
  console.log('Starting Next.js development server...');
  const nextProcess = spawn('npm', ['run', 'dev'], {
    cwd: appDir,
    stdio: 'pipe'
  });

  let nextOutput = '';
  nextProcess.stdout.on('data', (data) => {
    const output = data.toString();
    nextOutput += output;
    console.log(`[Next.js] ${output.trim()}`);
  });

  nextProcess.stderr.on('data', (data) => {
    console.error(`[Next.js Error] ${data.toString().trim()}`);
  });

  // Wait for Next.js server to be ready
  console.log('Waiting for Next.js server to be ready...');
  await waitForServer(3001);

  // Start Electron after Next.js is ready
  startElectron();

  function startElectron() {
    console.log('Starting Electron...');
    const electronProcess = spawn('npx', ['electron', path.join(appDir, 'electron', 'main.js')], {
      stdio: 'inherit'
    });

    electronProcess.on('close', (code) => {
      console.log(`Electron process exited with code ${code}`);
      nextProcess.kill();
      process.exit(0);
    });

    process.on('SIGINT', () => {
      console.log('Received SIGINT. Shutting down...');
      electronProcess.kill();
      nextProcess.kill();
      process.exit(0);
    });
  }
}

main().catch(err => {
  console.error('Error starting application:', err);
  process.exit(1);
}); 