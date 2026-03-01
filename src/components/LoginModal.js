// src/components/LoginModal.js
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Sparkles } from 'lucide-react';
import { useUser } from '@/context/UserContext';

export default function LoginModal({ isOpen, onClose }) {
  const [username, setUsername] = useState('');
  const { login } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim().length >= 2) {
      login(username.trim());
      setUsername('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-dark-200 border border-red-900/30 rounded-2xl p-8 w-full max-w-md relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-red-500" size={28} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to NepStreams</h2>
              <p className="text-zinc-400 text-sm">Enter a display name to join as a guest</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your display name..."
                  maxLength={20}
                  className="w-full bg-dark-50 border border-red-900/30 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={username.trim().length < 2}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-red-900/30"
              >
                Continue as Guest
              </button>

              <p className="text-zinc-500 text-xs text-center">
                No registration required. Your data is stored locally.
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
