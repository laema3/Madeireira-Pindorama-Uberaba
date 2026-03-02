import React from 'react';
import { useData } from './DataContext';
import { MapPin } from 'lucide-react';

export function ServiceAreas() {
  const { serviceAreas } = useData();

  if (!serviceAreas || serviceAreas.length === 0) {
    return null;
  }

  return (
    <section id="atuacao" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-emerald-900 mb-4">Área de Atuação</h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Atendemos diversas cidades com qualidade e compromisso.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {serviceAreas.map((area) => (
            <div 
              key={area.id} 
              className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-6 py-3 rounded-full font-medium shadow-sm border border-emerald-100"
            >
              <MapPin size={18} className="text-emerald-600" />
              {area.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
