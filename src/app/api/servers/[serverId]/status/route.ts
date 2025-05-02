import { NextResponse } from 'next/server';

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
  { params }: { params: { serverId: string } }
) {
  try {
    const { serverId } = params;

    // Validate environment variables
    if (!API_URL) {
      return NextResponse.json(
        { error: 'Backend URL not configured' },
        { status: 500 }
      );
    }

    if (!API_KEY) {
      return NextResponse.json(
        { error: 'Backend API key not configured' },
        { status: 500 }
      );
    }

    if (!serverId) {
      return NextResponse.json(
        { error: 'Server ID is required' },
        { status: 400 }
      );
    }

    // Fetch server status from the backend
    const response = await fetch(`${API_URL}/servers/${serverId}/status`, {
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch server status: ${response.statusText}` },
        { status: response.status }
      );
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
    console.error('Error fetching server status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch server status' },
      { status: 500 }
    );
  }
} 