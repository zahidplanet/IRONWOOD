#!/usr/bin/env node

/**
 * Git hooks setup script
 * 
 * This script sets up Git hooks for the project.
 * It creates symbolic links from the .git/hooks directory to the scripts in the project.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define the hooks to set up
const hooks = [
  { src: 'scripts/commit-msg.js', dest: '.git/hooks/commit-msg' },
  // Add more hooks as needed
];

console.log('🔧 Setting up Git hooks...');

// Ensure the scripts directory exists
try {
  if (!fs.existsSync('scripts')) {
    fs.mkdirSync('scripts');
  }
} catch (error) {
  console.error('Error creating scripts directory:', error);
  process.exit(1);
}

// Ensure the .git/hooks directory exists
try {
  if (!fs.existsSync('.git/hooks')) {
    fs.mkdirSync('.git/hooks', { recursive: true });
  }
} catch (error) {
  console.error('Error creating .git/hooks directory:', error);
  process.exit(1);
}

// Create each hook
hooks.forEach(hook => {
  try {
    const srcPath = path.resolve(__dirname, '..', hook.src);
    const destPath = path.resolve(__dirname, '..', hook.dest);
    
    // Make the source script executable
    execSync(`chmod +x ${srcPath}`);
    
    // Create a symbolic link
    console.log(`Creating hook link from ${srcPath} to ${destPath}`);
    
    // Remove existing hook if it exists
    if (fs.existsSync(destPath)) {
      fs.unlinkSync(destPath);
    }
    
    // Create relative path for symlink
    const relativePath = path.relative(path.dirname(destPath), srcPath);
    
    // Create the symlink
    fs.symlinkSync(relativePath, destPath);
    
    console.log(`✅ Successfully set up ${hook.dest}`);
  } catch (error) {
    console.error(`Error setting up ${hook.dest}:`, error);
  }
});

console.log('🎉 Git hooks setup complete!');
console.log('Commit messages will now be validated to follow the format: [Component] Brief description'); 