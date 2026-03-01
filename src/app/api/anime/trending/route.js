// src/app/api/anime/trending/route.js
import { NextResponse } from 'next/server';
import consumetApi from '@/lib/consumet';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || 1;
  const perPage = searchParams.get('perPage') || 20;

  try {
    const data = await consumetApi.getTrending(page, perPage);
    // Filter out hentai
    if (data.results) {
      data.results = data.results.filter(anime => {
        const genres = (anime.genres || []).map(g => g.toLowerCase());
        return !genres.includes('hentai');
      });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Trending API error:', error.message);
    return NextResponse.json({ results: [], hasNextPage: false }, { status: 200 });
  }
}
