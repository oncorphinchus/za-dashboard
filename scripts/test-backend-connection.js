// Script to test backend API connection with different authentication formats
// Run with: node scripts/test-backend-connection.js

// Disable certificate validation for self-signed certs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Load environment variables from .env.local if it exists
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  console.log('dotenv not installed, skipping .env.local loading');
}

const API_URL = process.env.NEXT_PUBLIC_MANAGEMENT_BACKEND_URL;
const API_KEY = process.env.MANAGEMENT_BACKEND_API_KEY;

if (!API_URL) {
  console.error('ERROR: NEXT_PUBLIC_MANAGEMENT_BACKEND_URL is not set');
  process.exit(1);
}

if (!API_KEY) {
  console.error('ERROR: MANAGEMENT_BACKEND_API_KEY is not set');
  process.exit(1);
}

console.log(`Testing connection to backend: ${API_URL}`);

// Test different authorization header formats
const authFormats = [
  { name: 'Bearer Token', headers: { 'Authorization': `Bearer ${API_KEY}` } },
  { name: 'API Key', headers: { 'Authorization': `ApiKey ${API_KEY}` } },
  { name: 'Key Only', headers: { 'Authorization': API_KEY } },
  { name: 'X-API-Key Header', headers: { 'X-API-Key': API_KEY } },
  { name: 'api_key Query Param', url: `/servers?api_key=${encodeURIComponent(API_KEY)}`, headers: {} }
];

async function testConnection() {
  for (const format of authFormats) {
    const targetUrl = `${API_URL}${format.url || '/servers'}`;
    console.log(`\nTrying format: ${format.name}`);
    console.log(`URL: ${targetUrl}`);
    console.log('Headers:', JSON.stringify(format.headers));

    try {
      const response = await fetch(targetUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...format.headers
        }
      });

      console.log(`Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        console.log('SUCCESS! This authentication format works.');
        try {
          const data = await response.json();
          console.log('Response data:', JSON.stringify(data, null, 2).slice(0, 500) + '...');
        } catch (e) {
          console.log('Could not parse response as JSON');
        }
      } else {
        try {
          const text = await response.text();
          console.log('Error response:', text.slice(0, 1000));
        } catch (e) {
          console.log('Could not read error response');
        }
      }
    } catch (error) {
      console.error(`Error with ${format.name}:`, error.message);
    }
  }
}

testConnection().catch(console.error); 