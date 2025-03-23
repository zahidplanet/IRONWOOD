/**
 * Mock data utilities for the IRONWOOD dashboard
 * This provides sample data for development and demos
 */

import { addDays, format, subDays, subHours, subMinutes } from 'date-fns';

// -------------------- Types --------------------

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodType: string;
  appointmentStatus: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  lastVisit: string;
  nextAppointment?: string;
  status: 'Active' | 'Inactive' | 'Pending';
  vitalSigns?: {
    temperature: number;
    heartRate: number;
    bloodPressure: string;
    respiratoryRate: number;
    oxygenSaturation: number;
    lastUpdated: string;
  };
};

export type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  doctor: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
};

export type Prescription = {
  id: string;
  patientId: string;
  patientName: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  refillDate?: string;
  prescribedBy: string;
};

export type Device = {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'maintenance';
  location: string;
  lastMaintenance: string;
  nextMaintenance: string;
  readings: Array<{
    timestamp: string;
    value: number;
    unit: string;
  }>;
};

export type RoomStatus = {
  id: string;
  name: string;
  type: string;
  occupied: boolean;
  patient?: string;
  lastCleaned: string;
  temperature: number;
  humidity: number;
  status: 'available' | 'occupied' | 'cleaning' | 'maintenance';
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'on-duty' | 'off-duty' | 'on-leave';
  schedule?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
};

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  minQuantity: number;
  lastRestocked: string;
  expirationDate?: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
};

export type Alert = {
  id: string;
  type: 'info' | 'warning' | 'critical';
  message: string;
  source: string;
  timestamp: string;
  acknowledged: boolean;
  details?: string;
};

// -------------------- Mock Data --------------------

// Generate dates relative to now
const today = new Date();
const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
const formatDateTime = (date: Date) => format(date, 'yyyy-MM-dd HH:mm:ss');

// Mock Patients
export const mockPatients: Patient[] = [
  {
    id: 'P-10042',
    name: 'John Smith',
    age: 42,
    gender: 'male',
    bloodType: 'O+',
    appointmentStatus: 'scheduled',
    lastVisit: formatDate(subDays(today, 45)),
    nextAppointment: formatDate(addDays(today, 15)),
    status: 'Active',
    vitalSigns: {
      temperature: 98.6,
      heartRate: 72,
      bloodPressure: '120/80',
      respiratoryRate: 16,
      oxygenSaturation: 98,
      lastUpdated: formatDateTime(subHours(today, 6))
    }
  },
  {
    id: 'P-10043',
    name: 'Sarah Johnson',
    age: 35,
    gender: 'female',
    bloodType: 'A-',
    appointmentStatus: 'completed',
    lastVisit: formatDate(subDays(today, 7)),
    nextAppointment: formatDate(addDays(today, 60)),
    status: 'Active',
    vitalSigns: {
      temperature: 98.2,
      heartRate: 68,
      bloodPressure: '118/75',
      respiratoryRate: 14,
      oxygenSaturation: 99,
      lastUpdated: formatDateTime(subHours(today, 24))
    }
  },
  {
    id: 'P-10044',
    name: 'Michael Brown',
    age: 58,
    gender: 'male',
    bloodType: 'B+',
    appointmentStatus: 'no-show',
    lastVisit: formatDate(subDays(today, 90)),
    status: 'Inactive'
  },
  {
    id: 'P-10045',
    name: 'Emily Davis',
    age: 27,
    gender: 'female',
    bloodType: 'AB+',
    appointmentStatus: 'scheduled',
    lastVisit: formatDate(subDays(today, 180)),
    nextAppointment: formatDate(addDays(today, 3)),
    status: 'Active',
    vitalSigns: {
      temperature: 99.1,
      heartRate: 76,
      bloodPressure: '125/82',
      respiratoryRate: 18,
      oxygenSaturation: 97,
      lastUpdated: formatDateTime(subDays(today, 180))
    }
  },
  {
    id: 'P-10046',
    name: 'Robert Wilson',
    age: 62,
    gender: 'male',
    bloodType: 'A+',
    appointmentStatus: 'cancelled',
    lastVisit: formatDate(subDays(today, 30)),
    status: 'Pending'
  }
];

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: 'A-20010',
    patientId: 'P-10042',
    patientName: 'John Smith',
    date: formatDate(addDays(today, 15)),
    time: '10:30 AM',
    type: 'Follow-up',
    doctor: 'Dr. Williams',
    status: 'scheduled'
  },
  {
    id: 'A-20011',
    patientId: 'P-10042',
    patientName: 'John Smith',
    date: formatDate(subDays(today, 45)),
    time: '2:15 PM',
    type: 'Initial Consultation',
    doctor: 'Dr. Williams',
    status: 'completed',
    notes: 'Patient reported mild symptoms, prescribed medication and follow-up in 6 weeks.'
  },
  {
    id: 'A-20012',
    patientId: 'P-10043',
    patientName: 'Sarah Johnson',
    date: formatDate(subDays(today, 7)),
    time: '9:00 AM',
    type: 'Annual Check-up',
    doctor: 'Dr. Johnson',
    status: 'completed',
    notes: 'All tests normal, recommended lifestyle changes to improve cardiovascular health.'
  },
  {
    id: 'A-20013',
    patientId: 'P-10043',
    patientName: 'Sarah Johnson',
    date: formatDate(addDays(today, 60)),
    time: '11:45 AM',
    type: 'Follow-up',
    doctor: 'Dr. Johnson',
    status: 'scheduled'
  },
  {
    id: 'A-20014',
    patientId: 'P-10044',
    patientName: 'Michael Brown',
    date: formatDate(subDays(today, 14)),
    time: '3:30 PM',
    type: 'Urgent Care',
    doctor: 'Dr. Martinez',
    status: 'no-show'
  },
  {
    id: 'A-20015',
    patientId: 'P-10045',
    patientName: 'Emily Davis',
    date: formatDate(addDays(today, 3)),
    time: '2:00 PM',
    type: 'Annual Check-up',
    doctor: 'Dr. Chen',
    status: 'scheduled'
  }
];

