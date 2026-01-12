# Quick Setup Guide for Raichuru Belaku

## Current Issue Fixed
The project was configured with MongoDB but should use Supabase. I've updated the `.env` files to use Supabase configuration.

## Option 1: Use Supabase (Recommended for Production)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### Step 2: Setup Database
Run this SQL in your Supabase SQL editor:

```sql
-- Create newspapers table
CREATE TABLE newspapers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  pages JSONB DEFAULT '[]',
  total_pages INTEGER DEFAULT 1,
  preview_image TEXT,
  width INTEGER,
  height INTEGER,
  areas JSONB DEFAULT '[]',
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create todays_newspaper table
CREATE TABLE todays_newspaper (
  id INTEGER PRIMARY KEY DEFAULT 1,
  newspaper_id TEXT REFERENCES newspapers(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('newspapers', 'newspapers', true);
```

### Step 3: Update Environment Variables
Replace the placeholder values in `.env` files with your actual Supabase credentials:

```env
REACT_APP_SUPABASE_URL=https://your-actual-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-actual-anon-key
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

### Step 4: Run the Application
```bash
npm install
npm run dev
```

## Option 2: Use Local Storage Only (Development)

If you want to test without Supabase:

1. Leave the Supabase URLs as placeholders (the app will fallback to localStorage)
2. Run: `npm run dev`
3. The app will work with browser localStorage for data storage

## Option 3: Keep MongoDB Backend (Not Recommended)

If you prefer to keep the MongoDB setup:

1. Install MongoDB locally
2. Update `.env` to use MongoDB URLs
3. Run both backend and frontend:
   ```bash
   npm run start:all
   ```

## Recommended Next Steps

1. **For Production**: Use Option 1 (Supabase) - it provides cloud storage, database, and shareable PDF links
2. **For Development**: Use Option 2 (localStorage) - quick to test without setup
3. **Migration**: If you have existing data in MongoDB, you can export it and import to Supabase

## Testing the Setup

After setup, test by:
1. Going to Admin Dashboard (ಆಡಳಿತ)
2. Uploading a PDF file
3. Creating clickable areas
4. Viewing the newspaper in "ಇಂದಿನ ಪತ್ರಿಕೆ"

The app will automatically detect which storage method is available and use the appropriate one.