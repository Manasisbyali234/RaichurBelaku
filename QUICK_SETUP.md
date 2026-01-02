# Quick Setup for Shareable PDFs

## Problem
PDFs uploaded are only stored locally in your browser. Others can't see them when you share links.

## Solution
Set up Supabase cloud storage for shareable PDFs.

## Steps

### 1. Create Supabase Account
1. Go to https://supabase.com
2. Sign up/login
3. Create a new project

### 2. Get Your Credentials
1. In Supabase dashboard, go to **Settings > API**
2. Copy your **Project URL** (looks like: `https://abcdefgh.supabase.co`)
3. Copy your **anon public key** (long string starting with `eyJ...`)

### 3. Update Environment File
Edit `.env` file and replace:
```
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### 4. Create Database Tables
In Supabase dashboard, go to **SQL Editor** and run:
```sql
-- Create newspapers table
CREATE TABLE newspapers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  pages JSONB DEFAULT '[]',
  total_pages INTEGER DEFAULT 1,
  preview_image TEXT,
  width INTEGER,
  height INTEGER,
  areas JSONB DEFAULT '[]',
  pdf_url TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create today's newspaper table
CREATE TABLE todays_newspaper (
  id INTEGER PRIMARY KEY DEFAULT 1,
  newspaper_id TEXT REFERENCES newspapers(id),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Create Storage Bucket
1. Go to **Storage** in Supabase dashboard
2. Create a new bucket named `newspapers`
3. Make it **public** (so PDFs can be accessed via direct links)

### 6. Test
1. Restart your app: `npm run dev`
2. Upload a PDF in admin dashboard
3. The PDF will now be stored in Supabase and shareable!

## Result
✅ PDFs will be accessible via direct links
✅ Anyone can view PDFs you upload
✅ Data is backed up in the cloud