// Mock Prescriptions
export const mockPrescriptions: Prescription[] = [
  {
    id: 'RX-30001',
    patientId: 'P-10042',
    patientName: 'John Smith',
    medication: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Twice daily',
    startDate: formatDate(subDays(today, 45)),
    endDate: formatDate(subDays(today, 35)),
    prescribedBy: 'Dr. Williams'
  },
  {
    id: 'RX-30002',
    patientId: 'P-10042',
    patientName: 'John Smith',
    medication: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    startDate: formatDate(subDays(today, 45)),
    refillDate: formatDate(addDays(today, 15)),
    prescribedBy: 'Dr. Williams'
  },
  {
    id: 'RX-30003',
    patientId: 'P-10043',
    patientName: 'Sarah Johnson',
    medication: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily',
    startDate: formatDate(subDays(today, 7)),
    refillDate: formatDate(addDays(today, 23)),
    prescribedBy: 'Dr. Johnson'
  },
  {
    id: 'RX-30004',
    patientId: 'P-10045',
    patientName: 'Emily Davis',
    medication: 'Prednisone',
    dosage: '5mg',
    frequency: 'Once daily',
    startDate: formatDate(subDays(today, 180)),
    endDate: formatDate(subDays(today, 170)),
    prescribedBy: 'Dr. Chen'
  }
];

// Mock Devices with realistic IoT data patterns
export const mockDevices: Device[] = [
  {
    id: 'DEV-40001',
    name: 'Cardiac Monitor 1',
    type: 'Cardiac Monitor',
    status: 'online',
    location: 'ICU Room 101',
    lastMaintenance: formatDate(subDays(today, 30)),
    nextMaintenance: formatDate(addDays(today, 60)),
    readings: Array.from({ length: 24 }, (_, i) => ({
      timestamp: formatDateTime(subHours(today, 23 - i)),
      value: 70 + Math.floor(Math.sin(i / 3) * 10),
      unit: 'bpm'
    }))
  },
  {
    id: 'DEV-40002',
    name: 'Ventilator 2',
    type: 'Ventilator',
    status: 'maintenance',
    location: 'ICU Room 102',
    lastMaintenance: formatDate(subDays(today, 85)),
    nextMaintenance: formatDate(today),
    readings: Array.from({ length: 24 }, (_, i) => ({
      timestamp: formatDateTime(subHours(today, 23 - i)),
      value: 12 + Math.floor(Math.random() * 3),
      unit: 'breaths/min'
    }))
  },
  {
    id: 'DEV-40003',
    name: 'Infusion Pump 3',
    type: 'Infusion Pump',
    status: 'online',
    location: 'Ward A Room 105',
    lastMaintenance: formatDate(subDays(today, 10)),
    nextMaintenance: formatDate(addDays(today, 80)),
    readings: Array.from({ length: 24 }, (_, i) => ({
      timestamp: formatDateTime(subHours(today, 23 - i)),
      value: 50 + Math.floor(Math.random() * 10),
      unit: 'ml/hr'
    }))
  },
  {
    id: 'DEV-40004',
    name: 'Temperature Sensor 4',
    type: 'Environmental Sensor',
    status: 'online',
    location: 'Pharmacy Storage',
    lastMaintenance: formatDate(subDays(today, 60)),
    nextMaintenance: formatDate(addDays(today, 30)),
    readings: Array.from({ length: 24 }, (_, i) => ({
      timestamp: formatDateTime(subHours(today, 23 - i)),
      value: 35 + Math.floor(Math.sin(i / 8) * 3 + Math.random()),
      unit: '°F'
    }))
  },
  {
    id: 'DEV-40005',
    name: 'Patient Monitor 5',
    type: 'Patient Monitor',
    status: 'offline',
    location: 'ER Bay 3',
    lastMaintenance: formatDate(subDays(today, 45)),
    nextMaintenance: formatDate(addDays(today, 45)),
    readings: Array.from({ length: 24 }, (_, i) => ({
      timestamp: formatDateTime(subHours(today, 23 - i)),
      value: i < 20 ? (98 + Math.random() * 2) : 0, // Went offline 4 hours ago
      unit: '°F'
    }))
  }
];

