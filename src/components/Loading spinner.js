// src/components/LoadingSpinner.js
'use client';

import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', text }) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <motion.div
        className={`${sizes[size]} border-2 border-red-900/30 border-t-red-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && <p className="text-zinc-400 text-sm animate-pulse">{text}</p>}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="aspect-[3/4] rounded-xl skeleton" />
      <div className="h-4 w-3/4 rounded skeleton" />
      <div className="h-3 w-1/2 rounded skeleton" />
    </div>
  );
}

export function GridSkeleton({ count = 10 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
