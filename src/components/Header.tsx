import React from 'react';
import { Menu, X, TreePine, Search, User, Phone, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useLoader } from './LoaderContext';
import { useData } from './DataContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { simulateLoading } = useLoader();
  const { settings } = useData();

  const navItems = [
    { label: 'Início', href: '#' },
    { label: 'Sobre Nós', href: '#sobre' },
    { label: 'Produtos', href: '#produtos' },
    { label: 'Obras', href: '#obras' },
    { label: 'Parceiros', href: '#parceiros' },
    { label: 'Contato', href: '#contato' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    simulateLoading(() => {
      setIsMenuOpen(false);
      const element = document.querySelector(href === '#' ? 'body' : href);
      element?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      {/* Top Bar */}
      <div className="bg-emerald-900 text-white py-2 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex gap-6">
            <a href={`tel:${settings.phone}`} className="flex items-center gap-2 hover:text-emerald-200 transition">
              <Phone size={14} />
              <span>{settings.phone}</span>
            </a>
            <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-emerald-200 transition">
              <MessageCircle size={14} />
              <span>WhatsApp</span>
            </a>
          </div>
          <div className="flex gap-4">
            <button className="hover:text-emerald-200 transition flex items-center gap-1">
              <User size={14} />
              <span>Login / Cadastrar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 min-h-[100px]">
          <div className="flex items-center gap-4 shrink-0">
            {settings.logoUrl && settings.logoUrl.trim() !== '' ? (
              <img 
                src={settings.logoUrl} 
                alt="Logo" 
                className="h-24 w-auto object-contain" 
                referrerPolicy="no-referrer" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none'; // Hide broken image
                }}
              />
            ) : (
              <div className="bg-emerald-900 p-2 rounded-lg text-white">
                <TreePine size={32} />
              </div>
            )}
          </div>

          <nav className="hidden lg:flex space-x-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-stone-600 hover:text-emerald-800 font-medium transition whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Search Bar Desktop */}
            <div className="hidden md:flex items-center bg-stone-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-emerald-500 transition">
              <Search size={18} className="text-stone-400" />
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-32 lg:w-48"
              />
            </div>

            {/* Mobile Search Toggle */}
            <button 
              className="md:hidden p-2 text-stone-600"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={24} />
            </button>

            <button
              className="lg:hidden p-2 text-stone-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <div className="flex items-center bg-stone-100 rounded-lg px-4 py-2">
              <Search size={18} className="text-stone-400" />
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="block px-3 py-2 text-base font-medium text-stone-600 hover:text-emerald-800 hover:bg-stone-50 rounded-md"
              >
                {item.label}
              </a>
            ))}
            <div className="border-t border-stone-100 mt-4 pt-4 pb-2">
              <div className="flex flex-col gap-3 px-3">
                <a href={`tel:${settings.phone}`} className="flex items-center gap-3 text-stone-600">
                  <Phone size={18} />
                  <span>{settings.phone}</span>
                </a>
                <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-stone-600">
                  <MessageCircle size={18} />
                  <span>WhatsApp</span>
                </a>
                <button className="flex items-center gap-3 text-emerald-700 font-bold mt-2">
                  <User size={18} />
                  <span>Login / Cadastrar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
