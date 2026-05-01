import React from 'react';
import { Menu, X, TreePine, Search, Phone, MessageCircle, ChevronDown, Home, Info, Package, Target, Lightbulb, Hammer, Users, UserCheck, Mail } from 'lucide-react';
import { useState } from 'react';
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
    { label: 'Início', href: '/', icon: Home },
    { label: 'Sobre Nós', href: '/#sobre', icon: Info },
    { label: 'Produtos', href: '/#produtos', icon: Package },
    { 
      label: 'Serviços', 
      href: '#',
      icon: Target,
      submenu: [
        { label: 'Atuação', href: '/atuacao', icon: Target },
        { label: 'Dicas', href: '/dicas', icon: Lightbulb },
        { label: 'Obras', href: '/obras', icon: Hammer },
        { label: 'Parceiros', href: '/parceiros', icon: Users },
        { label: 'Profissionais', href: '/profissionais', icon: UserCheck },
      ]
    },
    { label: 'Contato', href: '/#contato', icon: Mail },
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
    <header className="bg-emerald-900 shadow-sm sticky top-0 z-40">
      {/* Top Bar */}
      <div className="bg-emerald-950 text-white px-4 hidden sm:block h-8">
        <div className="max-w-7xl mx-auto flex justify-end items-center h-full text-[10px] uppercase tracking-widest font-bold">
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4 shrink-0">
            <Link to="/" onClick={(e) => handleNavClick(e as any, '/')} className="flex flex-col items-center gap-1">
              {settings?.logoUrl && settings?.logoUrl.trim() !== '' ? (
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
                <div className="bg-white p-2 rounded-lg text-emerald-900">
                  <TreePine size={32} />
                </div>
              )}
              <div className="flex flex-col items-center text-center">
                <span className="font-bold text-white text-base md:text-lg leading-tight">Madeireira Pindorama</span>
                <span className="text-stone-300 text-xs md:text-sm font-medium">Madeiras e Acabamentos</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-8">
            <nav className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <div key={item.label} className="relative group">
                  {item.submenu ? (
                    <>
                      <button
                        className="text-white hover:bg-emerald-800 font-semibold text-base px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <item.icon size={18} className="text-yellow-400" />
                        {item.label}
                        <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
                      </button>
                      <div className="absolute left-0 top-full mt-2 w-48 bg-emerald-800 border border-emerald-700 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                        <div className="py-2">
                          {item.submenu.map((sub) => (
                            <Link
                              key={sub.label}
                              to={sub.href}
                              onClick={(e) => handleNavClick(e as any, sub.href)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-emerald-700 transition-colors"
                            >
                              <sub.icon size={16} className="text-yellow-400" />
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
                      className="text-white hover:bg-emerald-800 font-semibold text-base px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <item.icon size={18} className="text-yellow-400" />
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {/* Phone Button like in the image */}
              <a 
                href={`tel:${settings?.phone || ''}`}
                className="hidden md:flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-emerald-950 font-bold py-2.5 px-6 rounded-full transition shadow-sm"
              >
                <Phone size={18} />
                <span>{settings?.phone || '(00) 0000-0000'}</span>
              </a>

              <button
                className="lg:hidden p-2 text-white"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search size={24} />
              </button>
              <button
                className="lg:hidden p-2 text-white"
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
        <div className="lg:hidden bg-emerald-900 border-t border-emerald-800 max-h-[80vh] overflow-y-auto">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => setActiveSubmenu(activeSubmenu === item.label ? null : item.label)}
                      className="w-full flex justify-between items-center px-3 py-2 text-lg font-medium text-white hover:bg-emerald-800 rounded-md transition-colors duration-200"
                    >
                      <span className="flex items-center gap-2">
                        <item.icon size={20} className="text-yellow-400" />
                        {item.label}
                      </span>
                      <ChevronDown size={20} className={`transition-transform ${activeSubmenu === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    {activeSubmenu === item.label && (
                      <div className="bg-emerald-950 rounded-md mt-1 ml-4 space-y-1">
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.label}
                            to={sub.href}
                            onClick={(e) => handleNavClick(e as any, sub.href)}
                            className="flex items-center gap-2 px-3 py-2 text-base font-medium text-stone-300 hover:text-white"
                          >
                            <sub.icon size={18} className="text-yellow-400" />
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
                    className="flex items-center gap-2 px-3 py-2 text-lg font-medium text-white hover:bg-emerald-800 rounded-md transition-colors duration-200"
                  >
                    <item.icon size={20} className="text-yellow-400" />
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="border-t border-emerald-800 mt-4 pt-4 pb-2">
              <div className="flex flex-col gap-3 px-3">
                <a href={`tel:${settings?.phone || ''}`} className="flex items-center gap-3 text-stone-300">
                  <Phone size={18} className="text-yellow-400" />
                  <span>{settings?.phone || '(00) 0000-0000'}</span>
                </a>
                <a href={settings?.whatsappUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-stone-300">
                  <MessageCircle size={18} className="text-yellow-400" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
