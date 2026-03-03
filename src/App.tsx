import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { MissionVisionValues } from './components/MissionVisionValues';
import { Products } from './components/Products';
import { Works } from './components/Works';
import { Partners } from './components/Partners';
import { Professionals } from './components/Professionals';
import { ServiceAreas } from './components/ServiceAreas';
import { Posts } from './components/Posts';
import { Location } from './components/Location';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';
import { FloatingActions } from './components/FloatingActions';
import { ContactForm } from './components/ContactForm';
import { LoaderProvider } from './components/LoaderContext';
import { DataProvider } from './components/DataContext';
import { AdminPanel } from './components/AdminPanel';
import { FaviconManager } from './components/FaviconManager';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    document.title = "Madeireira Pindorama";
    const checkHash = () => {
      setIsAdmin(window.location.hash === '#admin');
    };
    
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  return (
    <DataProvider>
      <FaviconManager />
      {isAdmin ? (
        <AdminPanel />
      ) : (
        <LoaderProvider>
          <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
            <Header />
            <main>
              <Hero />
              <About />
              <MissionVisionValues />
              <Products />
              <Works />
              <Partners />
              <Professionals />
              <ServiceAreas />
              <Posts />
              <div id="contato">
                <ContactForm />
                <Location />
              </div>
            </main>
            <Footer />
            <Chatbot />
            <FloatingActions />
            
            {/* Secret Admin Link in Footer (hidden but accessible) */}
            <div className="fixed bottom-0 left-0 w-full h-2 z-0 opacity-0 hover:opacity-100 pointer-events-none">
              <a href="#admin" className="pointer-events-auto absolute bottom-0 right-0 p-1 text-xs text-gray-300">Admin</a>
            </div>
          </div>
        </LoaderProvider>
      )}
    </DataProvider>
  );
}
