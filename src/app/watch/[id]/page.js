// src/app/watch/[id]/page.js
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';
import EpisodeSelector from '@/components/EpisodeSelector';
import ServerSelector from '@/components/ServerSelector';
import CommentSection from '@/components/CommentSection';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fetchAnimeInfo, fetchStreamingLinks } from '@/lib/api';

export default function WatchPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const episodeId = searchParams.get('ep');
  const episodeNum = searchParams.get('num') || '1';

  const [anime, setAnime] = useState(null);
  const [sources, setSources] = useState([]);
  const [subtitles, setSubtitles] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [server, setServer] = useState('gogocdn');
  const [subOrDub, setSubOrDub] = useState('sub');
  const [loading, setLoading] = useState(true);
  const [streamLoading, setStreamLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  // Load anime info
  useEffect(() => {
    setLoading(true);
    fetchAnimeInfo(id)
      .then((data) => {
        setAnime(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Set current episode
  useEffect(() => {
    if (anime?.episodes && episodeId) {
      const ep = anime.episodes.find(e => e.id === episodeId);
      if (ep) setCurrentEpisode(ep);
    }
  }, [anime, episodeId]);

  // Load streaming links
  const loadStreams = useCallback(async () => {
    if (!episodeId) return;
    setStreamLoading(true);

    try {
      // For dub, try to modify the episode ID
      let epId = episodeId;
      if (subOrDub === 'dub') {
        epId = episodeId.replace(/-episode-/, '-dub-episode-');
      }

      const data = await fetchStreamingLinks(epId);
      setSources(data.sources || []);
      setSubtitles(data.subtitles || []);
    } catch (err) {
      console.error('Failed to load streams:', err);
      setSources([]);
      setSubtitles([]);
    }
    setStreamLoading(false);
  }, [episodeId, server, subOrDub]);

  useEffect(() => {
    loadStreams();
  }, [loadStreams]);

  // Navigation helpers
  const episodes = anime?.episodes || [];
  const currentIndex = episodes.findIndex(e => e.id === episodeId);
  const prevEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;

  const navigateToEpisode = (episode) => {
    router.push(`/watch/${id}?ep=${episode.id}&num=${episode.number}`);
  };

  const handleTimestampClick = (timestamp) => {
    // Convert timestamp to seconds and seek
    const parts = timestamp.split(':').map(Number);
    let seconds = 0;
    if (parts.length === 3) {
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      seconds = parts[0] * 60 + parts[1];
    }
    // We'd need a ref to the player, for now scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const title = anime?.title?.english || anime?.title?.romaji || anime?.title?.userPreferred || anime?.title || '';

  if (loading) return <LoadingSpinner size="lg" text="Loading..." />;

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Link href="/" className="text-zinc-500 hover:text-white transition-colors">Home</Link>
          <span className="text-zinc-700">/</span>
          <Link href={`/anime/${id}`} className="text-zinc-500 hover:text-white transition-colors line-clamp-1">
            {title}
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="text-red-400">Episode {episodeNum}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {streamLoading ? (
                <div className="aspect-video bg-dark-300 rounded-xl flex items-center justify-center">
                  <LoadingSpinner text="Loading video..." />
                </div>
              ) : (
                <VideoPlayer
                  sources={sources}
                  subtitles={subtitles}
                  onTimeUpdate={setCurrentTime}
                />
              )}
            </motion.div>

            {/* Episode title & navigation */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white">
                  {title} - Episode {episodeNum}
                </h1>
                {currentEpisode?.title && (
                  <p className="text-zinc-400 text-sm mt-1">{currentEpisode.title}</p>
                )}
              </div>
              <Link
                href={`/anime/${id}`}
                className="flex items-center gap-1 text-zinc-400 hover:text-red-400 text-sm transition-colors"
              >
                <Info size={16} />
                Details
              </Link>
            </div>

            {/* Prev/Next buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => prevEpisode && navigateToEpisode(prevEpisode)}
                disabled={!prevEpisode}
                className="flex items-center gap-2 bg-dark-50 hover:bg-red-900/20 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 hover:text-white px-4 py-2 rounded-lg text-sm transition-all flex-1"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <button
                onClick={() => nextEpisode && navigateToEpisode(nextEpisode)}
                disabled={!nextEpisode}
                className="flex items-center gap-2 justify-end bg-dark-50 hover:bg-red-900/20 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-300 hover:text-white px-4 py-2 rounded-lg text-sm transition-all flex-1"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Server selector */}
            <ServerSelector
              currentServer={server}
              onServerChange={setServer}
              subOrDub={subOrDub}
              onSubDubChange={setSubOrDub}
            />

            {/* Comments */}
            <CommentSection
              animeId={id}
              episodeNum={episodeNum}
              onTimestampClick={handleTimestampClick}
            />
          </div>

          {/* Sidebar - Episodes */}
          <div className="lg:col-span-1">
            <EpisodeSelector
              episodes={episodes}
              currentEpisode={currentEpisode}
              onSelect={navigateToEpisode}
              animeId={id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
