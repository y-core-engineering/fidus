import { NextRequest, NextResponse } from 'next/server';

interface ChatRequest {
  user_id: string;
  message: string;
}

interface ChatResponse {
  response: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse | { error: string }>> {
  try {
    const body: ChatRequest = await request.json();
    const { user_id, message } = body;

    // Validate input
    if (!user_id || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id and message' },
        { status: 400 }
      );
    }

    // Call Python backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/memory/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, message }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      return NextResponse.json(
        { error: 'Failed to communicate with backend' },
        { status: response.status }
      );
    }

    const data: ChatResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
