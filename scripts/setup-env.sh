#!/bin/bash

# Setup script for ZKP Dashboard
# This script helps set up environment variables

echo "🚀 Setting up ZKP Dashboard Environment..."

# Create .env file for backend if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env from example.env..."
    cp backend/example.env backend/.env
    echo "✅ Created backend/.env"
    echo "⚠️  Please edit backend/.env with your actual API keys"
else
    echo "ℹ️  backend/.env already exists"
fi

# Create .env.local for frontend if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local..."
    cat > .env.local << EOF
# Frontend Environment Variables
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
EOF
    echo "✅ Created .env.local"
else
    echo "ℹ️  .env.local already exists"
fi

echo ""
echo "📝 Next steps:"
echo "1. Edit backend/.env with your MongoDB URI and API keys"
echo "2. Edit .env.local with your frontend API keys"
echo "3. Run: npm install (or pnpm install)"
echo "4. Start MongoDB: mongod (or use MongoDB Atlas)"
echo "5. Run backend: npm run dev:backend"
echo "6. Run frontend: npm run dev"
echo ""
echo "✅ Setup complete!"

