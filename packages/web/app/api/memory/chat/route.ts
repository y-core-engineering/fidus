import { NextRequest } from 'next/server';

interface ChatRequest {
  user_id: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { user_id, message } = body;

    // Validate input
    if (!user_id || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: user_id and message' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Extract X-User-ID from request headers (if present)
    const userIdHeader = request.headers.get('X-User-ID');

    // Call Python backend with streaming
    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Forward X-User-ID header to backend if present
    if (userIdHeader) {
      headers['X-User-ID'] = userIdHeader;
    }

    const response = await fetch(`${backendUrl}/memory/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ user_id, message }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to communicate with backend' }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Stream the response back to the client
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }
            controller.enqueue(value);
          }
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    // Extract X-User-ID from backend response and forward to client
    const responseHeaders: Record<string, string> = {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    };

    const backendUserId = response.headers.get('X-User-ID');
    if (backendUserId) {
      responseHeaders['X-User-ID'] = backendUserId;
    }

    return new Response(stream, {
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
