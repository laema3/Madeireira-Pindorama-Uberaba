import React from 'react';
import { motion } from 'motion/react';
import { useLoader } from './LoaderContext';
import { useData } from './DataContext';

export function About() {
  const { simulateLoading } = useLoader();
  const { about, history } = useData();

  return (
    <section id="sobre" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sobre Nós */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {about.image && about.image.trim() !== '' ? (
              <img
                src={about.image}
                alt={about.title}
                className="rounded-2xl shadow-xl w-full h-96 object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/800x600?text=Sem+Imagem';
                  e.currentTarget.onerror = null;
                }}
              />
            ) : (
              <div className="rounded-2xl shadow-xl w-full h-96 bg-stone-200 flex items-center justify-center text-stone-400">
                Sem imagem
              </div>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-emerald-800 font-bold uppercase tracking-wide mb-2">Sobre Nós</h2>
            <h3 className="text-4xl font-bold text-emerald-900 mb-6">{about.title}</h3>
            <p className="text-stone-600 mb-6 text-lg leading-relaxed whitespace-pre-line">
              {about.description}
            </p>
          </motion.div>
        </div>

        {/* Nossa História */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:order-2"
          >
            {history.videoUrl && history.videoUrl.trim() !== '' ? (
              <div className="rounded-2xl shadow-xl w-full h-96 overflow-hidden">
                <video 
                  src={history.videoUrl} 
                  className="w-full h-full object-cover"
                  controls
                  muted
                  loop
                  autoPlay
                />
              </div>
            ) : history.image && history.image.trim() !== '' ? (
              <img
                src={history.image}
                alt={history.title}
                className="rounded-2xl shadow-xl w-full h-96 object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/800x600?text=Sem+Imagem';
                  e.currentTarget.onerror = null;
                }}
              />
            ) : (
              <div className="rounded-2xl shadow-xl w-full h-96 bg-stone-200 flex items-center justify-center text-stone-400">
                Sem mídia
              </div>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:order-1"
          >
            <h2 className="text-emerald-800 font-bold uppercase tracking-wide mb-2">Nossa Trajetória</h2>
            <h3 className="text-4xl font-bold text-emerald-900 mb-6">{history.title}</h3>
            <p className="text-stone-600 mb-6 text-lg leading-relaxed whitespace-pre-line">
              {history.description}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
