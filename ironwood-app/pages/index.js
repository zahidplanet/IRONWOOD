import React, { useState } from 'react';
import Head from 'next/head';
import Navigation from '../components/Navigation';
import { 
  GlassCard,
  GlassButton,
  MetricDisplay,
  PageHeader,
  SearchBar,
  DataTable,
  TabNavigation,
  ToggleSwitch
} from '../components/ui';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(false);
  
  // Sample data for metrics
  const metrics = [
    { title: 'Total Projects', value: '24', change: 12, trend: 'up' },
    { title: 'Active Tasks', value: '38', change: -5, trend: 'down' },
    { title: 'Completion Rate', value: '87', suffix: '%', change: 3, trend: 'up' },
    { title: 'Resources Used', value: '64', suffix: '%', change: 0, trend: 'neutral' }
  ];
  
  // Sample tabs for the tab navigation
  const tabs = [
    { id: 'all', label: 'All Projects', count: 24 },
    { id: 'active', label: 'Active', count: 16 },
    { id: 'completed', label: 'Completed', count: 8 },
    { id: 'archived', label: 'Archived', count: 3 }
  ];
  
  // Sample columns for the data table
  const columns = [
    { header: 'Project Name', accessor: 'name' },
    { header: 'Status', accessor: 'status', 
      cell: (row) => (
        <span 
          className={`px-2 py-1 rounded-full text-xs ${
            row.status === 'Active' ? 'bg-soft-mint bg-opacity-20 text-soft-mint' :
            row.status === 'Completed' ? 'bg-electric-coral bg-opacity-20 text-electric-coral' :
            'bg-cosmic-ink text-stellar-gray'
          }`}
        >
          {row.status}
        </span>
      )
    },
    { header: 'Progress', accessor: 'progress',
      cell: (row) => (
        <div className="w-full bg-cosmic-ink rounded-full h-2">
          <div 
            className="bg-soft-mint h-2 rounded-full" 
            style={{ width: `${row.progress}%` }}
          ></div>
        </div>
      )
    },
    { header: 'Last Updated', accessor: 'lastUpdated' },
    { header: 'Actions', accessor: 'actions',
      cell: () => (
        <div className="flex space-x-2">
          <GlassButton variant="outline" size="small">View</GlassButton>
          <GlassButton variant="danger" size="small">Delete</GlassButton>
        </div>
      )
    }
  ];
  
  // Sample data for the data table
  const projectData = [
    { id: 1, name: 'Medical Imaging Analysis', status: 'Active', progress: 75, lastUpdated: '2 hours ago' },
    { id: 2, name: 'Patient Record System', status: 'Completed', progress: 100, lastUpdated: '1 day ago' },
    { id: 3, name: 'Prescription Management', status: 'Active', progress: 35, lastUpdated: '4 hours ago' },
    { id: 4, name: 'Health Analytics Dashboard', status: 'Active', progress: 60, lastUpdated: '30 minutes ago' },
    { id: 5, name: 'Telehealth Integration', status: 'Pending', progress: 10, lastUpdated: '1 week ago' }
  ];
  
  return (
    <div className="min-h-screen bg-space-black text-clinical-white">
      <Head>
        <title>IRONWOOD | Dashboard</title>
        <meta name="description" content="IRONWOOD Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />
      
      <main className="container mx-auto pt-24 px-6 pb-12">
        <PageHeader 
          title="Project Dashboard" 
          subtitle="Track your medical research projects"
          actions={
            <div className="flex items-center">
              <ToggleSwitch 
                id="auto-refresh"
                isOn={autoRefresh}
                handleToggle={() => setAutoRefresh(!autoRefresh)}
                label="Auto Refresh"
                className="mr-4"
              />
              <GlassButton 
                variant="primary"
                onClick={() => console.log('Refresh clicked')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Refresh
              </GlassButton>
            </div>
          }
        />
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <GlassCard key={index} className="p-4">
              <MetricDisplay
                title={metric.title}
                value={metric.value}
                suffix={metric.suffix}
                change={metric.change}
                trend={metric.trend}
              />
            </GlassCard>
          ))}
        </div>
        
        {/* Projects Section */}
        <GlassCard className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-h2 font-semibold">Projects</h2>
            <div className="w-64">
              <SearchBar 
                placeholder="Search projects..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <TabNavigation 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="mb-6"
          />
          
          <DataTable 
            columns={columns}
            data={projectData}
          />
        </GlassCard>
      </main>
    </div>
  );
}