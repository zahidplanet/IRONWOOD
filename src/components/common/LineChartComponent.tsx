'use client'

import { useState } from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts'
import { motion } from 'framer-motion'

type ChartData = {
  name: string
  [key: string]: string | number
}

type DataKey = {
  key: string
  color: string
  name: string
}

type LineChartProps = {
  title: string
  data: ChartData[]
  dataKeys: DataKey[]
  timeRanges?: string[]
}

export default function LineChartComponent({ 
  title, 
  data, 
  dataKeys,
  timeRanges = ['7D', '30D', '90D', 'ALL'] 
}: LineChartProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRanges[0])
  
  // This would filter the data based on the time range in a real app
  const filteredData = data

  return (
    <motion.div 
      className="dashboard-card h-96"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="card-header">
        <h3>{title}</h3>
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              className={`text-xs px-3 py-1 rounded-full ${
                selectedTimeRange === range 
                  ? 'bg-primary text-white' 
                  : 'bg-background-glass text-gray-400'
              }`}
              onClick={() => setSelectedTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[calc(100%-40px)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.5)' }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.5)' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(18,18,18,0.9)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)'
              }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
            />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '10px',
                color: 'rgba(255,255,255,0.7)'
              }}
            />
            {dataKeys.map((dataKey) => (
              <Line
                key={dataKey.key}
                type="monotone"
                dataKey={dataKey.key}
                stroke={dataKey.color}
                name={dataKey.name}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
} 