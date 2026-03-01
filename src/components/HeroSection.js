// src/components/HeroSection.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function HeroSection({ animes }) {
  const [current, setCurrent] = useState(0);
  const featured = (animes || []).slice(0, 5);

  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (!featured.length) return null;

  const anime = featured[current];
  const title = anime.title?.english || anime.title?.romaji || anime.title?.userPreferred || anime.title || '';
  const desc = anime.description?.replace(/<[^>]*>/g, '') || '';
  const image = anime.cover || anime.image || '';
  const rating = anime.rating ? (anime.rating / 10).toFixed(1) : null;

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          )}
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-500 via-transparent to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-500" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              {/* Badges */}
              <div className="flex items-center gap-3 mb-4">
                {rating && (
                  <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 text-sm font-semibold">{rating}</span>
                  </div>
                )}
                {anime.type && (
                  <span className="bg-red-600/30 text-red-400 text-sm px-3 py-1 rounded-full font-medium">
                    {anime.type}
                  </span>
                )}
                {anime.status && (
                  <span className="bg-zinc-800/50 text-zinc-300 text-sm px-3 py-1 rounded-full">
                    {anime.status}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight red-glow-text">
                {title}
              </h1>

              {/* Genres */}
              {anime.genres && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {anime.genres.slice(0, 4).map((genre) => (
                    <span key={genre} className="text-xs bg-white/10 text-zinc-300 px-3 py-1 rounded-full">
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-zinc-300 text-sm md:text-base line-clamp-3 mb-6 leading-relaxed">
                {desc}
              </p>

              <div className="flex gap-4">
                <Link href={`/anime/${anime.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-red-900/40"
                  >
                    <Play size={20} fill="white" />
                    Watch Now
                  </motion.button>
                </Link>
                <Link href={`/anime/${anime.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-3 rounded-xl transition-all backdrop-blur-sm"
                  >
                    <Info size={20} />
                    Details
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation arrows */}
      {featured.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + featured.length) % featured.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-red-600/50 backdrop-blur-sm text-white p-2 rounded-full transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % featured.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-red-600/50 backdrop-blur-sm text-white p-2 rounded-full transition-all"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'w-8 bg-red-500' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
