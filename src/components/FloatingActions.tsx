import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { useLoader } from './LoaderContext';
import { useData } from './DataContext';

export function FloatingActions() {
  const { simulateLoading } = useLoader();
  const { settings } = useData();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    simulateLoading(() => {
      window.open(href, '_blank');
    });
  };

  return (
    <>
      {/* WhatsApp on the Right (Replacing AI Agent) */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href={settings.whatsappUrl}
          onClick={(e) => handleClick(e, settings.whatsappUrl)}
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition hover:scale-110 flex items-center justify-center group relative"
          title="Fale Conosco no WhatsApp"
        >
          <MessageCircle size={28} />
          <span className="absolute -top-12 right-0 bg-emerald-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Fale conosco no WhatsApp
          </span>
        </a>
      </div>

      {/* Phone on the Left */}
      <div className="fixed bottom-6 left-6 z-50">
        <a
          href={`tel:${settings.phone.replace(/\D/g, '')}`}
          onClick={(e) => {
            e.preventDefault();
            simulateLoading(() => {
              window.location.href = `tel:${settings.phone.replace(/\D/g, '')}`;
            });
          }}
          className="bg-stone-800 text-white p-3 rounded-full shadow-lg hover:bg-stone-900 transition hover:scale-110 flex items-center justify-center"
          title="Ligar para nós"
        >
          <Phone size={24} />
        </a>
      </div>
    </>
  );
}
