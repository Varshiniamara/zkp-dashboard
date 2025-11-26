/**
 * Build Backend TypeScript to JavaScript
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building backend TypeScript...');

const backendSrc = path.join(__dirname, '../backend/src');
const backendDist = path.join(__dirname, '../backend/dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(backendDist)) {
  fs.mkdirSync(backendDist, { recursive: true });
}

// Check if TypeScript is installed
try {
  execSync('npx tsc --version', { stdio: 'ignore' });
} catch (error) {
  console.log('📦 TypeScript not found. Installing...');
  execSync('npm install --save-dev typescript @types/node', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
}

// Compile TypeScript
try {
  const tsconfigPath = path.join(__dirname, '../backend/tsconfig.json');
  
  if (!fs.existsSync(tsconfigPath)) {
    // Create basic tsconfig.json
    const tsconfig = {
      compilerOptions: {
        target: 'ES2020',
        module: 'commonjs',
        lib: ['ES2020'],
        outDir: './dist',
        rootDir: './src',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        moduleResolution: 'node'
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist']
    };
    
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  }
  
  execSync('npx tsc', { 
    cwd: path.join(__dirname, '../backend'),
    stdio: 'inherit'
  });
  
  console.log('✅ Backend built successfully!');
} catch (error) {
  console.error('❌ Error building backend:', error.message);
  console.log('⚠️  Continuing with JavaScript files...');
}

