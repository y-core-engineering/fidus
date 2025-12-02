import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function GET(
  request: Request,
  { params }: { params: { user_id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenant_id');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenant_id is required' },
        { status: 400 }
      );
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const userId = request.headers.get('X-User-ID');
    if (userId) {
      headers['X-User-ID'] = userId;
    }

    const response = await fetch(
      `${BACKEND_URL}/memory/user/${params.user_id}?tenant_id=${tenantId}`,
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
        { error: 'Failed to fetch user' },
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

export async function PUT(
  request: Request,
  { params }: { params: { user_id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenant_id');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenant_id is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const userId = request.headers.get('X-User-ID');
    if (userId) {
      headers['X-User-ID'] = userId;
    }

    const response = await fetch(
      `${BACKEND_URL}/memory/user/${params.user_id}?tenant_id=${tenantId}`,
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
        { error: 'Failed to update user' },
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

export async function DELETE(
  request: Request,
  { params }: { params: { user_id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenant_id');
    const confirm = searchParams.get('confirm');

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenant_id is required' },
        { status: 400 }
      );
    }

    if (confirm !== 'true') {
      return NextResponse.json(
        { error: 'Must set confirm=true to delete user' },
        { status: 400 }
      );
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const userId = request.headers.get('X-User-ID');
    if (userId) {
      headers['X-User-ID'] = userId;
    }

    const response = await fetch(
      `${BACKEND_URL}/memory/user/${params.user_id}?tenant_id=${tenantId}&confirm=true`,
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
        { error: 'Failed to delete user' },
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
