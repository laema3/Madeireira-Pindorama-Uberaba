import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, MessageCircle, TreePine } from 'lucide-react';
import { useLoader } from './LoaderContext';
import { useData } from './DataContext';

const DEFAULT_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1622675363204-20482388a81c?q=80&w=2070&auto=format&fit=crop',
    title: 'Tradição em Marcenaria',
    description: 'Profissionais qualificados para transformar madeira em arte.'
  },
  {
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop',
    title: 'Qualidade que Constrói Sonhos',
    description: 'As melhores madeiras para sua obra ou reforma.'
  },
  {
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop',
    title: 'Sustentabilidade e Confiança',
    description: 'Madeiras certificadas e de origem legal.'
  },
  {
    url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=2070&auto=format&fit=crop',
    title: 'Variedade em Acabamentos',
    description: 'Decks, forros e assoalhos com o melhor preço.'
  }
];

export function Hero() {
  const [index, setIndex] = useState(0);
  const { simulateLoading } = useLoader();
  const { settings } = useData();

  const heroImages = settings.heroSlides && settings.heroSlides.length > 0
    ? settings.heroSlides.filter(slide => slide.url && slide.url.trim() !== '')
    : DEFAULT_IMAGES;

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  if (heroImages.length === 0) return null;

  const currentSlide = heroImages[index % heroImages.length];

  return (
    <div className="relative min-h-[600px] md:h-[750px] w-full overflow-hidden bg-[#2a2a2a] flex items-center">
      {/* Background Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${index}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${currentSlide.url}")` }}
        >
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-black/60 md:bg-black/50 lg:bg-gradient-to-r lg:from-black/90 lg:to-black/30"></div>
        </motion.div>
      </AnimatePresence>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-12 md:py-0">
        <div className="max-w-4xl">
          {/* Content */}
          <div className="text-white">
            <motion.div
              key={`badge-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
              Líder em Qualidade e Tradição
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
                  {currentSlide.title ? currentSlide.title.split(' ').map((word, i, arr) => (
                    <span key={i}>
                      {i === arr.length - 1 ? (
                        <span className="text-yellow-400">{word}</span>
                      ) : (
                        <span>{word} </span>
                      )}
                    </span>
                  )) : 'Madeireira Pindorama'}
                </h1>
                
                <p className="text-lg md:text-xl text-stone-300 mb-10 max-w-2xl leading-relaxed">
                  {currentSlide.description || 'Tradição e Qualidade em Madeiras'}
                </p>

                <div className="flex flex-wrap gap-4 mb-12">
                  <a 
                    href={settings.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-yellow-400 hover:bg-yellow-500 text-emerald-950 font-bold py-4 px-8 rounded-xl transition flex items-center gap-3 shadow-lg shadow-yellow-400/10"
                  >
                    <MessageCircle size={24} />
                    Falar com Atendente
                  </a>
                  <a 
                    href="/#produtos"
                    className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-xl border border-white/20 transition flex items-center gap-2 backdrop-blur-sm"
                  >
                    Ver Catálogo
                    <ChevronRight size={24} />
                  </a>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/10 pt-8 mt-12">
                  <div className="flex flex-col gap-1">
                    <div className="text-yellow-400 font-bold text-lg leading-none">Entrega</div>
                    <div className="text-[10px] text-stone-400 uppercase tracking-widest">Rápida e Própria</div>
                  </div>
                  <div className="flex flex-col gap-1 border-x border-white/10 px-6">
                    <div className="text-yellow-400 font-bold text-lg leading-none">Certificada</div>
                    <div className="text-[10px] text-stone-400 uppercase tracking-widest">Origem Legal</div>
                  </div>
                  <div className="flex flex-col gap-1 border-r border-white/10 pr-6">
                    <div className="text-yellow-400 font-bold text-lg leading-none">Garantia</div>
                    <div className="text-[10px] text-stone-400 uppercase tracking-widest">De Qualidade</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
                      <TreePine size={20} />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white leading-none">+46 Anos</div>
                      <div className="text-[10px] text-stone-400 uppercase">Desde 1978</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="absolute bottom-12 left-0 w-full px-4 sm:px-6 lg:px-8 z-20 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-end pointer-events-auto">
          <div className="flex gap-4">
            <button 
              onClick={() => setIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
              className="w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/10 transition"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => setIndex((prev) => (prev + 1) % heroImages.length)}
              className="w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/10 transition"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-1.5 transition-all duration-300 rounded-full ${
              i === index ? 'h-8 bg-yellow-400' : 'h-2 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
