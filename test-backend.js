// Simple test script to verify backend connection
const API_BASE_URL = 'https://belku.onrender.com/api';

async function testBackend() {
  console.log('Testing backend connection...');
  
  try {
    // Test basic connection
    const response = await fetch(`${API_BASE_URL}/newspapers`);
    const data = await response.json();
    
    console.log('✅ Backend connection successful!');
    console.log('Response status:', response.status);
    console.log('Newspapers found:', data.length || 0);
    
    if (data.length > 0) {
      console.log('Sample newspaper:', data[0]);
    }
    
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
  }
}

// Run the test
testBackend();