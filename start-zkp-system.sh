#!/bin/bash
#!/bin/bash

# Set error handling
set -e

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Function to start a service
start_service() {
  echo "🔄 Starting $1..."
  cd "$2"
  if [ -f "package.json" ]; then
    if [ ! -d "node_modules" ]; then
      echo "📦 Installing dependencies for $1..."
      npm install
    fi
    # Start in background and save PID
    npm run dev &> "$1.log" &
    echo $! > "$1.pid"
    echo "✅ $1 started (PID: $(cat $1.pid))"
  else
    echo "❌ $1 not found in $2"
    exit 1
  fi
}

# Create .env files if they don't exist
create_env_files() {
  # Backend .env
  if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env..."
    cat > backend/.env << 'ENV_END'
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/zkp-dashboard
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
ENV_END
  fi

  # Frontend .env.local
  if [ ! -f "frontend/.env.local" ]; then
    echo "Creating frontend/.env.local..."
    cat > frontend/.env.local << 'ENV_END'
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_INFURA_ID=your_infura_id
NEXT_PUBLIC_ALCHEMY_KEY=your_alchemy_key
ENV_END
  fi
}

# Main execution
main() {
  echo "🚀 Starting ZKP Dashboard System..."
  
  # Create necessary directories
  mkdir -p backend/logs frontend/logs
  
  # Create .env files
  create_env_files

  # Start MongoDB
  echo "🔄 Starting MongoDB..."
  if ! command_exists mongod; then
    echo "❌ MongoDB is not installed. Please install it first."
    echo "Run: brew tap mongodb/brew && brew install mongodb-community"
    exit 1
  fi
  
  # Start MongoDB in the background
  mongod --config /usr/local/etc/mongod.conf --fork --logpath ./mongod.log
  
  # Wait for MongoDB to start
  sleep 2
  
  # Start backend
  start_service "Backend" "backend"
  
  # Start frontend
  start_service "Frontend" "frontend"
  
  # Print success message
  echo -e "\n🎉 All services started successfully!"
  echo "----------------------------------------"
  echo "🌐 Frontend: http://localhost:3000"
  echo "🔧 Backend API: http://localhost:5000"
  echo "📊 MongoDB: mongodb://127.0.0.1:27017/zkp-dashboard"
  echo "----------------------------------------"
  echo "📝 Logs:"
  echo "  - Backend: tail -f backend/backend.log"
  echo "  - Frontend: tail -f frontend/frontend.log"
  echo "  - MongoDB: tail -f mongod.log"
  echo -e "\n🛑 To stop all services: pkill -f 'node|mongod'"
}

# Run main function
main
