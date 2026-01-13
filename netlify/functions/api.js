exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const path = event.path.replace('/.netlify/functions/api', '');
  
  if (path === '/health') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() })
    };
  }

  if (path === '/auth/login' && event.httpMethod === 'POST') {
    const { username, password } = JSON.parse(event.body);
    if (username === 'admin' && password === 'admin123') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Login successful' })
      };
    }
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ message: 'Invalid credentials' })
    };
  }

  if (path === '/newspapers') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([])
    };
  }

  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ message: 'Not found' })
  };
};