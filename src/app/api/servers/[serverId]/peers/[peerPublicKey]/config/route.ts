import { NextResponse } from 'next/server';
import { disableCertificateVerification } from '@/lib/httpClient';

// Disable certificate verification at module level for server-side code
disableCertificateVerification();

// Helper function to join URL paths correctly without double slashes
function joinUrl(base: string, path: string): string {
  // Remove trailing slash from base if it exists
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  // Remove leading slash from path if it exists
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

// Backend API URL and key from environment variables
const API_URL = process.env.NEXT_PUBLIC_MANAGEMENT_BACKEND_URL || '';
const API_KEY = process.env.MANAGEMENT_BACKEND_API_KEY || '';

// Create headers with API key
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`
};

export async function GET(
  request: Request,
  { params }: { params: { serverId: string, peerPublicKey: string } }
) {
  try {
    const { serverId, peerPublicKey } = params;
    const backendUrl = process.env.NEXT_PUBLIC_MANAGEMENT_BACKEND_URL;
    const apiKey = process.env.NEXT_PUBLIC_MANAGEMENT_BACKEND_API_KEY || process.env.MANAGEMENT_BACKEND_API_KEY;

    if (!backendUrl || !apiKey) {
      throw new Error('Missing required environment variables');
    }

    if (!serverId) {
      return NextResponse.json(
        { error: 'Server ID is required' },
        { status: 400 }
      );
    }

    if (!peerPublicKey) {
      return NextResponse.json(
        { error: 'Peer public key is required' },
        { status: 400 }
      );
    }

    console.log(`Attempting to fetch config for peer on server: ${serverId}`);

    // Try different possible endpoint paths
    const possibleEndpoints = [
      `servers/${serverId}/peers/${encodeURIComponent(peerPublicKey)}/config`,
      `api/servers/${serverId}/peers/${encodeURIComponent(peerPublicKey)}/config`,
      `api/v1/servers/${serverId}/peers/${encodeURIComponent(peerPublicKey)}/config`,
      `v1/servers/${serverId}/peers/${encodeURIComponent(peerPublicKey)}/config`,
      `server/${serverId}/peers/${encodeURIComponent(peerPublicKey)}/config`,
      `api/server/${serverId}/peers/${encodeURIComponent(peerPublicKey)}/config`,
    ];

    let response;
    let endpointUsed;

    for (const endpoint of possibleEndpoints) {
      try {
        const fullUrl = joinUrl(backendUrl, endpoint);
        console.log(`Trying endpoint: ${fullUrl}`);
        response = await fetch(fullUrl, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
          cache: 'no-store',
        });
        
        console.log(`Config fetch from ${fullUrl}, status: ${response?.status}`);
        
        if (response.ok) {
          endpointUsed = endpoint;
          console.log(`Successfully fetched peer config via endpoint: ${fullUrl}`);
          break;
        }
      } catch (error) {
        console.log(`Failed to fetch peer config via ${endpoint}:`, error);
      }
    }

    if (!response || !response.ok) {
      throw new Error(`Fetch peer config failed. Tried ${possibleEndpoints.length} different endpoints`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching peer configuration:', error);
    return NextResponse.json(
      { error: 'Failed to fetch peer configuration from backend' },
      { status: 500 }
    );
  }
} 