'use client'

import { motion } from 'framer-motion'

type PatientCardProps = {
  name: string
  age: number
  id: string
  lastVisit: string
  nextAppointment?: string
  status: 'Active' | 'Inactive' | 'Pending'
  onClick?: () => void
}

export default function PatientCard({
  name,
  age,
  id,
  lastVisit,
  nextAppointment,
  status,
  onClick
}: PatientCardProps) {
  const statusColors = {
    Active: 'bg-accent-green text-accent-green',
    Inactive: 'bg-secondary text-secondary',
    Pending: 'bg-accent-yellow text-accent-yellow'
  }

  return (
    <motion.div
      className="dashboard-card cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-lg">{name}</h3>
        <div className={`px-2 py-1 rounded-full text-xs ${statusColors[status]} bg-opacity-20`}>
          {status}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Patient ID</span>
          <span>{id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Age</span>
          <span>{age}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Last Visit</span>
          <span>{lastVisit}</span>
        </div>
        {nextAppointment && (
          <div className="flex justify-between">
            <span className="text-gray-400">Next Appointment</span>
            <span className="text-accent-teal">{nextAppointment}</span>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
        <motion.div
          className="h-2 w-2 rounded-full bg-primary"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: status === 'Active' ? [0.5, 1, 0.5] : 0.3
          }}
          transition={{ 
            repeat: status === 'Active' ? Infinity : 0,
            duration: 2
          }}
        />
      </div>
    </motion.div>
  )
} 