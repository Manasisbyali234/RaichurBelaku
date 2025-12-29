-- Create newspapers table
CREATE TABLE newspapers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  pages JSONB,
  total_pages INTEGER,
  preview_image TEXT,
  width INTEGER,
  height INTEGER,
  areas JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create todays_newspaper table
CREATE TABLE todays_newspaper (
  id INTEGER PRIMARY KEY DEFAULT 1,
  newspaper_id TEXT REFERENCES newspapers(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_newspapers_date ON newspapers(date DESC);
CREATE INDEX idx_newspapers_name ON newspapers(name);

-- Enable Row Level Security (RLS)
ALTER TABLE newspapers ENABLE ROW LEVEL SECURITY;
ALTER TABLE todays_newspaper ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed)
CREATE POLICY "Allow all operations on newspapers" ON newspapers
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on todays_newspaper" ON todays_newspaper
  FOR ALL USING (true);

-- Insert initial record for todays_newspaper
INSERT INTO todays_newspaper (id, newspaper_id) VALUES (1, NULL)
ON CONFLICT (id) DO NOTHING;