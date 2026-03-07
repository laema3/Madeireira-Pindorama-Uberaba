import React from 'react';
import { useData } from './DataContext';

export function Partners() {
  const { partners } = useData();

  return (
    <section id="parceiros" className="py-16 bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-emerald-900 mb-4">Parceiros</h2>
          <div className="w-24 h-1 bg-emerald-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-stone-600 max-w-2xl mx-auto">
            Trabalhamos com as melhores marcas do mercado.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-12 opacity-80">
          {partners.map((partner) => (
            <div key={partner.id} className="grayscale hover:grayscale-0 transition duration-300">
              {partner.logo && partner.logo.trim() !== '' ? (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-16 object-contain hover:brightness-100"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/200x100?text=${encodeURIComponent(partner.name)}`;
                    e.currentTarget.onerror = null;
                  }}
                />
              ) : (
                <span className="text-xl font-bold text-gray-800 hover:text-emerald-700 transition">{partner.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
