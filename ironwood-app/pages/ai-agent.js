import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function AIAgent() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTickers, setSelectedTickers] = useState('AAPL,MSFT,NVDA');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [showReasoning, setShowReasoning] = useState(false);
  
  const agentDescriptions = {
    'ben_graham': 'The godfather of value investing, only buys hidden gems with a margin of safety',
    'bill_ackman': 'An activist investor, takes bold positions and pushes for change',
    'cathie_wood': 'The queen of growth investing, believes in the power of innovation and disruption',
    'charlie_munger': "Warren Buffett's partner, only buys wonderful businesses at fair prices",
    'phil_fisher': 'Legendary growth investor who mastered scuttlebutt analysis',
    'stanley_druckenmiller': 'Macro legend who hunts for asymmetric opportunities with growth potential',
    'warren_buffett': 'The oracle of Omaha, seeks wonderful companies at a fair price',
    'valuation': 'Calculates the intrinsic value of a stock and generates trading signals',
    'sentiment': 'Analyzes market sentiment and generates trading signals',
    'fundamentals': 'Analyzes fundamental data and generates trading signals',
    'technicals': 'Analyzes technical indicators and generates trading signals',
    'risk_manager': 'Calculates risk metrics and sets position limits',
    'portfolio_manager': 'Makes final trading decisions and generates orders'
  };
  
  // Mock data for development - will be replaced with actual API data
  const mockAgents = Object.keys(agentDescriptions).map(key => ({
    id: key,
    name: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    description: agentDescriptions[key],
    status: 'active'
  }));
  
  const mockResults = {
    decisions: [
      { ticker: 'AAPL', action: 'BUY', confidence: 0.85, weight: 0.2, reasons: 'Strong cash position, innovation pipeline, and consistent performance' },
      { ticker: 'MSFT', action: 'HOLD', confidence: 0.75, weight: 0.15, reasons: 'Cloud growth and AI leadership, but valuation approaching upper bounds' },
      { ticker: 'NVDA', action: 'BUY', confidence: 0.9, weight: 0.25, reasons: 'AI chip dominance and expanding TAM in data centers and edge computing' }
    ],
    portfolio_metrics: {
      expected_return: '12.8%',
      risk_level: 'Moderate',
      sharpe_ratio: 1.85,
      volatility: '18.4%'
    },
    market_analysis: {
      sentiment: 'Bullish',
      trend: 'Upward',
      risk_factors: ['Fed policy uncertainty', 'China-Taiwan tensions', 'AI bubble concerns']
    },
    agent_insights: {
      warren_buffett: 'These companies have durable competitive advantages and strong management',
      cathie_wood: 'The AI revolution represents a multi-trillion dollar opportunity over the next decade',
      charlie_munger: 'High-quality businesses with reasonable valuations given their growth prospects'
    }
  };

  useEffect(() => {
    // Simulated API call - would be replaced with actual backend call
    const fetchAgents = async () => {
      try {
        // In production this would be a real API call to Python backend
        // const response = await fetch('/api/ai-agents');
        // const data = await response.json();
        setAgents(mockAgents);
        setLoading(false);
      } catch (err) {
        setError('Failed to load AI agents. Please try again later.');
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const handleTickerChange = (e) => {
    setSelectedTickers(e.target.value);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      // In production this would call the Python backend
      // const response = await fetch(`/api/analyze?tickers=${selectedTickers}&show_reasoning=${showReasoning}`);
      // const data = await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnalysisResults(mockResults);
    } catch (err) {
      setError('Analysis failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !analysisResults) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            <span className={styles.gradient}>AI Agent System</span>
          </h1>
          <div className={styles.loadingSpinner}></div>
          <p>Loading AI agents...</p>
        </main>
      </div>
    );
  }

  if (error && !analysisResults) {
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
          <span className={styles.gradient}>AI Hedge Fund</span>
        </h1>
        <p className={styles.description}>
          Powered by multiple AI agents collaborating on investment decisions
        </p>
        
        <div className={styles.controlPanel}>
          <div className={styles.inputGroup}>
            <label htmlFor="tickers">Ticker Symbols (comma-separated):</label>
            <input 
              type="text" 
              id="tickers" 
              value={selectedTickers} 
              onChange={handleTickerChange}
              className={styles.input}
            />
          </div>
          
          <div className={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              id="showReasoning" 
              checked={showReasoning} 
              onChange={(e) => setShowReasoning(e.target.checked)}
            />
            <label htmlFor="showReasoning">Show Agent Reasoning</label>
          </div>
          
          <button 
            className={styles.analyzeButton} 
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze Stocks'}
          </button>
        </div>
        
        {analysisResults && (
          <div className={styles.resultsContainer}>
            <div className={styles.portfolioGrid}>
              <div className={styles.card}>
                <h2>Investment Decisions</h2>
                <div className={styles.decisionsTable}>
                  {analysisResults.decisions.map((decision, idx) => (
                    <div key={idx} className={styles.decisionRow}>
                      <div className={styles.decisionTicker}>{decision.ticker}</div>
                      <div className={styles.decisionAction} data-action={decision.action}>
                        {decision.action}
                      </div>
                      <div className={styles.decisionConfidence}>
                        <div className={styles.confidenceMeter}>
                          Confidence: {(decision.confidence * 100).toFixed(0)}%
                          <div 
                            className={styles.confidenceBar} 
                            style={{ width: `${decision.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className={styles.decisionWeight}>
                        Portfolio Weight: {(decision.weight * 100).toFixed(0)}%
                      </div>
                      <div className={styles.decisionReasons}>
                        {decision.reasons}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={styles.card}>
                <h2>Portfolio Metrics</h2>
                <div className={styles.metricsGrid}>
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>Expected Return:</span>
                    <span className={styles.metricValue}>{analysisResults.portfolio_metrics.expected_return}</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>Risk Level:</span>
                    <span className={styles.metricValue}>{analysisResults.portfolio_metrics.risk_level}</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>Sharpe Ratio:</span>
                    <span className={styles.metricValue}>{analysisResults.portfolio_metrics.sharpe_ratio}</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>Volatility:</span>
                    <span className={styles.metricValue}>{analysisResults.portfolio_metrics.volatility}</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.card}>
                <h2>Market Analysis</h2>
                <div className={styles.marketAnalysis}>
                  <div className={styles.marketMetric}>
                    <span className={styles.marketLabel}>Sentiment:</span>
                    <span className={styles.marketValue}>{analysisResults.market_analysis.sentiment}</span>
                  </div>
                  <div className={styles.marketMetric}>
                    <span className={styles.marketLabel}>Trend:</span>
                    <span className={styles.marketValue}>{analysisResults.market_analysis.trend}</span>
                  </div>
                  <div className={styles.marketMetric}>
                    <span className={styles.marketLabel}>Risk Factors:</span>
                    <ul className={styles.riskList}>
                      {analysisResults.market_analysis.risk_factors.map((risk, idx) => (
                        <li key={idx}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className={styles.card}>
                <h2>Agent Insights</h2>
                <div className={styles.agentInsights}>
                  {Object.entries(analysisResults.agent_insights).map(([agent, insight], idx) => (
                    <div key={idx} className={styles.agentInsight}>
                      <div className={styles.agentName}>
                        {agent.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:
                      </div>
                      <div className={styles.agentComment}>"{insight}"</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className={styles.agentsSection}>
          <h2 className={styles.sectionTitle}>The AI Hedge Fund Team</h2>
          <div className={styles.agentsGrid}>
            {agents.map(agent => (
              <div key={agent.id} className={styles.agentCard}>
                <h3>{agent.name}</h3>
                <p>{agent.description}</p>
                <div className={styles.agentStatus}>
                  Status: <span className={styles.statusActive}>{agent.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 