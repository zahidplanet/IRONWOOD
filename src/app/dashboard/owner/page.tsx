'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import KPICard from '@/components/common/KPICard'
import LineChartComponent from '@/components/common/LineChartComponent'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/lib/localStorage'

// Default mock data
const defaultKpiData = [
  {
    title: 'Total Revenue',
    value: '$984,254',
    change: { value: 12.8, isPositive: true }
  },
  {
    title: 'Patient Count',
    value: '3,241',
    change: { value: 8.3, isPositive: true }
  },
  {
    title: 'Staff Utilization',
    value: '87%',
    change: { value: 2.4, isPositive: true }
  },
  {
    title: 'Average Cost',
    value: '$328',
    change: { value: 1.2, isPositive: false }
  }
]

const defaultRevenueData = [
  { name: 'Jan', revenue: 65000, expenses: 42000, profit: 23000 },
  { name: 'Feb', revenue: 59000, expenses: 39000, profit: 20000 },
  { name: 'Mar', revenue: 80000, expenses: 48000, profit: 32000 },
  { name: 'Apr', revenue: 81000, expenses: 47000, profit: 34000 },
  { name: 'May', revenue: 76000, expenses: 44000, profit: 32000 },
  { name: 'Jun', revenue: 84000, expenses: 49000, profit: 35000 },
  { name: 'Jul', revenue: 92000, expenses: 51000, profit: 41000 }
]

const defaultProjects = [
  { name: 'New Wing Construction', status: 'In Progress' },
  { name: 'EHR System Upgrade', status: 'In Progress' },
  { name: 'Staff Training Program', status: 'In Progress' }
]

const defaultPhysicians = [
  { name: 'Dr. Smith', patients: 242, revenue: 142500, satisfaction: 4.8, status: 'Active' },
  { name: 'Dr. Johnson', patients: 187, revenue: 124800, satisfaction: 4.5, status: 'Active' },
  { name: 'Dr. Williams', patients: 203, revenue: 138900, satisfaction: 4.3, status: 'Active' },
  { name: 'Dr. Brown', patients: 165, revenue: 112000, satisfaction: 4.7, status: 'Active' }
]

const revenueChartKeys = [
  { key: 'revenue', color: '#0a84ff', name: 'Revenue' },
  { key: 'expenses', color: '#ff375f', name: 'Expenses' },
  { key: 'profit', color: '#30d158', name: 'Profit' }
]

// Type definition for our dashboard data
type OwnerDashboardData = {
  kpiData: typeof defaultKpiData;
  revenueData: typeof defaultRevenueData;
  projects: typeof defaultProjects;
  physicians: typeof defaultPhysicians;
}

export default function OwnerDashboard() {
  // Use the localStorage hook with our default data
  const [dashboardData, setDashboardData] = useLocalStorage<OwnerDashboardData>(
    STORAGE_KEYS.OWNER_DASHBOARD_DATA,
    {
      kpiData: defaultKpiData,
      revenueData: defaultRevenueData,
      projects: defaultProjects,
      physicians: defaultPhysicians
    }
  );

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Owner Dashboard</h1>
            <p className="text-gray-400">Comprehensive facility overview</p>
          </div>
          
          <Link href="/" className="px-4 py-2 glassmorphism rounded-full text-sm hover:bg-primary/10 transition-colors">
            Back to Home
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardData.kpiData.map((kpi, index) => (
            <KPICard 
              key={index}
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LineChartComponent 
            title="Revenue Overview"
            data={dashboardData.revenueData}
            dataKeys={revenueChartKeys}
          />
          
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Key Projects</h3>
            </div>
            
            <div className="space-y-4">
              {dashboardData.projects.map((project, index) => (
                <div key={index} className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-primary mr-3"></div>
                  <span>{project.name}</span>
                  <div className="ml-auto text-sm text-gray-400">{project.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Physician Performance</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-3">Physician</th>
                  <th className="text-left p-3">Patients</th>
                  <th className="text-left p-3">Revenue</th>
                  <th className="text-left p-3">Satisfaction</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.physicians.map((physician, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-3">{physician.name}</td>
                    <td className="p-3">{physician.patients}</td>
                    <td className="p-3">${physician.revenue.toLocaleString()}</td>
                    <td className="p-3">{physician.satisfaction}/5</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-accent-green/20 text-accent-green">{physician.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
} 