// Mock Room Status
export const mockRooms: RoomStatus[] = [
  {
    id: 'R-50001',
    name: 'Room 101',
    type: 'ICU',
    occupied: true,
    patient: 'John Smith',
    lastCleaned: formatDateTime(subDays(today, 1)),
    temperature: 70.2,
    humidity: 45,
    status: 'occupied'
  },
  {
    id: 'R-50002',
    name: 'Room 102',
    type: 'ICU',
    occupied: true,
    patient: 'Sarah Johnson',
    lastCleaned: formatDateTime(subDays(today, 2)),
    temperature: 71.5,
    humidity: 44,
    status: 'occupied'
  },
  {
    id: 'R-50003',
    name: 'Room 103',
    type: 'Standard',
    occupied: false,
    lastCleaned: formatDateTime(subHours(today, 3)),
    temperature: 72.1,
    humidity: 42,
    status: 'available'
  },
  {
    id: 'R-50004',
    name: 'Room 104',
    type: 'Standard',
    occupied: false,
    lastCleaned: formatDateTime(subDays(today, 1)),
    temperature: 71.8,
    humidity: 43,
    status: 'cleaning'
  },
  {
    id: 'R-50005',
    name: 'Room 105',
    type: 'Standard',
    occupied: true,
    patient: 'Emily Davis',
    lastCleaned: formatDateTime(subDays(today, 3)),
    temperature: 72.3,
    humidity: 45,
    status: 'occupied'
  },
  {
    id: 'R-50006',
    name: 'Room 106',
    type: 'Standard',
    occupied: false,
    lastCleaned: formatDateTime(subDays(today, 5)),
    temperature: 68.5,
    humidity: 40,
    status: 'maintenance'
  }
];

// Mock Staff
export const mockStaff: StaffMember[] = [
  {
    id: 'S-60001',
    name: 'Dr. Williams',
    role: 'Physician',
    department: 'Internal Medicine',
    status: 'on-duty',
    schedule: {
      monday: '8:00 AM - 5:00 PM',
      tuesday: '8:00 AM - 5:00 PM',
      wednesday: '8:00 AM - 5:00 PM',
      thursday: '8:00 AM - 5:00 PM',
      friday: '8:00 AM - 12:00 PM',
      saturday: 'Off',
      sunday: 'Off'
    }
  },
  {
    id: 'S-60002',
    name: 'Dr. Johnson',
    role: 'Physician',
    department: 'Cardiology',
    status: 'on-duty',
    schedule: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: 'Off',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 6:00 PM',
      saturday: 'Off',
      sunday: 'Off'
    }
  },
  {
    id: 'S-60003',
    name: 'Dr. Martinez',
    role: 'Physician',
    department: 'Emergency Medicine',
    status: 'off-duty',
    schedule: {
      monday: 'Off',
      tuesday: 'Off',
      wednesday: '7:00 PM - 7:00 AM',
      thursday: '7:00 PM - 7:00 AM',
      friday: '7:00 PM - 7:00 AM',
      saturday: '7:00 PM - 7:00 AM',
      sunday: 'Off'
    }
  },
  {
    id: 'S-60004',
    name: 'Dr. Chen',
    role: 'Physician',
    department: 'Pediatrics',
    status: 'on-leave',
    schedule: {
      monday: '8:00 AM - 4:00 PM',
      tuesday: '8:00 AM - 4:00 PM',
      wednesday: '8:00 AM - 4:00 PM',
      thursday: '8:00 AM - 4:00 PM',
      friday: '8:00 AM - 4:00 PM',
      saturday: 'Off',
      sunday: 'Off'
    }
  },
  {
    id: 'S-60005',
    name: 'Nurse Richards',
    role: 'Nurse',
    department: 'ICU',
    status: 'on-duty',
    schedule: {
      monday: '7:00 AM - 7:00 PM',
      tuesday: '7:00 AM - 7:00 PM',
      wednesday: '7:00 AM - 7:00 PM',
      thursday: 'Off',
      friday: 'Off',
      saturday: 'Off',
      sunday: '7:00 AM - 7:00 PM'
    }
  }
];

