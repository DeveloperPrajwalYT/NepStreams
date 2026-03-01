// src/app/genre/[genre]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import AnimeGrid from '@/components/AnimeGrid';
import GenreFilter from '@/components/GenreFilter';

export default function GenrePage() {
  const { genre } = useParams();
  const decodedGenre = decodeURIComponent(genre).replace(/-/g, ' ');
  const displayGenre = decodedGenre.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const loadData = async (p = 1) => {
    try {
      const res = await fetch(`/api/anime/search?genre=${displayGenre}&page=${p}`);
      const data = await res.json();
      return data;
    } catch {
      return { results: [], hasNextPage: false };
    }
  };

  useEffect(() => {
    setLoading(true);
    setPage(1);
    loadData(1).then((data) => {
      setResults(data.results || []);
      setHasMore(data.hasNextPage || false);
      setLoading(false);
    });
  }, [genre]);

  const loadMore = async () => {
    const nextPage = page + 1;
    const data = await loadData(nextPage);
    if (data.results) {
      setResults(prev => [...prev, ...data.results]);
      setHasMore(data.hasNextPage || false);
      setPage(nextPage);
    }
  };

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">
            <span className="text-red-500">{displayGenre}</span> Anime
          </h1>
          <p className="text-zinc-400">Browse anime in the {displayGenre} genre</p>
        </div>

        <AnimeGrid
          animes={results}
          loading={loading}
          title=""
        />

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
      </div>
    </div>
  );
}
