// src/components/ServerSelector.js
'use client';

import { motion } from 'framer-motion';
import { Server, Globe, Subtitles, Mic } from 'lucide-react';

const servers = [
  { id: 'gogocdn', name: 'VidStreaming', icon: Server },
  { id: 'streamsb', name: 'StreamSB', icon: Server },
  { id: 'vidcloud', name: 'VidCloud', icon: Server },
];

export default function ServerSelector({ currentServer, onServerChange, subOrDub, onSubDubChange }) {
  return (
    <div className="bg-dark-200 rounded-xl border border-red-900/10 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Sub/Dub Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 text-sm font-medium mr-2">Audio:</span>
          <button
            onClick={() => onSubDubChange('sub')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              subOrDub === 'sub'
                ? 'bg-red-600 text-white'
                : 'bg-dark-50 text-zinc-400 hover:text-white'
            }`}
          >
            <Subtitles size={14} />
            SUB
          </button>
          <button
            onClick={() => onSubDubChange('dub')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              subOrDub === 'dub'
                ? 'bg-red-600 text-white'
                : 'bg-dark-50 text-zinc-400 hover:text-white'
            }`}
          >
            <Mic size={14} />
            DUB
          </button>
        </div>

        <div className="h-8 w-px bg-zinc-800 hidden sm:block" />

        {/* Server Selection */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-zinc-400 text-sm font-medium mr-2">Server:</span>
          {servers.map((server) => {
            const Icon = server.icon;
            return (
              <button
                key={server.id}
                onClick={() => onServerChange(server.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentServer === server.id
                    ? 'bg-red-600/20 text-red-400 border border-red-600/50'
                    : 'bg-dark-50 text-zinc-400 hover:text-white border border-transparent'
                }`}
              >
                <Icon size={14} />
                {server.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