// Mock Inventory
export const mockInventory: InventoryItem[] = [
  {
    id: 'I-70001',
    name: 'Disposable Gloves',
    category: 'PPE',
    quantity: 1200,
    unit: 'pairs',
    location: 'Central Storage',
    minQuantity: 500,
    lastRestocked: formatDate(subDays(today, 15)),
    status: 'in-stock'
  },
  {
    id: 'I-70002',
    name: 'Surgical Masks',
    category: 'PPE',
    quantity: 350,
    unit: 'pieces',
    location: 'Central Storage',
    minQuantity: 300,
    lastRestocked: formatDate(subDays(today, 30)),
    status: 'low-stock'
  },
  {
    id: 'I-70003',
    name: 'Amoxicillin 500mg',
    category: 'Medication',
    quantity: 250,
    unit: 'bottles',
    location: 'Pharmacy',
    minQuantity: 50,
    lastRestocked: formatDate(subDays(today, 10)),
    expirationDate: formatDate(addDays(today, 365)),
    status: 'in-stock'
  },
  {
    id: 'I-70004',
    name: 'Infusion Tubing',
    category: 'Supplies',
    quantity: 75,
    unit: 'sets',
    location: 'ICU Storage',
    minQuantity: 100,
    lastRestocked: formatDate(subDays(today, 45)),
    status: 'low-stock'
  },
  {
    id: 'I-70005',
    name: 'Sterile Bandages',
    category: 'Supplies',
    quantity: 0,
    unit: 'boxes',
    location: 'ER Storage',
    minQuantity: 20,
    lastRestocked: formatDate(subDays(today, 60)),
    status: 'out-of-stock'
  }
];

// Mock Alerts
export const mockAlerts: Alert[] = [
  {
    id: 'AL-80001',
    type: 'critical',
    message: 'Patient Monitor 5 offline',
    source: 'Device Management System',
    timestamp: formatDateTime(subHours(today, 4)),
    acknowledged: false,
    details: 'Device in ER Bay 3 lost connection. Requires immediate attention.'
  },
  {
    id: 'AL-80002',
    type: 'warning',
    message: 'Low inventory: Surgical Masks',
    source: 'Inventory Management',
    timestamp: formatDateTime(subHours(today, 12)),
    acknowledged: true,
    details: 'Current quantity: 350, Minimum required: 300'
  },
  {
    id: 'AL-80003',
    type: 'warning',
    message: 'Room 106 temperature out of range',
    source: 'Environmental Monitoring',
    timestamp: formatDateTime(subHours(today, 2)),
    acknowledged: false,
    details: 'Current temperature: 68.5°F, Target range: 70-74°F'
  },
  {
    id: 'AL-80004',
    type: 'info',
    message: 'Scheduled maintenance: Ventilator 2',
    source: 'Maintenance Schedule',
    timestamp: formatDateTime(subDays(today, 1)),
    acknowledged: true,
    details: 'Maintenance scheduled for today. Device located in ICU Room 102.'
  },
  {
    id: 'AL-80005',
    type: 'critical',
    message: 'Out of stock: Sterile Bandages',
    source: 'Inventory Management',
    timestamp: formatDateTime(subHours(today, 36)),
    acknowledged: false,
    details: 'Item completely depleted. Last restocked 60 days ago.'
  }
];

// -------------------- Utilities for Data Simulation --------------------

