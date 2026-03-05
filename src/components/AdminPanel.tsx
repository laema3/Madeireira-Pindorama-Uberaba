import React, { useState, useRef, useEffect } from 'react';
import { useData } from './DataContext';
import { Product, Partner, Client, Category, Subcategory, Settings, Work, Professional, ServiceArea, Post } from '../types';
import { Plus, Edit, Trash2, Save, X, LayoutDashboard, Package, Users, Info, Settings as SettingsIcon, Tag, List, UserCheck, Hammer, Image as ImageIcon, LogOut, Lock, User, Briefcase, MapPin, FileText, Video, RefreshCw, Download, Upload } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sobre' | 'produtos' | 'obras' | 'categorias' | 'clientes' | 'parceiros' | 'profissionais' | 'ajustes' | 'atuacao' | 'postagens' | 'sincronizacao'>('dashboard');
  const { 
    about, history, updateAbout, updateHistory,
    products, addProduct, updateProduct, deleteProduct,
    partners, addPartner, updatePartner, deletePartner,
    clients, addClient, updateClient, deleteClient,
    categories, addCategory, updateCategory, deleteCategory,
    subcategories, addSubcategory, updateSubcategory, deleteSubcategory,
    settings, updateSettings,
    works, addWork, updateWork, deleteWork,
    professionals, addProfessional, updateProfessional, deleteProfessional,
    serviceAreas, addServiceArea, updateServiceArea, deleteServiceArea,
    posts, addPost, updatePost, deletePost,
    isSyncing, lastSyncError, exportData, importData, forceSyncPull
  } = useData();

  // --- State for Forms ---
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partial<Partner> | null>(null);
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Partial<Subcategory> | null>(null);
  const [editingWork, setEditingWork] = useState<Partial<Work> | null>(null);
  const [editingProfessional, setEditingProfessional] = useState<Partial<Professional> | null>(null);
  const [editingServiceArea, setEditingServiceArea] = useState<Partial<ServiceArea> | null>(null);
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);
  
  const [aboutForm, setAboutForm] = useState(about);
  const [historyForm, setHistoryForm] = useState(history);
  const [settingsForm, setSettingsForm] = useState(settings);

  // --- UI State ---
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; confirmMsg: string; remove: (id: string) => void } | null>(null);

  // --- Auth State ---
  const [user, setUser] = useState<any>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const aboutImageRef = useRef<HTMLInputElement>(null);
  const historyImageRef = useRef<HTMLInputElement>(null);
  const historyVideoRef = useRef<HTMLInputElement>(null);

  // Sync forms with context data when it changes
  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  useEffect(() => {
    setAboutForm(about);
  }, [about]);

  useEffect(() => {
    setHistoryForm(history);
  }, [history]);

  // --- Helper Functions ---
  const processFile = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const max_size = 800; // Max dimension to save space (reduced from 1200)

        if (width > height) {
          if (width > max_size) {
            height *= max_size / width;
            width = max_size;
          }
        } else {
          if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          
          // Preserve transparency for PNG and WebP
          const mimeType = (file.type === 'image/png' || file.type === 'image/webp') 
            ? file.type 
            : 'image/jpeg';
          
          const quality = mimeType === 'image/jpeg' ? 0.6 : undefined;
          callback(canvas.toDataURL(mimeType, quality));
        } else {
          callback(reader.result as string); // Fallback if canvas fails
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const processFiles = (files: FileList, callback: (base64s: string[]) => void) => {
    const promises = Array.from(files).map(file => new Promise<string>((resolve) => {
      processFile(file, resolve);
    }));
    Promise.all(promises).then(callback);
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Handlers ---

  const handleSaveAbout = () => {
    try {
      updateAbout(aboutForm);
      showNotification('Alterações em "Sobre Nós" salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar Sobre Nós:', error);
      showNotification('Erro ao salvar alterações.', 'error');
    }
  };

  const handleSaveHistory = () => {
    try {
      updateHistory(historyForm);
      showNotification('Alterações em "Nossa História" salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar História:', error);
      showNotification('Erro ao salvar alterações.', 'error');
    }
  };

  const handleSaveSettings = () => {
    try {
      // Create a sanitized copy for logging to avoid flooding the console with base64 strings
      const sanitizedSettings = {
        ...settingsForm,
        logoUrl: settingsForm.logoUrl ? (settingsForm.logoUrl.startsWith('data:') ? '<base64_data>' : settingsForm.logoUrl) : '',
        footerLogoUrl: settingsForm.footerLogoUrl ? (settingsForm.footerLogoUrl.startsWith('data:') ? '<base64_data>' : settingsForm.footerLogoUrl) : '',
        heroSlides: settingsForm.heroSlides?.map(slide => ({
          ...slide,
          url: slide.url && slide.url.startsWith('data:') ? '<base64_data>' : slide.url
        }))
      };
      console.log('Salvando configurações:', sanitizedSettings);
      updateSettings(settingsForm);
      showNotification('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      showNotification('Erro ao salvar configurações.', 'error');
    }
  };

  // Generic Save/Delete Handlers
  const handleSaveItem = <T extends { id?: string }>(
    item: Partial<T>,
    setItem: (i: Partial<T> | null) => void,
    add: (i: T) => void,
    update: (i: T) => void,
    confirmMsg: string
  ) => {
    if (item.id) {
      update(item as T);
      setItem(null);
      showNotification(`${confirmMsg} atualizado(a) com sucesso!`);
    } else {
      const newItem = { ...item, id: Date.now().toString() } as T;
      add(newItem);
      setItem(null);
      showNotification(`${confirmMsg} criado(a) com sucesso!`);
    }
  };

  const handleDeleteItem = (id: string, remove: (id: string) => void, confirmMsg: string) => {
    setDeleteConfirmation({ id, remove, confirmMsg });
  };

  const confirmDelete = () => {
    if (deleteConfirmation) {
      deleteConfirmation.remove(deleteConfirmation.id);
      showNotification(`${deleteConfirmation.confirmMsg} excluído(a) com sucesso!`);
      setDeleteConfirmation(null);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      showNotification('Login realizado com sucesso!');
    } catch (error: any) {
      console.error("Login error:", error);
      showNotification('Erro ao fazer login com Google: ' + error.message, 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showNotification('Por favor, preencha email e senha.', 'error');
      return;
    }
    
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showNotification('Login realizado com sucesso!');
    } catch (error: any) {
      console.error("Login error:", error);
      let msg = 'Erro ao fazer login.';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        msg = 'Email ou senha incorretos.';
      } else if (error.code === 'auth/too-many-requests') {
        msg = 'Muitas tentativas falhas. Tente novamente mais tarde.';
      }
      showNotification(msg, 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showNotification('Logout realizado com sucesso.');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const removeWorkImage = (index: number) => {
    if (editingWork && editingWork.images) {
      const newImages = [...editingWork.images];
      newImages.splice(index, 1);
      setEditingWork({ ...editingWork, images: newImages });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        {notification && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all transform translate-y-0 ${notification.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
            {notification.message}
          </div>
        )}
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-800">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-emerald-900 mb-2">Acesso Administrativo</h2>
          <p className="text-stone-500 mb-8">Faça login para continuar</p>
          
          <button 
            onClick={handleGoogleLogin} 
            disabled={isLoggingIn}
            className="w-full bg-white border border-stone-300 text-stone-700 py-3 rounded-lg font-bold hover:bg-stone-50 transition shadow-sm hover:shadow flex items-center justify-center gap-3 mb-6"
          >
            {isLoggingIn ? (
              <RefreshCw className="animate-spin" size={20} />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            Entrar com Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-stone-500">Ou entre com email</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                placeholder="seu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoggingIn ? <RefreshCw className="animate-spin" size={20} /> : 'Entrar'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-stone-500 hover:text-emerald-700">Voltar ao site</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden min-h-[800px] flex flex-col md:flex-row">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-emerald-900 text-white p-6 flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <LayoutDashboard />
            <h2 className="text-xl font-bold">Painel Admin</h2>
          </div>
          
          {/* Sync Status Indicator */}
          <div className="flex items-center gap-2 text-[10px] mb-8 opacity-80">
            {isSyncing ? (
              <div className="flex items-center gap-1 text-emerald-300">
                <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
                Salvando no servidor...
              </div>
            ) : lastSyncError ? (
              <div className="flex items-center gap-1 text-red-400">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                Erro de conexão
              </div>
            ) : (
              <div className="flex items-center gap-1 text-emerald-500">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                Sincronizado
              </div>
            )}
          </div>
          
          <nav className="space-y-2">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-emerald-800 font-bold' : 'hover:bg-emerald-800/50'}`}>
              <LayoutDashboard size={20} /> Dashboard
            </button>
            <button onClick={() => setActiveTab('clientes')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'clientes' ? 'bg-emerald-800 font-bold' : 'hover:bg-emerald-800/50'}`}>
              <UserCheck size={20} /> Clientes
            </button>
            <button onClick={() => setActiveTab('produtos')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'produtos' ? 'bg-emerald-800 font-bold' : 'hover:bg-emerald-800/50'}`}>
              <Package size={20} /> Produtos
            </button>
            <button onClick={() => setActiveTab('obras')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'obras' ? 'bg-emerald-800 font-bold' : 'hover:bg-emerald-800/50'}`}>
              <Hammer size={20} /> Obras
            </button>
            <button onClick={() => setActiveTab('profissionais')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'profissionais' ? 'bg-emerald-800 font-bold' : 'hover:bg-emerald-800/50'}`}>
              <Briefcase size={20} /> Profissionais
            </button>
            <button onClick={() => setActiveTab('categorias')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'categorias' ? 'bg-emerald-800 font-bold' : 'hover:bg-emerald-800/50'}`}>
              <List size={20} /> Categorias
            </button>
            <button onClick={() => setActiveTab('parceiros')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'parceiros' ? 'bg-emerald-800 font-bold' : 'hover:bg-emerald-800/50'}`}>
              <Users size={20} /> Parceiros
            </button>
            <button onClick={() => setActiveTab('atuacao')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'atuacao' ? 'bg-emerald-800 font-bold' : 'hover:bg-emerald-800/50'}`}>
              <MapPin size={20} /> Área de Atuação
            </button>
            <button onClick={() => setActiveTab('postagens')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'postagens' ? 'bg-emerald-800 font-bold' : 'hover:bg-emerald-800/50'}`}>
              <FileText size={20} /> Postagens
            </button>
            <button onClick={() => setActiveTab('sobre')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'sobre' ? 'bg-emerald-800 font-bold' : 'hover:bg-emerald-800/50'}`}>
              <Info size={20} /> Sobre Nós
            </button>
            <button onClick={() => setActiveTab('ajustes')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'ajustes' ? 'bg-emerald-800 font-bold' : 'hover:bg-emerald-800/50'}`}>
              <SettingsIcon size={20} /> Ajustes
            </button>
            <button onClick={() => setActiveTab('sincronizacao')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'sincronizacao' ? 'bg-emerald-800 font-bold' : 'hover:bg-emerald-800/50'}`}>
              <RefreshCw size={20} /> Sincronização
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition hover:bg-red-800/50 text-red-200 hover:text-white mt-4">
              <LogOut size={20} /> Sair
            </button>
          </nav>

          <div className="mt-auto pt-8 border-t border-emerald-800">
            <a href="/" className="text-emerald-200 hover:text-white text-sm flex items-center gap-2">
              <X size={16} /> Voltar ao Site
            </a>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto relative">
          
          {/* Notification Toast */}
          {notification && (
            <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all transform translate-y-0 ${notification.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
              {notification.message}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirmation && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
              <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-2xl">
                <h4 className="text-xl font-bold text-stone-900 mb-2">Confirmar Exclusão</h4>
                <p className="text-stone-600 mb-6">
                  Tem certeza que deseja excluir este(a) <strong>{deleteConfirmation.confirmMsg}</strong>? Esta ação não pode ser desfeita.
                </p>
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setDeleteConfirmation(null)}
                    className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 font-medium"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2"
                  >
                    <Trash2 size={18} /> Excluir
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- SINCRONIZACAO --- */}
          {activeTab === 'sincronizacao' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-stone-800">Sincronização e Backup</h2>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
                  <RefreshCw className="text-emerald-600" />
                  Sincronização Manual
                </h3>
                <p className="text-stone-600 mb-6">
                  Use esta opção se você estiver acessando o painel de um novo dispositivo (como seu smartphone) e os dados mais recentes não estiverem aparecendo. Isso forçará o sistema a baixar a versão mais atual do servidor.
                </p>
                <button 
                  onClick={() => {
                    if (window.confirm("Isso apagará o cache local e recarregará a página com os dados do servidor. Continuar?")) {
                      forceSyncPull();
                    }
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
                >
                  <RefreshCw size={20} />
                  Forçar Atualização (Baixar do Servidor)
                </button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
                  <Download className="text-emerald-600" />
                  Exportar Dados (Backup)
                </h3>
                <p className="text-stone-600 mb-6">
                  Faça o download de todos os dados do site (produtos, configurações, textos) em um arquivo JSON. Isso é útil para manter uma cópia de segurança segura.
                </p>
                <button 
                  onClick={() => {
                    const dataStr = exportData();
                    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                    const exportFileDefaultName = `backup-pindorama-${new Date().toISOString().split('T')[0]}.json`;
                    const linkElement = document.createElement('a');
                    linkElement.setAttribute('href', dataUri);
                    linkElement.setAttribute('download', exportFileDefaultName);
                    linkElement.click();
                    showNotification('Backup exportado com sucesso!');
                  }}
                  className="bg-stone-800 hover:bg-stone-900 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
                >
                  <Download size={20} />
                  Baixar Arquivo de Backup
                </button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
                  <Upload className="text-emerald-600" />
                  Importar Dados (Restaurar)
                </h3>
                <p className="text-stone-600 mb-6">
                  Restaure os dados do site a partir de um arquivo de backup JSON. <strong>Atenção:</strong> Isso substituirá TODOS os dados atuais do site.
                </p>
                <div className="flex items-center gap-4">
                  <label className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 cursor-pointer">
                    <Upload size={20} />
                    Selecionar Arquivo e Restaurar
                    <input 
                      type="file" 
                      accept=".json" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        if (window.confirm("ATENÇÃO: Isso substituirá todos os dados atuais do site pelos dados do arquivo. Tem certeza?")) {
                          const reader = new FileReader();
                          reader.onload = async (event) => {
                            try {
                              const content = event.target?.result as string;
                              const success = await importData(content);
                              if (success) {
                                showNotification('Dados restaurados com sucesso! Recarregando...');
                                setTimeout(() => window.location.reload(), 2000);
                              } else {
                                showNotification('Erro ao restaurar dados. Arquivo inválido.', 'error');
                              }
                            } catch (err) {
                              showNotification('Erro ao ler o arquivo.', 'error');
                            }
                          };
                          reader.readAsText(file);
                        }
                        // Reset input
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* --- DASHBOARD --- */}
          {activeTab === 'dashboard' && (
            <div>
              <h3 className="text-2xl font-bold text-emerald-900 mb-6">Visão Geral</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-emerald-100 rounded-lg text-emerald-800"><Package /></div>
                    <span className="text-3xl font-bold text-emerald-900">{products.length}</span>
                  </div>
                  <p className="text-emerald-800 font-medium">Produtos Cadastrados</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-800"><UserCheck /></div>
                    <span className="text-3xl font-bold text-blue-900">{clients.length}</span>
                  </div>
                  <p className="text-blue-800 font-medium">Clientes Cadastrados</p>
                </div>
                <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-amber-100 rounded-lg text-amber-800"><Users /></div>
                    <span className="text-3xl font-bold text-amber-900">{partners.length}</span>
                  </div>
                  <p className="text-amber-800 font-medium">Parceiros Ativos</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg text-purple-800"><List /></div>
                    <span className="text-3xl font-bold text-purple-900">{categories.length}</span>
                  </div>
                  <p className="text-purple-800 font-medium">Categorias</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-orange-100 rounded-lg text-orange-800"><Hammer /></div>
                    <span className="text-3xl font-bold text-orange-900">{works.length}</span>
                  </div>
                  <p className="text-orange-800 font-medium">Obras Realizadas</p>
                </div>
                <div className="bg-teal-50 p-6 rounded-xl border border-teal-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-teal-100 rounded-lg text-teal-800"><Briefcase /></div>
                    <span className="text-3xl font-bold text-teal-900">{professionals.length}</span>
                  </div>
                  <p className="text-teal-800 font-medium">Profissionais Indicados</p>
                </div>
              </div>
            </div>
          )}

          {/* --- OBRAS --- */}
          {activeTab === 'obras' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-emerald-900">Gerenciar Obras</h3>
                <button 
                  onClick={() => setEditingWork({ title: '', description: '', images: [] })}
                  className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-800 flex items-center gap-2"
                >
                  <Plus size={18} /> Nova Obra
                </button>
              </div>

              {editingWork && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white p-6 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-bold">{editingWork.id ? 'Editar Obra' : 'Nova Obra'}</h4>
                      <button onClick={() => setEditingWork(null)}><X /></button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium">Título da Obra</label>
                        <input className="w-full p-2 border rounded" value={editingWork.title} onChange={e => setEditingWork({...editingWork, title: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Descrição</label>
                        <textarea className="w-full p-2 border rounded" rows={3} value={editingWork.description} onChange={e => setEditingWork({...editingWork, description: e.target.value})} />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Imagens da Obra</label>
                        
                        <div className="mb-4">
                          <input 
                            type="file" 
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              if (e.target.files && editingWork) {
                                processFiles(e.target.files, (newImages) => {
                                  setEditingWork(prev => {
                                    if (!prev) return null;
                                    return {
                                      ...prev,
                                      images: [...(prev.images || []), ...newImages]
                                    };
                                  });
                                });
                              }
                            }}
                            className="w-full p-2 border rounded"
                          />
                          <p className="text-xs text-stone-500 mt-1">Você pode selecionar múltiplas imagens.</p>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                          {editingWork.images?.map((img, idx) => (
                            <div key={idx} className="relative group aspect-square bg-stone-100 rounded overflow-hidden">
                              {img && img.trim() !== '' ? (
                                <img 
                                  src={img} 
                                  alt={`Obra ${idx}`} 
                                  className="w-full h-full object-cover" 
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://placehold.co/600x400?text=Erro+Imagem';
                                    e.currentTarget.onerror = null;
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                                  <ImageIcon className="text-stone-300" />
                                </div>
                              )}
                              <button 
                                onClick={() => removeWorkImage(idx)}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                          {(!editingWork.images || editingWork.images.length === 0) && (
                            <div className="col-span-full text-center py-8 text-stone-400 border-2 border-dashed rounded-lg">
                              Nenhuma imagem adicionada
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                      <button onClick={() => setEditingWork(null)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancelar</button>
                      <button onClick={() => handleSaveItem(editingWork, setEditingWork, addWork, updateWork, 'obra')} className="px-4 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-800">Salvar</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {works.map(w => (
                  <div key={w.id} className="bg-white rounded-lg border overflow-hidden shadow-sm">
                    <div className="h-48 bg-stone-200 relative">
                      {w.images[0] && w.images[0].trim() !== '' ? (
                        <img 
                          src={w.images[0]} 
                          alt={w.title} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer" 
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/600x400?text=Erro+Imagem';
                            e.currentTarget.onerror = null;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400"><ImageIcon size={48} /></div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {w.images.length} fotos
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-lg mb-1">{w.title}</h4>
                      <p className="text-stone-600 text-sm line-clamp-2 mb-4">{w.description}</p>
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingWork(w)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18} /></button>
                        <button onClick={() => handleDeleteItem(w.id, deleteWork, 'obra')} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- CLIENTES --- */}
          {activeTab === 'clientes' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-emerald-900">Gerenciar Clientes</h3>
                <button onClick={() => setEditingClient({ name: '', email: '', phone: '', address: '' })} className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-800 flex items-center gap-2"><Plus size={18} /> Novo Cliente</button>
              </div>

              {editingClient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white p-6 rounded-xl w-full max-w-md">
                    <h4 className="text-xl font-bold mb-4">{editingClient.id ? 'Editar Cliente' : 'Novo Cliente'}</h4>
                    <div className="space-y-4">
                      <input className="w-full p-2 border rounded" placeholder="Nome" value={editingClient.name} onChange={e => setEditingClient({...editingClient, name: e.target.value})} />
                      <input className="w-full p-2 border rounded" placeholder="Email" value={editingClient.email} onChange={e => setEditingClient({...editingClient, email: e.target.value})} />
                      <input className="w-full p-2 border rounded" placeholder="Telefone" value={editingClient.phone} onChange={e => setEditingClient({...editingClient, phone: e.target.value})} />
                      <input className="w-full p-2 border rounded" placeholder="Endereço" value={editingClient.address} onChange={e => setEditingClient({...editingClient, address: e.target.value})} />
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                      <button onClick={() => setEditingClient(null)} className="px-4 py-2 border rounded">Cancelar</button>
                      <button onClick={() => handleSaveItem(editingClient, setEditingClient, addClient, updateClient, 'cliente')} className="px-4 py-2 bg-emerald-700 text-white rounded">Salvar</button>
                    </div>
                  </div>
                </div>
              )}

              <table className="w-full text-left border rounded-lg overflow-hidden">
                <thead className="bg-stone-100">
                  <tr>
                    <th className="p-4">Nome</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Telefone</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(c => (
                    <tr key={c.id} className="border-t hover:bg-stone-50">
                      <td className="p-4 font-medium">{c.name}</td>
                      <td className="p-4">{c.email}</td>
                      <td className="p-4">{c.phone}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => setEditingClient(c)} className="text-blue-600"><Edit size={18} /></button>
                        <button onClick={() => handleDeleteItem(c.id, deleteClient, 'cliente')} className="text-red-600"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* --- CATEGORIAS & SUBCATEGORIAS --- */}
          {activeTab === 'categorias' && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Categorias */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-emerald-900">Categorias</h3>
                  <button onClick={() => setEditingCategory({ name: '' })} className="bg-emerald-700 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"><Plus size={16} /> Nova</button>
                </div>
                
                {editingCategory && (
                  <div className="mb-4 p-4 bg-stone-50 rounded-lg border">
                    <input className="w-full p-2 border rounded mb-2" placeholder="Nome da Categoria" value={editingCategory.name} onChange={e => setEditingCategory({...editingCategory, name: e.target.value})} />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingCategory(null)} className="text-sm text-stone-500">Cancelar</button>
                      <button onClick={() => handleSaveItem(editingCategory, setEditingCategory, addCategory, updateCategory, 'categoria')} className="text-sm bg-emerald-700 text-white px-3 py-1 rounded">Salvar</button>
                    </div>
                  </div>
                )}

                <ul className="space-y-2">
                  {categories.map(c => (
                    <li key={c.id} className="flex justify-between items-center p-3 bg-white border rounded hover:bg-stone-50">
                      <span>{c.name}</span>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingCategory(c)} className="text-blue-600"><Edit size={16} /></button>
                        <button onClick={() => handleDeleteItem(c.id, deleteCategory, 'categoria')} className="text-red-600"><Trash2 size={16} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Subcategorias */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-emerald-900">Subcategorias</h3>
                  <button onClick={() => setEditingSubcategory({ name: '', categoryId: categories[0]?.id || '' })} className="bg-emerald-700 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"><Plus size={16} /> Nova</button>
                </div>

                {editingSubcategory && (
                  <div className="mb-4 p-4 bg-stone-50 rounded-lg border">
                    <input className="w-full p-2 border rounded mb-2" placeholder="Nome da Subcategoria" value={editingSubcategory.name} onChange={e => setEditingSubcategory({...editingSubcategory, name: e.target.value})} />
                    <select className="w-full p-2 border rounded mb-2" value={editingSubcategory.categoryId} onChange={e => setEditingSubcategory({...editingSubcategory, categoryId: e.target.value})}>
                      <option value="">Selecione a Categoria</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingSubcategory(null)} className="text-sm text-stone-500">Cancelar</button>
                      <button onClick={() => handleSaveItem(editingSubcategory, setEditingSubcategory, addSubcategory, updateSubcategory, 'subcategoria')} className="text-sm bg-emerald-700 text-white px-3 py-1 rounded">Salvar</button>
                    </div>
                  </div>
                )}

                <ul className="space-y-2">
                  {subcategories.map(s => (
                    <li key={s.id} className="flex justify-between items-center p-3 bg-white border rounded hover:bg-stone-50">
                      <div>
                        <span className="font-medium">{s.name}</span>
                        <span className="text-xs text-stone-500 ml-2">({categories.find(c => c.id === s.categoryId)?.name || 'Sem Categoria'})</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingSubcategory(s)} className="text-blue-600"><Edit size={16} /></button>
                        <button onClick={() => handleDeleteItem(s.id, deleteSubcategory, 'subcategoria')} className="text-red-600"><Trash2 size={16} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* --- AJUSTES --- */}
          {activeTab === 'ajustes' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-emerald-900">Configurações do Site</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-stone-50 p-6 rounded-xl border">
                  <h4 className="font-bold mb-4 flex items-center gap-2"><Tag size={18} /> Identidade Visual</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Logomarca Principal</label>
                      <input 
                        type="file" 
                        id="logo-input"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            processFile(e.target.files[0], (base64) => setSettingsForm({...settingsForm, logoUrl: base64}));
                          }
                        }}
                        className="hidden"
                      />
                      {settingsForm.logoUrl ? (
                        <div className="relative group w-32 h-32 bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                          <img src={settingsForm.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                            <button 
                              type="button"
                              onClick={() => document.getElementById('logo-input')?.click()}
                              className="text-white hover:text-emerald-400 text-xs font-bold"
                            >
                              Alterar
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleDeleteItem('logo', () => setSettingsForm({...settingsForm, logoUrl: ''}), 'logomarca principal')}
                              className="text-white hover:text-red-400 text-xs font-bold"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          type="button"
                          onClick={() => document.getElementById('logo-input')?.click()}
                          className="w-32 h-32 border-2 border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center text-stone-500 hover:bg-stone-50 transition"
                        >
                          <Plus size={24} />
                          <span className="text-xs mt-1">Logo</span>
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Logomarca do Rodapé (Opcional)</label>
                      <input 
                        type="file" 
                        id="footer-logo-input"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            processFile(e.target.files[0], (base64) => setSettingsForm({...settingsForm, footerLogoUrl: base64}));
                          }
                        }}
                        className="hidden"
                      />
                      {settingsForm.footerLogoUrl ? (
                        <div className="relative group w-32 h-32 bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                          <img src={settingsForm.footerLogoUrl} alt="Footer Logo" className="w-full h-full object-contain p-2" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                            <button 
                              type="button"
                              onClick={() => document.getElementById('footer-logo-input')?.click()}
                              className="text-white hover:text-emerald-400 text-xs font-bold"
                            >
                              Alterar
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleDeleteItem('footer-logo', () => setSettingsForm({...settingsForm, footerLogoUrl: ''}), 'logomarca do rodapé')}
                              className="text-white hover:text-red-400 text-xs font-bold"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          type="button"
                          onClick={() => document.getElementById('footer-logo-input')?.click()}
                          className="w-32 h-32 border-2 border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center text-stone-500 hover:bg-stone-50 transition"
                        >
                          <Plus size={24} />
                          <span className="text-xs mt-1">Logo Rodapé</span>
                        </button>
                      )}
                      <p className="text-xs text-stone-500 mt-1">Se não for enviada, a logomarca principal será usada no rodapé.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Texto do Rodapé</label>
                      <input className="w-full p-2 border rounded" value={settingsForm.footerText} onChange={e => setSettingsForm({...settingsForm, footerText: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Descrição abaixo da Logo</label>
                      <textarea className="w-full p-2 border rounded" rows={2} value={settingsForm.footerDescription || ''} onChange={e => setSettingsForm({...settingsForm, footerDescription: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Horários de Funcionamento</label>
                      <textarea className="w-full p-2 border rounded" rows={2} value={settingsForm.openingHours || ''} onChange={e => setSettingsForm({...settingsForm, openingHours: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="bg-stone-50 p-6 rounded-xl border">
                  <h4 className="font-bold mb-4 flex items-center gap-2"><Users size={18} /> Redes Sociais & Contato</h4>
                  <div className="space-y-4">
                    <input className="w-full p-2 border rounded" placeholder="Facebook URL" value={settingsForm.facebookUrl} onChange={e => setSettingsForm({...settingsForm, facebookUrl: e.target.value})} />
                    <input className="w-full p-2 border rounded" placeholder="Instagram URL" value={settingsForm.instagramUrl} onChange={e => setSettingsForm({...settingsForm, instagramUrl: e.target.value})} />
                    <input className="w-full p-2 border rounded" placeholder="WhatsApp Link" value={settingsForm.whatsappUrl} onChange={e => setSettingsForm({...settingsForm, whatsappUrl: e.target.value})} />
                    <input className="w-full p-2 border rounded" placeholder="Endereço" value={settingsForm.address} onChange={e => setSettingsForm({...settingsForm, address: e.target.value})} />
                    <input className="w-full p-2 border rounded" placeholder="Telefone" value={settingsForm.phone} onChange={e => setSettingsForm({...settingsForm, phone: e.target.value})} />
                    <input className="w-full p-2 border rounded" placeholder="Email" value={settingsForm.email} onChange={e => setSettingsForm({...settingsForm, email: e.target.value})} />
                  </div>
                </div>

                <div className="bg-stone-50 p-6 rounded-xl border md:col-span-2">
                  <h4 className="font-bold mb-4 flex items-center gap-2"><Lock size={18} /> Segurança (Acesso Admin)</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">Usuário Admin</label>
                      <input className="w-full p-2 border rounded" value={settingsForm.adminUser} onChange={e => setSettingsForm({...settingsForm, adminUser: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Senha Admin</label>
                      <input className="w-full p-2 border rounded" type="text" value={settingsForm.adminPassword} onChange={e => setSettingsForm({...settingsForm, adminPassword: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="bg-stone-50 p-6 rounded-xl border md:col-span-2">
                  <h4 className="font-bold mb-4 flex items-center gap-2"><ImageIcon size={18} /> Banner Principal (Slide)</h4>
                  <p className="text-sm text-stone-500 mb-4">Gerencie as imagens, títulos e descrições do slide da página inicial.</p>
                  
                  <div className="space-y-6">
                    <div className="flex gap-2">
                      <input 
                        type="file" 
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            const currentCount = settingsForm.heroSlides?.length || 0;
                            const newFiles = Array.from(e.target.files);
                            
                            if (currentCount + newFiles.length > 3) {
                              showNotification('Limite de 3 imagens no banner.', 'error');
                              return;
                            }

                            processFiles(e.target.files, (newImages) => {
                              setSettingsForm(prev => ({
                                ...prev,
                                heroSlides: [
                                  ...(prev.heroSlides || []),
                                  ...newImages.map(url => ({ url, title: 'Novo Slide', description: 'Descrição do slide' }))
                                ]
                              }));
                            });
                          }
                        }}
                        className="w-full p-2 border rounded"
                      />
                      <button 
                        type="button"
                        onClick={() => setSettingsForm({...settingsForm, heroSlides: []})}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm hover:bg-red-200"
                      >
                        Limpar todos
                      </button>
                    </div>
                    <p className="text-xs text-stone-500">Você pode selecionar até 3 imagens para o slide.</p>

                    <div className="space-y-4">
                      {settingsForm.heroSlides?.map((slide, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg border items-start">
                          <div className="w-full md:w-1/3 relative group aspect-video bg-stone-200 rounded overflow-hidden border">
                            {slide.url && slide.url.trim() !== '' ? (
                              <img 
                                src={slide.url} 
                                alt={`Slide ${idx + 1}`} 
                                className="w-full h-full object-cover" 
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://placehold.co/600x400?text=Erro+Imagem';
                                  e.currentTarget.onerror = null;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400">
                                <ImageIcon size={24} />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                              <button 
                                type="button"
                                onClick={() => {
                                  const newSlides = [...(settingsForm.heroSlides || [])];
                                  if (idx > 0) {
                                    [newSlides[idx], newSlides[idx - 1]] = [newSlides[idx - 1], newSlides[idx]];
                                    setSettingsForm({ ...settingsForm, heroSlides: newSlides });
                                  }
                                }}
                                disabled={idx === 0}
                                className="text-white hover:text-emerald-400 disabled:opacity-30"
                                title="Mover para cima"
                              >
                                ↑
                              </button>
                              <button 
                                type="button"
                                onClick={() => {
                                  handleDeleteItem(idx.toString(), () => {
                                    const newSlides = [...(settingsForm.heroSlides || [])];
                                    newSlides.splice(idx, 1);
                                    setSettingsForm({ ...settingsForm, heroSlides: newSlides });
                                  }, 'slide do banner');
                                }}
                                className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                                title="Remover"
                              >
                                <X size={14} />
                              </button>
                              <button 
                                type="button"
                                onClick={() => {
                                  const newSlides = [...(settingsForm.heroSlides || [])];
                                  if (idx < newSlides.length - 1) {
                                    [newSlides[idx], newSlides[idx + 1]] = [newSlides[idx + 1], newSlides[idx]];
                                    setSettingsForm({ ...settingsForm, heroSlides: newSlides });
                                  }
                                }}
                                disabled={idx === (settingsForm.heroSlides?.length || 0) - 1}
                                className="text-white hover:text-emerald-400 disabled:opacity-30"
                                title="Mover para baixo"
                              >
                                ↓
                              </button>
                            </div>
                            <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1 rounded">
                              {idx + 1}
                            </div>
                          </div>
                          
                          <div className="w-full md:w-2/3 space-y-3">
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="block text-xs font-medium text-stone-500">Título</label>
                              </div>
                              <input 
                                type="text" 
                                value={slide.title} 
                                onChange={(e) => {
                                  const newSlides = [...(settingsForm.heroSlides || [])];
                                  newSlides[idx].title = e.target.value;
                                  setSettingsForm({ ...settingsForm, heroSlides: newSlides });
                                }}
                                className="w-full p-2 border rounded text-sm"
                                placeholder="Título do slide"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-stone-500 mb-1">Descrição</label>
                              <textarea 
                                value={slide.description} 
                                onChange={(e) => {
                                  const newSlides = [...(settingsForm.heroSlides || [])];
                                  newSlides[idx].description = e.target.value;
                                  setSettingsForm({ ...settingsForm, heroSlides: newSlides });
                                }}
                                className="w-full p-2 border rounded text-sm"
                                rows={2}
                                placeholder="Descrição do slide"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!settingsForm.heroSlides || settingsForm.heroSlides.length === 0) && (
                        <div className="text-center py-8 text-stone-400 border-2 border-dashed rounded-lg">
                          Nenhum slide adicionado
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-stone-50 p-6 rounded-xl border md:col-span-2">
                  <h4 className="font-bold mb-4 flex items-center gap-2"><SettingsIcon size={18} /> Integrações</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">Google Tag Manager ID</label>
                      <input className="w-full p-2 border rounded" placeholder="GTM-XXXXXX" value={settingsForm.googleTagId} onChange={e => setSettingsForm({...settingsForm, googleTagId: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Facebook Pixel ID</label>
                      <input className="w-full p-2 border rounded" placeholder="1234567890" value={settingsForm.facebookPixelId} onChange={e => setSettingsForm({...settingsForm, facebookPixelId: e.target.value})} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={handleSaveSettings} className="bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-800 flex items-center gap-2 shadow-lg">
                  <Save size={20} /> Salvar Configurações
                </button>
              </div>
            </div>
          )}

          {/* --- SOBRE NÓS (Existing) --- */}
          {activeTab === 'sobre' && (
            <div className="space-y-12">
              <div className="bg-stone-50 p-6 rounded-xl border border-stone-200">
                <h3 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                  <Info /> Editar "Sobre Nós"
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Título</label>
                    <input 
                      type="text" 
                      value={aboutForm.title} 
                      onChange={e => setAboutForm({...aboutForm, title: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Descrição</label>
                    <textarea 
                      rows={4}
                      value={aboutForm.description} 
                      onChange={e => setAboutForm({...aboutForm, description: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Imagem</label>
                    <input 
                      type="file" 
                      ref={aboutImageRef}
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          processFile(e.target.files[0], (base64) => setAboutForm({...aboutForm, image: base64}));
                        }
                      }}
                      className="hidden"
                    />
                    
                    {aboutForm.image && aboutForm.image.trim() !== '' ? (
                      <div className="relative group w-full max-w-md aspect-video bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                        <img 
                          src={aboutForm.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/600x400?text=Erro+Imagem';
                            e.currentTarget.onerror = null;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                          <button 
                            type="button"
                            onClick={() => aboutImageRef.current?.click()}
                            className="bg-white text-emerald-800 p-2 rounded-full hover:bg-emerald-50 shadow-lg flex items-center gap-2 px-4 font-bold"
                          >
                            <Edit size={18} /> Alterar
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleDeleteItem('about-image', () => setAboutForm({...aboutForm, image: ''}), 'imagem do Sobre Nós')}
                            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg flex items-center gap-2 px-4 font-bold"
                          >
                            <Trash2 size={18} /> Excluir
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        type="button"
                        onClick={() => aboutImageRef.current?.click()}
                        className="w-full max-w-md aspect-video border-2 border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center text-stone-500 hover:bg-stone-50 transition"
                      >
                        <ImageIcon size={48} className="mb-2 opacity-20" />
                        <span className="font-medium">Clique para adicionar imagem</span>
                      </button>
                    )}
                  </div>
                  <button onClick={handleSaveAbout} className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-800 flex items-center gap-2">
                    <Save size={18} /> Salvar Alterações
                  </button>
                </div>
              </div>

              <div className="bg-stone-50 p-6 rounded-xl border border-stone-200">
                <h3 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                  <Info /> Editar "Nossa História"
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Título</label>
                    <input 
                      type="text" 
                      value={historyForm.title} 
                      onChange={e => setHistoryForm({...historyForm, title: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Descrição</label>
                    <textarea 
                      rows={4}
                      value={historyForm.description} 
                      onChange={e => setHistoryForm({...historyForm, description: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-stone-700">Mídia (Imagem ou Vídeo)</label>
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => historyImageRef.current?.click()}
                          className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded hover:bg-emerald-200 flex items-center gap-1"
                        >
                          <ImageIcon size={14} /> Adicionar Imagem
                        </button>
                        <button 
                          type="button"
                          onClick={() => historyVideoRef.current?.click()}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 flex items-center gap-1"
                        >
                          <Video size={14} /> Adicionar Vídeo
                        </button>
                      </div>
                    </div>

                    <input 
                      type="file" 
                      ref={historyImageRef}
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          processFile(e.target.files[0], (base64) => setHistoryForm({...historyForm, image: base64, videoUrl: ''}));
                        }
                      }}
                      className="hidden"
                    />

                    <input 
                      type="file" 
                      ref={historyVideoRef}
                      accept="video/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          if (file.size > 10 * 1024 * 1024) { // 10MB limit for base64
                            showNotification('O vídeo é muito grande. Tente um arquivo menor que 10MB.', 'error');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setHistoryForm({...historyForm, videoUrl: reader.result as string, image: ''});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                    
                    {historyForm.videoUrl && historyForm.videoUrl.trim() !== '' ? (
                      <div className="relative group w-full max-w-md aspect-video bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                        <video 
                          src={historyForm.videoUrl} 
                          className="w-full h-full object-cover"
                          controls
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                          <button 
                            type="button"
                            onClick={() => handleDeleteItem('history-video', () => setHistoryForm({...historyForm, videoUrl: ''}), 'vídeo da Nossa História')}
                            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ) : historyForm.image && historyForm.image.trim() !== '' ? (
                      <div className="relative group w-full max-w-md aspect-video bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                        <img 
                          src={historyForm.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/600x400?text=Erro+Imagem';
                            e.currentTarget.onerror = null;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                          <button 
                            type="button"
                            onClick={() => historyImageRef.current?.click()}
                            className="bg-white text-emerald-800 p-2 rounded-full hover:bg-emerald-50 shadow-lg flex items-center gap-2 px-4 font-bold"
                          >
                            <Edit size={18} /> Alterar
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleDeleteItem('history-image', () => setHistoryForm({...historyForm, image: ''}), 'imagem da Nossa História')}
                            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg flex items-center gap-2 px-4 font-bold"
                          >
                            <Trash2 size={18} /> Excluir
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full max-w-md aspect-video border-2 border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center text-stone-500 gap-2">
                        <div className="flex gap-4">
                          <ImageIcon size={48} className="opacity-20" />
                          <Video size={48} className="opacity-20" />
                        </div>
                        <span className="font-medium">Selecione uma Imagem ou Vídeo</span>
                      </div>
                    )}
                  </div>
                  <button onClick={handleSaveHistory} className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-800 flex items-center gap-2">
                    <Save size={18} /> Salvar Alterações
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- PRODUTOS (Existing) --- */}
          {activeTab === 'produtos' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-emerald-900">Gerenciar Produtos</h3>
                <button 
                  onClick={() => setEditingProduct({ name: '', category: '', subcategory: '', brand: '', price: 0, description: '', image: '' })}
                  className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-800 flex items-center gap-2"
                >
                  <Plus size={18} /> Novo Produto
                </button>
              </div>

              {editingProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-bold">{editingProduct.id ? 'Editar Produto' : 'Novo Produto'}</h4>
                      <button onClick={() => setEditingProduct(null)}><X /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium">Nome do Produto</label>
                        <input className="w-full p-2 border rounded" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Marca</label>
                        <input className="w-full p-2 border rounded" value={editingProduct.brand} onChange={e => setEditingProduct({...editingProduct, brand: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Preço (R$)</label>
                        <input type="number" className="w-full p-2 border rounded" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Categoria</label>
                        <select className="w-full p-2 border rounded" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                          <option value="">Selecione...</option>
                          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Subcategoria</label>
                        <select className="w-full p-2 border rounded" value={editingProduct.subcategory} onChange={e => setEditingProduct({...editingProduct, subcategory: e.target.value})}>
                          <option value="">Selecione...</option>
                          {subcategories.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium">Imagem</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0] && editingProduct) {
                              processFile(e.target.files[0], (base64) => setEditingProduct({...editingProduct, image: base64}));
                            }
                          }}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium">Descrição</label>
                        <textarea className="w-full p-2 border rounded" rows={3} value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                      <button onClick={() => setEditingProduct(null)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancelar</button>
                      <button onClick={() => handleSaveItem(editingProduct, setEditingProduct, addProduct, updateProduct, 'produto')} className="px-4 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-800">Salvar</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg border overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-stone-100">
                    <tr>
                      <th className="p-4">Produto</th>
                      <th className="p-4">Marca</th>
                      <th className="p-4">Categoria</th>
                      <th className="p-4">Preço</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} className="border-t hover:bg-stone-50">
                        <td className="p-4 flex items-center gap-3">
                          {p.image && p.image.trim() !== '' ? (
                            <img 
                              src={p.image} 
                              className="w-10 h-10 rounded object-cover" 
                              alt="" 
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.currentTarget.src = 'https://placehold.co/100x100?text=Erro';
                                e.currentTarget.onerror = null;
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-stone-200 flex items-center justify-center">
                              <ImageIcon size={16} className="text-stone-400" />
                            </div>
                          )}
                          {p.name}
                        </td>
                        <td className="p-4">{p.brand}</td>
                        <td className="p-4">{p.category} / {p.subcategory}</td>
                        <td className="p-4">R$ {p.price?.toFixed(2)}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => setEditingProduct(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18} /></button>
                          <button onClick={() => handleDeleteItem(p.id, deleteProduct, 'produto')} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- PARCEIROS (Existing) --- */}
          {activeTab === 'parceiros' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-emerald-900">Gerenciar Parceiros</h3>
                <button 
                  onClick={() => setEditingPartner({ name: '', logo: '' })}
                  className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-800 flex items-center gap-2"
                >
                  <Plus size={18} /> Novo Parceiro
                </button>
              </div>

              {editingPartner && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white p-6 rounded-xl w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-bold">{editingPartner.id ? 'Editar Parceiro' : 'Novo Parceiro'}</h4>
                      <button onClick={() => setEditingPartner(null)}><X /></button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium">Nome</label>
                        <input className="w-full p-2 border rounded" value={editingPartner.name} onChange={e => setEditingPartner({...editingPartner, name: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Logo</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0] && editingPartner) {
                              processFile(e.target.files[0], (base64) => setEditingPartner({...editingPartner, logo: base64}));
                            }
                          }}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                      <button onClick={() => setEditingPartner(null)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancelar</button>
                      <button onClick={() => handleSaveItem(editingPartner, setEditingPartner, addPartner, updatePartner, 'parceiro')} className="px-4 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-800">Salvar</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {partners.map(p => (
                  <div key={p.id} className="bg-white p-4 rounded-xl border shadow-sm flex flex-col items-center relative group">
                    {p.logo && p.logo.trim() !== '' ? (
                      <img 
                        src={p.logo} 
                        alt={p.name} 
                        className="h-16 object-contain mb-4" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.onerror = null;
                        }}
                      />
                    ) : (
                      <div className="h-16 w-full flex items-center justify-center bg-stone-50 mb-4 rounded text-stone-400">
                        <ImageIcon size={32} />
                      </div>
                    )}
                    <h4 className="font-bold text-stone-800">{p.name}</h4>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
                      <button onClick={() => setEditingPartner(p)} className="p-1 bg-blue-100 text-blue-600 rounded"><Edit size={16} /></button>
                      <button onClick={() => handleDeleteItem(p.id, deletePartner, 'parceiro')} className="p-1 bg-red-100 text-red-600 rounded"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- PROFISSIONAIS --- */}
          {activeTab === 'profissionais' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-emerald-900">Profissionais Indicados</h3>
                <button 
                  onClick={() => setEditingProfessional({ name: '', specialty: '', contact: '', image: '' })}
                  className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-800 flex items-center gap-2"
                >
                  <Plus size={18} /> Novo Profissional
                </button>
              </div>

              {editingProfessional && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white p-6 rounded-xl w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-bold">{editingProfessional.id ? 'Editar Profissional' : 'Novo Profissional'}</h4>
                      <button onClick={() => setEditingProfessional(null)}><X /></button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium">Nome</label>
                        <input className="w-full p-2 border rounded" value={editingProfessional.name} onChange={e => setEditingProfessional({...editingProfessional, name: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Especialidade</label>
                        <input className="w-full p-2 border rounded" value={editingProfessional.specialty} onChange={e => setEditingProfessional({...editingProfessional, specialty: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Contato (WhatsApp/Tel)</label>
                        <input className="w-full p-2 border rounded" value={editingProfessional.contact} onChange={e => setEditingProfessional({...editingProfessional, contact: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Foto</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0] && editingProfessional) {
                              processFile(e.target.files[0], (base64) => setEditingProfessional({...editingProfessional, image: base64}));
                            }
                          }}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                      <button onClick={() => setEditingProfessional(null)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancelar</button>
                      <button onClick={() => handleSaveItem(editingProfessional, setEditingProfessional, addProfessional, updateProfessional, 'profissional')} className="px-4 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-800">Salvar</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {professionals.map(p => (
                  <div key={p.id} className="bg-white rounded-xl border shadow-sm overflow-hidden relative group">
                    <div className="h-48 bg-stone-100 relative">
                      {p.image && p.image.trim() !== '' ? (
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/300x300?text=Sem+Foto';
                            e.currentTarget.onerror = null;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <User size={48} />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-stone-800">{p.name}</h4>
                      <p className="text-emerald-700 text-sm font-medium">{p.specialty}</p>
                      <p className="text-stone-500 text-xs mt-1">{p.contact}</p>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
                      <button onClick={() => setEditingProfessional(p)} className="p-1 bg-blue-100 text-blue-600 rounded shadow-sm"><Edit size={16} /></button>
                      <button onClick={() => handleDeleteItem(p.id, deleteProfessional, 'profissional')} className="p-1 bg-red-100 text-red-600 rounded shadow-sm"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- ÁREA DE ATUAÇÃO --- */}
          {activeTab === 'atuacao' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-emerald-900">Gerenciar Área de Atuação</h3>
                <button 
                  onClick={() => setEditingServiceArea({ name: '' })}
                  className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-800 flex items-center gap-2"
                >
                  <Plus size={18} /> Nova Cidade
                </button>
              </div>

              {editingServiceArea && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white p-6 rounded-xl w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-bold">{editingServiceArea.id ? 'Editar Cidade' : 'Nova Cidade'}</h4>
                      <button onClick={() => setEditingServiceArea(null)}><X /></button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium">Nome da Cidade</label>
                        <input className="w-full p-2 border rounded" value={editingServiceArea.name} onChange={e => setEditingServiceArea({...editingServiceArea, name: e.target.value})} />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                      <button onClick={() => setEditingServiceArea(null)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancelar</button>
                      <button onClick={() => handleSaveItem(editingServiceArea, setEditingServiceArea, addServiceArea, updateServiceArea, 'cidade')} className="px-4 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-800">Salvar</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {serviceAreas.map(sa => (
                  <div key={sa.id} className="bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between group">
                    <div className="flex items-center gap-2 text-emerald-800 font-medium">
                      <MapPin size={18} className="text-emerald-600" />
                      {sa.name}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition flex gap-1">
                      <button onClick={() => setEditingServiceArea(sa)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                      <button onClick={() => handleDeleteItem(sa.id, deleteServiceArea, 'cidade')} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- POSTAGENS --- */}
          {activeTab === 'postagens' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-emerald-900">Gerenciar Postagens (Dicas)</h3>
                <button 
                  onClick={() => setEditingPost({ title: '', content: '', image: '', createdAt: new Date().toISOString() })}
                  className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-800 flex items-center gap-2"
                >
                  <Plus size={18} /> Nova Postagem
                </button>
              </div>

              {editingPost && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white p-6 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-bold">{editingPost.id ? 'Editar Postagem' : 'Nova Postagem'}</h4>
                      <button onClick={() => setEditingPost(null)}><X /></button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium">Título</label>
                        <input className="w-full p-2 border rounded" value={editingPost.title} onChange={e => setEditingPost({...editingPost, title: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Imagem</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0] && editingPost) {
                              processFile(e.target.files[0], (base64) => setEditingPost({...editingPost, image: base64}));
                            }
                          }}
                          className="w-full p-2 border rounded"
                        />
                        {editingPost.image && editingPost.image.trim() !== '' && (
                          <img 
                            src={editingPost.image} 
                            alt="Preview" 
                            className="mt-2 h-32 object-cover rounded-md" 
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.src = 'https://placehold.co/600x400?text=Erro+Imagem';
                              e.currentTarget.onerror = null;
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Conteúdo</label>
                        <textarea 
                          className="w-full p-2 border rounded" 
                          rows={10} 
                          value={editingPost.content} 
                          onChange={e => setEditingPost({...editingPost, content: e.target.value})} 
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                      <button onClick={() => setEditingPost(null)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancelar</button>
                      <button onClick={() => handleSaveItem(editingPost, setEditingPost, addPost, updatePost, 'postagem')} className="px-4 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-800">Salvar</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(post => (
                  <div key={post.id} className="bg-white rounded-xl border shadow-sm overflow-hidden relative group flex flex-col">
                    <div className="h-48 bg-stone-100 relative">
                      {post.image && post.image.trim() !== '' ? (
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/600x400?text=Sem+Imagem';
                            e.currentTarget.onerror = null;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <ImageIcon size={48} />
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h4 className="font-bold text-stone-800 mb-2 line-clamp-2">{post.title}</h4>
                      <p className="text-stone-600 text-sm line-clamp-3 flex-1">{post.content}</p>
                      <div className="mt-4 text-xs text-stone-400">
                        {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
                      <button onClick={() => setEditingPost(post)} className="p-1 bg-blue-100 text-blue-600 rounded shadow-sm"><Edit size={16} /></button>
                      <button onClick={() => handleDeleteItem(post.id, deletePost, 'postagem')} className="p-1 bg-red-100 text-red-600 rounded shadow-sm"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
