// Backend Endpoint Discovery Tool
// Run with: node scripts/find-backend-endpoints.js [SERVER_ID] [PEER_KEY]

// Disable certificate validation for self-signed certs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Load environment variables from .env.local if it exists
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  console.log('dotenv not installed, skipping .env.local loading');
}

// Helper function to join URL paths correctly without double slashes
function joinUrl(base, path) {
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

// Get arguments from command line
const backendUrl = process.env.NEXT_PUBLIC_MANAGEMENT_BACKEND_URL || process.argv[2];
const apiKey = process.env.NEXT_PUBLIC_MANAGEMENT_BACKEND_API_KEY || process.argv[3];
const serverId = process.argv[4]; // Optional for testing server-specific endpoints
const peerKey = process.argv[5];  // Optional for testing peer-specific endpoints

if (!backendUrl) {
  console.error('ERROR: Backend URL not provided. Set NEXT_PUBLIC_MANAGEMENT_BACKEND_URL or provide as first argument');
  console.log('Usage: node scripts/find-backend-endpoints.js [BACKEND_URL] [API_KEY] [SERVER_ID] [PEER_KEY]');
  process.exit(1);
}

if (!apiKey) {
  console.error('ERROR: API Key not provided. Set NEXT_PUBLIC_MANAGEMENT_BACKEND_API_KEY or provide as second argument');
  console.log('Usage: node scripts/find-backend-endpoints.js [BACKEND_URL] [API_KEY] [SERVER_ID] [PEER_KEY]');
  process.exit(1);
}

console.log(`\n🔍 Backend API Discovery Tool`);
console.log(`Testing connection to: ${backendUrl}`);
console.log(`Using API key: ${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)}`);
if (serverId) console.log(`Using server ID: ${serverId}`);
if (peerKey) console.log(`Using peer key: ${peerKey}`);
console.log(`\n====================================\n`);

// Define the endpoints to test
let endpointsToTest = [];

// Basic server list endpoints - always test these
const serverListEndpoints = [
  '',
  'servers',
  'api/servers',
  'servers-list',
  'api/v1/servers',
  'v1/servers',
  'wg/servers',
  'admin/servers',
  'wireguard/servers'
];
endpointsToTest.push(...serverListEndpoints.map(path => ({ 
  path, 
  method: 'GET', 
  description: 'Server listing' 
})));

// If server ID is provided, add server-specific endpoints
if (serverId) {
  const serverEndpoints = [
    `servers/${serverId}`,
    `api/servers/${serverId}`,
    `servers/${serverId}/status`,
    `api/servers/${serverId}/status`,
    `servers-status/${serverId}`,
    `api/v1/servers/${serverId}/status`,
    `v1/servers/${serverId}/status`,
    `server/${serverId}/status`,
    `api/server/${serverId}/status`,
    `servers/${serverId}/peers`,
    `api/servers/${serverId}/peers`,
    `api/v1/servers/${serverId}/peers`,
    `v1/servers/${serverId}/peers`
  ];
  
  endpointsToTest.push(...serverEndpoints.map(path => ({ 
    path, 
    method: 'GET', 
    description: 'Server details/status' 
  })));
  
  // Add POST endpoints for peer creation
  endpointsToTest.push(
    ...[
      `servers/${serverId}/peers`,
      `api/servers/${serverId}/peers`,
      `api/v1/servers/${serverId}/peers`,
      `v1/servers/${serverId}/peers`
    ].map(path => ({ 
      path, 
      method: 'POST',
      body: JSON.stringify({ description: "Test peer from discovery tool" }),
      description: 'Peer creation' 
    }))
  );
  
  // If peer key is provided, test peer-specific endpoints
  if (peerKey) {
    const peerEndpoints = [
      `servers/${serverId}/peers/${peerKey}`,
      `api/servers/${serverId}/peers/${peerKey}`,
      `api/v1/servers/${serverId}/peers/${peerKey}`,
      `v1/servers/${serverId}/peers/${peerKey}`,
      `servers/${serverId}/peers/${peerKey}/config`,
      `api/servers/${serverId}/peers/${peerKey}/config`,
      `api/v1/servers/${serverId}/peers/${peerKey}/config`,
      `v1/servers/${serverId}/peers/${peerKey}/config`
    ];
    
    endpointsToTest.push(...peerEndpoints.map(path => ({ 
      path, 
      method: 'GET', 
      description: 'Peer details/config' 
    })));
    
    // Add DELETE endpoints for peer removal (but don't execute them)
    endpointsToTest.push(
      ...[
        `servers/${serverId}/peers/${peerKey}`,
        `api/servers/${serverId}/peers/${peerKey}`,
        `api/v1/servers/${serverId}/peers/${peerKey}`,
        `v1/servers/${serverId}/peers/${peerKey}`
      ].map(path => ({ 
        path, 
        method: 'DELETE_TEST_ONLY', // We won't actually DELETE, just check if endpoint exists
        description: 'Peer deletion (not executed)' 
      }))
    );
  }
}

async function testEndpoint(endpoint) {
  const fullUrl = joinUrl(backendUrl, endpoint.path);
  
  try {
    const method = endpoint.method === 'DELETE_TEST_ONLY' ? 'HEAD' : endpoint.method;
    
    console.log(`Testing [${method}] ${fullUrl}...`);
    
    const response = await fetch(fullUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: endpoint.body ? endpoint.body : undefined,
      cache: 'no-store'
    });
    
    if (response.ok) {
      console.log(`✅ SUCCESS! Status: ${response.status} ${response.statusText}`);
      
      try {
        // Only try to parse JSON for GET requests to avoid side effects
        if (method === 'GET') {
          const data = await response.json();
          if (Array.isArray(data)) {
            console.log(`   Response type: Array with ${data.length} items`);
          } else if (typeof data === 'object') {
            console.log(`   Response type: Object with keys: ${Object.keys(data).join(', ')}`);
          }
        }
      } catch (e) {
        console.log(`   Response is not valid JSON`);
      }
      
      return {
        endpoint: endpoint.path,
        method: endpoint.method,
        description: endpoint.description,
        status: response.status,
        success: true
      };
    } else {
      console.log(`❌ FAILED! Status: ${response.status} ${response.statusText}`);
      return {
        endpoint: endpoint.path,
        method: endpoint.method,
        status: response.status,
        success: false
      };
    }
  } catch (error) {
    console.log(`❌ ERROR! ${error.message}`);
    return {
      endpoint: endpoint.path,
      method: endpoint.method,
      error: error.message,
      success: false
    };
  }
}

