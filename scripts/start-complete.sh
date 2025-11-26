#!/bin/bash

# Complete ZKP Dashboard Startup Script
# Starts both backend and frontend on single localhost

echo "🚀 Starting Complete ZKP Dashboard..."
echo "=================================="

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB doesn't appear to be running."
    echo "   Please start MongoDB: mongod"
    echo "   Or use MongoDB Atlas and update MONGO_URI in backend/.env"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found. Running setup..."
    npm run setup || node scripts/setup-env.js
fi

# Check if database is seeded
if ! mongosh zkp-dashboard --quiet --eval "db.users.countDocuments()" 2>/dev/null | grep -q "[0-9]"; then
    echo "📊 Database not seeded. Seeding now..."
    npm run seed
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "✅ Pre-flight checks complete!"
echo ""
echo "Starting servers..."
echo ""

# Start both servers using concurrently
npx concurrently \
  --names "BACKEND,FRONTEND" \
  --prefix-colors "cyan,yellow" \
  "npm run dev:backend" \
  "npm run dev"

