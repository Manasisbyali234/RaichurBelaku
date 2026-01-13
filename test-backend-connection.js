import http from 'http';

console.log('Testing backend connection...');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`✓ Backend is running! Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    process.exit(0);
  });
});

req.on('error', (err) => {
  console.error('✗ Backend connection failed:', err.message);
  console.log('\nTo fix this:');
  console.log('1. Run: fix-server-error.bat');
  console.log('2. Or manually start: cd backend && node simple-server.js');
  process.exit(1);
});

req.setTimeout(5000, () => {
  console.error('✗ Backend connection timeout');
  req.destroy();
  process.exit(1);
});

req.end();