import React, { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Projects() {
  const [activeProject, setActiveProject] = useState(null);
  
  // Mock project data
  const projects = [
    {
      id: 'proj001',
      name: 'Oakwood Heights Phase 1',
      location: 'Austin, TX',
      budget: 8500000,
      spent: 3200000,
      startDate: '2023-04-15',
      targetCompletionDate: '2024-06-30',
      status: 'In Progress',
      completion: 38,
      tasks: [
        { name: 'Land Acquisition', status: 'Completed', completion: 100 },
        { name: 'Permits & Approvals', status: 'Completed', completion: 100 },
        { name: 'Foundation Work', status: 'Completed', completion: 100 },
        { name: 'Structural Framing', status: 'In Progress', completion: 65 },
        { name: 'Plumbing & Electrical', status: 'In Progress', completion: 40 },
        { name: 'Interior Finishing', status: 'Not Started', completion: 0 },
        { name: 'Landscaping', status: 'Not Started', completion: 0 }
      ],
      risks: [
        { name: 'Supply Chain Delays', severity: 'Medium', mitigation: 'Pre-ordered critical materials' },
        { name: 'Weather Delays', severity: 'Low', mitigation: 'Built 2-week buffer into timeline' }
      ]
    },
    {
      id: 'proj002',
      name: 'Riverside Plaza',
      location: 'Portland, OR',
      budget: 6800000,
      spent: 750000,
      startDate: '2023-09-01',
      targetCompletionDate: '2024-11-15',
      status: 'Planning',
      completion: 11,
      tasks: [
        { name: 'Land Acquisition', status: 'Completed', completion: 100 },
        { name: 'Permits & Approvals', status: 'In Progress', completion: 60 },
        { name: 'Architectural Design', status: 'In Progress', completion: 85 },
        { name: 'Contractor Selection', status: 'In Progress', completion: 40 },
        { name: 'Site Preparation', status: 'Not Started', completion: 0 },
        { name: 'Construction', status: 'Not Started', completion: 0 }
      ],
      risks: [
        { name: 'Zoning Challenges', severity: 'High', mitigation: 'Working with legal team on variances' },
        { name: 'Budget Overrun', severity: 'Medium', mitigation: 'Building in 15% contingency' }
      ]
    }
  ];

  // Handler for viewing project details
  const handleViewProject = (project) => {
    setActiveProject(project);
  };

  // Handler for closing project details
  const handleCloseProjectView = () => {
    setActiveProject(null);
  };

  // Render project details view
  const renderProjectDetails = () => {
    if (!activeProject) return null;

    return (
      <div className={styles.projectDetailOverlay}>
        <div className={styles.projectDetailCard}>
          <button className={styles.closeButton} onClick={handleCloseProjectView}>×</button>
          
          <h2>{activeProject.name}</h2>
          <div className={styles.projectMeta}>
            <p><strong>Location:</strong> {activeProject.location}</p>
            <p><strong>Status:</strong> <span className={styles.statusBadge}>{activeProject.status}</span></p>
            <p><strong>Budget:</strong> ${activeProject.budget.toLocaleString()}</p>
            <p><strong>Spent:</strong> ${activeProject.spent.toLocaleString()} ({Math.round((activeProject.spent / activeProject.budget) * 100)}%)</p>
            <p><strong>Timeline:</strong> {new Date(activeProject.startDate).toLocaleDateString()} to {new Date(activeProject.targetCompletionDate).toLocaleDateString()}</p>
            
            <div className={styles.progressContainer}>
              <p><strong>Overall Completion:</strong> {activeProject.completion}%</p>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${activeProject.completion}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <h3>Tasks</h3>
          <div className={styles.tasksList}>
            {activeProject.tasks.map((task, index) => (
              <div key={index} className={styles.taskItem}>
                <div className={styles.taskHeader}>
                  <span>{task.name}</span>
                  <span className={styles.taskStatus}>{task.status}</span>
                </div>
                <div className={styles.taskProgress}>
                  <div 
                    className={styles.taskProgressFill} 
                    style={{ width: `${task.completion}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <h3>Risk Assessment</h3>
          <div className={styles.risksList}>
            {activeProject.risks.map((risk, index) => (
              <div key={index} className={styles.riskItem}>
                <div className={styles.riskHeader}>
                  <span>{risk.name}</span>
                  <span className={`${styles.riskSeverity} ${styles[`risk${risk.severity}`]}`}>
                    {risk.severity}
                  </span>
                </div>
                <p className={styles.mitigationPlan}>
                  <strong>Mitigation:</strong> {risk.mitigation}
                </p>
              </div>
            ))}
          </div>
          
          <div className={styles.actionButtons}>
            <button className={styles.actionButton}>Update Progress</button>
            <button className={styles.actionButton}>Add Task</button>
            <button className={styles.actionButton}>Generate Report</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          <span className={styles.gradient}>Project Management</span>
        </h1>
        
        <div className={styles.projectsActionBar}>
          <button className={styles.button}>+ New Project</button>
          <div className={styles.projectsFilter}>
            <select className={styles.selectFilter}>
              <option value="all">All Projects</option>
              <option value="inProgress">In Progress</option>
              <option value="planning">Planning</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        
        <div className={styles.projectsGrid}>
          {projects.map(project => (
            <div key={project.id} className={styles.projectCard} onClick={() => handleViewProject(project)}>
              <h2>{project.name}</h2>
              <p className={styles.projectLocation}>{project.location}</p>
              
              <div className={styles.projectStats}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Budget</span>
                  <span className={styles.statValue}>${project.budget.toLocaleString()}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Status</span>
                  <span className={styles.statValue}>{project.status}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Completion</span>
                  <span className={styles.statValue}>{project.completion}%</span>
                </div>
              </div>
              
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${project.completion}%` }}
                ></div>
              </div>
              
              <div className={styles.projectCardFooter}>
                <span>Target: {new Date(project.targetCompletionDate).toLocaleDateString()}</span>
                <button className={styles.viewButton}>View Details</button>
              </div>
            </div>
          ))}
        </div>
        
        {renderProjectDetails()}
      </main>
    </div>
  );
} 