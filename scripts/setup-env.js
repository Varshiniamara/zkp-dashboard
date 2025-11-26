/**
 * Node.js setup script for environment files
 * Works cross-platform (Windows, Linux, Mac)
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up ZKP Dashboard Environment...\n');

// Create backend/.env if it doesn't exist
const backendEnvPath = path.join(__dirname, '../backend/.env');
const backendExamplePath = path.join(__dirname, '../backend/example.env');

if (!fs.existsSync(backendEnvPath) && fs.existsSync(backendExamplePath)) {
  console.log('Creating backend/.env from example.env...');
  fs.copyFileSync(backendExamplePath, backendEnvPath);
  console.log('✅ Created backend/.env\n');
} else if (fs.existsSync(backendEnvPath)) {
  console.log('ℹ️  backend/.env already exists\n');
}

// Create .env.local if it doesn't exist
const frontendEnvPath = path.join(__dirname, '../.env.local');
if (!fs.existsSync(frontendEnvPath)) {
  console.log('Creating .env.local...');
  const frontendEnvContent = `# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_ML_PREDICTIONS=true
NEXT_PUBLIC_ENABLE_BLOCKCHAIN_VERIFICATION=true

# Web3 Provider URLs
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key_here
NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key_here

# Ethereum Network
NEXT_PUBLIC_ETHEREUM_NETWORK=sepolia

# Starknet Network
NEXT_PUBLIC_STARKNET_NETWORK=testnet
`;
  fs.writeFileSync(frontendEnvPath, frontendEnvContent);
  console.log('✅ Created .env.local\n');
} else {
  console.log('ℹ️  .env.local already exists\n');
}

console.log('📝 Next steps:');
console.log('1. Edit backend/.env with your MongoDB URI and API keys');
console.log('2. Edit .env.local with your frontend API keys');
console.log('3. Run: npm install (or pnpm install)');
console.log('4. Start MongoDB: mongod (or use MongoDB Atlas)');
console.log('5. Run: npm run seed (to seed database)');
console.log('6. Run backend: npm run dev:backend');
console.log('7. Run frontend: npm run dev');
console.log('\n✅ Setup complete!\n');

