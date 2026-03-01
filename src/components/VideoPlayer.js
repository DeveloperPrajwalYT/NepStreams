// src/components/VideoPlayer.js
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function VideoPlayer({ sources, subtitles, onTimeUpdate }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current || !sources || sources.length === 0) {
      setError('No streaming sources available');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Find the best quality source
    const source = sources.find(s => s.quality === '1080p') ||
                   sources.find(s => s.quality === '720p') ||
                   sources.find(s => s.quality === '480p') ||
                   sources.find(s => s.quality === 'default') ||
                   sources.find(s => s.quality === 'auto') ||
                   sources[0];

    if (!source) {
      setError('No valid source found');
      setLoading(false);
      return;
    }

    let art = null;

    const initPlayer = async () => {
      try {
        const Artplayer = (await import('artplayer')).default;
        const Hls = (await import('hls.js')).default;

        if (playerRef.current) {
          playerRef.current.destroy();
        }

        // Prepare subtitle tracks
        const subTracks = (subtitles || []).map((sub, i) => ({
          default: i === 0,
          html: sub.lang || `Subtitle ${i + 1}`,
          url: sub.url,
        }));

        // Quality options
        const qualities = sources
          .filter(s => s.url && s.quality)
          .map(s => ({
            default: s.quality === source.quality,
            html: s.quality,
            url: s.url,
          }));

        art = new Artplayer({
          container: containerRef.current,
          url: source.url,
          type: source.url.includes('.m3u8') ? 'm3u8' : 'mp4',
          autoplay: false,
          pip: true,
          autoSize: false,
          autoMini: false,
          screenshot: true,
          setting: true,
          loop: false,
          flip: true,
          playbackRate: true,
          aspectRatio: true,
          fullscreen: true,
          fullscreenWeb: true,
          subtitleOffset: true,
          miniProgressBar: true,
          mutex: true,
          backdrop: true,
          playsInline: true,
          autoPlayback: true,
          airplay: true,
          theme: '#dc2626',
          volume: 0.8,
          isLive: false,
          muted: false,
          autoplay: false,
          subtitle: subTracks.length > 0 ? {
            url: subTracks[0]?.url || '',
            type: 'vtt',
            style: {
              color: '#fff',
              fontSize: '20px',
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
              fontFamily: 'Arial, sans-serif',
            },
            encoding: 'utf-8',
          } : undefined,
          settings: [
            ...(qualities.length > 1 ? [{
              html: 'Quality',
              tooltip: source.quality,
              selector: qualities,
              onSelect: function(item) {
                art.switchQuality(item.url, item.html);
                return item.html;
              },
            }] : []),
            ...(subTracks.length > 1 ? [{
              html: 'Subtitle',
              tooltip: subTracks[0]?.html || 'Off',
              selector: [
                { html: 'Off', url: '' },
                ...subTracks,
              ],
              onSelect: function(item) {
                if (item.url) {
                  art.subtitle.switch(item.url);
                } else {
                  art.subtitle.show = false;
                }
                return item.html;
              },
            }] : []),
          ],
          customType: {
            m3u8: function (video, url) {
              if (Hls.isSupported()) {
                if (art.hls) art.hls.destroy();
                const hls = new Hls({
                  maxBufferLength: 30,
                  maxMaxBufferLength: 600,
                });
                hls.loadSource(url);
                hls.attachMedia(video);
                art.hls = hls;
                art.on('destroy', () => hls.destroy());
              } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
              } else {
                art.notice.show = 'HLS is not supported in this browser';
              }
            },
          },
          icons: {
            loading: '<div class="flex items-center justify-center"><div class="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div></div>',
          },
        });

        art.on('ready', () => {
          setLoading(false);
        });

        art.on('video:timeupdate', () => {
          if (onTimeUpdate) {
            onTimeUpdate(art.currentTime);
          }
        });

        art.on('error', (err) => {
          console.error('Player error:', err);
          setError('Failed to load video. Try another server.');
          setLoading(false);
        });

        playerRef.current = art;
      } catch (err) {
        console.error('Player init error:', err);
        setError('Failed to initialize player');
        setLoading(false);
      }
    };

    initPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [sources, subtitles]);

  if (error && (!sources || sources.length === 0)) {
    return (
      <div className="aspect-video bg-dark-300 rounded-xl flex items-center justify-center">
        <div className="text-center p-8">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-zinc-300 text-lg font-medium">{error}</p>
          <p className="text-zinc-500 text-sm mt-2">Try selecting a different server</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
      {loading && (
        <div className="absolute inset-0 z-10 bg-dark-300 flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={40} className="text-red-500 animate-spin mx-auto mb-3" />
            <p className="text-zinc-400 text-sm">Loading video...</p>
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
