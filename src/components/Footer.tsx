import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { useData } from './DataContext';

export function Footer() {
  const { settings } = useData();

  return (
    <footer className="bg-stone-950 text-stone-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            {settings.logoUrl && settings.logoUrl.trim() !== '' && (
              <img 
                src={settings.logoUrl} 
                alt="Madeireira Pindorama" 
                className="h-32 w-auto object-contain mb-6" 
                referrerPolicy="no-referrer" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <h3 className="text-white text-xl font-bold mb-6">Madeireira Pindorama</h3>
            <p className="mb-6">
              Há mais de 20 anos fornecendo madeira de qualidade e soluções para construção civil e marcenaria.
            </p>
            <div className="flex gap-4">
              <a href={settings.facebookUrl} className="text-stone-400 hover:text-emerald-500 transition"><Facebook /></a>
              <a href={settings.instagramUrl} className="text-stone-400 hover:text-emerald-500 transition"><Instagram /></a>
              <a href={settings.whatsappUrl} className="text-stone-400 hover:text-emerald-500 transition"><MessageCircle /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-6">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="shrink-0 text-emerald-600" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="shrink-0 text-emerald-600" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="shrink-0 text-emerald-600" />
                <span>{settings.email}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-6">Horário de Funcionamento</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Segunda a Sexta</span>
                <span className="text-white">08:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sábado</span>
                <span className="text-white">08:00 - 12:00</span>
              </li>
              <li className="flex justify-between">
                <span>Domingo</span>
                <span className="text-emerald-600">Fechado</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 text-center text-sm flex flex-col items-center gap-2">
          <p>{settings.footerText}</p>
          <a href="#admin" className="text-stone-700 hover:text-emerald-600 text-xs">Acesso Administrativo</a>
        </div>
      </div>
    </footer>
  );
}
