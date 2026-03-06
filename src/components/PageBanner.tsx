import React from 'react';
import { motion } from 'motion/react';

interface PageBannerProps {
  title: string;
}

export function PageBanner({ title }: PageBannerProps) {
  return (
    <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 py-24 md:py-32 flex items-center justify-center text-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-bold text-white uppercase tracking-tighter drop-shadow-lg"
        >
          {title}
        </motion.h1>
      </div>
    </div>
  );
}
