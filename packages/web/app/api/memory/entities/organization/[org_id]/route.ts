import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

interface RouteParams {
  params: { org_id: string };
}

/**
 * GET /api/memory/entities/organization/[org_id] - Get organization by ID
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { org_id } = params;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const userId = request.headers.get('X-User-ID');
    if (userId) {
      headers['X-User-ID'] = userId;
    }

    const response = await fetch(
      `${BACKEND_URL}/memory/entities/organization/${org_id}`,
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
        { error: 'Failed to fetch organization', detail: errorText },
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
 * PUT /api/memory/entities/organization/[org_id] - Update organization
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { org_id } = params;
    const body = await request.json();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const userId = request.headers.get('X-User-ID');
    if (userId) {
      headers['X-User-ID'] = userId;
    }

    const response = await fetch(
      `${BACKEND_URL}/memory/entities/organization/${org_id}`,
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
        { error: 'Failed to update organization', detail: errorText },
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
 * DELETE /api/memory/entities/organization/[org_id] - Delete organization
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { org_id } = params;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const userId = request.headers.get('X-User-ID');
    if (userId) {
      headers['X-User-ID'] = userId;
    }

    const response = await fetch(
      `${BACKEND_URL}/memory/entities/organization/${org_id}`,
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
        { error: 'Failed to delete organization', detail: errorText },
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
