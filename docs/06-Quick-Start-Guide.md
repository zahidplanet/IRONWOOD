# IRONWOOD Quick Start Guide

This guide provides a streamlined approach to get started with IRONWOOD development.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Python 3.6+ (only for AI functionality)
- Git with LFS support

## Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/zahidpasha/IRONWOOD.git
cd IRONWOOD
```

### 2. Basic Setup

For a standard setup (Next.js + Electron):

```bash
# One-step setup and launch
npm run start
```

This will:
- Set up the project structure
- Install dependencies
- Start the Next.js server
- Launch the Electron application

### 3. Advanced Setup (with AI Integration)

If you want to work with the AI functionality:

```bash
# Setup AI components
npm run setup-ai

# Create and activate Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r python-api/requirements.txt

# Start the integrated application
npm run start-integrated
```

## Project Structure

```
ironwood-app/            # Main Next.js + Electron application
├── components/          # React components
├── electron/            # Electron configuration
├── pages/               # Next.js pages
└── styles/              # CSS styles

python-api/              # Python backend for AI features
└── server.py            # Flask API server
```

## Development Workflow

### 1. Create a Feature Branch

Always work in a feature branch:

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Modify or add components in `ironwood-app/components/`
- Create or update pages in `ironwood-app/pages/`
- Add styles in `ironwood-app/styles/`
- Extend AI functionality in `python-api/`

### 3. Run the Application

During development:

```bash
# For Next.js + Electron only
npm run start

# For Next.js + Electron + Python AI
npm run start-integrated
```

### 4. Commit Changes

Make regular commits with descriptive messages:

```bash
git add .
git commit -m "Add feature XYZ"
git push origin feature/your-feature-name
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - The application uses port 3001 by default
   - Check if another process is using this port
   - Kill the process or change the port in package.json

2. **Module Loading Errors**
   - Run `npm install` in the root directory
   - Verify that node_modules exists in ironwood-app/

3. **Python API Connection**
   - Ensure the Python API server is running on port 5001
   - Check Python dependencies are installed
   - Verify the virtual environment is activated

4. **Large File Issues**
   - IRONWOOD uses Git LFS for large files
   - Ensure Git LFS is installed and initialized
   - Run `git lfs pull` to fetch large files

## Getting Help

- Check the documentation in the `docs/` directory
- Review existing issues in the GitHub repository
- Contact the project maintainers 