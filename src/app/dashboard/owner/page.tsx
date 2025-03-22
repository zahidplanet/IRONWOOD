'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import KPICard from '@/components/common/KPICard'
import LineChartComponent from '@/components/common/LineChartComponent'

// Mock data - replace with API calls in production
const kpiData = [
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

const revenueData = [
  { name: 'Jan', revenue: 65000, expenses: 42000, profit: 23000 },
  { name: 'Feb', revenue: 59000, expenses: 39000, profit: 20000 },
  { name: 'Mar', revenue: 80000, expenses: 48000, profit: 32000 },
  { name: 'Apr', revenue: 81000, expenses: 47000, profit: 34000 },
  { name: 'May', revenue: 76000, expenses: 44000, profit: 32000 },
  { name: 'Jun', revenue: 84000, expenses: 49000, profit: 35000 },
  { name: 'Jul', revenue: 92000, expenses: 51000, profit: 41000 }
]

const revenueChartKeys = [
  { key: 'revenue', color: '#0a84ff', name: 'Revenue' },
  { key: 'expenses', color: '#ff375f', name: 'Expenses' },
  { key: 'profit', color: '#30d158', name: 'Profit' }
]

export default function OwnerDashboard() {
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
          {kpiData.map((kpi, index) => (
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
            data={revenueData}
            dataKeys={revenueChartKeys}
          />
          
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Key Projects</h3>
            </div>
            
            <div className="space-y-4">
              {['New Wing Construction', 'EHR System Upgrade', 'Staff Training Program'].map((project, index) => (
                <div key={index} className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-primary mr-3"></div>
                  <span>{project}</span>
                  <div className="ml-auto text-sm text-gray-400">In Progress</div>
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
                {['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown'].map((name, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-3">{name}</td>
                    <td className="p-3">{Math.floor(Math.random() * 100 + 150)}</td>
                    <td className="p-3">${Math.floor(Math.random() * 50000 + 100000)}</td>
                    <td className="p-3">{(Math.random() * 2 + 3).toFixed(1)}/5</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-accent-green/20 text-accent-green">Active</span>
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