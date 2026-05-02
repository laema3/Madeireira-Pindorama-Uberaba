import React from 'react';
import { useData } from './DataContext';
import { Lock, LogIn } from 'lucide-react';
import { motion } from 'motion/react';

export function Maintenance() {
  const { settings } = useData();

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background with Wood Pattern */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] animate-pulse"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1516733257386-816766cf241c?auto=format&fit=crop&q=80")',
          filter: 'brightness(0.3)'
        }}
      />
      
      {/* Overlay Texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 to-emerald-950/80" />

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-xl text-center bg-white/5 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl"
      >
        {/* Logo */}
        <div className="mb-8">
          {settings.logoUrl ? (
            <img 
              src={settings.logoUrl} 
              alt="Logo" 
              className="h-24 md:h-32 mx-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            />
          ) : (
            <div className="w-24 h-24 bg-emerald-700 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              MP
            </div>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
          Página em <span className="text-emerald-400">Manutenção</span>
        </h1>
        
        <p className="text-stone-300 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Estamos preparando novidades incríveis para você. Em breve nossa serraria digital estará de volta com força total!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="#admin"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-900/40 transform hover:-translate-y-1"
          >
            <LogIn size={20} />
            Área Restrita (Login)
          </a>
          
          <div className="flex items-center gap-4 text-white/60">
             <span className="w-8 h-px bg-white/20" />
             <Lock size={16} className="animate-pulse" />
             <span className="w-8 h-px bg-white/20" />
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 pt-8 border-t border-white/5 space-y-2">
          <p className="text-stone-400 text-sm">
            {settings.address}
          </p>
          <p className="text-emerald-400/80 font-mono text-xs">
            QUALIDADE E TRADIÇÃO EM MADEIRAS
          </p>
        </div>
      </motion.div>

      {/* Decorative floating chips */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-stone-500/10 rounded-full blur-3xl" />
    </div>
  );
}
