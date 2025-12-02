import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Extract X-User-ID from request headers (if present)
    const userIdHeader = request.headers.get('X-User-ID');
    const body = await request.json();

    // Call Python backend
    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Forward X-User-ID header to backend if present
    if (userIdHeader) {
      headers['X-User-ID'] = userIdHeader;
    }

    const response = await fetch(`${backendUrl}/memory/preferences/accept`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to accept preference' }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Extract X-User-ID from backend response and forward to client
    const responseHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const backendUserId = response.headers.get('X-User-ID');
    if (backendUserId) {
      responseHeaders['X-User-ID'] = backendUserId;
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('API route error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
