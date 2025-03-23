const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Kill any running processes
try {
  if (process.platform === 'darwin' || process.platform === 'linux') {
    execSync('pkill -f electron || true');
    execSync('pkill -f "next dev" || true');
    execSync('pkill -f "node" || true');
  } else if (process.platform === 'win32') {
    execSync('taskkill /F /IM electron.exe /T || echo No electron processes');
    execSync('taskkill /F /IM node.exe /T || echo No node processes');
  }
} catch (e) {
  // Ignore errors
}

// Ensure we're in the right directory
const projectRoot = __dirname;
const standalonePath = path.join(projectRoot, 'ironwood-standalone');

// Create standalone directory if it doesn't exist
if (!fs.existsSync(standalonePath)) {
  fs.mkdirSync(standalonePath, { recursive: true });
}

// Create package.json if it doesn't exist
const packageJsonPath = path.join(standalonePath, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  const packageJson = {
    name: "ironwood-standalone",
    version: "1.0.0",
    private: true,
    scripts: {
      "dev": "next dev -p 3001",
      "build": "next build",
      "start": "next start -p 3001"
    },
    dependencies: {
      "next": "^13.1.0",
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "electron": "^22.0.0"
    }
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

// Create the components directory
const componentsDir = path.join(standalonePath, 'components');
if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
}

// Create the pages directory
const pagesDir = path.join(standalonePath, 'pages');
if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

// Create the styles directory
const stylesDir = path.join(standalonePath, 'styles');
if (!fs.existsSync(stylesDir)) {
  fs.mkdirSync(stylesDir, { recursive: true });
}

// Create the electron directory
const electronDir = path.join(standalonePath, 'electron');
if (!fs.existsSync(electronDir)) {
  fs.mkdirSync(electronDir, { recursive: true });
}

console.log('Installing dependencies...');
process.chdir(standalonePath);
execSync('npm install', { stdio: 'inherit' });

console.log('Starting the app...');
execSync('npx next dev -p 3001', { 
  stdio: 'inherit',
  env: { ...process.env, PORT: '3001' }
}); 