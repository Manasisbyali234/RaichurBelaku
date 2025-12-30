# Quick Fix: Supabase Storage Public Access

## Problem
PDFs uploaded to Netlify are not accessible to other users because Supabase Storage bucket is not properly configured for public access.

## Solution

### Step 1: Configure Supabase Storage Bucket

1. **Go to your Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Open your project

2. **Navigate to Storage**
   - Click "Storage" in the left sidebar
   - Find your `newspapers` bucket

3. **Make Bucket Public**
   - Click on the `newspapers` bucket
   - Go to "Configuration" tab
   - Toggle "Public bucket" to **ON**

### Step 2: Set Storage Policies

1. **Go to Storage Policies**
   - In Storage section, click "Policies"
   - Click "New Policy" for the `newspapers` bucket

2. **Create Public Read Policy**
   ```sql
   -- Allow anyone to view/download files
   CREATE POLICY "Public Access" ON storage.objects 
   FOR SELECT USING (bucket_id = 'newspapers');
   ```

3. **Create Upload Policy**
   ```sql
   -- Allow uploads (you can restrict this later)
   CREATE POLICY "Allow Upload" ON storage.objects 
   FOR INSERT WITH CHECK (bucket_id = 'newspapers');
   ```

### Step 3: Test the Fix

1. **Upload a new PDF** through your admin dashboard
2. **Check the Archive page** - you should see "PDF ನೋಡಿ" button
3. **Click the button** - PDF should open in new tab
4. **Copy the URL** and test in incognito/different browser

### Alternative: Manual Bucket Creation

If the bucket doesn't exist:

1. **Create New Bucket**
   - Go to Storage > "New bucket"
   - Name: `newspapers`
   - **Check "Public bucket"**
   - Click "Create bucket"

2. **Upload Test File**
   - Upload any PDF to test
   - Get public URL and verify it works

### Step 4: Verify Environment Variables

Make sure your Netlify site has these environment variables:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Common Issues

1. **Bucket not public**: Toggle "Public bucket" to ON
2. **Missing policies**: Add the SQL policies above
3. **Wrong environment variables**: Check Netlify dashboard
4. **Cache issues**: Try incognito mode or clear browser cache

### Test Command

Run this in your browser console on the admin page to test:

```javascript
// Test Supabase connection
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has Supabase Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

After following these steps, your PDFs should be accessible to all users via shareable links.