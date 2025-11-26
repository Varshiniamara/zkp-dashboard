/**
 * Complete Installation Script
 * Installs all dependencies and sets up the project
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Complete Installation...\n');

const projectRoot = path.join(__dirname, '..');

// Step 1: Install npm dependencies
console.log('📦 Step 1: Installing npm dependencies...');
try {
  execSync('npm install', { 
    cwd: projectRoot, 
    stdio: 'inherit' 
  });
  console.log('✅ Dependencies installed!\n');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Step 2: Setup environment files
console.log('⚙️  Step 2: Setting up environment files...');
try {
  require('./setup-env.js');
  console.log('✅ Environment files created!\n');
} catch (error) {
  console.warn('⚠️  Environment setup warning:', error.message);
}

// Step 3: Build backend
console.log('🔨 Step 3: Building backend...');
try {
  require('./build-backend.js');
  console.log('✅ Backend built!\n');
} catch (error) {
  console.warn('⚠️  Backend build warning:', error.message);
}

console.log('🎉 Installation Complete!\n');
console.log('Next steps:');
console.log('1. Start MongoDB (optional): mongod');
console.log('2. Seed database (optional): npm run seed');
console.log('3. Start server: npm run start:unified');
console.log('4. Open: http://localhost:3000\n');

