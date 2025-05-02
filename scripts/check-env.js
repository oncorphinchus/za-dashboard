// Environment Variable Check Script
// Run with: node scripts/check-env.js

// Load environment variables from .env.local if it exists
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  console.log('dotenv not installed, skipping .env.local loading');
}

// Define required variables
const requiredVariables = [
  { name: 'NEXT_PUBLIC_MANAGEMENT_BACKEND_URL', description: 'The URL of your backend API' },
  { name: 'NEXT_PUBLIC_MANAGEMENT_BACKEND_API_KEY', description: 'Your API key for authentication' },
];

// Define optional variables
const optionalVariables = [
  { name: 'NODE_TLS_REJECT_UNAUTHORIZED', description: 'Set to 0 to allow self-signed certificates', expected: '0' },
];

console.log("\n======= ENVIRONMENT VARIABLE CHECK =======\n");

// Check required variables
let hasAllRequired = true;
console.log("Required Variables:");
console.log("-------------------");
for (const variable of requiredVariables) {
  const value = process.env[variable.name];
  if (!value) {
    console.log(`❌ ${variable.name}: Missing! (${variable.description})`);
    hasAllRequired = false;
  } else {
    // Show only the first 3 and last 3 characters of sensitive values
    const maskedValue = variable.name.includes('KEY') || variable.name.includes('SECRET') 
      ? `${value.substring(0, 3)}...${value.substring(value.length - 3)}`
      : value;
    console.log(`✅ ${variable.name}: ${maskedValue}`);
  }
}

// Check optional variables
console.log("\nOptional Variables:");
console.log("-------------------");
for (const variable of optionalVariables) {
  const value = process.env[variable.name];
  if (!value) {
    console.log(`⚠️ ${variable.name}: Not set (${variable.description})`);
  } else if (variable.expected && value !== variable.expected) {
    console.log(`⚠️ ${variable.name}: Set to '${value}', expected '${variable.expected}' (${variable.description})`);
  } else {
    console.log(`✅ ${variable.name}: ${value}`);
  }
}

// Summary
console.log("\nSummary:");
console.log("--------");
if (hasAllRequired) {
  console.log("✅ All required environment variables are set.");
  console.log("\nYou can start the application with:");
  console.log("npm run dev");
} else {
  console.log("❌ Some required environment variables are missing.");
  console.log("\nCreate or update your .env.local file with the following:");
  
  for (const variable of requiredVariables) {
    if (!process.env[variable.name]) {
      console.log(`${variable.name}=your_${variable.name.toLowerCase()}_here`);
    }
  }
}

console.log("\n=========================================\n"); 