import React from 'react';
import { useData } from './DataContext';
import { Phone, Star } from 'lucide-react';

export function Professionals() {
  const { professionals } = useData();

  return (
    <section className="py-16 bg-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-emerald-900 mb-4">Profissionais Indicados</h2>
          <div className="w-24 h-1 bg-emerald-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-stone-600 max-w-2xl mx-auto">
            Encontre os melhores especialistas para o seu projeto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {professionals && professionals.map((pro) => (
            <div key={pro.id} className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-4">
              {pro.image && pro.image.trim() !== '' ? (
                <img
                  src={pro.image}
                  alt={pro.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-emerald-200"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/100x100?text=' + pro.name.charAt(0);
                    e.currentTarget.onerror = null;
                  }}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-200 text-emerald-800 font-bold text-xl">
                  {pro.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="font-bold text-emerald-900">{pro.name}</h3>
                <p className="text-emerald-700 text-sm font-medium mb-1">{pro.specialty}</p>
                <div className="flex items-center text-stone-500 text-sm">
                  <Phone size={14} className="mr-1" />
                  {pro.contact}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
