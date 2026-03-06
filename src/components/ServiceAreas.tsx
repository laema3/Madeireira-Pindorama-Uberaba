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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {serviceAreas.map((area) => (
            <div 
              key={area.id} 
              className="flex flex-col sm:flex-row bg-stone-50 rounded-2xl overflow-hidden shadow-sm border border-stone-100 group hover:shadow-md transition-shadow"
            >
              <div className="sm:w-1/3 h-48 sm:h-auto overflow-hidden">
                {area.image ? (
                  <img 
                    src={area.image} 
                    alt={area.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-emerald-300">
                    <MapPin size={48} />
                  </div>
                )}
              </div>
              <div className="sm:w-2/3 p-6 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-emerald-900 mb-2">{area.title}</h3>
                <p className="text-stone-600 leading-relaxed">
                  {area.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
