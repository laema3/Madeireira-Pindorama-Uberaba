import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, MessageCircle, TreePine } from 'lucide-react';
import { useLoader } from './LoaderContext';
import { useData } from './DataContext';

const DEFAULT_IMAGES = [
  {
    url: 'https://picsum.photos/seed/lumber1/1920/1080',
    title: 'Qualidade que Constrói Sonhos',
    description: 'As melhores madeiras para sua obra ou reforma.'
  },
  {
    url: 'https://picsum.photos/seed/lumber2/1920/1080',
    title: 'Sustentabilidade e Confiança',
    description: 'Madeiras certificadas e de origem legal.'
  },
  {
    url: 'https://picsum.photos/seed/lumber3/1920/1080',
    title: 'Variedade em Acabamentos',
    description: 'Decks, forros e assoalhos com o melhor preço.'
  },
  {
    url: 'https://picsum.photos/seed/lumber4/1920/1080',
    title: 'Entrega Rápida e Segura',
    description: 'Logística eficiente para atender sua necessidade.'
  },
  {
    url: 'https://picsum.photos/seed/lumber5/1920/1080',
    title: 'Parceria com Profissionais',
    description: 'Soluções completas para marceneiros e carpinteiros.'
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
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a2a] via-[#3a3a3a] to-[#1a1a1a] opacity-90"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-12 md:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Content */}
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
                <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                  {currentSlide.title.split(' ').map((word, i, arr) => (
                    <span key={i}>
                      {i === arr.length - 1 ? (
                        <span className="text-yellow-400">{word}</span>
                      ) : (
                        <span>{word} </span>
                      )}
                    </span>
                  ))}
                </h1>
                
                <p className="text-lg md:text-xl text-stone-300 mb-10 max-w-lg leading-relaxed">
                  {currentSlide.description}
                </p>

                <div className="flex flex-wrap gap-4 mb-12">
                  <a 
                    href={settings.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-yellow-400 hover:bg-yellow-500 text-emerald-950 font-bold py-4 px-8 rounded-xl transition flex items-center gap-3 shadow-lg shadow-yellow-400/10"
                  >
                    <MessageCircle size={20} />
                    Orçamento via WhatsApp
                  </a>
                  <a 
                    href="/#produtos"
                    className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-xl border border-white/20 transition flex items-center gap-2 backdrop-blur-sm"
                  >
                    Conhecer Produtos
                    <ChevronRight size={20} />
                  </a>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
                  <div className="flex flex-col gap-1">
                    <div className="text-yellow-400 font-bold text-sm">Entrega</div>
                    <div className="text-[10px] text-stone-400 uppercase tracking-tighter">Rápida e Segura</div>
                  </div>
                  <div className="flex flex-col gap-1 border-x border-white/10 px-4">
                    <div className="text-yellow-400 font-bold text-sm">Certificada</div>
                    <div className="text-[10px] text-stone-400 uppercase tracking-tighter">Origem Legal</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-yellow-400 font-bold text-sm">Garantia</div>
                    <div className="text-[10px] text-stone-400 uppercase tracking-tighter">De Qualidade</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side: Visual */}
          <div className="relative aspect-[4/5] md:aspect-square">
            <AnimatePresence>
              <motion.div
                key={`image-${index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.5, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 z-10"
              >
                <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
                  <img
                    src={currentSlide.url}
                    alt={currentSlide.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/800x800?text=Madeireira+Pindorama';
                    }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Floating Card - Needs to be outside the AnimatePresence to stay visible */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-6 -left-6 md:-left-12 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-4 z-20"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                <TreePine size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-900 leading-none">+30 Anos</div>
                <div className="text-xs text-stone-500 font-medium uppercase tracking-wider">Desde 1995</div>
              </div>
            </motion.div>

            {/* Carousel Indicators */}
            <div className="absolute -bottom-12 right-0 flex gap-3 z-30">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? 'w-8 bg-yellow-400' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
