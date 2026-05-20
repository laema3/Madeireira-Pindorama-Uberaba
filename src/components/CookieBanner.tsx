import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('cookieConsent');
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-stone-900 border-t border-emerald-800 text-stone-300 p-4 sm:p-6 z-[100] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="max-w-4xl">
        <p className="text-sm">
          Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência em nosso site, 
          personalizar conteúdo e analisar nosso tráfego. Ao continuar navegando, você concorda com nossa{' '}
          <Link to="/politica-de-privacidade" className="text-emerald-400 font-medium hover:text-emerald-300 underline underline-offset-2">
            Política de Privacidade
          </Link>.
        </p>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
        <button
          onClick={handleAccept}
          className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors whitespace-nowrap shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-stone-900"
        >
          Aceitar e Continuar
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="p-2 text-stone-500 hover:text-stone-300 hover:bg-stone-800 rounded-lg transition-colors"
          aria-label="Fechar"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
