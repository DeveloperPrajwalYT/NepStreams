// src/components/GenreFilter.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';

const allGenres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Ecchi', 'Fantasy',
  'Horror', 'Mahou Shoujo', 'Mecha', 'Music', 'Mystery', 'Psychological',
  'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller',
];

export default function GenreFilter({ selected, onSelect }) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? allGenres : allGenres.slice(0, 10);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={18} className="text-red-500" />
        <h3 className="text-lg font-semibold text-white">Filter by Genre</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !selected
              ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
              : 'bg-dark-50 text-zinc-400 hover:text-white hover:bg-dark-50/80'
          }`}
        >
          All
        </button>
        {displayed.map((genre) => (
          <button
            key={genre}
            onClick={() => onSelect(genre)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selected === genre
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                : 'bg-dark-50 text-zinc-400 hover:text-white hover:bg-dark-50/80'
            }`}
          >
            {genre}
          </button>
        ))}
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-4 py-2 rounded-full text-sm font-medium bg-dark-50 text-red-400 hover:bg-dark-50/80 transition-all"
        >
          {showAll ? 'Show Less' : 'More...'}
        </button>
      </div>
    </div>
  );
}
