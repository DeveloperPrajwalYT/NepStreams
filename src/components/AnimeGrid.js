// src/components/AnimeGrid.js
'use client';

import AnimeCard from './AnimeCard';
import { GridSkeleton } from './LoadingSpinner';

export default function AnimeGrid({ animes, loading, title, subtitle }) {
  if (loading) {
    return (
      <section className="mb-12">
        {title && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            {subtitle && <p className="text-zinc-400 text-sm mt-1">{subtitle}</p>}
          </div>
        )}
        <GridSkeleton count={10} />
      </section>
    );
  }

  if (!animes || animes.length === 0) return null;

  return (
    <section className="mb-12">
      {title && (
        <div className="mb-6 flex items-center gap-3">
          <div className="w-1 h-8 bg-red-600 rounded-full" />
          <div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            {subtitle && <p className="text-zinc-400 text-sm mt-1">{subtitle}</p>}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-stagger">
        {animes.map((anime, i) => (
          <AnimeCard key={anime.id} anime={anime} index={i} />
        ))}
      </div>
    </section>
  );
}
