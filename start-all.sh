#!/bin/bash

# Function to install dependencies and start a service
start_service() {
    local service_name=$1
    local port=$2
    echo "📦 Installing dependencies for $service_name..."
    cd $service_name
    npm install
    if [ $? -eq 0 ]; then
        echo "Dependencies installed successfully for $service_name"
        echo "Starting $service_name on port $port..."
        start /B cmd /c "npm run dev"
        cd ..
    else
        echo "❌ Failed to install dependencies for $service_name"
        cd ..
        exit 1
    fi
}

echo " Starting all services..."

# Create .env files if they don't exist
if [ ! -f "./user-service/.env" ]; then
    echo "Creating .env for user-service..."
    echo "PORT=3001
MONGO_URL=mongodb://127.0.0.1:27017/userdb
JWT_SECRET=my_secret_key" > ./user-service/.env
fi

if [ ! -f "./post-service/.env" ]; then
    echo "Creating .env for post-service..."
    echo "PORT=3002
MONGO_URL=mongodb://127.0.0.1:27017/postdb
JWT_SECRET=my_secret_key" > ./post-service/.env
fi

if [ ! -f "./comment-service/.env" ]; then
    echo "Creating .env for comment-service..."
    echo "PORT=3003
MONGO_URL=mongodb://127.0.0.1:27017/commentdb
JWT_SECRET=my_secret_key" > ./comment-service/.env
fi

if [ ! -f "./frontend/frontend/.env" ]; then
    echo "Creating .env for frontend..."
    echo "PORT=3004" > ./frontend/frontend/.env
fi

# Start MongoDB if not running (assuming it's installed)
echo "Checking MongoDB status..."
mongod --version > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "MongoDB is installed"
else
    echo "MongoDB is not installed. Please install MongoDB first"
    exit 1
fi

# Start services
start_service "user-service" 3001
echo "Waiting for user-service to initialize..."
sleep 5

start_service "post-service" 3002
echo "Waiting for post-service to initialize..."
sleep 5

start_service "comment-service" 3003
echo "Waiting for comment-service to initialize..."
sleep 5

start_service "frontend/frontend" 3004

echo "All services have been started!"
echo "Frontend: http://localhost:3004"
echo "User Service: http://localhost:3001"
echo "Post Service: http://localhost:3002"
echo "Comment Service: http://localhost:3003"
echo "
Use Ctrl+C to stop all services"

# Keep the script running
wait