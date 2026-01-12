# Backend-Only Deployment Guide

## Current Issue
Your app is deployed as **static** but needs **Node.js backend** to serve PDFs.

## Quick Fix Steps

### 1. Update Your Render Service
1. Go to your Render dashboard: https://dashboard.render.com
2. Find your `raichuru-belaku` service
3. Go to **Settings**
4. Change **Environment** from `Static Site` to `Web Service`
5. Set **Build Command**: `npm ci && npm run build`
6. Set **Start Command**: `node server.js`

### 2. Add Environment Variables
In Render dashboard → Environment tab, add:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb://localhost:27017/raichur-belaku
JWT_SECRET=your-secret-key-here
```

### 3. Add MongoDB Database
1. In Render dashboard, create new **PostgreSQL** database (free tier)
2. Or use **MongoDB Atlas** (free tier):
   - Go to https://cloud.mongodb.com
   - Create free cluster
   - Get connection string
   - Update MONGODB_URI in Render

### 4. Redeploy
1. Push your updated code to GitHub
2. Render will automatically redeploy
3. Your app will now serve both frontend and backend

## What This Fixes
- ✅ PDFs stored in backend `/uploads` folder
- ✅ All data in MongoDB database
- ✅ Single service handles everything
- ✅ No external dependencies

## Test After Deployment
1. Visit your app URL
2. Go to Admin → Upload PDF
3. PDF should upload and display correctly
4. Check "Today's Newspaper" page

## Alternative: Use MongoDB Atlas
If local MongoDB doesn't work on Render:

1. Create free MongoDB Atlas account
2. Create cluster and get connection string
3. Update MONGODB_URI in Render environment variables
4. Redeploy

Your PDFs will be stored in the backend and accessible via direct URLs like:
`https://your-app.onrender.com/uploads/filename.pdf`