import React from 'react';
import { useData } from './DataContext';

export function Location() {
  const { settings } = useData();
  const address = settings?.address || 'Av. das Araucárias, 1234 - Distrito Industrial';
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section className="bg-stone-100">
      <div className="w-full h-[500px] bg-stone-300 overflow-hidden shadow-md relative">
         <iframe 
           src={mapUrl}
           width="100%" 
           height="100%" 
           style={{ border: 0 }} 
           allowFullScreen 
           loading="lazy"
           title="Mapa de Localização"
         ></iframe>
      </div>
    </section>
  );
}
