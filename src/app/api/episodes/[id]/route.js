// src/app/api/episodes/[id]/route.js
import { NextResponse } from 'next/server';
import consumetApi from '@/lib/consumet';

export async function GET(request, { params }) {
  const { id } = params;
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider') || 'gogoanime';

  try {
    const data = await consumetApi.getAnilistInfo(id, provider);
    return NextResponse.json({
      episodes: data.episodes || [],
      totalEpisodes: data.totalEpisodes || (data.episodes || []).length,
    });
  } catch (error) {
    console.error('Episodes API error:', error.message);
    return NextResponse.json({ episodes: [], totalEpisodes: 0 }, { status: 200 });
  }
}
