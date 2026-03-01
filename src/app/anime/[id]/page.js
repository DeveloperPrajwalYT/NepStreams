// src/app/anime/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Play, Star, Calendar, Clock, Tag, ArrowLeft, TvMinimalPlay
} from 'lucide-react';
import { fetchAnimeInfo } from '@/lib/api';
import EpisodeSelector from '@/components/EpisodeSelector';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AnimeInfoPage() {
  const { id } = useParams();
  const router = useRouter();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchAnimeInfo(id)
      .then((data) => {
        setAnime(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <LoadingSpinner size="lg" text="Loading anime info..." />;

  if (error || !anime) {
    return (
      <div className="pt-24 text-center">
        <p className="text-red-400 text-lg">Failed to load anime</p>
        <button onClick={() => router.back()} className="text-zinc-400 mt-4 hover:text-white">
          Go back
        </button>
      </div>
    );
  }

  const title = anime.title?.english || anime.title?.romaji || anime.title?.userPreferred || anime.title || '';
  const desc = (anime.description || '').replace(/<[^>]*>/g, '');
  const image = anime.image || '';
  const cover = anime.cover || image;
  const rating = anime.rating ? (anime.rating / 10).toFixed(1) : null;
  const episodes = anime.episodes || [];

  const handleEpisodeSelect = (episode) => {
    router.push(`/watch/${id}?ep=${episode.id}&num=${episode.number}`);
  };

  return (
    <div className="min-h-screen">
      {/* Cover Banner */}
      <div className="relative h-[50vh] overflow-hidden">
        {cover && (
          <Image src={cover} alt={title} fill className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-500 via-dark-500/60 to-dark-500/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-500 via-transparent to-dark-500/50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-64 relative z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-shrink-0"
          >
            <div className="relative w-[220px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-red-900/20 mx-auto md:mx-0">
              {image && (
                <Image src={image} alt={title} fill className="object-cover" />
              )}
            </div>

            {/* Quick play button */}
            {episodes.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleEpisodeSelect(episodes[0])}
                className="w-[220px] mt-4 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-900/40 mx-auto md:mx-0"
              >
                <Play size={18} fill="white" />
                Watch Episode 1
              </motion.button>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 min-w-0"
          >
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{title}</h1>

            {anime.title?.romaji && anime.title.romaji !== title && (
              <p className="text-zinc-400 text-lg mb-4">{anime.title.romaji}</p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {rating && (
                <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1.5 rounded-full">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 text-sm font-semibold">{rating}</span>
                </div>
              )}
              {anime.type && (
                <span className="bg-red-600/20 text-red-400 text-sm px-3 py-1.5 rounded-full font-medium">
                  {anime.type}
                </span>
              )}
              {anime.status && (
                <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${
                  anime.status === 'Ongoing' || anime.status === 'RELEASING'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {anime.status}
                </span>
              )}
              {anime.releaseDate && (
                <div className="flex items-center gap-1 text-zinc-400 text-sm">
                  <Calendar size={14} />
                  {anime.releaseDate}
                </div>
              )}
              {anime.totalEpisodes && (
                <div className="flex items-center gap-1 text-zinc-400 text-sm">
                  <TvMinimalPlay size={14} />
                  {anime.totalEpisodes} Episodes
                </div>
              )}
              {anime.duration && (
                <div className="flex items-center gap-1 text-zinc-400 text-sm">
                  <Clock size={14} />
                  {anime.duration} min
                </div>
              )}
            </div>

            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {anime.genres.map((genre) => (
                  <Link
                    key={genre}
                    href={`/genre/${genre.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center gap-1 bg-dark-50 hover:bg-red-900/20 text-zinc-300 hover:text-red-400 text-sm px-3 py-1.5 rounded-full transition-all"
                  >
                    <Tag size={12} />
                    {genre}
                  </Link>
                ))}
              </div>
            )}

            {/* Description */}
            {desc && (
              <div className="mb-8">
                <h3 className="text-white font-semibold mb-2">Synopsis</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
              </div>
            )}

            {/* Other info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {anime.subOrDub && (
                <div className="bg-dark-50 rounded-xl p-3">
                  <p className="text-zinc-500 text-xs mb-1">Audio</p>
                  <p className="text-white text-sm font-medium capitalize">{anime.subOrDub}</p>
                </div>
              )}
              {anime.studios && anime.studios.length > 0 && (
                <div className="bg-dark-50 rounded-xl p-3">
                  <p className="text-zinc-500 text-xs mb-1">Studio</p>
                  <p className="text-white text-sm font-medium">{anime.studios.join(', ')}</p>
                </div>
              )}
              {anime.season && (
                <div className="bg-dark-50 rounded-xl p-3">
                  <p className="text-zinc-500 text-xs mb-1">Season</p>
                  <p className="text-white text-sm font-medium capitalize">{anime.season} {anime.releaseDate}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Episodes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <EpisodeSelector
            episodes={episodes}
            currentEpisode={null}
            onSelect={handleEpisodeSelect}
            animeId={id}
          />
        </motion.div>
      </div>
    </div>
  );
}
