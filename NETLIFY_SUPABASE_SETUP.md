# Netlify Deployment with Supabase

## Quick Setup Steps

### 1. Set up Supabase
1. Go to https://supabase.com and create account
2. Create new project
3. Go to Settings → API and copy:
   - Project URL
   - anon public key

### 2. Set up Database
1. In Supabase dashboard, go to SQL Editor
2. Copy and run the SQL from `supabase-schema.sql`

### 3. Configure Netlify Environment Variables
1. In Netlify dashboard, go to Site settings → Environment variables
2. Add these variables:
   ```
   REACT_APP_SUPABASE_URL = https://your-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY = your-anon-key-here
   ```

### 4. Deploy
1. Build and deploy: `npm run build`
2. Upload `dist` folder to Netlify

### 5. Migrate Data
1. After deployment, go to Admin Dashboard
2. Use the "Data Migration" section to transfer localStorage data to Supabase
3. Clear localStorage after successful migration

## How it Works

- **Development**: Uses localStorage (no setup needed)
- **Production**: Automatically uses Supabase when environment variables are set
- **Data Sharing**: All users see the same data from Supabase cloud database

## Benefits

✅ **Shared Data**: Everyone sees the same newspapers and articles
✅ **No Data Loss**: Cloud storage prevents data loss
✅ **Unlimited Storage**: No browser storage limits
✅ **Real-time Updates**: Changes appear immediately for all users
✅ **Free Tier**: Supabase free tier is sufficient for this app

## Troubleshooting

If data doesn't appear:
1. Check environment variables in Netlify
2. Verify Supabase project is active
3. Check browser console for errors
4. Use Data Migration tool in Admin Dashboard