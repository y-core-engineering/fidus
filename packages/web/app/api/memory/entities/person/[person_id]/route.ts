import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

interface RouteParams {
  params: { person_id: string };
}

/**
 * GET /api/memory/entities/person/[person_id] - Get person by ID
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { person_id } = params;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const userId = request.headers.get('X-User-ID');
    if (userId) {
      headers['X-User-ID'] = userId;
    }

    const response = await fetch(
      `${BACKEND_URL}/memory/entities/person/${person_id}`,
      {
        method: 'GET',
        headers,
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend error: ${errorText}`);
      return NextResponse.json(
        { error: 'Failed to fetch person', detail: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to backend:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/memory/entities/person/[person_id] - Update person
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { person_id } = params;
    const body = await request.json();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const userId = request.headers.get('X-User-ID');
    if (userId) {
      headers['X-User-ID'] = userId;
    }

    const response = await fetch(
      `${BACKEND_URL}/memory/entities/person/${person_id}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend error: ${errorText}`);
      return NextResponse.json(
        { error: 'Failed to update person', detail: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to backend:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/memory/entities/person/[person_id] - Delete person
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { person_id } = params;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const userId = request.headers.get('X-User-ID');
    if (userId) {
      headers['X-User-ID'] = userId;
    }

    const response = await fetch(
      `${BACKEND_URL}/memory/entities/person/${person_id}`,
      {
        method: 'DELETE',
        headers,
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend error: ${errorText}`);
      return NextResponse.json(
        { error: 'Failed to delete person', detail: errorText },
        { status: response.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error proxying to backend:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
