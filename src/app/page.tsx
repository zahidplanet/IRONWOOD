'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  const [activeView, setActiveView] = useState<string>('owner')

  return (
    <main className="min-h-screen p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-gradient">IRONWOOD</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard 
            title="Owner Dashboard"
            description="View aggregated data across the entire facility"
            href="/dashboard/owner"
            isActive={activeView === 'owner'}
            onClick={() => setActiveView('owner')}
          />
          
          <DashboardCard 
            title="Physician Dashboard"
            description="Access personalized metrics and patient data"
            href="/dashboard/physician" 
            isActive={activeView === 'physician'}
            onClick={() => setActiveView('physician')}
          />
          
          <DashboardCard 
            title="Patient Portal"
            description="Coming Soon - Patient health data access"
            href="/dashboard/patient"
            isActive={activeView === 'patient'}
            onClick={() => setActiveView('patient')}
          />
        </div>
      </motion.div>
    </main>
  )
}

type DashboardCardProps = {
  title: string
  description: string
  href: string
  isActive: boolean
  onClick: () => void
}

function DashboardCard({ title, description, href, isActive, onClick }: DashboardCardProps) {
  return (
    <Link href={href} passHref>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className={`dashboard-card cursor-pointer ${isActive ? 'ring-2 ring-primary' : ''}`}
        onClick={onClick}
      >
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-400">{description}</p>
        <div className="mt-4 flex justify-end">
          <motion.div 
            className="h-2 w-2 rounded-full bg-primary"
            animate={{ 
              scale: isActive ? [1, 1.5, 1] : 1,
              opacity: isActive ? 1 : 0.3
            }}
            transition={{ 
              repeat: isActive ? Infinity : 0,
              duration: 2
            }}
          />
        </div>
      </motion.div>
    </Link>
  )
} 