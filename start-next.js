
const { spawn } = require('child_process');

console.log('🚀 Starting Next.js development server in separate process...');
spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  detached: true
});
