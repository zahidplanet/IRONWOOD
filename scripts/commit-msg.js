#!/usr/bin/env node

/**
 * Git commit message hook script
 * 
 * This script validates commit messages to follow the format:
 * [Component] Brief description
 * 
 * Installation: 
 * 1. Make this file executable: chmod +x scripts/commit-msg.js
 * 2. Set up git hook: 
 *    ln -sf ../../scripts/commit-msg.js .git/hooks/commit-msg
 */

const fs = require('fs');

// Read the commit message from the file passed as an argument
const commitMessageFile = process.argv[2];
const commitMessage = fs.readFileSync(commitMessageFile, 'utf8');

// Commit message format: [Component] Brief description
const commitRegex = /^\[[\w-]+\] .+/;

// Skip validation for merge commits
if (commitMessage.startsWith('Merge branch') || commitMessage.startsWith('Merge pull request')) {
  process.exit(0);
}

// Validate the commit message format
if (!commitRegex.test(commitMessage)) {
  console.error('\n❌ Invalid commit message format.');
  console.error('Commit messages should follow the format: [Component] Brief description');
  console.error('Examples:');
  console.error('  [Dashboard] Add property comparison chart');
  console.error('  [API] Fix data fetching for property analytics');
  console.error('  [Docs] Update installation instructions\n');
  process.exit(1);
}

// Allow the commit if everything is valid
process.exit(0); 