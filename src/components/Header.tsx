import React from 'react';
import { Menu, X, TreePine, Search, User, Phone, MessageCircle, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLoader } from './LoaderContext';
import { useData } from './DataContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const { simulateLoading } = useLoader();
  const { settings } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Início', href: '/' },
    { label: 'Sobre Nós', href: '/#sobre' },
    { label: 'Produtos', href: '/#produtos' },
    { 
      label: 'Serviços', 
      href: '#',
      submenu: [
        { label: 'Atuação', href: '/atuacao' },
        { label: 'Dicas', href: '/dicas' },
        { label: 'Obras', href: '/obras' },
        { label: 'Parceiros', href: '/parceiros' },
        { label: 'Profissionais', href: '/profissionais' },
      ]
    },
    { label: 'Contato', href: '/#contato' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.replace('/#', '');
      
      simulateLoading(() => {
        setIsMenuOpen(false);
        if (location.pathname !== '/') {
          navigate('/');
          // Wait for navigation to complete before scrolling
          setTimeout(() => {
            const element = document.getElementById(targetId);
            element?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        } else {
          const element = document.getElementById(targetId);
          element?.scrollIntoView({ behavior: 'smooth' });
        }
      });
      return;
    }

    if (href === '/') {
      e.preventDefault();
      simulateLoading(() => {
        setIsMenuOpen(false);
        if (location.pathname !== '/') {
          navigate('/');
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
      return;
    }

    if (href === '#') {
      e.preventDefault();
      return;
    }

    // For regular routes
    e.preventDefault();
    setIsMenuOpen(false);
    navigate(href);
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-40">
      {/* Top Bar */}
      <div className="bg-emerald-900 text-white py-1 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-end items-center text-[10px] uppercase tracking-widest font-bold">
          <div className="flex gap-4">
            <button className="hover:text-emerald-200 transition flex items-center gap-1">
              <User size={10} />
              <span>Área do Cliente</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4 shrink-0">
            <Link to="/" onClick={(e) => handleNavClick(e as any, '/')}>
              {settings.logoUrl && settings.logoUrl.trim() !== '' ? (
                <img 
                  src={settings.logoUrl} 
                  alt="Logo" 
                  className="h-16 md:h-20 w-auto object-contain" 
                  referrerPolicy="no-referrer" 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="bg-emerald-900 p-2 rounded-lg text-white">
                  <TreePine size={32} />
                </div>
              )}
            </Link>
          </div>

          <div className="flex items-center gap-8">
            <nav className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <div key={item.label} className="relative group">
                  {item.submenu ? (
                    <>
                      <button
                        className="text-stone-700 hover:text-white hover:bg-emerald-700 font-semibold text-base px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                      >
                        {item.label}
                        <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
                      </button>
                      <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-stone-100 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                        <div className="py-2">
                          {item.submenu.map((sub) => (
                            <Link
                              key={sub.label}
                              to={sub.href}
                              onClick={(e) => handleNavClick(e as any, sub.href)}
                              className="block px-4 py-2 text-sm text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={(e) => handleNavClick(e as any, item.href)}
                      className="text-stone-700 hover:text-white hover:bg-emerald-700 font-semibold text-base px-3 py-2 rounded-lg transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {/* Phone Button like in the image */}
              <a 
                href={`tel:${settings.phone}`}
                className="hidden md:flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-emerald-950 font-bold py-2.5 px-6 rounded-full transition shadow-sm"
              >
                <Phone size={18} />
                <span>{settings.phone}</span>
              </a>

              <button
                className="lg:hidden p-2 text-stone-600"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
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
        <div className="lg:hidden bg-white border-t border-stone-100 max-h-[80vh] overflow-y-auto">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => setActiveSubmenu(activeSubmenu === item.label ? null : item.label)}
                      className="w-full flex justify-between items-center px-3 py-2 text-lg font-medium text-stone-600 hover:text-white hover:bg-emerald-700 rounded-md transition-colors duration-200"
                    >
                      {item.label}
                      <ChevronDown size={20} className={`transition-transform ${activeSubmenu === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    {activeSubmenu === item.label && (
                      <div className="bg-stone-50 rounded-md mt-1 ml-4 space-y-1">
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.label}
                            to={sub.href}
                            onClick={(e) => handleNavClick(e as any, sub.href)}
                            className="block px-3 py-2 text-base font-medium text-stone-500 hover:text-emerald-700"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.href}
                    onClick={(e) => handleNavClick(e as any, item.href)}
                    className="block px-3 py-2 text-lg font-medium text-stone-600 hover:text-white hover:bg-emerald-700 rounded-md transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
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
