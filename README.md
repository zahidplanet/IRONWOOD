# IRONWOOD

A futuristic dashboard for IoT-enabled medical facility management, featuring role-based views, real-time data visualization, and a glassmorphic UI.

## Project Overview

IRONWOOD is a comprehensive digital platform serving as the central interface for monitoring and managing a medical facility's physical infrastructure. The dashboard integrates data from multiple IoT endpoints including medical equipment, building management systems, and security devices.

### Key Components

- **Owner Dashboard**: Displays aggregated, real-time data across the entire facility (financials, HR, projects, sales)
- **Physician Dashboard**: Presents individualized metrics (revenue, conversion rates, patient feedback, procedure data)
- **Patient Portal** (Test Mode): Placeholder for future patient health data portal

## Getting Started

### Web Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Desktop Application

The IRONWOOD dashboard can also be run as a desktop application using Electron.

```bash
# Install dependencies
npm install

# Run in development mode
npm run electron:dev

# Build desktop app
npm run electron:build
```

After building, you can find the installer in the `dist` directory.

## Development Instructions

### 1. Project Architecture & Role-Based Views

#### Primary Views
- **Owner Dashboard**: Holistic view of the entire facility
- **Physician Dashboard**: Personalized and secure view for individual doctors
- **Patient Portal**: Currently in test mode with "Coming Soon" placeholders

#### Navigation & Routing
- Persistent sidebar/header for switching between views
- Role-based routing/conditional rendering for access control

### 2. Design & User Experience

#### Futuristic, Glassmorphic UI
- Glass-like appearance for cards, modals, and panels
- Dark, high-contrast theme with neon/vibrant accent colors
- Clean, minimalistic layout with ample negative space

#### Smooth Animations
- Framer Motion for transitions and animations
- Subtle motion effects for updated metrics
- Crisp, rapid animations for an energetic feel

#### Responsive Layout
- Modular grid layout for adaptive display
- Component-based sections for reusability

### 3. Component Structure & Data Integration

#### Extend Existing Components
- KPICard: Enhanced with physician-specific metrics
- Chart Components: Line and bar charts with filtering options
- Tables: Detailed rows for comprehensive data display

#### Dynamic Data Handling
- React hooks for data loading
- Clear error and loading states
- Structure for future API integration

#### Patient Portal Toggle
- Navigation toggle for Patient Portal view
- Placeholder content with "Coming Soon" message
- Distinct separation from other dashboards

### 4. Code Refactoring & Future Proofing

#### Modularize Code
- Refactor into smaller, maintainable subcomponents
- Separate components for different dashboards
- Reusable UI elements

#### Theming & Styling
- Global theme for consistency
- Encapsulated, reusable styling

#### Documentation & Comments
- Inline comments and README updates
- Documentation of design decisions

## Data Storage

The application currently uses browser localStorage for data persistence in the prototype phase. In the future, this will be replaced with a cloud-based solution.

### Current Implementation
- Local data persistence using browser localStorage
- Mock data pre-populated for demonstration
- Data remains persistent between sessions

### Future Plans
- Replace localStorage with cloud database
- Implement authentication and authorization
- Add real-time data synchronization

## IoT Infrastructure Integration

### 1. Positioning Within IoT Ecosystem

- **Centralized Data Aggregation**: Aggregates data from multiple IoT endpoints
- **Data Ingestion**: Middleware for real-time data collection
- **Data Fusion**: Unified view of disparate data sources
- **Real-Time Facility Management**: Live monitoring and alerting
- **Enhanced Healthcare Delivery**: Integration with clinical devices
- **Future-Ready Architecture**: Modular and extensible design

### 2. Future IoT Components Integration

- **Building Management Systems**: HVAC, lighting, security
- **Medical Devices & Wearables**: Diagnostic tools, patient monitoring
- **Robotics & Automation**: Medication dispensing, patient transport
- **Data Analytics & AI**: Predictive maintenance, outcome forecasting

## Development Workflow

1. Work on issues in separate branches
2. Commit frequently to avoid bottlenecking
3. Ensure all tasks and checks pass before requesting review
4. Keep code and design clear and focused
5. Maintain project context and roadmap in documentation

## License

[MIT](LICENSE) 