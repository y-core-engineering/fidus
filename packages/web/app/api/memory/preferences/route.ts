import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function GET() {
  try {
    console.log(`Fetching preferences from ${BACKEND_URL}/memory/preferences`);

    const response = await fetch(`${BACKEND_URL}/memory/preferences`, {
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
        { error: 'Failed to fetch preferences' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`Fetched ${data.preferences?.length || 0} preferences`);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to backend:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
