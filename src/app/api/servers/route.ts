import { NextResponse } from 'next/server';
import { createFetchOptions, disableCertificateVerification, createAuthHeaders } from '@/lib/httpClient';

// Disable certificate verification at module level for server-side code
disableCertificateVerification();

// Backend API URL and key from environment variables
const API_URL = process.env.NEXT_PUBLIC_MANAGEMENT_BACKEND_URL || '';
const API_KEY = process.env.MANAGEMENT_BACKEND_API_KEY || '';

// Create headers with API key using the helper function
const headers = createAuthHeaders(API_KEY);

// Log the request details for debugging (omitting sensitive information)
console.log(`Making request to: ${API_URL}/servers`);
console.log('Authorization header format used:', Object.keys(headers).filter(h => h !== 'Content-Type')[0]);

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

    // Fetch servers from the backend using the agent that allows self-signed certificates
    const response = await fetch(`${API_URL}/servers`, createFetchOptions(headers));

    // Log response status for debugging
    console.log(`Backend response status: ${response.status}`);
    
    if (!response.ok) {
      let errorDetail = '';
      try {
        // Try to get more details from the error response
        const errorResponse = await response.text();
        errorDetail = errorResponse;
        console.log('Error response:', errorResponse);
      } catch (e) {
        console.log('Could not read error response body');
      }

      return NextResponse.json(
        { 
          error: `Failed to fetch servers: ${response.statusText}`, 
          detail: errorDetail 
        },
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