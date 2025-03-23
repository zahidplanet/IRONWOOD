# IRONWOOD

IRONWOOD is a modern desktop application built with Next.js and Electron, designed to provide an integrated platform for AI-powered real estate development and property management.

## Features

- **Next.js + Electron Integration**: Modern web technologies in a desktop application
- **AI Property Analysis**: Advanced property valuation and market analysis with AI-powered insights
- **Development Dashboard**: Comprehensive project tracking and monitoring
- **Property Portfolio Management**: Track and manage multiple development projects
- **Design Review Tools**: Visualize and approve architectural designs

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Python (v3.6 or higher) - Required only for advanced AI analytics

### Installation

1. Clone the repository:
```bash
git clone https://github.com/zahidpasha/IRONWOOD.git
cd IRONWOOD
```

2. Run the all-in-one launcher script:
```bash
node auto-start.js
```

This script will:
- Set up the project structure
- Install dependencies
- Start the Next.js server and Electron app together

### AI Analytics Integration

To set up the AI analytics integration:

1. Install the AI components:
```bash
npm run setup-ai
```

This will:
- Set up the Python API bridge to connect Next.js with the Python backend
- Configure the necessary endpoints

2. Install Python dependencies:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r python-api/requirements.txt
```

3. Run the integrated application:
```bash
npm run start-integrated
```

This will start both:
- The Python Flask API server for AI processing
- The Next.js + Electron application

## Development

### Project Structure

```
ironwood-app/            # Main application
├── components/          # React components
├── electron/            # Electron configuration
├── pages/               # Next.js pages
│   └── api/             # API routes
└── styles/              # CSS styles

python-api/              # Python API bridge
├── server.py            # Flask API server
└── requirements.txt     # Python dependencies
```

### Development Workflow

1. Make changes to the Next.js application in the `pages/` directory
2. The development server will automatically reload
3. The Electron app will display the changes from the Next.js server

### Creating New Features

Create new features/fix issues in dedicated branches:

```bash
git checkout -b feature/your-feature-name
# Make your changes
git add .
git commit -m "Description of changes"
git push origin feature/your-feature-name
# Create a PR when ready for review
```

## AI Architecture

The AI Analytics integration provides advanced insights for real estate development:

- **Market Analysis**: Property values, trends, and growth potential
- **Development Optimization**: Cost analysis, return on investment projections
- **Risk Assessment**: Market volatility and development risk analysis
- **Design Evaluation**: Architectural efficiency and marketability scoring

These AI components collaborate to provide comprehensive property development insights with reasoning and confidence levels.

## Roadmap

- [ ] Enhanced property visualization tools
- [ ] Real-time data integration with market APIs
- [ ] User authentication and team collaboration
- [ ] Notification system for project milestones
- [ ] Advanced data visualization tools
- [ ] Mobile companion app for on-site updates

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Electron for enabling desktop applications with web technologies
- [AI Hedge Fund](https://github.com/virattt/ai-hedge-fund) for the sophisticated AI investment agent system