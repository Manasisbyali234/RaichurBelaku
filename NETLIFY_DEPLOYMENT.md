# Netlify Deployment Guide for Shareable PDF Links

This guide will help you deploy your Raichuru Belaku newspaper app to Netlify with Supabase for shareable PDF links.

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **GitHub Repository**: Push your code to GitHub

## Step 1: Setup Supabase

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a project name (e.g., "raichuru-belaku")
3. Set a database password
4. Select a region close to your users

### 1.2 Setup Database
1. Go to SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the SQL to create tables

### 1.3 Setup Storage
1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `newspapers`
3. Make the bucket **public** (for shareable links)
4. Set the following bucket policies:
   ```sql
   -- Allow public access to read files
   CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'newspapers');
   
   -- Allow authenticated users to upload
   CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'newspapers');
   ```

### 1.4 Get API Keys
1. Go to Settings > API in your Supabase dashboard
2. Copy your **Project URL** and **anon public key**

## Step 2: Deploy to Netlify

### 2.1 Connect GitHub Repository
1. Go to [netlify.com](https://netlify.com) and log in
2. Click "New site from Git"
3. Connect your GitHub account
4. Select your repository

### 2.2 Configure Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18 or higher

### 2.3 Set Environment Variables
In Netlify dashboard, go to Site settings > Environment variables and add:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual Supabase project URL and anon key.

### 2.4 Deploy
1. Click "Deploy site"
2. Wait for the build to complete
3. Your site will be available at a Netlify URL (e.g., `https://amazing-site-name.netlify.app`)

## Step 3: Test the Setup

### 3.1 Upload a PDF
1. Go to your deployed site
2. Navigate to Admin Dashboard (ಆಡಳಿತ)
3. Login with: `admin` / `admin123`
4. Upload a PDF file
5. The PDF should be stored in Supabase Storage

### 3.2 Verify Shareable Links
1. Go to Archive (ಆರ್ಕೈವ್)
2. You should see "PDF ನೋಡಿ" button for uploaded newspapers
3. Click the button - it should open the PDF in a new tab
4. The URL should be a Supabase Storage URL that works from anywhere

## Step 4: Custom Domain (Optional)

1. In Netlify dashboard, go to Domain settings
2. Add your custom domain
3. Configure DNS settings as instructed by Netlify
4. Enable HTTPS (automatic with Netlify)

## How It Works

1. **PDF Upload**: When admin uploads a PDF, it's stored in Supabase Storage
2. **Public URLs**: Supabase generates public URLs for the PDFs
3. **Database**: Newspaper metadata and PDF URLs are stored in Supabase database
4. **Sharing**: Anyone with the link can access the PDFs directly

## Troubleshooting

### PDFs Not Uploading
- Check Supabase Storage bucket is public
- Verify environment variables are set correctly
- Check browser console for errors

### Links Not Working
- Ensure bucket policies allow public access
- Verify PDF URLs in Supabase Storage dashboard

### Build Failures
- Check Node.js version (use 18+)
- Verify all dependencies are in package.json
- Check build logs for specific errors

## Security Notes

- PDFs are publicly accessible once uploaded
- Admin login is hardcoded (consider changing for production)
- Consider implementing proper authentication for admin features

## Support

If you encounter issues:
1. Check browser console for errors
2. Review Netlify build logs
3. Check Supabase logs in dashboard
4. Ensure all environment variables are set correctly