const fs = require('fs');
const path = require('path');

console.log('🔧 Next.js Server Patch Tool');

// Path to the next-server.js file
const nextServerPath = path.join(__dirname, 'node_modules', 'next', 'dist', 'server', 'next-server.js');

if (!fs.existsSync(nextServerPath)) {
  console.error('❌ Could not find next-server.js at:', nextServerPath);
  process.exit(1);
}

// Read the file
console.log('📄 Reading next-server.js...');
const originalContent = fs.readFileSync(nextServerPath, 'utf8');

// Make a backup
const backupPath = `${nextServerPath}.backup`;
if (!fs.existsSync(backupPath)) {
  console.log('💾 Creating backup...');
  fs.writeFileSync(backupPath, originalContent);
}

// Find and fix the syntax error (unexpected comma)
console.log('🔍 Looking for syntax errors...');

// The error occurs around line 917, with an unexpected comma
const fixedContent = originalContent.replace(/(\S+)\s*,\s*\n\s*\}(?!\s*,)/g, '$1\n    }');

if (fixedContent === originalContent) {
  console.log('⚠️ Could not identify the syntax error pattern!');
  console.log('Trying alternate repair method...');
  
  // Manually fix the specific error we saw
  const lineNumber = 917;
  const lines = originalContent.split('\n');
  
  // Look for lines with trailing commas
  let fixed = false;
  for (let i = Math.max(0, lineNumber - 10); i < Math.min(lines.length, lineNumber + 10); i++) {
    if (lines[i].trim().endsWith(',') && lines[i + 1].trim().startsWith('}')) {
      console.log(`🔧 Found likely syntax error on line ${i + 1}: ${lines[i]}`);
      lines[i] = lines[i].replace(/,\s*$/, '');
      console.log(`✅ Fixed to: ${lines[i]}`);
      fixed = true;
    }
  }
  
  if (!fixed) {
    console.error('❌ Could not automatically fix the syntax error.');
    console.log('Consider reinstalling Next.js: npm remove next && npm install next@14.1.0');
    process.exit(1);
  }
  
  fs.writeFileSync(nextServerPath, lines.join('\n'));
  console.log('✅ Applied manual fix!');
} else {
  fs.writeFileSync(nextServerPath, fixedContent);
  console.log('✅ Fixed syntax error!');
}

// Create middleware manifest files if they don't exist
console.log('📁 Creating middleware manifest files...');

const manifestDirs = [
  path.join(__dirname, '.next', 'server'),
  path.join(__dirname, 'out', 'server')
];

const manifest = {
  version: 1,
  sortedMiddleware: [],
  middleware: {},
  functions: {},
  pages: {}
};

manifestDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, 'middleware-manifest.json'), JSON.stringify(manifest, null, 2));
});

console.log('✅ Created middleware manifest files');

console.log('\n🚀 Patch applied successfully!');
console.log('You can now try running Next.js with:');
console.log('  npm run dev');
console.log('\nAnd then in a separate terminal, run Electron with:');
console.log('  npx electron electron/main-minimal.js'); 