// API Diagnostic Tool
// Run with: node scripts/api-diagnostic.js

// Disable certificate validation for self-signed certs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Load environment variables from .env.local if it exists
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  console.log('dotenv not installed, skipping .env.local loading');
}

// Get API URL and key from environment variables or command line arguments
const API_URL = process.env.NEXT_PUBLIC_MANAGEMENT_BACKEND_URL || process.argv[2];
const API_KEY = process.env.MANAGEMENT_BACKEND_API_KEY || process.argv[3];

if (!API_URL) {
  console.error('ERROR: Backend URL not provided. Set NEXT_PUBLIC_MANAGEMENT_BACKEND_URL or provide as first argument');
  console.log('Usage: node scripts/api-diagnostic.js [API_URL] [API_KEY]');
  process.exit(1);
}

if (!API_KEY) {
  console.error('ERROR: API Key not provided. Set MANAGEMENT_BACKEND_API_KEY or provide as second argument');
  console.log('Usage: node scripts/api-diagnostic.js [API_URL] [API_KEY]');
  process.exit(1);
}

console.log(`======= WireGuard API Diagnostic Tool =======`);
console.log(`Testing connection to backend: ${API_URL}`);
console.log(`Using API key: ${API_KEY.substring(0, 3)}...${API_KEY.substring(API_KEY.length - 3)}`);
console.log(`=============================================\n`);

// Authentication formats to try
const authFormats = [
  { name: 'Bearer Token', headers: { 'Authorization': `Bearer ${API_KEY}` } },
  { name: 'API Key', headers: { 'Authorization': `ApiKey ${API_KEY}` } },
  { name: 'Key Only', headers: { 'Authorization': API_KEY } },
  { name: 'X-API-Key Header', headers: { 'X-API-Key': API_KEY } },
  { name: 'api_key Query Param', queryParam: `api_key=${encodeURIComponent(API_KEY)}`, headers: {} }
];

// Server list endpoints to try
const serverEndpoints = [
  '/servers',
  '/api/servers',
  '/servers-list',
  '/api/v1/servers',
  '/v1/servers',
  '/admin/servers',
  '/wg/servers'
];

async function testEndpoint(endpoint, authFormat) {
  const queryParam = authFormat.queryParam ? `?${authFormat.queryParam}` : '';
  const targetUrl = `${API_URL}${endpoint}${queryParam}`;
  
  console.log(`\nTrying: ${authFormat.name} with ${endpoint}`);
  console.log(`URL: ${targetUrl}`);
  
  try {
    const response = await fetch(targetUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...authFormat.headers
      }
    });

    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      console.log('✅ SUCCESS! This combination works');
      try {
        const data = await response.json();
        
        // Check response format
        if (Array.isArray(data)) {
          console.log(`Found array data with ${data.length} items`);
        } else if (data.servers && Array.isArray(data.servers)) {
          console.log(`Found wrapped data with ${data.servers.length} servers`);
        } else {
          console.log('Data structure:', JSON.stringify(data).slice(0, 100) + '...');
        }
        
        // Save this working combination
        return {
          endpoint,
          authFormat: authFormat.name,
          works: true
        };
      } catch (e) {
        console.log('Response not valid JSON');
      }
    } else {
      try {
        const text = await response.text();
        console.log('Error response:', text.slice(0, 200));
      } catch (e) {
        console.log('Could not read error response');
      }
    }
  } catch (error) {
    console.error(`Error:`, error.message);
  }
  
  return {
    endpoint,
    authFormat: authFormat.name,
    works: false
  };
}

async function runTests() {
  console.log(`Testing ${authFormats.length} auth formats × ${serverEndpoints.length} endpoints = ${authFormats.length * serverEndpoints.length} combinations\n`);
  
  const results = [];
  
  for (const endpoint of serverEndpoints) {
    for (const authFormat of authFormats) {
      const result = await testEndpoint(endpoint, authFormat);
      results.push(result);
    }
  }
  
  // Find working combinations
  const workingCombinations = results.filter(r => r.works);
  
  console.log('\n=============================================');
  console.log(`TEST RESULTS: ${workingCombinations.length} working combinations found`);
  console.log('=============================================');
  
  if (workingCombinations.length > 0) {
    console.log('\nWorking combinations:');
    workingCombinations.forEach((combo, index) => {
      console.log(`${index + 1}. Endpoint: "${combo.endpoint}" with "${combo.authFormat}" authentication`);
    });
    
    console.log('\nTo use this in your application:');
    console.log('1. In .env.local, set:');
    console.log(`   NEXT_PUBLIC_MANAGEMENT_BACKEND_URL=${API_URL}`);
    console.log(`   MANAGEMENT_BACKEND_API_KEY=${API_KEY}`);
    
    // Recommend auth format
    if (workingCombinations[0].authFormat === 'Bearer Token') {
      console.log('   API_AUTH_FORMAT=bearer (default)');
    } else if (workingCombinations[0].authFormat === 'API Key') {
      console.log('   API_AUTH_FORMAT=apikey');
    } else if (workingCombinations[0].authFormat === 'Key Only') {
      console.log('   API_AUTH_FORMAT=raw');
    } else if (workingCombinations[0].authFormat === 'X-API-Key Header') {
      console.log('   API_AUTH_FORMAT=x-api-key');
    }
    
    console.log('\n2. Edit src/app/api/servers/route.ts:');
    console.log('   Make sure the following endpoint is included first in the possibleEndpoints array:');
    console.log(`   '${workingCombinations[0].endpoint}',`);
  } else {
    console.log('\n❌ No working combinations found!');
    console.log('Please check:');
    console.log('1. The backend URL is correct and accessible');
    console.log('2. The API key is valid');
    console.log('3. The backend is running and properly configured');
    console.log('4. Network connectivity and firewall rules');
  }
}

runTests().catch(console.error); 