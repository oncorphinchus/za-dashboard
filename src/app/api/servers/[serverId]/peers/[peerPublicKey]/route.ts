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

export async function DELETE(
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

    console.log(`Attempting to remove peer from server: ${serverId}`);

    // Try different possible endpoint paths
    const possibleEndpoints = [
      `/servers/${serverId}/peers/${encodeURIComponent(peerPublicKey)}`,
      `/api/servers/${serverId}/peers/${encodeURIComponent(peerPublicKey)}`,
      `/api/v1/servers/${serverId}/peers/${encodeURIComponent(peerPublicKey)}`,
      `/v1/servers/${serverId}/peers/${encodeURIComponent(peerPublicKey)}`,
      `/server/${serverId}/peers/${encodeURIComponent(peerPublicKey)}`,
      `/api/server/${serverId}/peers/${encodeURIComponent(peerPublicKey)}`,
    ];

    let response;
    let endpointUsed;

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying endpoint: ${backendUrl}${endpoint}`);
        response = await fetch(`${backendUrl}${endpoint}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });
        
        console.log(`Delete peer request to ${backendUrl}${endpoint}, status: ${response?.status}`);
        
        if (response.ok) {
          endpointUsed = endpoint;
          console.log(`Successfully removed peer via endpoint: ${backendUrl}${endpoint}`);
          break;
        }
      } catch (error) {
        console.log(`Failed to remove peer via ${endpoint}:`, error);
      }
    }

    if (!response || !response.ok) {
      throw new Error(`Remove peer failed. Tried ${possibleEndpoints.length} different endpoints`);
    }

    // Just return success message
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing peer:', error);
    return NextResponse.json(
      { error: 'Failed to remove peer from backend' },
      { status: 500 }
    );
  }
} 