import React from 'react';
import { useData } from './DataContext';

export function Partners() {
  const { partners } = useData();

  return (
    <section id="parceiros" className="py-16 bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Parceiros</h2>
          <p className="text-stone-400">Trabalhamos com as melhores marcas do mercado.</p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-12 opacity-80">
          {partners.map((partner) => (
            <div key={partner.id} className="grayscale hover:grayscale-0 transition duration-300">
              {partner.logo && partner.logo.trim() !== '' ? (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-16 object-contain brightness-0 invert hover:brightness-100 hover:invert-0"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/200x100?text=${encodeURIComponent(partner.name)}`;
                    e.currentTarget.onerror = null;
                  }}
                />
              ) : (
                <span className="text-xl font-bold text-stone-500 hover:text-white transition">{partner.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
