// src/app/search/page.js
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import AnimeGrid from '@/components/AnimeGrid';
import SearchBar from '@/components/SearchBar';
import GenreFilter from '@/components/GenreFilter';
import { searchAnime, fetchTrending, fetchPopular } from '@/lib/api';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || '';
  const genre = searchParams.get('genre') || '';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(genre || null);

  useEffect(() => {
    setLoading(true);
    setPage(1);

    const load = async () => {
      try {
        let data;
        if (type === 'trending') {
          data = await fetchTrending(1);
        } else if (type === 'popular') {
          data = await fetchPopular(1);
        } else if (query) {
          const res = await fetch(`/api/anime/search?q=${encodeURIComponent(query)}&page=1${selectedGenre ? `&genre=${selectedGenre}` : ''}`);
          data = await res.json();
        } else if (selectedGenre) {
          const res = await fetch(`/api/anime/search?genre=${selectedGenre}&page=1`);
          data = await res.json();
        } else {
          data = await fetchTrending(1);
        }
        setResults(data.results || []);
        setHasMore(data.hasNextPage || false);
      } catch {
        setResults([]);
      }
      setLoading(false);
    };

    load();
  }, [query, type, selectedGenre]);

  const loadMore = async () => {
    const nextPage = page + 1;
    try {
      let data;
      if (type === 'trending') {
        data = await fetchTrending(nextPage);
      } else if (type === 'popular') {
        data = await fetchPopular(nextPage);
      } else if (query) {
        const res = await fetch(`/api/anime/search?q=${encodeURIComponent(query)}&page=${nextPage}${selectedGenre ? `&genre=${selectedGenre}` : ''}`);
        data = await res.json();
      } else if (selectedGenre) {
        const res = await fetch(`/api/anime/search?genre=${selectedGenre}&page=${nextPage}`);
        data = await res.json();
      }
      if (data?.results) {
        setResults(prev => [...prev, ...data.results]);
        setHasMore(data.hasNextPage || false);
        setPage(nextPage);
      }
    } catch {
      // ignore
    }
  };

  const handleGenreSelect = (g) => {
    setSelectedGenre(g);
    const params = new URLSearchParams(searchParams.toString());
    if (g) {
      params.set('genre', g);
    } else {
      params.delete('genre');
    }
    router.push(`/search?${params.toString()}`);
  };

  const pageTitle = type === 'trending' ? '🔥 Trending Anime' :
                    type === 'popular' ? '⭐ Popular Anime' :
                    query ? `Search results for "${query}"` :
                    selectedGenre ? `${selectedGenre} Anime` :
                    'Browse Anime';

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar initialQuery={query} large />
        </div>

        {/* Genre Filter */}
        <GenreFilter selected={selectedGenre} onSelect={handleGenreSelect} />

        {/* Results */}
        <AnimeGrid
          animes={results}
          loading={loading}
          title={pageTitle}
          subtitle={`${results.length} results found`}
        />

        {/* Load more */}
        {hasMore && !loading && (
          <div className="text-center mt-8 mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadMore}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg shadow-red-900/30"
            >
              Load More
            </motion.button>
          </div>
        )}

        {!loading && results.length === 0 && (
          <div className="text-center py-20">
            <SearchIcon size={48} className="text-zinc-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-zinc-300 mb-2">No results found</h3>
            <p className="text-zinc-500">Try a different search term or genre</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="pt-24 min-h-screen"><div className="max-w-7xl mx-auto px-4"><p className="text-zinc-400">Loading...</p></div></div>}>
      <SearchContent />
    </Suspense>
  );
}
