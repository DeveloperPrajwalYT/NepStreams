// src/app/api/anime/search/route.js
import { NextResponse } from 'next/server';
import consumetApi from '@/lib/consumet';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const page = searchParams.get('page') || 1;
  const genre = searchParams.get('genre');
  const sort = searchParams.get('sort');

  if (!query && !genre) {
    return NextResponse.json({ results: [] });
  }

  try {
    let data;
    if (genre) {
      data = await consumetApi.advancedSearch({
        genres: `["${genre}"]`,
        page,
        perPage: 20,
        sort: sort ? `["${sort}"]` : '["POPULARITY_DESC"]',
        query: query || undefined,
      });
    } else {
      data = await consumetApi.searchAnilist(query, page, 20);
    }

    if (data.results) {
      data.results = data.results.filter(anime => {
        const genres = (anime.genres || []).map(g => g.toLowerCase());
        return !genres.includes('hentai');
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Search API error:', error.message);
    return NextResponse.json({ results: [], hasNextPage: false }, { status: 200 });
  }
}
