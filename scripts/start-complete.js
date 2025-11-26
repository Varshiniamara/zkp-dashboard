/**
 * Complete ZKP Dashboard Startup Script
 * Starts both backend and frontend on single localhost
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Complete ZKP Dashboard...');
console.log('==================================\n');

// Check if .env files exist
const backendEnvPath = path.join(__dirname, '../backend/.env');
if (!fs.existsSync(backendEnvPath)) {
  console.log('⚠️  backend/.env not found. Running setup...');
  try {
    require('./setup-env.js');
  } catch (error) {
    console.error('Setup failed:', error.message);
  }
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, '../node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 node_modules not found. Installing dependencies...');
  console.log('   Please run: npm install');
  console.log('   Then restart this script.\n');
  process.exit(1);
}

console.log('✅ Pre-flight checks complete!\n');
console.log('Starting servers...\n');
console.log('Backend: http://localhost:5000');
console.log('Frontend: http://localhost:3000');
console.log('Demo: http://localhost:3000/demo\n');
console.log('Press Ctrl+C to stop all servers\n');

// Start backend
const backend = spawn('npm', ['run', 'dev:backend'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  shell: true
});

// Start frontend
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  shell: true
});

// Handle exit
process.on('SIGINT', () => {
  console.log('\n\n🛑 Stopping servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});

// Handle errors
backend.on('error', (error) => {
  console.error('Backend error:', error);
});

frontend.on('error', (error) => {
  console.error('Frontend error:', error);
});

