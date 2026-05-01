import React from 'react';
import { motion } from 'motion/react';
import { useData } from './DataContext';

interface PageBannerProps {
  title: string;
}

export function PageBanner({ title }: PageBannerProps) {
  const { settings } = useData();
  
  const bgStyle = settings.pageBannerImageUrl 
    ? { backgroundImage: `url(${settings.pageBannerImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

  return (
    <div 
      className={`py-24 md:py-32 flex items-center justify-center text-center px-4 relative overflow-hidden ${!settings.pageBannerImageUrl ? 'bg-wood' : ''}`}
      style={bgStyle}
    >
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      <div className="absolute inset-0 bg-emerald-900/30 z-20"></div>
      <div className="absolute inset-0 opacity-10 z-30">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>
      <div className="max-w-7xl mx-auto w-full relative z-30">
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
