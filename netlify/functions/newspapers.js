exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  // Simple file-based storage (for demo only)
  const fs = require('fs');
  const path = require('path');
  const dataFile = '/tmp/newspapers.json';

  try {
    if (event.httpMethod === 'GET') {
      if (fs.existsSync(dataFile)) {
        const data = fs.readFileSync(dataFile, 'utf8');
        return {
          statusCode: 200,
          headers,
          body: data
        };
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([])
      };
    }

    if (event.httpMethod === 'POST') {
      const newspapers = JSON.parse(event.body);
      fs.writeFileSync(dataFile, JSON.stringify(newspapers));
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};