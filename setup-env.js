#!/usr/bin/env node

// Environment Setup Script for Raichuru Belaku
// Run with: node setup-env.js

import { readFileSync, writeFileSync } from 'fs';
import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupEnvironment() {
  console.log('🚀 Raichuru Belaku Environment Setup\n');
  
  console.log('Please provide your Supabase project details:');
  console.log('(You can find these in your Supabase dashboard > Settings > API)\n');
  
  const supabaseUrl = await question('Supabase Project URL: ');
  const supabaseKey = await question('Supabase Anon Key: ');
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Both URL and key are required!');
    process.exit(1);
  }
  
  const envContent = `# Supabase Configuration
# Replace with your actual Supabase project details
# Note: Use VITE_ prefix for Vite environment variables

VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseKey}

# Legacy React App variables (kept for compatibility)
REACT_APP_SUPABASE_URL=${supabaseUrl}
REACT_APP_SUPABASE_ANON_KEY=${supabaseKey}

# Auto-generated on ${new Date().toISOString()}
`;

  try {
    writeFileSync('.env', envContent);
    console.log('\n✅ Environment file created successfully!');
    console.log('📁 File: .env');
    console.log('\nNext steps:');
    console.log('1. Run: npm install');
    console.log('2. Run: npm run dev');
    console.log('3. Test PDF upload in admin dashboard');
    console.log('\nFor Netlify deployment, add these environment variables:');
    console.log(`VITE_SUPABASE_URL=${supabaseUrl}`);
    console.log(`VITE_SUPABASE_ANON_KEY=${supabaseKey}`);
  } catch (error) {
    console.log('❌ Error creating .env file:', error.message);
  }
  
  rl.close();
}

setupEnvironment().catch(console.error);