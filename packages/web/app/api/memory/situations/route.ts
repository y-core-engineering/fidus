import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function GET(request: NextRequest) {
  try {
    console.log(`Fetching situations from ${BACKEND_URL}/memory/situations`);

    // Extract X-User-ID from request headers (if present)
    const userIdHeader = request.headers.get('X-User-ID');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Forward X-User-ID header to backend if present
    if (userIdHeader) {
      headers['X-User-ID'] = userIdHeader;
    }

    const response = await fetch(`${BACKEND_URL}/memory/situations`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend error: ${errorText}`);
      return NextResponse.json(
        { error: 'Failed to fetch situations' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`Fetched ${data.situations?.length || 0} situations`);

    // Extract X-User-ID from backend response and forward to client
    const backendUserId = response.headers.get('X-User-ID');
    const responseHeaders: Record<string, string> = {};
    if (backendUserId) {
      responseHeaders['X-User-ID'] = backendUserId;
    }

    return NextResponse.json(data, { headers: responseHeaders });
  } catch (error) {
    console.error('Error proxying to backend:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
