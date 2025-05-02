import { NextResponse } from 'next/server';

// Backend API URL and key from environment variables
const API_URL = process.env.NEXT_PUBLIC_MANAGEMENT_BACKEND_URL || '';
const API_KEY = process.env.MANAGEMENT_BACKEND_API_KEY || '';

// Create headers with API key
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`
};

export async function GET() {
  try {
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

    // Fetch servers from the backend
    const response = await fetch(`${API_URL}/servers`, {
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch servers: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching servers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch servers' },
      { status: 500 }
    );
  }
} 