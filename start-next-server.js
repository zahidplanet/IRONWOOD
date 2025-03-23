
  const fs = require('fs');
  const path = require('path');
  const { execSync, spawn } = require('child_process');
  
  // Create required directories
  console.log('Creating required directories...');
  const dirs = [
    path.join(__dirname, '.next', 'server'),
    path.join(__dirname, 'out', 'server')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Create middleware manifest
  const manifest = {
    version: 1,
    sortedMiddleware: [],
    middleware: {},
    functions: {},
    pages: {}
  };
  
  dirs.forEach(dir => {
    const manifestPath = path.join(dir, 'middleware-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`Created manifest at: ${manifestPath}`);
  });
  
  // Correctly patch Next.js server file
  console.log('Patching Next.js server file...');
  try {
    const serverPath = path.join(__dirname, 'node_modules', 'next', 'dist', 'server', 'next-server.js');
    let content = fs.readFileSync(serverPath, 'utf8');
    
    // First check if we need to patch it
    if (content.includes('getMiddlewareManifest()')) {
      console.log('Server file needs patching...');
      
      // Replace the getMiddlewareManifest method with one that returns an empty manifest
      content = content.replace(
        /getMiddlewareManifest() {[^}]*}/s,
        `getMiddlewareManifest() {
          return {
            version: 1,
            sortedMiddleware: [],
            middleware: {},
            functions: {},
            pages: {}
          };
        }`
      );
      
      fs.writeFileSync(serverPath, content);
      console.log('Successfully patched Next.js server file');
    } else {
      console.log('Server file is already patched or has a different structure');
    }
  } catch (error) {
    console.error('Error patching Next.js server file:', error);
  }
  
  // Create minimal error components
  console.log('Creating error components...');
  const pagesDir = path.join(__dirname, 'src', 'pages');
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
  }
  
  // Create _error.js
  fs.writeFileSync(
    path.join(pagesDir, '_error.js'),
    `export default function Error({ statusCode }) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>{statusCode ? \`Error \${statusCode}\` : 'An error occurred'}</h1>
          <p>Sorry, there was a problem with the requested page.</p>
        </div>
      );
    }
    `
  );
  
  // Create _document.js
  fs.writeFileSync(
    path.join(pagesDir, '_document.js'),
    `import { Html, Head, Main, NextScript } from 'next/document';
    
    export default function Document() {
      return (
        <Html>
          <Head />
          <body>
            <Main />
            <NextScript />
          </body>
        </Html>
      );
    }
    `
  );
  
  // Create index.js if it doesn't exist
  if (!fs.existsSync(path.join(pagesDir, 'index.js'))) {
    fs.writeFileSync(
      path.join(pagesDir, 'index.js'),
      `export default function Home() {
        return (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1 style={{ 
              background: 'linear-gradient(to right, #0070f3, #9333ea)', 
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              IRONWOOD
            </h1>
            <p>Healthcare Dashboard System</p>
          </div>
        );
      }
      `
    );
  }
  
  console.log('Starting Next.js dev server...');
  const nextProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });
  
  nextProcess.on('exit', (code) => {
    console.log(`Next.js process exited with code ${code}`);
  });
  