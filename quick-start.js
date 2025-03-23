const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 IRONWOOD Quick Start');

// Kill any running processes first
try {
  console.log('Stopping any existing processes...');
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

// Setup directories
const projectRoot = __dirname;
const standaloneDir = path.join(projectRoot, 'ironwood-standalone');
console.log('Creating necessary directories...');

// Make sure standalone directory exists
if (!fs.existsSync(standaloneDir)) {
  fs.mkdirSync(standaloneDir, { recursive: true });
}

// Make all required directories
const dirs = [
  path.join(standaloneDir, 'pages'),
  path.join(standaloneDir, 'styles'),
  path.join(standaloneDir, 'components'),
  path.join(standaloneDir, 'electron'),
  path.join(standaloneDir, 'pages', 'api')
];

dirs.forEach(dir => {
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
  path.join(standaloneDir, 'package.json'),
  JSON.stringify(packageJson, null, 2)
);

console.log('Creating files...');

// Create Navigation component
fs.writeFileSync(
  path.join(standaloneDir, 'components', 'Navigation.js'),
  `import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

export default function Navigation() {
  const router = useRouter();
  
  return (
    <nav className={styles.nav}>
      <div className={styles.navBrand}>
        <Link href="/" className={styles.navLink}>
          <span className={styles.gradient}>IRONWOOD</span>
        </Link>
      </div>
      
      <div className={styles.navLinks}>
        <Link 
          href="/" 
          className={styles.navLink}
        >
          Dashboard
        </Link>
        <Link 
          href="/portfolio" 
          className={styles.navLink}
        >
          AI Portfolio
        </Link>
      </div>
    </nav>
  );
}`
);

// Create _app.js
fs.writeFileSync(
  path.join(standaloneDir, 'pages', '_app.js'),
  `import '../styles/globals.css';
import Navigation from '../components/Navigation';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navigation />
      <div style={{ marginTop: '60px' }}>
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;`
);

// Create index.js
fs.writeFileSync(
  path.join(standaloneDir, 'pages', 'index.js'),
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
  path.join(standaloneDir, 'pages', 'portfolio.js'),
  `import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function Portfolio() {
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 0,
    holdings: [],
    recommendations: [],
    aiAnalysis: null
  });

  const [loading, setLoading] = useState(false);
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
    setLoading(true);
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
  path.join(standaloneDir, 'styles', 'globals.css'),
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
  path.join(standaloneDir, 'styles', 'Home.module.css'),
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
  path.join(standaloneDir, 'electron', 'main.js'),
  `const { app, BrowserWindow } = require('electron');
const path = require('path');
const http = require('http');

// Disable hardware acceleration to prevent crashes
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

// Security warnings are noisy in dev
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

let mainWindow;
const NEXT_PORT = 3001;

function waitForNextJs(retries = 30) {
  return new Promise((resolve, reject) => {
    const checkNext = (retriesLeft) => {
      const request = http.request({
        method: 'GET',
        host: 'localhost',
        port: NEXT_PORT,
        path: '/',
        timeout: 1000
      }, (response) => {
        if (response.statusCode === 200) {
          console.log('Next.js server is available!');
          resolve();
        } else if (retriesLeft > 0) {
          console.log(\`Waiting for Next.js (retry \${retries - retriesLeft + 1}/\${retries})...\`);
          setTimeout(() => checkNext(retriesLeft - 1), 1000);
        } else {
          reject(new Error('Next.js server not responding with 200 OK'));
        }
      });
      
      request.on('error', (err) => {
        if (retriesLeft > 0) {
          console.log(\`Waiting for Next.js (retry \${retries - retriesLeft + 1}/\${retries})...\`);
          setTimeout(() => checkNext(retriesLeft - 1), 1000);
        } else {
          reject(new Error(\`Could not connect to Next.js server: \${err.message}\`));
        }
      });
      
      request.on('timeout', () => {
        request.destroy();
        if (retriesLeft > 0) {
          console.log(\`Connection timed out, retrying (\${retries - retriesLeft + 1}/\${retries})...\`);
          setTimeout(() => checkNext(retriesLeft - 1), 1000);
        } else {
          reject(new Error('Connection to Next.js server timed out after multiple attempts'));
        }
      });
      
      request.end();
    };
    
    checkNext(retries);
  });
}

async function createWindow() {
  try {
    // Wait for Next.js server to be available
    await waitForNextJs();
    
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      backgroundColor: '#121212',
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
    
    const startUrl = \`http://localhost:\${NEXT_PORT}\`;
    console.log(\`Loading URL: \${startUrl}\`);
    
    // Add error handling for page load
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error(\`Failed to load: \${errorDescription} (\${errorCode})\`);
      // Retry loading
      setTimeout(() => {
        console.log('Retrying to load the URL...');
        mainWindow.loadURL(startUrl);
      }, 1000);
    });
    
    // Show window when ready to render
    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
    });
    
    await mainWindow.loadURL(startUrl);
    
    // Open DevTools in development
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    
    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  } catch (err) {
    console.error('Error creating window:', err.message);
    app.quit();
  }
}

app.on('ready', () => {
  createWindow().catch(err => {
    console.error('Error starting app:', err.message);
    app.quit();
  });
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow().catch(err => {
      console.error('Error restoring window:', err.message);
      app.quit();
    });
  }
});`
);

// Start the app
console.log('Installing dependencies...');
process.chdir(standaloneDir);
execSync('npm install', { stdio: 'inherit' });
execSync('npm install electron@latest --save-dev', { stdio: 'inherit' });

// Start Next.js in a new terminal
console.log('Starting Next.js in a new terminal...');
if (process.platform === 'darwin') {
  execSync(`osascript -e 'tell app "Terminal" to do script "cd \\"${standaloneDir}\\" && npx next dev -p 3001"'`, { stdio: 'inherit' });
} else if (process.platform === 'win32') {
  execSync(`start cmd.exe /K "cd /d "${standaloneDir}" && npx next dev -p 3001"`, { stdio: 'inherit' });
} else {
  execSync(`xterm -e 'cd "${standaloneDir}" && npx next dev -p 3001' &`, { stdio: 'inherit' });
}

// Add a slight delay to ensure Next.js starts up
console.log('Waiting for Next.js to start...');
execSync('sleep 5');

// Start Electron in the current terminal
console.log('Starting Electron...');
execSync('npx electron electron/main.js', { stdio: 'inherit' }); 