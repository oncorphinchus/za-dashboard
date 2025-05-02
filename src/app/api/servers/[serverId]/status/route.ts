import { NextResponse } from 'next/server';
import { disableCertificateVerification } from '@/lib/httpClient';

// Disable certificate verification at module level for server-side code
disableCertificateVerification();

// Backend API URL and key from environment variables
const API_URL = process.env.NEXT_PUBLIC_MANAGEMENT_BACKEND_URL || '';
const API_KEY = process.env.MANAGEMENT_BACKEND_API_KEY || '';

// Create headers with API key
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`
};

// Helper function to join URL paths correctly without double slashes
function joinUrl(base: string, path: string): string {
  // Remove trailing slash from base if it exists
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  // Remove leading slash from path if it exists
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

export async function GET(
  request: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const { serverId } = params;
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

    console.log(`Attempting to fetch status for server ID: ${serverId}`);

    // Prioritize the correct endpoint based on our backend implementation
    // then try fallbacks if needed
    const possibleEndpoints = [
      `servers/${serverId}/status`,
      `api/servers/${serverId}/status`,  
      `servers-status/${serverId}`,
      `api/v1/servers/${serverId}/status`,
      `v1/servers/${serverId}/status`,
      `server/${serverId}/status`,
      `api/server/${serverId}/status`
    ];

    let response;
    let endpointUsed;

    for (const endpoint of possibleEndpoints) {
      try {
        const fullUrl = joinUrl(backendUrl, endpoint);
        console.log(`Trying status endpoint: ${fullUrl}`);
        response = await fetch(fullUrl, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
          cache: 'no-store',
        });
        
        console.log(`Status fetch from ${fullUrl}, status: ${response?.status}`);
        
        if (response.ok) {
          endpointUsed = endpoint;
          console.log(`Successfully found server status at: ${fullUrl}`);
          break;
        }
      } catch (error) {
        console.log(`Failed to fetch from ${endpoint}:`, error);
      }
    }

    if (!response || !response.ok) {
      throw new Error(`Server status fetch failed. Tried ${possibleEndpoints.length} different endpoints`);
    }

    const data = await response.json();
    
    // Parse latestHandshake string dates into Date objects for each peer
    if (data.status?.peers) {
      data.status.peers = data.status.peers.map((peer: any) => {
        if (peer.latestHandshake) {
          peer.latestHandshake = new Date(peer.latestHandshake);
        }
        return peer;
      });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Server status fetch error:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch server status from backend' },
      { status: 500 }
    );
  }
} 