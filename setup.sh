#!/bin/bash

echo "Setting up Raichuru Belaku with Backend Storage..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Create uploads directory
echo "Creating uploads directory..."
mkdir -p uploads

# Start backend server
echo "Starting backend server..."
echo "Backend will run on http://localhost:3001"
echo "Frontend will run on http://localhost:5173"
echo ""
echo "To start both servers, run: npm run start:all"
echo "Or start them separately:"
echo "  Backend: npm run backend:dev"
echo "  Frontend: npm run dev"
echo ""
echo "Setup complete!"