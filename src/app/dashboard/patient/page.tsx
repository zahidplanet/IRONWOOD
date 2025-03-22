'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import PatientCard from '@/components/patient/PatientCard'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/lib/localStorage'

// Default mock data for demo
const defaultPatientData = {
  profile: {
    name: 'John Smith',
    age: 42,
    id: 'P-10042',
    lastVisit: '2023-07-15',
    nextAppointment: '2023-08-10',
    status: 'Active' as const
  },
  upcomingAppointments: [
    { date: '2023-08-10', time: '10:30 AM', doctor: 'Dr. Williams', type: 'Follow-up' },
    { date: '2023-09-05', time: '2:15 PM', doctor: 'Dr. Johnson', type: 'Annual Check-up' }
  ],
  recentPrescriptions: [
    { medication: 'Amoxicillin', dosage: '500mg', frequency: 'Twice daily', refillDate: '2023-08-01' },
    { medication: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', refillDate: '2023-08-15' }
  ]
}

// Type definition for patient data
type PatientData = typeof defaultPatientData

export default function PatientPortal() {
  // Use localStorage for data persistence
  const [patientData, setPatientData] = useLocalStorage<PatientData>(
    STORAGE_KEYS.USER_PREFERENCES,
    defaultPatientData
  );
  
  const [showDemo, setShowDemo] = useState(false);

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
        
        {!showDemo ? (
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
            
            <div className="mt-8">
              <button 
                onClick={() => setShowDemo(true)}
                className="px-6 py-3 bg-primary rounded-full text-white hover:bg-primary-dark transition-colors"
              >
                View Demo
              </button>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              {['Personal Health Records', 'Appointment Scheduling', 'Secure Messaging', 'Prescription Refills'].map((feature, index) => (
                <div key={index} className="px-4 py-3 glassmorphism rounded-lg text-gray-400 flex items-center">
                  <div className="h-2 w-2 rounded-full bg-accent-purple mr-3"></div>
                  {feature}
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <PatientCard 
                name={patientData.profile.name}
                age={patientData.profile.age}
                id={patientData.profile.id}
                lastVisit={patientData.profile.lastVisit}
                nextAppointment={patientData.profile.nextAppointment}
                status={patientData.profile.status}
              />
            </div>
            
            <div className="md:col-span-2">
              <div className="dashboard-card mb-6">
                <div className="card-header">
                  <h3>Upcoming Appointments</h3>
                </div>
                <div className="space-y-4">
                  {patientData.upcomingAppointments.map((appointment, index) => (
                    <div key={index} className="p-3 bg-background-glass rounded-lg flex justify-between items-center">
                      <div>
                        <div className="font-medium">{appointment.date}, {appointment.time}</div>
                        <div className="text-sm text-gray-400">{appointment.type} with {appointment.doctor}</div>
                      </div>
                      <button className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                        Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="dashboard-card">
                <div className="card-header">
                  <h3>Prescriptions</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-3">Medication</th>
                        <th className="text-left p-3">Dosage</th>
                        <th className="text-left p-3">Frequency</th>
                        <th className="text-left p-3">Refill Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patientData.recentPrescriptions.map((prescription, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                          <td className="p-3">{prescription.medication}</td>
                          <td className="p-3">{prescription.dosage}</td>
                          <td className="p-3">{prescription.frequency}</td>
                          <td className="p-3">{prescription.refillDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
} 