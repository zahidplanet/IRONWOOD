'use client'

import { motion } from 'framer-motion'

type KPICardProps = {
  title: string
  value: string | number
  change?: {
    value: number
    isPositive: boolean
  }
  icon?: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

export default function KPICard({ 
  title, 
  value, 
  change, 
  icon,
  variant = 'default' 
}: KPICardProps) {
  const variantStyles = {
    default: 'from-primary/20 to-primary/5',
    success: 'from-accent-green/20 to-accent-green/5',
    warning: 'from-accent-yellow/20 to-accent-yellow/5',
    danger: 'from-secondary/20 to-secondary/5'
  }

  const indicatorColor = {
    default: 'bg-primary',
    success: 'bg-accent-green',
    warning: 'bg-accent-yellow',
    danger: 'bg-secondary'
  }

  return (
    <motion.div 
      className={`dashboard-card bg-gradient-to-br ${variantStyles[variant]}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-sm ${change.isPositive ? 'text-accent-green' : 'text-secondary'}`}>
                {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}%
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-2 rounded-full bg-background-glass">
            {icon}
          </div>
        )}
      </div>
      
      <div className="mt-4 h-1 w-full bg-background-glass rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${indicatorColor[variant]} rounded-full`}
          initial={{ width: '0%' }}
          animate={{ width: '70%' }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
    </motion.div>
  )
} 