import { NextRequest } from 'next/server';

// Increase timeout for LLM streaming responses
export const maxDuration = 120; // 2 minutes

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

    // Use AbortController with longer timeout for LLM streaming (2 minutes)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    const response = await fetch(`${backendUrl}/memory/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ user_id, message }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

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
    // Using push-based pattern for better cross-browser compatibility (Firefox)
    const reader = response.body?.getReader();
    if (!reader) {
      return new Response(
        JSON.stringify({ error: 'No response body from backend' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let isClosed = false;
    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (!isClosed) {
            const { done, value } = await reader.read();
            if (done || isClosed) {
              if (!isClosed) {
                isClosed = true;
                controller.close();
              }
              break;
            }
            controller.enqueue(value);
          }
        } catch (error) {
          // Only log non-abort errors
          if (!isClosed && (error as Error).name !== 'AbortError') {
            console.error('Stream error:', error);
            controller.error(error);
          }
        }
      },
      cancel() {
        isClosed = true;
        reader.cancel();
      },
    });

    // Extract X-User-ID from backend response and forward to client
    // Note: Headers optimized for cross-browser SSE compatibility (Firefox requires specific headers)
    const responseHeaders: Record<string, string> = {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    };

    const backendUserId = response.headers.get('X-User-ID');
    if (backendUserId) {
      responseHeaders['X-User-ID'] = backendUserId;
    }

    return new Response(stream, {
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
