'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function PatientPortal() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Patient Portal</h1>
            <p className="text-gray-400">Personal health management platform</p>
          </div>
          
          <Link href="/" className="px-4 py-2 glassmorphism rounded-full text-sm hover:bg-primary/10 transition-colors">
            Back to Home
          </Link>
        </div>
        
        <motion.div 
          className="dashboard-card text-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-block mb-8 p-6 rounded-full bg-background-glass"
            animate={{ 
              scale: [1, 1.1, 1],
              borderColor: ['rgba(10, 132, 255, 0.3)', 'rgba(10, 132, 255, 0.6)', 'rgba(10, 132, 255, 0.3)']
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
            style={{
              border: '2px solid rgba(10, 132, 255, 0.3)'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          
          <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
          <p className="text-xl text-gray-400 max-w-xl mx-auto">
            The patient portal is currently under development. Soon, you'll be able to access your personal health records, schedule appointments, and communicate with your healthcare providers.
          </p>
          
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {['Personal Health Records', 'Appointment Scheduling', 'Secure Messaging', 'Prescription Refills'].map((feature, index) => (
              <div key={index} className="px-4 py-3 glassmorphism rounded-lg text-gray-400 flex items-center">
                <div className="h-2 w-2 rounded-full bg-accent-purple mr-3"></div>
                {feature}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  )
} 