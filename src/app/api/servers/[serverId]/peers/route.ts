import { NextResponse } from 'next/server';

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

    if (!body.description) {
      return NextResponse.json(
        { error: 'Peer description is required' },
        { status: 400 }
      );
    }

    // Create a new peer on the backend
    const response = await fetch(`${API_URL}/servers/${serverId}/peers`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to add peer: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error adding peer:', error);
    return NextResponse.json(
      { error: 'Failed to add peer' },
      { status: 500 }
    );
  }
} 