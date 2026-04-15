import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, MessageCircle, Clock, Settings } from 'lucide-react';
import { useData } from './DataContext';

export function Footer() {
  const { settings } = useData();

  return (
    <footer className="bg-[#3d2b1f] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            {(settings.footerLogoUrl || settings.logoUrl) && (settings.footerLogoUrl || settings.logoUrl).trim() !== '' && (
              <img 
                src={settings.footerLogoUrl && settings.footerLogoUrl.trim() !== '' ? settings.footerLogoUrl : settings.logoUrl} 
                alt="Madeireira Pindorama" 
                className="h-32 w-auto object-contain mb-6" 
                referrerPolicy="no-referrer" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <h3 className="text-white text-xl font-bold mb-6">Madeireira Pindorama</h3>
            <p className="mb-6 whitespace-pre-line text-white/80">
              {settings.footerDescription || 'Há mais de 20 anos fornecendo madeira de qualidade e soluções para construção civil e marcenaria.'}
            </p>
            <div className="flex gap-4">
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-400 transition"><Facebook /></a>
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-400 transition"><Instagram /></a>
              <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-400 transition"><MessageCircle /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-6">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="shrink-0 text-yellow-400" />
                <span className="text-white/90">{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="shrink-0 text-yellow-400" />
                <span className="text-white/90">{settings.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="shrink-0 text-yellow-400" />
                <span className="text-white/90">{settings.email}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-2">
              <Clock size={20} className="text-yellow-400" />
              Horário de Funcionamento
            </h3>
            {settings.openingHours ? (
              <p className="whitespace-pre-line text-white/80 leading-relaxed">
                {settings.openingHours}
              </p>
            ) : (
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-white/70">Segunda a Sexta</span>
                  <span className="text-white font-medium">08:00 - 18:00</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white/70">Sábado</span>
                  <span className="text-white font-medium">08:00 - 12:00</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white/70">Domingo</span>
                  <span className="text-white/40">Fechado</span>
                </li>
              </ul>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm flex flex-col items-center gap-4">
          <p className="text-white/60">{settings.footerText}</p>
          <a href="#admin" className="text-white/10 hover:text-white transition-colors" title="Área Administrativa">
            <Settings size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
