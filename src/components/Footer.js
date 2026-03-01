// src/components/Footer.js
'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-300 border-t border-red-900/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">N</span>
              </div>
              <span className="text-xl font-bold">
                <span className="text-red-500">Nep</span>
                <span className="text-white">Streams</span>
              </span>
            </Link>
            <p className="text-zinc-500 text-sm max-w-md leading-relaxed">
              Your ultimate destination for streaming anime. Watch thousands of anime episodes with subtitles and dubbing for free.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-zinc-400 hover:text-red-400 text-sm transition-colors">Home</Link></li>
              <li><Link href="/search?type=trending" className="text-zinc-400 hover:text-red-400 text-sm transition-colors">Trending</Link></li>
              <li><Link href="/search?type=popular" className="text-zinc-400 hover:text-red-400 text-sm transition-colors">Popular</Link></li>
              <li><Link href="/genre/action" className="text-zinc-400 hover:text-red-400 text-sm transition-colors">Action</Link></li>
              <li><Link href="/genre/romance" className="text-zinc-400 hover:text-red-400 text-sm transition-colors">Romance</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Genres</h4>
            <ul className="space-y-2">
              <li><Link href="/genre/action" className="text-zinc-400 hover:text-red-400 text-sm transition-colors">Action</Link></li>
              <li><Link href="/genre/comedy" className="text-zinc-400 hover:text-red-400 text-sm transition-colors">Comedy</Link></li>
              <li><Link href="/genre/drama" className="text-zinc-400 hover:text-red-400 text-sm transition-colors">Drama</Link></li>
              <li><Link href="/genre/fantasy" className="text-zinc-400 hover:text-red-400 text-sm transition-colors">Fantasy</Link></li>
              <li><Link href="/genre/ecchi" className="text-zinc-400 hover:text-red-400 text-sm transition-colors">Ecchi</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} NepStreams. All rights reserved.
          </p>
          <p className="text-zinc-600 text-xs flex items-center gap-1">
            Made with <Heart size={12} className="text-red-500 fill-red-500" /> for anime fans
          </p>
        </div>

        <div className="mt-4 p-4 bg-dark-50 rounded-xl">
          <p className="text-zinc-600 text-xs text-center leading-relaxed">
            Disclaimer: NepStreams does not host any content. All anime is sourced from third-party providers.
            This site is for educational and personal use only. Please support the official anime releases.
          </p>
        </div>
      </div>
    </footer>
  );
}
