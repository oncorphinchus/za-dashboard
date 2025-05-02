import { Agent } from 'https';

/**
 * Ensures that self-signed certificates are accepted in server-side code
 * WARNING: This disables SSL certificate validation. Only use in development
 * or when connecting to trusted backends with self-signed certificates.
 */
export function disableCertificateVerification() {
  // Only run on the server, not in the browser
  if (typeof window === 'undefined') {
    // Set the Node.js environment variable to disable certificate validation
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }
}

/**
 * Creates fetch options with an HTTPS agent that allows self-signed certificates
 * Only use this in development environments or when connecting to trusted servers with self-signed certs
 */
export function createFetchOptions(headers: Record<string, string> = {}) {
  // Call the function to disable certificate verification
  disableCertificateVerification();
  
  // Only create the agent on the server side (not in the browser)
  const agent = typeof window === 'undefined' 
    ? new Agent({ rejectUnauthorized: false }) 
    : undefined;

  return {
    headers,
    agent,
    cache: 'no-store' as const
  };
} 