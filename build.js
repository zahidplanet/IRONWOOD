const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build process for IRONWOOD Desktop App');

// Step 1: Build Next.js static site
console.log('📦 Building Next.js static export...');
exec('npm run build', (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Next.js build error: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`❌ Next.js build stderr: ${stderr}`);
  }
  
  console.log(stdout);
  console.log('✅ Next.js build completed successfully');
  
  // Step 2: Build Electron app
  console.log('🔨 Building Electron app...');
  
  // Ensure resources directory exists
  if (!fs.existsSync('resources')) {
    fs.mkdirSync('resources');
    console.log('📁 Created resources directory');
  }
  
  // Build the app
  exec('electron-builder', (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Electron build error: ${error.message}`);
      return;
    }
    
    if (stderr) {
      console.error(`❌ Electron build stderr: ${stderr}`);
    }
    
    console.log(stdout);
    console.log('✅ Electron build completed successfully');
    console.log('🎉 IRONWOOD Desktop App build finished! Check the dist/ directory for the installer.');
  });
}); 