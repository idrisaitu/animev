import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ episodeId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || 'gogoanime';
    const multiple = searchParams.get('multiple') || 'false';
    const { episodeId } = await params;

    const response = await fetch(
      `${BACKEND_URL}/streaming/watch/${episodeId}?source=${source}&multiple=${multiple}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in streaming watch API:', error);
    return NextResponse.json(
      { error: 'Failed to get streaming links' },
      { status: 500 }
    );
  }
}
