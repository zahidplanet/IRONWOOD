# IRONWOOD App Overview

## App Overview
IRONWOOD is an integrated software platform designed for a mixed-use medical campus development that combines healthcare facilities, residential spaces, wellness centers, and R&D labs. The platform serves as the digital backbone connecting all physical aspects of the campus, delivering real-time data and seamless service to owners, medical practitioners, and patients. The system features role-based dashboards, IoT integration, and a patient portal, all designed with a futuristic glassmorphic UI.

## User Flows
- **Owner Flow**: Access comprehensive facility-wide data including financials, HR, projects, and sales; monitor real-time IoT inputs from building systems; oversee operations across all medical practices
- **Physician Flow**: View personalized practice metrics (revenue, conversion rates, patient feedback); access patient data; utilize centralized medication management; receive alerts and insights
- **Patient Flow**: Register and book appointments; access personal health records; view test results; communicate with physicians; opt into digital twin creation; upgrade to premium features for additional services

## Tech Stack & APIs
- Frontend: React with Framer Motion for animations
- CSS: Styled-components or CSS modules with glassmorphic UI elements
- Data visualization: Line and bar chart components
- IoT integration: REST APIs, MQTT brokers
- Authentication: Role-based access control
- Backend integration points for BMS, medical devices, robotics
- HIPAA-compliant data handling protocols

## Core Features
- Role-based dashboards with distinct views (Owner, Physician, Patient)
- Real-time IoT data aggregation and visualization
- Centralized medication management system
- Biometric access controls
- Patient digital twins (opt-in)
- Automated alerts and notifications
- AI assistant for patient education and monitoring
- Premium subscription options for enhanced services
- Integration with wellness facilities booking

## In-scope vs Out-of-scope Items
**In-scope:**
- Three primary dashboard views (Owner, Physician, Patient Portal placeholder)
- Glassmorphic UI with animations
- Mock data integration (to be replaced with real APIs)
- Basic navigation and role-based routing
- Core dashboard components (KPI cards, charts, tables)

**Out-of-scope (Future Development):**
- Full Patient Portal implementation
- AI digital twin integration
- Robotics and drone delivery integration
- Biometric authentication
- Advanced analytics and machine learning features
- Premium subscription billing system
- Integration with transportation services (Waymo/RoboTaxi) 