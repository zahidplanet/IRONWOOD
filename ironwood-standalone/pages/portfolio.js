import React, { useState, useEffect } from 'react';
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
            <p>Total Value: ${portfolioData.totalValue.toLocaleString()}</p>
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
                  <span>${holding.value.toLocaleString()}</span>
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
                    style={{ width: `${rec.confidence * 100}%` }}
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
} 