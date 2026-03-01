// src/components/Navbar.js
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import LoginModal from './LoginModal';

const genres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
  'Mecha', 'Music', 'Mystery', 'Psychological', 'Romance', 'Sci-Fi',
  'Slice of Life', 'Sports', 'Supernatural', 'Thriller', 'Ecchi',
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [genreDropdown, setGenreDropdown] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const searchRef = useRef(null);
  const genreRef = useRef(null);
  const router = useRouter();
  const { user, logout } = useUser();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (genreRef.current && !genreRef.current.contains(e.target)) {
        setGenreDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-xl shadow-lg shadow-red-900/10'
            : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center group-hover:animate-glow transition-all">
                <span className="text-white font-black text-sm">N</span>
              </div>
              <span className="text-xl font-bold">
                <span className="text-red-500">Nep</span>
                <span className="text-white">Streams</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-zinc-300 hover:text-red-400 transition-colors text-sm font-medium">
                Home
              </Link>

              <div ref={genreRef} className="relative">
                <button
                  onClick={() => setGenreDropdown(!genreDropdown)}
                  className="text-zinc-300 hover:text-red-400 transition-colors text-sm font-medium flex items-center gap-1"
                >
                  Genres <ChevronDown size={14} className={`transition-transform ${genreDropdown ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {genreDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-2 w-[400px] glass rounded-xl p-4 grid grid-cols-3 gap-2"
                    >
                      {genres.map((genre) => (
                        <Link
                          key={genre}
                          href={`/genre/${genre.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={() => setGenreDropdown(false)}
                          className="text-sm text-zinc-400 hover:text-red-400 hover:bg-red-900/10 px-3 py-2 rounded-lg transition-all"
                        >
                          {genre}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/search?type=trending" className="text-zinc-300 hover:text-red-400 transition-colors text-sm font-medium">
                Trending
              </Link>
              <Link href="/search?type=popular" className="text-zinc-300 hover:text-red-400 transition-colors text-sm font-medium">
                Popular
              </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Search Toggle */}
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.form
                    key="search-form"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 300, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSearch}
                    className="flex items-center overflow-hidden"
                  >
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search anime..."
                      className="w-full bg-dark-50 border border-red-900/30 rounded-lg px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      className="ml-2 text-zinc-400 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  </motion.form>
                ) : (
                  <motion.button
                    key="search-btn"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSearchOpen(true)}
                    className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
                  >
                    <Search size={20} />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* User */}
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-dark-50 rounded-full px-3 py-1.5">
                    <img src={user.avatar} alt="" className="w-6 h-6 rounded-full" />
                    <span className="text-sm text-zinc-300 hidden sm:inline">{user.username}</span>
                  </div>
                  <button onClick={logout} className="p-2 text-zinc-500 hover:text-red-400 transition-colors">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-red-900/30"
                >
                  <User size={16} />
                  <span className="hidden sm:inline">Login</span>
                </button>
              )}

              {/* Mobile menu */}
              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="md:hidden p-2 text-zinc-400 hover:text-white"
              >
                {mobileMenu ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-black/95 backdrop-blur-xl border-t border-red-900/20 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">
                <Link href="/" onClick={() => setMobileMenu(false)} className="block text-zinc-300 hover:text-red-400 py-2">Home</Link>
                <Link href="/search?type=trending" onClick={() => setMobileMenu(false)} className="block text-zinc-300 hover:text-red-400 py-2">Trending</Link>
                <Link href="/search?type=popular" onClick={() => setMobileMenu(false)} className="block text-zinc-300 hover:text-red-400 py-2">Popular</Link>
                <div className="border-t border-zinc-800 pt-3">
                  <p className="text-zinc-500 text-xs uppercase mb-2">Genres</p>
                  <div className="grid grid-cols-2 gap-2">
                    {genres.map((genre) => (
                      <Link
                        key={genre}
                        href={`/genre/${genre.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => setMobileMenu(false)}
                        className="text-sm text-zinc-400 hover:text-red-400 py-1"
                      >
                        {genre}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
