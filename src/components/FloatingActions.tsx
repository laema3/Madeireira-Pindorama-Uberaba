import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { useLoader } from './LoaderContext';

export function FloatingActions() {
  const { simulateLoading } = useLoader();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    simulateLoading(() => {
      window.open(href, '_blank');
    });
  };

  return (
    <div className="fixed bottom-6 left-6 flex flex-col gap-4 z-50">
      <a
        href="https://wa.me/5511999999999"
        onClick={(e) => handleClick(e, "https://wa.me/5511999999999")}
        className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition hover:scale-110 flex items-center justify-center"
        title="WhatsApp"
      >
        <MessageCircle size={24} />
      </a>
      <a
        href="tel:+551133334444"
        onClick={(e) => {
          e.preventDefault();
          simulateLoading(() => {
            window.location.href = "tel:+551133334444";
          });
        }}
        className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition hover:scale-110 flex items-center justify-center"
        title="Ligar"
      >
        <Phone size={24} />
      </a>
    </div>
  );
}
