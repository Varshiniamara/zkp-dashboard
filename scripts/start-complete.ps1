# Complete ZKP Dashboard Startup Script (PowerShell)
# Starts both backend and frontend on single localhost

Write-Host "🚀 Starting Complete ZKP Dashboard..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Check if MongoDB is running
$mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if (-not $mongoProcess) {
    Write-Host "⚠️  MongoDB doesn't appear to be running." -ForegroundColor Yellow
    Write-Host "   Please start MongoDB: mongod" -ForegroundColor Yellow
    Write-Host "   Or use MongoDB Atlas and update MONGO_URI in backend/.env" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
}

# Check if .env files exist
if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  backend\.env not found. Running setup..." -ForegroundColor Yellow
    npm run setup
    if ($LASTEXITCODE -ne 0) {
        node scripts/setup-env.js
    }
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
    npm install
}

Write-Host ""
Write-Host "✅ Pre-flight checks complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Starting servers..." -ForegroundColor Cyan
Write-Host ""

# Check if concurrently is installed
$concurrentlyInstalled = npm list concurrently 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "📦 Installing concurrently..." -ForegroundColor Cyan
    npm install -D concurrently
}

# Start both servers
npx concurrently --names "BACKEND,FRONTEND" --prefix-colors "cyan,yellow" "npm run dev:backend" "npm run dev"

