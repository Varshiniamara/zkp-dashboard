# PowerShell setup script for ZKP Dashboard (Windows)
# This script helps set up environment variables

Write-Host "🚀 Setting up ZKP Dashboard Environment..." -ForegroundColor Cyan

# Create .env file for backend if it doesn't exist
if (-not (Test-Path "backend\.env")) {
    Write-Host "Creating backend\.env from example.env..." -ForegroundColor Yellow
    Copy-Item "backend\example.env" "backend\.env"
    Write-Host "✅ Created backend\.env" -ForegroundColor Green
    Write-Host "⚠️  Please edit backend\.env with your actual API keys" -ForegroundColor Yellow
} else {
    Write-Host "ℹ️  backend\.env already exists" -ForegroundColor Blue
}

# Create .env.local for frontend if it doesn't exist
if (-not (Test-Path ".env.local")) {
    Write-Host "Creating .env.local..." -ForegroundColor Yellow
    @"
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
"@ | Out-File -FilePath ".env.local" -Encoding utf8
    Write-Host "✅ Created .env.local" -ForegroundColor Green
} else {
    Write-Host "ℹ️  .env.local already exists" -ForegroundColor Blue
}

Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit backend\.env with your MongoDB URI and API keys"
Write-Host "2. Edit .env.local with your frontend API keys"
Write-Host "3. Run: npm install (or pnpm install)"
Write-Host "4. Start MongoDB: mongod (or use MongoDB Atlas)"
Write-Host "5. Run backend: npm run dev:backend"
Write-Host "6. Run frontend: npm run dev"
Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green

