const { execSync } = require('child_process');
const path = require('path');

// Go to the standalone directory and run the app
const standaloneDir = path.join(__dirname, 'ironwood-standalone');
console.log('Changing to standalone directory:', standaloneDir);

try {
  execSync(`cd "${standaloneDir}" && node run.js`, { 
    stdio: 'inherit',
    windowsHide: false
  });
} catch (e) {
  // If the command was interrupted by the user, don't show an error
  if (e.signal !== 'SIGINT') {
    console.error('Error running the app:', e);
  }
}
