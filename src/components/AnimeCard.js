// src/components/AnimeCard.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Star, Calendar } from 'lucide-react';

export default function AnimeCard({ anime, index = 0 }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const title = anime.title?.english || anime.title?.romaji || anime.title?.userPreferred || anime.title || 'Unknown';
  const image = anime.image || anime.cover || '/placeholder.jpg';
  const rating = anime.rating ? (anime.rating / 10).toFixed(1) : null;
  const type = anime.type || anime.format || '';
  const status = anime.status || '';
  const year = anime.releaseDate || anime.year || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/anime/${anime.id}`} className="group block">
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-dark-50 mb-3">
          {/* Image */}
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className={`object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />

          {!imageLoaded && <div className="absolute inset-0 skeleton" />}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-900/50"
            >
              <Play size={24} fill="white" className="text-white ml-1" />
            </motion.div>
          </div>

          {/* Rating badge */}
          {rating && (
            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-semibold text-white">{rating}</span>
            </div>
          )}

          {/* Type badge */}
          {type && (
            <div className="absolute top-2 right-2 bg-red-600/90 backdrop-blur-sm rounded-lg px-2 py-1">
              <span className="text-xs font-semibold text-white">{type}</span>
            </div>
          )}

          {/* Status badge */}
          {status && (
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
              <span className={`text-xs font-medium ${
                status === 'Ongoing' || status === 'RELEASING' ? 'text-green-400' :
                status === 'Completed' || status === 'FINISHED' ? 'text-blue-400' : 'text-zinc-400'
              }`}>
                {status}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <h3 className="text-sm font-medium text-zinc-200 group-hover:text-red-400 transition-colors line-clamp-2 mb-1">
          {title}
        </h3>
        {year && (
          <div className="flex items-center gap-1 text-zinc-500 text-xs">
            <Calendar size={11} />
            <span>{year}</span>
          </div>
        )}
      </Link>
    </motion.div>
  );
}
