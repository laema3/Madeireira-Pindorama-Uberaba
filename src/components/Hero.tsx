import React, { useState, useEffect } from 'react';
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

  const heroImages = settings?.heroSlides && settings.heroSlides.length > 0
    ? settings.heroSlides.filter(slide => slide?.url && slide.url.trim() !== '')
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
    <div className="relative w-full bg-emerald-50 py-4 md:py-8 flex items-center shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative w-full min-h-[600px] md:min-h-[680px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl flex items-center bg-stone-900 group">
          {/* Background Slider */}
          <div
            key={`bg-${index}`}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
            style={{ backgroundImage: `url("${currentSlide.url}")` }}
          >
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
          
          <div className="w-full relative z-10 p-6 sm:p-10 md:p-16 xl:p-20">
            <div className="max-w-4xl">
              {/* Content */}
              <div className="text-white">
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8"
                >
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                  Líder em Qualidade e Tradição
                </div>

                <div
                  key={`content-${index}`}
                  className="transition-all duration-500"
                >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-none mb-6">
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
                      href={settings?.whatsappUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-yellow-400 hover:bg-yellow-500 text-emerald-950 font-bold py-4 px-8 rounded-xl transition flex items-center gap-3 shadow-lg shadow-yellow-400/10"
                    >
                      <MessageCircle size={24} />
                      Falar com Atendente
                    </a>
                    <a 
                      href="/produtos"
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
                    <div className="flex flex-col gap-1 border-white/10 md:border-l md:border-x-0 border-l pl-4 md:pl-6 md:px-6">
                      <div className="text-yellow-400 font-bold text-lg leading-none">Certificada</div>
                      <div className="text-[10px] text-stone-400 uppercase tracking-widest">Origem Legal</div>
                    </div>
                    <div className="flex flex-col gap-1 border-t border-white/10 pt-6 md:pt-0 mt-2 md:mt-0 md:border-t-0 md:border-l md:pl-6 md:pr-6">
                      <div className="text-yellow-400 font-bold text-lg leading-none">Garantia</div>
                      <div className="text-[10px] text-stone-400 uppercase tracking-widest">De Qualidade</div>
                    </div>
                    <div className="flex items-center gap-3 border-white/10 border-t border-l pl-4 md:border-t-0 md:pt-0 pt-6 mt-2 md:mt-0">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
                        <TreePine size={20} />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white leading-none">+46 Anos</div>
                        <div className="text-[10px] text-stone-400 uppercase">Desde 1978</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Controls and Indicators */}
          <div className="absolute right-6 bottom-6 md:right-12 md:bottom-12 z-20 flex flex-col items-end gap-6">
            <div className="flex md:hidden gap-2">
               {heroImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`h-1.5 transition-all duration-300 rounded-full ${
                      i === index ? 'w-6 bg-yellow-400' : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
                className="w-12 h-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => setIndex((prev) => (prev + 1) % heroImages.length)}
                className="w-12 h-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="hidden md:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col gap-3 z-30">
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
      </div>
    </div>
  );
}