async function runDiscovery() {
  console.log(`Testing ${endpointsToTest.length} possible endpoints...\n`);
  
  const results = [];
  
  for (const endpoint of endpointsToTest) {
    const result = await testEndpoint(endpoint);
    results.push(result);
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Find working endpoints
  const workingEndpoints = results.filter(r => r.success);
  
  console.log('\n==== DISCOVERY RESULTS ====');
  console.log(`Found ${workingEndpoints.length} working endpoints out of ${endpointsToTest.length} tested`);
  
  if (workingEndpoints.length > 0) {
    console.log('\nWorking API Endpoints:');
    console.log('---------------------');
    
    // Group by description
    const groupedEndpoints = {};
    workingEndpoints.forEach(endpoint => {
      const key = endpoint.description || 'Other';
      if (!groupedEndpoints[key]) {
        groupedEndpoints[key] = [];
      }
      groupedEndpoints[key].push(endpoint);
    });
    
    // Display grouped results
    for (const [description, endpoints] of Object.entries(groupedEndpoints)) {
      console.log(`\n${description}:`);
      endpoints.forEach(endpoint => {
        console.log(`  - [${endpoint.method}] ${endpoint.endpoint}`);
      });
    }
    
    console.log('\n=== RECOMMENDATIONS ===');
    // Find server list endpoint for recommendations
    const serverListEndpoint = workingEndpoints.find(e => 
      e.description === 'Server listing' && e.method === 'GET' && e.success);
    
    if (serverListEndpoint) {
      console.log('\nUpdate your Next.js API routes to prioritize these endpoints:');
      console.log('\n1. In src/app/api/servers/route.ts:');
      console.log('   Update possibleEndpoints to prioritize:');
      console.log(`   '${serverListEndpoint.endpoint}',`);
      
      if (serverId) {
        const serverStatusEndpoint = workingEndpoints.find(e => 
          e.description === 'Server details/status' && e.method === 'GET' && e.success);
        
        if (serverStatusEndpoint) {
          const pattern = serverStatusEndpoint.endpoint.replace(serverId, '${serverId}');
          console.log('\n2. In src/app/api/servers/[serverId]/status/route.ts:');
          console.log('   Update possibleEndpoints to prioritize:');
          console.log(`   \`${pattern}\`,`);
        }
        
        const peerCreationEndpoint = workingEndpoints.find(e => 
          e.description === 'Peer creation' && e.method === 'POST' && e.success);
        
        if (peerCreationEndpoint) {
          const pattern = peerCreationEndpoint.endpoint.replace(serverId, '${serverId}');
          console.log('\n3. In src/app/api/servers/[serverId]/peers/route.ts:');
          console.log('   Update possibleEndpoints to prioritize:');
          console.log(`   \`${pattern}\`,`);
        }
        
        if (peerKey) {
          const peerConfigEndpoint = workingEndpoints.find(e => 
            e.description === 'Peer details/config' && e.method === 'GET' && e.success && e.endpoint.includes('config'));
          
          if (peerConfigEndpoint) {
            const pattern = peerConfigEndpoint.endpoint
              .replace(serverId, '${serverId}')
              .replace(peerKey, '${encodeURIComponent(peerPublicKey)}');
            
            console.log('\n4. In src/app/api/servers/[serverId]/peers/[peerPublicKey]/config/route.ts:');
            console.log('   Update possibleEndpoints to prioritize:');
            console.log(`   \`${pattern}\`,`);
          }
          
          const peerDeleteEndpoint = workingEndpoints.find(e => 
            (e.description === 'Peer deletion (not executed)' || e.description === 'Peer details/config') && 
            !e.endpoint.includes('config'));
          
          if (peerDeleteEndpoint) {
            const pattern = peerDeleteEndpoint.endpoint
              .replace(serverId, '${serverId}')
              .replace(peerKey, '${encodeURIComponent(peerPublicKey)}');
            
            console.log('\n5. In src/app/api/servers/[serverId]/peers/[peerPublicKey]/route.ts:');
            console.log('   Update possibleEndpoints to prioritize:');
            console.log(`   \`${pattern}\`,`);
          }
        }
      }
    }
  } else {
    console.log('\n❌ No working endpoints found.');
    console.log('Possible issues:');
    console.log('1. The backend URL is incorrect');
    console.log('2. The API key is invalid');
    console.log('3. The API has a completely different structure than expected');
    console.log('4. The server requires different authorization format');
  }
  
  console.log('\n====================================\n');
}

runDiscovery().catch(console.error); 