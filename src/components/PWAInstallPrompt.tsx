import React, { useState, useEffect } from 'react';
import { X, Download, Share, PlusSquare } from 'lucide-react';

export function PWAInstallPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [platform, setPlatform] = useState<'android' | 'ios' | 'other'>('other');

  useEffect(() => {
    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isiOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    
    if (isiOS) setPlatform('ios');
    else if (isAndroid) setPlatform('android');

    // Check if already in standalone mode (installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone 
      || document.referrer.includes('android-app://');

    if (isStandalone) {
      return;
    }

    // Check if shown today
    const lastShown = localStorage.getItem('pwa_prompt_last_shown');
    const today = new Date().toISOString().split('T')[0];

    if (lastShown === today) {
      return;
    }

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, we don't have beforeinstallprompt, so we show it manually after a delay
    if (isiOS && lastShown !== today) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    // Mark as shown today
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('pwa_prompt_last_shown', today);
  };

  return (
    <>
      {isVisible && (
        <div
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 bg-white rounded-2xl shadow-2xl border-t-4 border-emerald-600 z-[100] p-5 animate-in slide-in-from-bottom-10 duration-500"
        >
          <button 
            onClick={handleClose}
            className="absolute top-3 right-3 text-stone-400 hover:text-stone-600 transition"
          >
            <X size={20} />
          </button>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 shrink-0">
              <Download size={24} />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 leading-tight mb-1">Madeireira Pindorama no seu Celular!</h3>
              <p className="text-sm text-stone-600 mb-4">Acesse mais rápido e receba ofertas exclusivas instalando nosso aplicativo.</p>
              
              {platform === 'ios' ? (
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-100 text-xs text-stone-500 space-y-2">
                  <p className="flex items-center gap-2">
                    1. Toque no ícone <Share size={14} className="text-blue-500" /> (Compartilhar)
                  </p>
                  <p className="flex items-center gap-2">
                    2. Role para baixo e toque em <PlusSquare size={14} className="text-stone-700" /> <strong>"Adicionar à Tela de Início"</strong>
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleInstall}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg transition shadow-md shadow-emerald-600/20"
                >
                  Instalar Agora
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
