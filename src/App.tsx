import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { LoaderProvider } from './components/LoaderContext';
import { DataProvider } from './components/DataContext';
import { AdminPanel } from './components/AdminPanel';
import { FaviconManager } from './components/FaviconManager';
import { ConnectionStatus } from './components/ConnectionStatus';

// Pages
import { Home } from './pages/Home';
import { WorksPage } from './pages/WorksPage';
import { ProfessionalsPage } from './pages/ProfessionalsPage';
import { ServiceAreasPage } from './pages/ServiceAreasPage';
import { PartnersPage } from './pages/PartnersPage';
import { PostsPage } from './pages/PostsPage';

function AppContent() {
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.title = "Madeireira Pindorama";
    const checkHash = () => {
      setIsAdmin(window.location.hash === '#admin');
    };
    
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  if (isAdmin) {
    return <AdminPanel />;
  }

  return (
    <LoaderProvider>
      <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/obras" element={<WorksPage />} />
            <Route path="/profissionais" element={<ProfessionalsPage />} />
            <Route path="/atuacao" element={<ServiceAreasPage />} />
            <Route path="/parceiros" element={<PartnersPage />} />
            <Route path="/dicas" element={<PostsPage />} />
          </Routes>
        </main>
        <Footer />
        <FloatingActions />
        
        {/* Secret Admin Link in Footer (hidden but accessible) */}
        <div className="fixed bottom-0 left-0 w-full h-2 z-0 opacity-0 hover:opacity-100 pointer-events-none">
          <a href="#admin" className="pointer-events-auto absolute bottom-0 right-0 p-1 text-xs text-gray-300">Admin</a>
        </div>
      </div>
    </LoaderProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <FaviconManager />
        <ConnectionStatus />
        <AppContent />
      </DataProvider>
    </BrowserRouter>
  );
}
