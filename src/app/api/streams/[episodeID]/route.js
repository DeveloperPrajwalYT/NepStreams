// src/app/api/streams/[episodeId]/route.js
import { NextResponse } from 'next/server';
import consumetApi from '@/lib/consumet';

export async function GET(request, { params }) {
  const { episodeId } = params;
  const { searchParams } = new URL(request.url);
  const server = searchParams.get('server') || 'gogocdn';

  try {
    let data;
    try {
      // Try anilist endpoint first
      data = await consumetApi.getAnilistWatch(episodeId);
    } catch {
      // Fallback to gogoanime direct
      data = await consumetApi.getStreamingLinks(episodeId, server);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Streams API error:', error.message);
    return NextResponse.json(
      { sources: [], subtitles: [], error: 'Stream not available' },
      { status: 200 }
    );
  }
}
