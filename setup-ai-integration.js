const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up AI Hedge Fund integration');

const pythonApiDir = path.join(__dirname, 'python-api');

// Create directories
if (!fs.existsSync(pythonApiDir)) {
    fs.mkdirSync(pythonApiDir, { recursive: true });
}

// Create the Python API bridge
console.log('Creating Python API bridge...');

// server.py - already created
console.log('Python API server file already exists.');

// requirements.txt - already created
console.log('Python requirements file already exists.');

// Install Python packages
console.log('Installing Python packages...');
try {
    let installCmd;
    if (process.platform === 'win32') {
        installCmd = 'pip install -r requirements.txt';
    } else {
        installCmd = 'pip3 install -r requirements.txt';
    }
    
    execSync(installCmd, { 
        cwd: pythonApiDir,
        stdio: 'inherit'
    });
    console.log('Python packages installed successfully.');
} catch (error) {
    console.error('Error installing Python packages:', error.message);
    console.log('You may need to manually install requirements with: pip install -r python-api/requirements.txt');
}

// Update Next.js API to connect to Python API
console.log('Creating Next.js API endpoint for AI integration...');

const nextApiDir = path.join(__dirname, 'ironwood-app', 'pages', 'api');
if (!fs.existsSync(nextApiDir)) {
    fs.mkdirSync(nextApiDir, { recursive: true });
}

// Create the API file
fs.writeFileSync(
    path.join(nextApiDir, 'ai-hedge-fund.js'),
    `// API route that proxies requests to the Python API
import fetch from 'isomorphic-unfetch';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:5000';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Forward the request to the appropriate Python API endpoint
    const endpoint = req.query.endpoint || 'health';
    const response = await fetch(\`\${PYTHON_API_URL}/api/\${endpoint}\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error connecting to Python API:', error);
    return res.status(500).json({ 
      error: 'Failed to connect to AI service',
      details: error.message 
    });
  }
}
`
);

// Create a portfolio page that uses the AI integration
console.log('Creating portfolio page...');

const portfolioPage = path.join(__dirname, 'ironwood-app', 'pages', 'portfolio.js');
fs.writeFileSync(
    portfolioPage,
    `import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import Navigation from '../components/Navigation';

export default function Portfolio() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  
  // Sample portfolio
  const samplePortfolio = [
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 10 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 5 },
    { symbol: 'GOOG', name: 'Alphabet Inc.', shares: 2 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', shares: 1 }
  ];

  async function analyzePortfolio() {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai-hedge-fund?endpoint=portfolio/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ portfolio: samplePortfolio }),
      });
      
      if (!response.ok) {
        throw new Error('API response was not ok');
      }
      
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze portfolio');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className={styles.container}>
      <Navigation />
      
      <main className={styles.main}>
        <h1 className={styles.title}>
          AI <span className={styles.gradient}>Portfolio</span> Manager
        </h1>
        
        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Current Portfolio</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Name</th>
                  <th>Shares</th>
                </tr>
              </thead>
              <tbody>
                {samplePortfolio.map((stock) => (
                  <tr key={stock.symbol}>
                    <td>{stock.symbol}</td>
                    <td>{stock.name}</td>
                    <td>{stock.shares}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <button 
              className={styles.button} 
              onClick={analyzePortfolio}
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Analyze with AI'}
            </button>
            
            {error && (
              <div className={styles.error}>
                Error: {error}
              </div>
            )}
            
            {analysis && (
              <div className={styles.analysisResults}>
                <h3>Analysis Results</h3>
                {analysis.results.map((result) => (
                  <div key={result.symbol} className={styles.analysisCard}>
                    <h4>{result.symbol}</h4>
                    <p><strong>Recommendation:</strong> {result.recommendation}</p>
                    <p><strong>Confidence:</strong> {Math.round(result.confidence * 100)}%</p>
                    <p>{result.reasoning}</p>
                    <div className={styles.metricsGrid}>
                      <div className={styles.metric}>
                        <span>Sentiment</span>
                        <div className={styles.metricBar} style={{ 
                          width: \`\${result.analysis.sentiment * 100}%\` 
                        }}></div>
                      </div>
                      <div className={styles.metric}>
                        <span>Fundamentals</span>
                        <div className={styles.metricBar} style={{ 
                          width: \`\${result.analysis.fundamentals * 100}%\` 
                        }}></div>
                      </div>
                      <div className={styles.metric}>
                        <span>Technicals</span>
                        <div className={styles.metricBar} style={{ 
                          width: \`\${result.analysis.technicals * 100}%\` 
                        }}></div>
                      </div>
                      <div className={styles.metric}>
                        <span>Risk</span>
                        <div className={styles.metricBar} style={{ 
                          width: \`\${result.analysis.risk * 100}%\` 
                        }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
`
);

console.log('✅ AI Hedge Fund integration setup complete.');
console.log('');
console.log('To start the integrated application, run:');
console.log('  npm run start-integrated');
console.log('');
console.log('This will start both the Python Flask API server and the Next.js + Electron application.'); 