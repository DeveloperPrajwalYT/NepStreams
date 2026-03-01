// src/components/EpisodeSelector.js
'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, ChevronDown } from 'lucide-react';

const EPISODES_PER_RANGE = 100;

export default function EpisodeSelector({ episodes, currentEpisode, onSelect, animeId }) {
  const [selectedRange, setSelectedRange] = useState(0);
  const [searchEp, setSearchEp] = useState('');

  // Calculate ranges
  const ranges = useMemo(() => {
    if (!episodes || episodes.length <= EPISODES_PER_RANGE) return null;
    const rangeList = [];
    for (let i = 0; i < episodes.length; i += EPISODES_PER_RANGE) {
      const start = i + 1;
      const end = Math.min(i + EPISODES_PER_RANGE, episodes.length);
      rangeList.push({ start, end, index: Math.floor(i / EPISODES_PER_RANGE) });
    }
    return rangeList;
  }, [episodes]);

  // Set initial range based on current episode
  useEffect(() => {
    if (currentEpisode && ranges) {
      const epNum = currentEpisode.number || 1;
      const rangeIdx = Math.floor((epNum - 1) / EPISODES_PER_RANGE);
      setSelectedRange(rangeIdx);
    }
  }, [currentEpisode, ranges]);

  // Filter episodes by range
  const displayedEpisodes = useMemo(() => {
    if (!episodes) return [];
    if (!ranges) return episodes;
    const start = selectedRange * EPISODES_PER_RANGE;
    const end = start + EPISODES_PER_RANGE;
    return episodes.slice(start, end);
  }, [episodes, ranges, selectedRange]);

  // Filter by search
  const filteredEpisodes = useMemo(() => {
    if (!searchEp) return displayedEpisodes;
    return displayedEpisodes.filter(ep =>
      String(ep.number).includes(searchEp) ||
      (ep.title && ep.title.toLowerCase().includes(searchEp.toLowerCase()))
    );
  }, [displayedEpisodes, searchEp]);

  if (!episodes || episodes.length === 0) {
    return (
      <div className="bg-dark-200 rounded-xl p-6 text-center">
        <p className="text-zinc-400">No episodes available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-200 rounded-xl border border-red-900/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-red-900/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white">
            Episodes <span className="text-red-500">({episodes.length})</span>
          </h3>
          <input
            type="text"
            value={searchEp}
            onChange={(e) => setSearchEp(e.target.value)}
            placeholder="Search episode..."
            className="bg-dark-50 border border-red-900/20 rounded-lg px-3 py-1.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 w-40"
          />
        </div>

        {/* Range selector - only show if more than 100 episodes */}
        {ranges && (
          <div className="flex flex-wrap gap-2">
            {ranges.map((range) => (
              <button
                key={range.index}
                onClick={() => setSelectedRange(range.index)}
                className={`episode-range-btn ${selectedRange === range.index ? 'active' : ''}`}
              >
                {range.start}-{range.end}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Episodes Grid */}
      <div className="p-4 max-h-[500px] overflow-y-auto">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {filteredEpisodes.map((episode) => {
            const isActive = currentEpisode?.id === episode.id;
            return (
              <motion.button
                key={episode.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(episode)}
                className={`relative p-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                    : 'bg-dark-50 text-zinc-400 hover:bg-red-900/20 hover:text-red-400'
                }`}
                title={episode.title || `Episode ${episode.number}`}
              >
                {isActive && (
                  <Play size={10} className="absolute top-1 right-1 fill-white" />
                )}
                {episode.number}
              </motion.button>
            );
          })}
        </div>

        {filteredEpisodes.length === 0 && (
          <p className="text-zinc-500 text-center py-4">No episodes found</p>
        )}
      </div>
    </div>
  );
}
