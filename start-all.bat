@echo off
setlocal enabledelayedexpansion

echo Starting all services...

:: Create .env files if they don't exist
if not exist "user-service\.env" (
    echo Creating .env for user-service...
    (
        echo PORT=3001
        echo MONGO_URL=mongodb://127.0.0.1:27017/userdb
        echo JWT_SECRET=my_secret_key
    ) > user-service\.env
)

if not exist "post-service\.env" (
    echo Creating .env for post-service...
    (
        echo PORT=3002
        echo MONGO_URL=mongodb://127.0.0.1:27017/postdb
        echo JWT_SECRET=my_secret_key
    ) > post-service\.env
)

if not exist "comment-service\.env" (
    echo Creating .env for comment-service...
    (
        echo PORT=3003
        echo MONGO_URL=mongodb://127.0.0.1:27017/commentdb
        echo JWT_SECRET=my_secret_key
    ) > comment-service\.env
)

if not exist "frontend\frontend\.env" (
    echo Creating .env for frontend...
    (
        echo PORT=3004
    ) > frontend\frontend\.env
)

:: Check if MongoDB is installed
echo 🔄 Checking MongoDB status...

:: Check if MongoDB service exists and is running
sc query "MongoDB" > nul
if %ERRORLEVEL% EQU 0 (
    :: Service exists, check if it's running
    sc query "MongoDB" | find "RUNNING" > nul
    if %ERRORLEVEL% EQU 0 (
        echo ✅ MongoDB service is running
    ) else (
        echo 🚀 Starting MongoDB service...
        net start MongoDB
        if %ERRORLEVEL% EQU 0 (
            echo ✅ MongoDB service started successfully
        ) else (
            echo ❌ Failed to start MongoDB service
            echo Please start MongoDB manually:
            echo 1. Open Services (services.msc)
            echo 2. Find 'MongoDB' service
            echo 3. Right-click and select 'Start'
            exit /b 1
        )
    )
) else (
    :: Check port 27017 in case MongoDB is running without service
    netstat -an | find "27017" > nul
    if %ERRORLEVEL% EQU 0 (
        echo ✅ MongoDB is running on port 27017
    ) else (
        echo ❌ MongoDB service not found
        echo Please ensure MongoDB is installed correctly:
        echo 1. Run MongoDB installer from https://www.mongodb.com/try/download/community
        echo 2. Choose 'Complete' installation
        echo 3. Make sure to install MongoDB as a Service
        echo 4. Restart your computer after installation
        exit /b 1
    )
)

:: Start MongoDB (assuming it's installed and in PATH)
start "MongoDB" mongod

echo ⏳ Waiting for MongoDB to initialize...
timeout /t 5 /nobreak >nul

:: Start services one by one
echo Starting User Service...
cd user-service
call npm install
start "User Service" cmd /c "npm run dev"
cd ..
echo Waiting for user-service to initialize...
timeout /t 5 /nobreak >nul

echo Starting Post Service...
cd post-service
call npm install
start "Post Service" cmd /c "npm run dev"
cd ..
echo Waiting for post-service to initialize...
timeout /t 5 /nobreak >nul

echo Starting Comment Service...
cd comment-service
call npm install
start "Comment Service" cmd /c "npm run dev"
cd ..
echo ⏳ Waiting for comment-service to initialize...
timeout /t 5 /nobreak >nul

echo Starting Frontend...
cd frontend\frontend
call npm install
start "Frontend" cmd /c "npm run dev"
cd ..\..

echo All services have been started!
echo Frontend: http://localhost:3004
echo User Service: http://localhost:3001
echo Post Service: http://localhost:3002
echo Comment Service: http://localhost:3003
echo.
echo Use Ctrl+C to stop all services

:: Keep the window open
pause