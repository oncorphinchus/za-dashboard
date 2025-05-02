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

export async function POST(
  request: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const { serverId } = params;
    const body = await request.json();
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

    if (!body.description) {
      return NextResponse.json(
        { error: 'Peer description is required' },
        { status: 400 }
      );
    }

    console.log(`Attempting to add peer to server: ${serverId}`);

    // Try different possible endpoint paths
    const possibleEndpoints = [
      `/servers/${serverId}/peers`,
      `/api/servers/${serverId}/peers`,
      `/api/v1/servers/${serverId}/peers`,
      `/v1/servers/${serverId}/peers`,
      `/server/${serverId}/peers`,
      `/api/server/${serverId}/peers`,
    ];

    let response;
    let endpointUsed;

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying endpoint: ${backendUrl}${endpoint}`);
        response = await fetch(`${backendUrl}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify(body),
        });
        
        console.log(`Add peer request to ${backendUrl}${endpoint}, status: ${response?.status}`);
        
        if (response.ok) {
          endpointUsed = endpoint;
          console.log(`Successfully added peer via endpoint: ${backendUrl}${endpoint}`);
          break;
        }
      } catch (error) {
        console.log(`Failed to add peer via ${endpoint}:`, error);
      }
    }

    if (!response || !response.ok) {
      throw new Error(`Add peer failed. Tried ${possibleEndpoints.length} different endpoints`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error adding peer:', error);
    return NextResponse.json(
      { error: 'Failed to add peer to backend' },
      { status: 500 }
    );
  }
} 