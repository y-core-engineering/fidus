import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function GET(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const preferenceId = params.key;
    console.log(`Fetching context for preference ${preferenceId} from ${BACKEND_URL}/memory/preferences/${preferenceId}/context`);

    const response = await fetch(`${BACKEND_URL}/memory/preferences/${preferenceId}/context`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend error: ${errorText}`);
      return NextResponse.json(
        { error: 'Failed to fetch preference context' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`Fetched context for preference ${preferenceId}`);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to backend:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
