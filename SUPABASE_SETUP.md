# Supabase Setup Guide for Shared Data Storage

## Quick Setup (5 minutes)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Wait for project to be ready (2-3 minutes)

### 2. Create Database Tables
Run these SQL commands in Supabase SQL Editor:

```sql
-- Create newspapers table
CREATE TABLE newspapers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  pages JSONB,
  total_pages INTEGER,
  preview_image TEXT,
  width INTEGER,
  height INTEGER,
  areas JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create today's newspaper table
CREATE TABLE todays_newspaper (
  id INTEGER PRIMARY KEY DEFAULT 1,
  newspaper_id TEXT REFERENCES newspapers(id),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE newspapers ENABLE ROW LEVEL SECURITY;
ALTER TABLE todays_newspaper ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
CREATE POLICY "Allow all operations on newspapers" ON newspapers FOR ALL USING (true);
CREATE POLICY "Allow all operations on todays_newspaper" ON todays_newspaper FOR ALL USING (true);
```

### 3. Get Project Credentials
1. Go to Project Settings → API
2. Copy:
   - Project URL (looks like: `https://xyz.supabase.co`)
   - Anon/Public Key (starts with `eyJ...`)

### 4. Configure Environment Variables

#### For Netlify Deployment:
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add these variables:
   ```
   REACT_APP_SUPABASE_URL = https://your-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY = your-anon-key-here
   ```

#### For Local Development (Optional):
1. Create `.env` file in project root:
   ```
   REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 5. Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### 6. Deploy to Netlify
1. Build and deploy your project
2. The app will automatically use Supabase in production
3. All users will now see the same data!

## How It Works

- **Development**: Uses localStorage (data stays on your computer)
- **Production**: Uses Supabase (data shared with all users)
- **Automatic**: No code changes needed, switches automatically

## Security Note

The current setup allows public read/write access for demo purposes. For production use, implement proper authentication and row-level security policies.

## Troubleshooting

1. **Data not syncing**: Check environment variables in Netlify
2. **Build errors**: Ensure `@supabase/supabase-js` is installed
3. **Database errors**: Verify SQL tables were created correctly

## Cost

Supabase free tier includes:
- 500MB database storage
- 2GB bandwidth
- 50,000 monthly active users

Perfect for a newspaper website!