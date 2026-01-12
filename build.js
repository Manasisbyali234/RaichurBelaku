const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting build process...');

try {
  // Set permissions for vite binary
  const vitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');
  if (fs.existsSync(vitePath)) {
    try {
      fs.chmodSync(vitePath, '755');
      console.log('Set permissions for vite binary');
    } catch (err) {
      console.log('Could not set permissions, continuing...');
    }
  }

  // Run vite build
  console.log('Running vite build...');
  execSync('npx vite build', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}