// src/components/SearchBar.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp } from 'lucide-react';

const popularSearches = ['Naruto', 'One Piece', 'Attack on Titan', 'Demon Slayer', 'Jujutsu Kaisen', 'My Hero Academia'];

export default function SearchBar({ initialQuery = '', large = false }) {
  const [query, setQuery] = useState(initialQuery);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setFocused(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className={`relative flex items-center ${large ? 'text-lg' : 'text-base'}`}>
          <Search
            size={large ? 22 : 18}
            className="absolute left-4 text-zinc-500"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search for anime..."
            className={`w-full bg-dark-50 border border-red-900/20 focus:border-red-500 rounded-2xl ${
              large ? 'pl-12 pr-12 py-4' : 'pl-10 pr-10 py-3'
            } text-white placeholder-zinc-500 focus:outline-none transition-all focus:shadow-lg focus:shadow-red-900/10`}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="absolute right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {focused && !query && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 glass rounded-xl p-4 z-50"
          >
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
              <TrendingUp size={14} />
              <span>Popular Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    router.push(`/search?q=${encodeURIComponent(term)}`);
                  }}
                  className="px-3 py-1.5 text-sm bg-dark-50 text-zinc-300 hover:text-red-400 hover:bg-red-900/10 rounded-full transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
