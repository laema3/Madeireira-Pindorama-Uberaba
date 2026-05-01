import React from 'react';
import { useData } from './DataContext';
import { Phone, Star } from 'lucide-react';

export function Professionals() {
  const { professionals, settings } = useData();

  return (
    <section className="py-24 relative overflow-hidden bg-emerald-900 border-y border-emerald-800">
      {/* Wood Background with Dark Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ 
          backgroundImage: `url("${settings.heroBgUrl || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=2070&auto=format&fit=crop'}")`,
          filter: 'brightness(0.3) saturate(0.8)'
        }}
      ></div>
      
      {/* Additional Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-[1]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Profissionais Indicados
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            className="h-1.5 bg-yellow-400 mx-auto rounded-full mb-6"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-stone-300 max-w-2xl mx-auto text-lg"
          >
            Encontre os melhores especialistas para o seu projeto. Qualidade garantida pela Pindorama.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {professionals && professionals.map((pro, index) => (
            <motion.div 
              key={pro.id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center gap-6 group transition-all hover:bg-white/20"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity"></div>
                {pro.image && pro.image.trim() !== '' ? (
                  <img
                    src={pro.image}
                    alt={pro.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white/20 relative z-10"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/200x200?text=' + pro.name.charAt(0);
                      e.currentTarget.onerror = null;
                    }}
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-emerald-800 flex items-center justify-center border-4 border-white/20 text-white font-bold text-3xl relative z-10 uppercase">
                    {pro.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="w-full">
                <h3 className="font-bold text-2xl text-white mb-2">{pro.name}</h3>
                <div className="inline-flex px-3 py-1 bg-yellow-400 text-emerald-950 text-xs font-bold rounded-full uppercase tracking-tighter mb-4">
                  {pro.specialty}
                </div>
                <div className="flex items-center justify-center gap-2 text-stone-300 bg-black/20 p-3 rounded-xl border border-white/5 group-hover:bg-black/40 transition-colors">
                  <div className="p-2 bg-emerald-600 rounded-lg text-white">
                    <Phone size={18} />
                  </div>
                  <span className="font-mono text-lg">{pro.contact}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
