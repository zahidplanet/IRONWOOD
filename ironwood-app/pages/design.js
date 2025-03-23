import React, { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Design() {
  const [activeDesign, setActiveDesign] = useState(null);
  
  // Mock design data
  const designs = [
    {
      id: 'design001',
      name: 'Oakwood Heights Main Building',
      project: 'Oakwood Heights Phase 1',
      architect: 'Foster & Partners',
      date: '2023-08-10',
      status: 'Under Review',
      thumbnail: '/mockup-1.jpg',
      aiScore: 87,
      feedback: [],
      metrics: {
        spacialEfficiency: 92,
        energyEfficiency: 85,
        naturalLight: 88,
        accessibility: 90,
        sustainability: 81
      }
    },
    {
      id: 'design002',
      name: 'Riverside Plaza Tower A',
      project: 'Riverside Plaza',
      architect: 'BIG Architecture',
      date: '2023-09-22',
      status: 'Approved',
      thumbnail: '/mockup-2.jpg',
      aiScore: 92,
      feedback: [
        { user: 'Sarah Chen', comment: 'Excellent use of space, particularly in the common areas.', date: '2023-09-24' },
        { user: 'AI Analysis', comment: 'Energy efficiency is 27% better than comparable buildings in the area.', date: '2023-09-23' }
      ],
      metrics: {
        spacialEfficiency: 94,
        energyEfficiency: 96,
        naturalLight: 89,
        accessibility: 93,
        sustainability: 90
      }
    },
    {
      id: 'design003',
      name: 'The Pines Central Plaza',
      project: 'The Pines',
      architect: 'Studio Gang',
      date: '2023-07-05',
      status: 'Revisions Requested',
      thumbnail: '/mockup-3.jpg',
      aiScore: 72,
      feedback: [
        { user: 'Michael Torres', comment: 'Outdoor spaces need better integration with indoor areas.', date: '2023-07-12' },
        { user: 'AI Analysis', comment: 'Natural light scores are 18% below target. Consider redesigning the east facade.', date: '2023-07-06' }
      ],
      metrics: {
        spacialEfficiency: 79,
        energyEfficiency: 74,
        naturalLight: 65,
        accessibility: 82,
        sustainability: 70
      }
    }
  ];

  // Handler for viewing design details
  const handleViewDesign = (design) => {
    setActiveDesign(design);
  };

  // Handler for closing design details
  const handleCloseDesignView = () => {
    setActiveDesign(null);
  };

  // Mock function for adding feedback
  const handleAddFeedback = () => {
    alert('Feedback system would add a comment here');
  };

  // Render design details view
  const renderDesignDetails = () => {
    if (!activeDesign) return null;

    return (
      <div className={styles.designDetailOverlay}>
        <div className={styles.designDetailCard}>
          <button className={styles.closeButton} onClick={handleCloseDesignView}>×</button>
          
          <h2>{activeDesign.name}</h2>
          <p className={styles.designMeta}>
            Project: <strong>{activeDesign.project}</strong> • 
            Architect: <strong>{activeDesign.architect}</strong> • 
            Date: <strong>{new Date(activeDesign.date).toLocaleDateString()}</strong>
          </p>
          
          <div className={styles.designImageContainer}>
            <div className={styles.designImagePlaceholder}>
              [Design Visualization]
              <p>3D Rendering would be displayed here</p>
            </div>
          </div>
          
          <div className={styles.designScoreContainer}>
            <div className={styles.overallScore}>
              <div className={styles.scoreCircle}>
                <span className={styles.scoreNumber}>{activeDesign.aiScore}</span>
              </div>
              <span className={styles.scoreLabel}>AI Rating</span>
            </div>
            
            <div className={styles.metricScores}>
              {Object.entries(activeDesign.metrics).map(([key, value]) => (
                <div key={key} className={styles.metricItem}>
                  <div className={styles.metricHeader}>
                    <span className={styles.metricName}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                    <span className={styles.metricValue}>{value}</span>
                  </div>
                  <div className={styles.metricBar}>
                    <div 
                      className={styles.metricBarFill} 
                      style={{ 
                        width: `${value}%`,
                        backgroundColor: value >= 90 ? '#4CAF50' : value >= 75 ? '#FFCA28' : '#F44336'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.aiInsights}>
            <h3>AI Insights</h3>
            <div className={styles.insightItems}>
              <div className={styles.insightItem}>
                <h4>Strengths</h4>
                <ul>
                  {activeDesign.aiScore >= 80 && (
                    <>
                      <li>Strong overall design coherence</li>
                      <li>Excellent space utilization</li>
                      <li>Good balance of public and private areas</li>
                    </>
                  )}
                  {activeDesign.metrics.energyEfficiency >= 85 && (
                    <li>Superior energy efficiency design</li>
                  )}
                  {activeDesign.metrics.naturalLight >= 85 && (
                    <li>Exceptional natural light integration</li>
                  )}
                  {activeDesign.metrics.accessibility >= 85 && (
                    <li>Highly accessible layout</li>
                  )}
                  {activeDesign.metrics.sustainability >= 85 && (
                    <li>Excellent sustainability features</li>
                  )}
                  {Object.values(activeDesign.metrics).every(v => v < 85) && (
                    <li>Design has potential with improvements</li>
                  )}
                </ul>
              </div>
              
              <div className={styles.insightItem}>
                <h4>Improvement Areas</h4>
                <ul>
                  {activeDesign.metrics.spacialEfficiency < 80 && (
                    <li>Space utilization could be improved</li>
                  )}
                  {activeDesign.metrics.energyEfficiency < 80 && (
                    <li>Energy efficiency needs attention</li>
                  )}
                  {activeDesign.metrics.naturalLight < 80 && (
                    <li>Insufficient natural light in some areas</li>
                  )}
                  {activeDesign.metrics.accessibility < 80 && (
                    <li>Accessibility issues should be addressed</li>
                  )}
                  {activeDesign.metrics.sustainability < 80 && (
                    <li>Sustainability features need enhancement</li>
                  )}
                  {Object.values(activeDesign.metrics).every(v => v >= 80) && (
                    <li>Minor refinements to perfect an already strong design</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          
          <div className={styles.feedbackSection}>
            <h3>Feedback ({activeDesign.feedback.length})</h3>
            {activeDesign.feedback.length > 0 ? (
              <div className={styles.feedbackList}>
                {activeDesign.feedback.map((item, index) => (
                  <div key={index} className={styles.feedbackItem}>
                    <div className={styles.feedbackHeader}>
                      <span className={styles.feedbackUser}>{item.user}</span>
                      <span className={styles.feedbackDate}>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <p className={styles.feedbackComment}>{item.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noFeedback}>No feedback yet.</p>
            )}
            
            <div className={styles.addFeedbackContainer}>
              <textarea 
                className={styles.feedbackInput} 
                placeholder="Add your feedback or comments here..."
                rows={3}
              ></textarea>
              <button className={styles.actionButton} onClick={handleAddFeedback}>Add Feedback</button>
            </div>
          </div>
          
          <div className={styles.actionButtons}>
            <button className={styles.actionButton}>Generate Report</button>
            {activeDesign.status !== 'Approved' && (
              <button className={styles.primaryButton}>Approve Design</button>
            )}
            {activeDesign.status !== 'Revisions Requested' && (
              <button className={styles.warningButton}>Request Revisions</button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          <span className={styles.gradient}>Design Review</span>
        </h1>
        
        <div className={styles.designsActionBar}>
          <button className={styles.button}>+ Upload New Design</button>
          <div className={styles.designsFilter}>
            <select className={styles.selectFilter}>
              <option value="all">All Designs</option>
              <option value="review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="revisions">Revisions Requested</option>
            </select>
          </div>
        </div>
        
        <div className={styles.designsGrid}>
          {designs.map(design => (
            <div key={design.id} className={styles.designCard} onClick={() => handleViewDesign(design)}>
              <div 
                className={styles.designThumbnail}
                // We'll use placeholder backgrounds instead of images for this example
                style={{
                  backgroundColor: design.id === 'design001' ? '#3949AB' : 
                                  design.id === 'design002' ? '#00897B' : '#C62828',
                }}
              >
                <span className={styles.thumbnailText}>{design.name}</span>
              </div>
              
              <div className={styles.designInfo}>
                <h2>{design.name}</h2>
                <p className={styles.designProject}>{design.project}</p>
                
                <div className={styles.designMeta}>
                  <span>{design.architect}</span>
                  <span>{new Date(design.date).toLocaleDateString()}</span>
                </div>
                
                <div className={styles.designStatus}>
                  <span 
                    className={`${styles.statusBadge} ${
                      design.status === 'Approved' ? styles.statusApproved :
                      design.status === 'Revisions Requested' ? styles.statusRevisions :
                      styles.statusReview
                    }`}
                  >
                    {design.status}
                  </span>
                  
                  <div className={styles.aiRating}>
                    <span className={styles.ratingNumber}>{design.aiScore}</span>
                    <span className={styles.ratingLabel}>AI Rating</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {renderDesignDetails()}
      </main>
    </div>
  );
} 