import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLoader } from './LoaderContext';
import { useData } from './DataContext';

const DEFAULT_IMAGES = [
  {
    url: 'https://picsum.photos/seed/lumber1/1920/1080',
    title: 'Qualidade que Constrói Sonhos',
    subtitle: 'As melhores madeiras para sua obra ou reforma.'
  },
  {
    url: 'https://picsum.photos/seed/lumber2/1920/1080',
    title: 'Sustentabilidade e Confiança',
    subtitle: 'Madeiras certificadas e de origem legal.'
  },
  {
    url: 'https://picsum.photos/seed/lumber3/1920/1080',
    title: 'Variedade em Acabamentos',
    subtitle: 'Decks, forros e assoalhos com o melhor preço.'
  },
  {
    url: 'https://picsum.photos/seed/lumber4/1920/1080',
    title: 'Entrega Rápida e Segura',
    subtitle: 'Logística eficiente para atender sua necessidade.'
  },
  {
    url: 'https://picsum.photos/seed/lumber5/1920/1080',
    title: 'Parceria com Profissionais',
    subtitle: 'Soluções completas para marceneiros e carpinteiros.'
  }
];

export function Hero() {
  const [index, setIndex] = useState(0);
  const { simulateLoading } = useLoader();
  const { settings } = useData();

  const filteredImages = settings.heroImages?.filter(url => url && url.trim() !== '') || [];

  const heroImages = filteredImages.length > 0
    ? filteredImages.map(url => ({
        url,
        title: 'Madeireira Pindorama',
        subtitle: 'Qualidade e Tradição em Madeiras'
      }))
    : DEFAULT_IMAGES;

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const next = () => {
    simulateLoading(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    });
  };

  const prev = () => {
    simulateLoading(() => {
      setIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    });
  };

  return (
    <div className="relative h-[600px] w-full overflow-hidden bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={heroImages[index % heroImages.length].url}
            alt={heroImages[index % heroImages.length].title}
            className="h-full w-full object-cover opacity-60"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/1920x1080?text=Imagem+Indisponivel';
              e.currentTarget.onerror = null;
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg"
            >
              {heroImages[index % heroImages.length].title}
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xl md:text-2xl drop-shadow-md"
            >
              {heroImages[index % heroImages.length].subtitle}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 p-2 rounded-full hover:bg-white/20 transition text-white"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 p-2 rounded-full hover:bg-white/20 transition text-white"
      >
        <ChevronRight size={32} />
      </button>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => simulateLoading(() => setIndex(i))}
            className={`w-3 h-3 rounded-full transition-colors ${
              i === index ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
