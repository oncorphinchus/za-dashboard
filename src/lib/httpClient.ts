import { Agent } from 'https';

/**
 * Creates fetch options with an HTTPS agent that allows self-signed certificates
 * Only use this in development environments or when connecting to trusted servers with self-signed certs
 */
export function createFetchOptions(headers: Record<string, string> = {}) {
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