@echo off
echo ==========================================
echo MongoDB Atlas Connection Fix
echo ==========================================
echo.

echo Step 1: Testing current connection...
cd backend
node test-connection.js

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Connection failed! Please follow these steps:
    echo.
    echo 1. Go to MongoDB Atlas Dashboard: https://cloud.mongodb.com/
    echo 2. Login with your account
    echo 3. Select your cluster "RBNews"
    echo 4. Go to "Network Access" in the left sidebar
    echo 5. Click "Add IP Address"
    echo 6. Choose "Add Current IP Address" or "Allow Access from Anywhere"
    echo 7. Save the changes
    echo 8. Wait 2-3 minutes for changes to take effect
    echo 9. Run this script again
    echo.
    echo Alternative: Check if your username/password is correct
    echo Current connection string uses: contactkraftiq_db_user
    echo.
    pause
    exit /b 1
) else (
    echo.
    echo ✅ MongoDB Atlas connection successful!
    echo.
    echo Starting the backend server...
    npm run dev
)