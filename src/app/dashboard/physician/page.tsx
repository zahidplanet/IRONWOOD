'use client'

import Link from 'next/link'
import KPICard from '@/components/common/KPICard'
import LineChartComponent from '@/components/common/LineChartComponent'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { STORAGE_KEYS } from '@/lib/localStorage'

// Default mock data
const defaultPhysicianData = {
  name: 'Dr. Sarah Johnson',
  specialty: 'Cardiology',
  stats: [
    {
      title: 'Monthly Revenue',
      value: '$57,328',
      change: { value: 9.4, isPositive: true }
    },
    {
      title: 'Patient Count',
      value: '124',
      change: { value: 12.7, isPositive: true }
    },
    {
      title: 'Procedure Success',
      value: '98.7%',
      change: { value: 1.2, isPositive: true }
    },
    {
      title: 'Avg. Wait Time',
      value: '8 min',
      change: { value: 2.8, isPositive: false }
    }
  ]
}

const defaultPatientData = [
  { name: 'Week 1', new: 28, returning: 42 },
  { name: 'Week 2', new: 32, returning: 38 },
  { name: 'Week 3', new: 25, returning: 45 },
  { name: 'Week 4', new: 30, returning: 52 }
]

const defaultAppointments = [
  { patient: 'Alex Morgan', time: '9:30 AM', type: 'Follow-up' },
  { patient: 'Jamie Lee', time: '11:00 AM', type: 'Initial Consultation' },
  { patient: 'Casey Kim', time: '1:15 PM', type: 'Procedure' },
  { patient: 'Taylor Reese', time: '3:45 PM', type: 'Follow-up' }
]

const defaultPatientNotes = [
  { patient: 'Morgan, Alex', date: '2023-07-10', note: 'Post-operative care plan discussed. Patient responding well to treatment.' },
  { patient: 'Lee, Jamie', date: '2023-07-08', note: 'Diagnosed with mild hypertension. Prescribed medication and lifestyle changes.' },
  { patient: 'Kim, Casey', date: '2023-07-05', note: 'Pre-procedure assessment completed. Scheduled for intervention next week.' }
]

const patientChartKeys = [
  { key: 'new', color: '#bf5af2', name: 'New Patients' },
  { key: 'returning', color: '#64d2ff', name: 'Returning Patients' }
]

// Type definition for our physician dashboard data
type PhysicianDashboardData = {
  physicianData: typeof defaultPhysicianData;
  patientData: typeof defaultPatientData;
  appointments: typeof defaultAppointments;
  patientNotes: typeof defaultPatientNotes;
}

export default function PhysicianDashboard() {
  // Use the localStorage hook with our default data
  const [dashboardData, setDashboardData] = useLocalStorage<PhysicianDashboardData>(
    STORAGE_KEYS.PHYSICIAN_DASHBOARD_DATA,
    {
      physicianData: defaultPhysicianData,
      patientData: defaultPatientData,
      appointments: defaultAppointments,
      patientNotes: defaultPatientNotes
    }
  );

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Physician Dashboard</h1>
            <p className="text-gray-400">Welcome back, {dashboardData.physicianData.name} ({dashboardData.physicianData.specialty})</p>
          </div>
          
          <Link href="/" className="px-4 py-2 glassmorphism rounded-full text-sm hover:bg-primary/10 transition-colors">
            Back to Home
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardData.physicianData.stats.map((stat, index) => (
            <KPICard 
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              variant={index === 2 ? 'success' : index === 3 ? 'warning' : 'default'}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LineChartComponent 
            title="Patient Flow"
            data={dashboardData.patientData}
            dataKeys={patientChartKeys}
            timeRanges={['4W', '12W', '26W', '52W']}
          />
          
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Upcoming Appointments</h3>
            </div>
            
            <div className="space-y-4">
              {dashboardData.appointments.map((appointment, index) => (
                <div key={index} className="flex items-center p-2 hover:bg-white/5 rounded-lg">
                  <div className="h-2 w-2 rounded-full bg-accent-purple mr-3"></div>
                  <div>
                    <div className="font-medium">{appointment.patient}</div>
                    <div className="text-sm text-gray-400">{appointment.type}</div>
                  </div>
                  <div className="ml-auto text-accent-teal">{appointment.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Patient Notes</h3>
          </div>
          
          <div className="space-y-4">
            {dashboardData.patientNotes.map((record, index) => (
              <div key={index} className="p-3 bg-background-glass rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{record.patient}</span>
                  <span className="text-sm text-gray-400">{record.date}</span>
                </div>
                <p className="text-sm">{record.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
} 