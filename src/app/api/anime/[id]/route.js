// src/app/api/anime/[id]/route.js
import { NextResponse } from 'next/server';
import consumetApi from '@/lib/consumet';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    // Try anilist first for richer data
    let data;
    try {
      data = await consumetApi.getAnilistInfo(id, 'gogoanime');
    } catch {
      // Fallback to gogoanime directly
      data = await consumetApi.getAnimeInfo(id);
    }

    // Filter out hentai
    const genres = (data.genres || []).map(g => g.toLowerCase());
    if (genres.includes('hentai')) {
      return NextResponse.json({ error: 'Content not available' }, { status: 403 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Anime info API error:', error.message);
    return NextResponse.json({ error: 'Anime not found' }, { status: 404 });
  }
}
