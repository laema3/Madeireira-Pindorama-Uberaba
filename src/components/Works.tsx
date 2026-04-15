import React, { useState } from 'react';
import { useData } from './DataContext';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Works() {
  const { works } = useData();
  const [selectedWork, setSelectedWork] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openGallery = (workId: string) => {
    setSelectedWork(workId);
    setCurrentImageIndex(0);
  };

  const closeGallery = () => {
    setSelectedWork(null);
  };

  const nextImage = (e: React.MouseEvent, total: number) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % total);
  };

  const prevImage = (e: React.MouseEvent, total: number) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + total) % total);
  };

  const currentWork = works.find(w => w.id === selectedWork);

  return (
    <section id="obras" className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-emerald-900 mb-4">Obras Realizadas</h2>
          <div className="w-24 h-1 bg-emerald-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-stone-600 max-w-2xl mx-auto">
            Confira alguns dos projetos executados com nossos materiais e parceiros.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {works.map((work) => (
            <motion.div 
              key={work.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer group"
              onClick={() => openGallery(work.id)}
            >
              <div className="relative h-64 overflow-hidden bg-stone-200">
                {work.images[0] && work.images[0].trim() !== '' ? (
                  <img 
                    src={work.images[0]} 
                    alt={work.title} 
                    className="w-full h-full object-contain transition duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/600x400?text=Erro+Imagem';
                      e.currentTarget.onerror = null;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                    <ZoomIn size={32} />
                  </div>
                )}
                {work.images[0] && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                    <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition transform scale-50 group-hover:scale-100" size={32} />
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-emerald-900 mb-2">{work.title}</h3>
                <p className="text-stone-600 line-clamp-2">{work.description}</p>
                <p className="mt-4 text-sm text-emerald-600 font-medium flex items-center gap-1">
                  Ver {work.images.length} fotos
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {selectedWork && currentWork && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeGallery}
          >
            <button 
              className="absolute top-4 right-4 text-white hover:text-emerald-400 z-50"
              onClick={closeGallery}
            >
              <X size={32} />
            </button>

            <div className="relative w-full max-w-5xl aspect-video" onClick={e => e.stopPropagation()}>
              <AnimatePresence mode='wait'>
                {currentWork.images[currentImageIndex] && currentWork.images[currentImageIndex].trim() !== '' ? (
                  <motion.img 
                    key={currentImageIndex}
                    src={currentWork.images[currentImageIndex]} 
                    alt={`${currentWork.title} - ${currentImageIndex + 1}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-contain rounded-lg"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/800x600?text=Imagem+Indisponivel';
                      e.currentTarget.onerror = null;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-500 bg-stone-100 rounded-lg">
                    Imagem não disponível
                  </div>
                )}
              </AnimatePresence>

              {currentWork.images.length > 1 && (
                <>
                  <button 
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-emerald-600 text-white p-2 rounded-full transition"
                    onClick={(e) => prevImage(e, currentWork.images.length)}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-emerald-600 text-white p-2 rounded-full transition"
                    onClick={(e) => nextImage(e, currentWork.images.length)}
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
                {currentImageIndex + 1} / {currentWork.images.length}
              </div>
            </div>
            
            <div className="absolute bottom-8 left-0 w-full text-center text-white pointer-events-none">
              <h3 className="text-2xl font-bold">{currentWork.title}</h3>
              <p className="text-stone-300">{currentWork.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