// Simulate a real-time data stream
export function simulateRealtimeData(callback: (data: any) => void, interval = 2000) {
  // Initial data snapshot
  let devices = [...mockDevices];
  let rooms = [...mockRooms];
  let alerts = [...mockAlerts];
  
  // Callback with initial data
  callback({
    devices,
    rooms,
    alerts,
    timestamp: new Date().toISOString()
  });
  
  // Set up interval for data updates
  const intervalId = setInterval(() => {
    // Update device readings
    devices = devices.map(device => {
      if (device.status === 'offline') return device;
      
      // Add a new reading
      const lastReading = device.readings[device.readings.length - 1];
      const newValue = simulateReading(lastReading.value, device.type);
      
      const newReading = {
        timestamp: formatDateTime(new Date()),
        value: newValue,
        unit: lastReading.unit
      };
      
      // Keep only last 24 readings
      const updatedReadings = [...device.readings.slice(1), newReading];
      
      // Random chance of status change
      let updatedStatus: 'online' | 'maintenance' = device.status as 'online' | 'maintenance';
      if (Math.random() < 0.01) {
        // Since we're in a block where device.status can only be 'online' | 'maintenance'
        // (because offline devices are filtered out above)
        updatedStatus = Math.random() < 0.5 ? 'maintenance' : 'online';
        
        // We need to handle the case separately for creating alerts
        const deviceGoingOffline = Math.random() < 0.5 && updatedStatus === 'online';
        if (deviceGoingOffline) {
          alerts = [...alerts, {
            id: `AL-${Date.now()}`,
            type: 'critical',
            message: `${device.name} offline`,
            source: 'Device Management System',
            timestamp: formatDateTime(new Date()),
            acknowledged: false,
            details: `Device in ${device.location} lost connection. Requires attention.`
          }];
          
          // Now we can safely set the status to offline
          return { ...device, readings: updatedReadings, status: 'offline' };
        }
      }
      
      return { ...device, readings: updatedReadings, status: updatedStatus };
    });
    
    // Update room data
    rooms = rooms.map(room => {
      // Slight temperature and humidity variations
      const tempChange = (Math.random() - 0.5) * 0.3;
      const humidityChange = (Math.random() - 0.5) * 0.5;
      
      return {
        ...room,
        temperature: +(room.temperature + tempChange).toFixed(1),
        humidity: Math.min(100, Math.max(0, Math.round(room.humidity + humidityChange)))
      };
    });
    
    // Random chance of new alert
    if (Math.random() < 0.1) {
      const alertTypes = ['info', 'warning', 'critical'];
      const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)] as 'info' | 'warning' | 'critical';
      
      alerts = [...alerts.slice(-9), {
        id: `AL-${Date.now()}`,
        type: randomType,
        message: generateRandomAlert(randomType),
        source: generateRandomSource(),
        timestamp: formatDateTime(new Date()),
        acknowledged: false
      }];
    }
    
    // Send updated data
    callback({
      devices,
      rooms,
      alerts,
      timestamp: new Date().toISOString()
    });
  }, interval);
  
  // Return function to stop the simulation
  return () => clearInterval(intervalId);
}

// Helper functions for simulation

function simulateReading(lastValue: number, deviceType: string): number {
  // Different patterns based on device type
  switch (deviceType) {
    case 'Cardiac Monitor':
      // Heart rate variations
      return Math.max(60, Math.min(100, lastValue + (Math.random() - 0.5) * 4));
    
    case 'Ventilator':
      // Breathing rate - more stable
      return Math.max(10, Math.min(16, lastValue + (Math.random() - 0.5) * 1));
      
    case 'Patient Monitor':
      // Temperature
      return Math.max(97, Math.min(99.5, lastValue + (Math.random() - 0.5) * 0.2));
      
    case 'Environmental Sensor':
      // Room temperature
      return Math.max(65, Math.min(75, lastValue + (Math.random() - 0.5) * 0.5));
      
    default:
      // Generic variation
      return Math.max(0, lastValue + (Math.random() - 0.5) * 5);
  }
}

function generateRandomAlert(type: 'info' | 'warning' | 'critical'): string {
  const alerts = {
    info: [
      'System backup completed',
      'Software update available',
      'Shift change: Nursing staff',
      'New patient admitted',
      'Scheduled equipment maintenance'
    ],
    warning: [
      'Battery low: Patient monitor',
      'Room temperature deviation',
      'Inventory approaching minimum levels',
      'Staff shortage in department',
      'Backup power check required'
    ],
    critical: [
      'Device disconnection detected',
      'Critical inventory shortage',
      'Patient monitor alarm',
      'Security breach detected',
      'Emergency power activated'
    ]
  };
  
  const options = alerts[type];
  return options[Math.floor(Math.random() * options.length)];
}

function generateRandomSource(): string {
  const sources = [
    'Device Management System',
    'Environmental Monitoring',
    'Inventory Management',
    'Staff Management',
    'Security System',
    'Patient Monitoring System',
    'Maintenance Schedule'
  ];
  
  return sources[Math.floor(Math.random() * sources.length)];
} 