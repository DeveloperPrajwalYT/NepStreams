// src/app/page.js
'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import AnimeGrid from '@/components/AnimeGrid';
import GenreFilter from '@/components/GenreFilter';
import { fetchTrending, fetchPopular } from '@/lib/api';

export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(true);

  useEffect(() => {
    fetchTrending(1)
      .then((data) => {
        setTrending(data.results || []);
        setLoadingTrending(false);
      })
      .catch(() => setLoadingTrending(false));

    fetchPopular(1)
      .then((data) => {
        setPopular(data.results || []);
        setLoadingPopular(false);
      })
      .catch(() => setLoadingPopular(false));
  }, []);

  return (
    <div>
      <HeroSection animes={trending.slice(0, 5)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <AnimeGrid
          animes={trending}
          loading={loadingTrending}
          title="🔥 Trending Now"
          subtitle="Most watched anime right now"
        />

        <AnimeGrid
          animes={popular}
          loading={loadingPopular}
          title="⭐ Most Popular"
          subtitle="All-time fan favorites"
        />
      </div>
    </div>
  );
}
