# Render Deployment Instructions

## Backend Deployment:
1. Create new Web Service on Render
2. Connect your GitHub repo
3. Set these settings:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node
   - **Plan**: Free

## Frontend Deployment:
1. Create new Static Site on Render
2. Connect same GitHub repo
3. Set these settings:
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`

## Environment Variables:
Set in frontend build:
- `VITE_API_URL`: https://your-backend-url.onrender.com
- `VITE_NODE_ENV`: production

## Deploy:
Push to GitHub - both services will auto-deploy!

Your app will be live at:
- Backend: https://your-backend-name.onrender.com
- Frontend: https://your-frontend-name.onrender.com