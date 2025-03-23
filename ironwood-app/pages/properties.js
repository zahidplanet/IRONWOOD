import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function Properties() {
  const [propertyData, setPropertyData] = useState({
    totalValue: 0,
    properties: [],
    recommendations: [],
    aiAnalysis: null
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for development properties
  const mockPropertyData = {
    totalValue: 25600000,
    properties: [
      { 
        id: 'prop001',
        name: 'Oakwood Heights',
        type: 'Residential',
        location: 'Austin, TX',
        value: 12500000, 
        roi: 18.5,
        status: 'In Development' 
      },
      { 
        id: 'prop002',
        name: 'Riverside Plaza',
        type: 'Commercial',
        location: 'Portland, OR',
        value: 8700000, 
        roi: 12.7,
        status: 'Planning' 
      },
      { 
        id: 'prop003',
        name: 'The Pines',
        type: 'Mixed Use',
        location: 'Denver, CO',
        value: 4400000, 
        roi: 15.2,
        status: 'Completed' 
      }
    ],
    recommendations: [
      {
        action: 'EXPAND',
        property: 'Oakwood Heights',
        reason: 'Market analysis shows increasing demand in this area with potential for 20% higher ROI with 2 additional buildings',
        confidence: 0.88
      },
      {
        action: 'REDESIGN',
        property: 'Riverside Plaza',
        reason: 'Commercial market shifting toward flexible workspaces - redesign could increase marketability by 35%',
        confidence: 0.75
      }
    ],
    aiAnalysis: {
      marketTrend: 'Positive growth in mixed-use developments',
      riskLevel: 'Moderate',
      strategy: 'Focus on energy-efficient designs and transit-oriented developments for maximum ROI'
    }
  };

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setPropertyData(mockPropertyData);
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            <span className={styles.gradient}>Loading Properties...</span>
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
          <span className={styles.gradient}>Property Portfolio</span>
        </h1>
        
        <div className={styles.portfolioGrid}>
          {/* Portfolio Summary */}
          <div className={styles.card}>
            <h2>Portfolio Overview</h2>
            <p>Total Value: ${propertyData.totalValue.toLocaleString()}</p>
            <p>Risk Level: {propertyData.aiAnalysis?.riskLevel}</p>
            <p>Market Trend: {propertyData.aiAnalysis?.marketTrend}</p>
          </div>

          {/* Current Properties */}
          <div className={styles.card}>
            <h2>Development Properties</h2>
            <div className={styles.holdingsTable}>
              {propertyData.properties.map(property => (
                <div key={property.id} className={styles.holdingRow}>
                  <span>{property.name}</span>
                  <span>{property.type}</span>
                  <span>${property.value.toLocaleString()}</span>
                  <span>{property.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className={styles.card}>
            <h2>AI Recommendations</h2>
            {propertyData.recommendations.map((rec, index) => (
              <div key={index} className={styles.recommendation}>
                <h3>{rec.action}: {rec.property}</h3>
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
            <h2>Development Strategy</h2>
            <p className={styles.strategy}>
              {propertyData.aiAnalysis?.strategy}
            </p>
            <button className={styles.button} onClick={() => alert('Generating detailed strategy report...')}>
              Generate Full Report
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}