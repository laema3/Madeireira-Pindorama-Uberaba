import React, { useState, useRef, useEffect } from 'react';
import { useData } from './DataContext';
import { Product, Partner, Client, Category, Subcategory, Settings, Work, Professional, ServiceArea, Post, SystemUser, Lead, LeadStatus } from '../types';
import { 
  Plus, Edit, Trash2, Save, X, LayoutDashboard, Package, Users, Info, Settings as SettingsIcon, 
  Tag, List, UserCheck, Hammer, Image as ImageIcon, LogOut, Lock, User, Briefcase, MapPin, 
  FileText, Video, RefreshCw, Download, Upload, Sparkles, AlertCircle, TreePine, Home, 
  Paintbrush, Layers, Boxes, Grid, Truck, HardHat, Ruler, Map, Construction, Shovel, Info as TooltipIcon,
  Warehouse, Fence, Lamp, Bed, Bath, Utensils, Armchair, DoorOpen, Thermometer, Car, Cctv, 
  ShieldCheck, Leaf, Sun, Wind, Droplets, Flame, Plug, Mountain, Pocket, Settings2,
  Inbox, PhoneCall, CheckCircle2, XCircle, Mail, Phone, Facebook, Instagram, MessageCircle,
  Wrench, Lightbulb, Sprout, Zap, Fan, Waves, Clock, Shield, Heart, Smile, Star, Cloud, Moon,
  Compass, Pin, Wifi, Headphones, Mic, Music, Camera, Tv, Smartphone, Cpu, Mouse, Keyboard, Printer,
  BrickWall, Cylinder, Pyramid, Square, Circle, Triangle, Scissors, Pipette, Brush, Eraser,
  Table, Sofa, Microwave, Refrigerator, WashingMachine, Tv2, Speaker, Watch, Luggage, 
  Dna, FlaskConical, Microscope, Stethoscope, Syringe, GraduationCap, Trophy, Medal, Target, 
  Rocket, Plane, Ship, Bike, Footprints, Tent, TreeDeciduous, Trees, Flower2
} from 'lucide-react';

const CATEGORY_ICONS = [
  { name: 'Package', icon: <Package size={20} /> },
  { name: 'TreePine', icon: <TreePine size={20} /> },
  { name: 'Home', icon: <Home size={20} /> },
  { name: 'Hammer', icon: <Hammer size={20} /> },
  { name: 'Paintbrush', icon: <Paintbrush size={20} /> },
  { name: 'Grid', icon: <Grid size={20} /> },
  { name: 'Layers', icon: <Layers size={20} /> },
  { name: 'Boxes', icon: <Boxes size={20} /> },
  { name: 'Truck', icon: <Truck size={20} /> },
  { name: 'HardHat', icon: <HardHat size={20} /> },
  { name: 'Ruler', icon: <Ruler size={20} /> },
  { name: 'Map', icon: <Map size={20} /> },
  { name: 'Construction', icon: <Construction size={20} /> },
  { name: 'Shovel', icon: <Shovel size={20} /> },
  { name: 'Warehouse', icon: <Warehouse size={20} /> },
  { name: 'Fence', icon: <Fence size={20} /> },
  { name: 'Lamp', icon: <Lamp size={20} /> },
  { name: 'Bed', icon: <Bed size={20} /> },
  { name: 'Bath', icon: <Bath size={20} /> },
  { name: 'Utensils', icon: <Utensils size={20} /> },
  { name: 'Armchair', icon: <Armchair size={20} /> },
  { name: 'DoorOpen', icon: <DoorOpen size={20} /> },
  { name: 'Thermometer', icon: <Thermometer size={20} /> },
  { name: 'Car', icon: <Car size={20} /> },
  { name: 'Cctv', icon: <Cctv size={20} /> },
  { name: 'ShieldCheck', icon: <ShieldCheck size={20} /> },
  { name: 'Leaf', icon: <Leaf size={20} /> },
  { name: 'Sun', icon: <Sun size={20} /> },
  { name: 'Wind', icon: <Wind size={20} /> },
  { name: 'Droplets', icon: <Droplets size={20} /> },
  { name: 'Flame', icon: <Flame size={20} /> },
  { name: 'Plug', icon: <Plug size={20} /> },
  { name: 'Mountain', icon: <Mountain size={20} /> },
  { name: 'Wrench', icon: <Wrench size={20} /> },
  { name: 'Lightbulb', icon: <Lightbulb size={20} /> },
  { name: 'Sprout', icon: <Sprout size={20} /> },
  { name: 'Zap', icon: <Zap size={20} /> },
  { name: 'Fan', icon: <Fan size={20} /> },
  { name: 'Waves', icon: <Waves size={20} /> },
  { name: 'Clock', icon: <Clock size={20} /> },
  { name: 'Shield', icon: <Shield size={20} /> },
  { name: 'Heart', icon: <Heart size={20} /> },
  { name: 'Smile', icon: <Smile size={20} /> },
  { name: 'Star', icon: <Star size={20} /> },
  { name: 'Cloud', icon: <Cloud size={20} /> },
  { name: 'Moon', icon: <Moon size={20} /> },
  { name: 'Flower2', icon: <Flower2 size={20} /> },
  { name: 'Compass', icon: <Compass size={20} /> },
  { name: 'Pin', icon: <Pin size={20} /> },
  { name: 'Wifi', icon: <Wifi size={20} /> },
  { name: 'Smartphone', icon: <Smartphone size={20} /> },
  { name: 'Cpu', icon: <Cpu size={20} /> },
  { name: 'BrickWall', icon: <BrickWall size={20} /> },
  { name: 'Scissors', icon: <Scissors size={20} /> },
  { name: 'Brush', icon: <Brush size={20} /> },
  { name: 'Table', icon: <Table size={20} /> },
  { name: 'Sofa', icon: <Sofa size={20} /> },
  { name: 'Trees', icon: <Trees size={20} /> },
  { name: 'TreeDeciduous', icon: <TreeDeciduous size={20} /> },
  { name: 'Target', icon: <Target size={20} /> },
  { name: 'Rocket', icon: <Rocket size={20} /> },
];

const renderIcon = (iconName?: string, size: number = 20) => {
  switch (iconName) {
    case 'TreePine': return <TreePine size={size} />;
    case 'Home': return <Home size={size} />;
    case 'Hammer': return <Hammer size={size} />;
    case 'Paintbrush': return <Paintbrush size={size} />;
    case 'Grid': return <Grid size={size} />;
    case 'Layers': return <Layers size={size} />;
    case 'Boxes': return <Boxes size={size} />;
    case 'Truck': return <Truck size={size} />;
    case 'HardHat': return <HardHat size={size} />;
    case 'Ruler': return <Ruler size={size} />;
    case 'Map': return <Map size={size} />;
    case 'Construction': return <Construction size={size} />;
    case 'Shovel': return <Shovel size={size} />;
    case 'Warehouse': return <Warehouse size={size} />;
    case 'Fence': return <Fence size={size} />;
    case 'Lamp': return <Lamp size={size} />;
    case 'Bed': return <Bed size={size} />;
    case 'Bath': return <Bath size={size} />;
    case 'Utensils': return <Utensils size={size} />;
    case 'Armchair': return <Armchair size={size} />;
    case 'DoorOpen': return <DoorOpen size={size} />;
    case 'Thermometer': return <Thermometer size={size} />;
    case 'Car': return <Car size={size} />;
    case 'Cctv': return <Cctv size={size} />;
    case 'ShieldCheck': return <ShieldCheck size={size} />;
    case 'Leaf': return <Leaf size={size} />;
    case 'Sun': return <Sun size={size} />;
    case 'Wind': return <Wind size={size} />;
    case 'Droplets': return <Droplets size={size} />;
    case 'Flame': return <Flame size={size} />;
    case 'Plug': return <Plug size={size} />;
    case 'Mountain': return <Mountain size={size} />;
    case 'Wrench': return <Wrench size={size} />;
    case 'Lightbulb': return <Lightbulb size={size} />;
    case 'Sprout': return <Sprout size={size} />;
    case 'Zap': return <Zap size={size} />;
    case 'Fan': return <Fan size={size} />;
    case 'Waves': return <Waves size={size} />;
    case 'Clock': return <Clock size={size} />;
    case 'Shield': return <Shield size={size} />;
    case 'Heart': return <Heart size={size} />;
    case 'Smile': return <Smile size={size} />;
    case 'Star': return <Star size={size} />;
    case 'Cloud': return <Cloud size={size} />;
    case 'Moon': return <Moon size={size} />;
    case 'Flower2': return <Flower2 size={size} />;
    case 'Compass': return <Compass size={size} />;
    case 'Pin': return <Pin size={size} />;
    case 'Wifi': return <Wifi size={size} />;
    case 'Smartphone': return <Smartphone size={size} />;
    case 'Cpu': return <Cpu size={size} />;
    case 'BrickWall': return <BrickWall size={size} />;
    case 'Scissors': return <Scissors size={size} />;
    case 'Brush': return <Brush size={size} />;
    case 'Table': return <Table size={size} />;
    case 'Sofa': return <Sofa size={size} />;
    case 'Trees': return <Trees size={size} />;
    case 'TreeDeciduous': return <TreeDeciduous size={size} />;
    case 'Target': return <Target size={size} />;
    case 'Rocket': return <Rocket size={size} />;
    case 'Package':
    default: return <Package size={size} />;
  }
};

const LeadStatusBadge = ({ status }: { status: LeadStatus }) => {
  switch (status) {
    case 'new': 
      return <span className="bg-blue-100 text-blue-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Inbox size={10} /> Novo</span>;
    case 'contacted': 
      return <span className="bg-amber-100 text-amber-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><MessageCircle size={10} /> Contatado</span>;
    case 'qualified': 
      return <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 size={10} /> Qualificado</span>;
    case 'closed': 
      return <span className="bg-stone-100 text-stone-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><XCircle size={10} /> Fechado</span>;
    default: 
      return <span className="bg-stone-100 text-stone-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">{status}</span>;
  }
};
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { GoogleGenAI } from '@google/genai';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sobre' | 'produtos' | 'obras' | 'categorias' | 'clientes' | 'parceiros' | 'profissionais' | 'ajustes' | 'atuacao' | 'postagens' | 'sincronizacao' | 'usuarios' | 'leads' | 'manutencao'>('dashboard');
  const [internalProductTab, setInternalProductTab] = useState('all');
  const { 
    about, history, updateAbout, updateHistory,
    products, addProduct, updateProduct, deleteProduct,
    partners, addPartner, updatePartner, deletePartner,
    clients, addClient, updateClient, deleteClient,
    leads, addLead, updateLead, deleteLead,
    categories, addCategory, updateCategory, deleteCategory,
    subcategories, addSubcategory, updateSubcategory, deleteSubcategory,
    settings, updateSettings,
    works, addWork, updateWork, deleteWork,
    professionals, addProfessional, updateProfessional, deleteProfessional,
    serviceAreas, addServiceArea, updateServiceArea, deleteServiceArea,
    posts, addPost, updatePost, deletePost,
    users: systemUsers, addUser, updateUser, deleteUser,
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
  const [editingUser, setEditingUser] = useState<Partial<SystemUser> | null>(null);
  const [editingLead, setEditingLead] = useState<Partial<Lead> | null>(null);
  const [leadStatusFilter, setLeadStatusFilter] = useState<LeadStatus | 'all'>('all');
  
  const [aboutForm, setAboutForm] = useState(about);
  const [historyForm, setHistoryForm] = useState(history);
  const [settingsForm, setSettingsForm] = useState(settings);

  // --- UI State ---
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; confirmMsg: string; remove: (id: string) => void } | null>(null);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState<Record<number, boolean>>({});

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

  const isAdminEmail = ['camillasites@gmail.com', 'contato@madeireirapindorama.com.br'].includes(user?.email?.toLowerCase() || '');
  const currentUserRole = systemUsers.find(u => u.email.toLowerCase() === user?.email?.toLowerCase())?.role;
  const canDelete = isAdminEmail || currentUserRole === 'admin';
  const canSave = isAdminEmail || currentUserRole === 'admin' || currentUserRole === 'editor';
  const canAccessAdmin = isAdminEmail || !!currentUserRole;

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
  const processFile = (file: File, callback: (base64: string) => void, options?: { maxSize?: number, quality?: number, preserveTransparency?: boolean }) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const max_size = options?.maxSize || 800; // Max dimension to save space

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
          if (options?.preserveTransparency === false) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }
          ctx.drawImage(img, 0, 0, width, height);
          
          // Preserve transparency for PNG and WebP unless explicitly disabled
          const mimeType = (options?.preserveTransparency !== false && (file.type === 'image/png' || file.type === 'image/webp')) 
            ? file.type 
            : 'image/jpeg';
          
          const quality = (mimeType === 'image/jpeg' || mimeType === 'image/webp') ? (options?.quality || 0.6) : undefined;
          callback(canvas.toDataURL(mimeType, quality));
        } else {
          callback(reader.result as string); // Fallback if canvas fails
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const processFiles = (files: FileList, callback: (base64s: string[]) => void, options?: { maxSize?: number, quality?: number, preserveTransparency?: boolean }) => {
    const promises = Array.from(files).map(file => new Promise<string>((resolve) => {
      processFile(file, resolve, options);
    }));
    Promise.all(promises).then(callback);
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Handlers ---

  const handleSaveAbout = async () => {
    try {
      await updateAbout(aboutForm);
      showNotification('Alterações em "Sobre Nós" salvas com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar Sobre Nós:', error);
      let msg = 'Erro ao salvar alterações.';
      try {
        const errInfo = JSON.parse(error.message);
        if (errInfo.message) msg = errInfo.message;
      } catch (e) {
        if (error.message) msg = error.message;
      }
      showNotification(msg, 'error');
    }
  };

  const handleSaveHistory = async () => {
    try {
      await updateHistory(historyForm);
      showNotification('Alterações em "Nossa História" salvas com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar História:', error);
      let msg = 'Erro ao salvar alterações.';
      try {
        const errInfo = JSON.parse(error.message);
        if (errInfo.message) msg = errInfo.message;
      } catch (e) {
        if (error.message) msg = error.message;
      }
      showNotification(msg, 'error');
    }
  };

  const handleSaveSettings = async () => {
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
      await updateSettings(settingsForm);
      showNotification('Configurações salvas com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar configurações:', error);
      let msg = 'Erro ao salvar configurações.';
      try {
        const errInfo = JSON.parse(error.message);
        if (errInfo.message) msg = errInfo.message;
      } catch (e) {
        if (error.message) msg = error.message;
      }
      showNotification(msg, 'error');
    }
  };

  const handleGenerateDescription = async (index: number, title: string) => {
    if (!title || title.trim() === '') {
      showNotification('Preencha o título primeiro para gerar a descrição com IA.', 'error');
      return;
    }

    setIsGeneratingDesc(prev => ({ ...prev, [index]: true }));
    try {
      const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        showNotification('Chave da API do Gemini não configurada.', 'error');
        return;
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Crie uma descrição curta e chamativa (máximo 2 frases) para um banner de um site de uma madeireira (Madeireira Pindorama), baseada neste título: "${title}"`,
      });
      
      const generatedText = response.text?.trim() || '';
      
      if (generatedText) {
        const newSlides = [...(settingsForm.heroSlides || [])];
        newSlides[index].description = generatedText;
        setSettingsForm({ ...settingsForm, heroSlides: newSlides });
        showNotification('Descrição gerada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao gerar descrição:', error);
      showNotification('Erro ao gerar descrição com IA.', 'error');
    } finally {
      setIsGeneratingDesc(prev => ({ ...prev, [index]: false }));
    }
  };

  // Generic Save/Delete Handlers
  const handleSaveItem = async <T extends { id?: string }>(
    item: Partial<T>,
    setItem: (i: Partial<T> | null) => void,
    add: (i: T) => void,
    update: (i: T) => void,
    confirmMsg: string
  ) => {
    if (!canSave) {
      showNotification('Você não tem permissão para salvar dados.', 'error');
      return;
    }
    try {
      if (item.id) {
        await update(item as T);
        setItem(null);
        showNotification(`${confirmMsg} atualizado(a) com sucesso!`);
      } else {
        const newItem = { ...item, id: Date.now().toString() } as T;
        await add(newItem);
        setItem(null);
        showNotification(`${confirmMsg} criado(a) com sucesso!`);
      }
    } catch (error: any) {
      console.error(`Erro ao salvar ${confirmMsg}:`, error);
      let msg = `Erro ao salvar ${confirmMsg}.`;
      try {
        const errInfo = JSON.parse(error.message);
        if (errInfo.message) msg = errInfo.message;
      } catch (e) {
        if (error.message) msg = error.message;
      }
      showNotification(msg, 'error');
    }
  };

  const handleDeleteItem = (id: string, remove: (id: string) => void, confirmMsg: string) => {
    if (!canDelete) {
      showNotification('Você não tem permissão para excluir dados.', 'error');
      return;
    }
    setDeleteConfirmation({ id, remove, confirmMsg });
  };

  const confirmDelete = async () => {
    if (deleteConfirmation) {
      try {
        await deleteConfirmation.remove(deleteConfirmation.id);
        showNotification(`${deleteConfirmation.confirmMsg} excluído(a) com sucesso!`);
      } catch (error: any) {
        console.error(`Erro ao excluir ${deleteConfirmation.confirmMsg}:`, error);
        let msg = `Erro ao excluir ${deleteConfirmation.confirmMsg}.`;
        try {
          // Try to parse the JSON error from handleFirestoreError
          const errInfo = JSON.parse(error.message);
          if (errInfo.message) msg = errInfo.message;
        } catch (e) {
          // Not a JSON error or standard error
          if (error.message) msg = error.message;
        }
        showNotification(msg, 'error');
      } finally {
        setDeleteConfirmation(null);
      }
    }
  };

  useEffect(() => {
    if (user) {
      console.log(`[AUTH] User logged in: ${user.email} (Verified: ${user.emailVerified})`);
    }
  }, [user]);

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
          
          {user && (
            <div className="mb-4 p-3 bg-stone-50 rounded border border-stone-200 text-xs text-stone-600">
              Logado como: <strong>{user.email}</strong>
            </div>
          )}
          
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
          
          {user && !canAccessAdmin && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-[10px] flex flex-col gap-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <AlertCircle size={14} />
                ACESSO NEGADO
              </div>
              <p>Você está logado como <strong>{user.email}</strong>. Este e-mail não está na lista de usuários autorizados.</p>
              <p>Solicite acesso ao administrador do sistema.</p>
            </div>
          )}

          {user && canAccessAdmin && !canSave && (
            <div className="mb-4 p-3 bg-yellow-900/50 border border-yellow-700 rounded-lg text-yellow-200 text-[10px] flex flex-col gap-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <AlertCircle size={14} />
                MODO VISUALIZAÇÃO
              </div>
              <p>Você possui apenas permissão de <strong>Visualizador</strong>. Não é permitido salvar ou excluir dados.</p>
            </div>
          )}

          {/* Sync Status Indicator */}
          <div className="flex items-center gap-2 text-[10px] mb-8 opacity-80">
            {isSyncing ? (
              <div className="flex items-center gap-1 text-emerald-300">
                <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
                Salvando no servidor...
              </div>
            ) : lastSyncError ? (
              <div className="flex items-center gap-1 text-red-400 group relative">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                Erro de conexão
                <div className="absolute left-0 top-full mt-2 hidden group-hover:block bg-red-900 text-white p-2 rounded text-xs z-50 w-48 break-words">
                  {lastSyncError}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-emerald-500">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                Sincronizado
              </div>
            )}
          </div>
          
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
              { id: 'manutencao', label: 'Manutenção', icon: <Construction size={20} /> },
              { id: 'leads', label: 'Leads', icon: <Inbox size={20} /> },
              { id: 'atuacao', label: 'Área de Atuação', icon: <MapPin size={20} /> },
              { id: 'categorias', label: 'Categorias & Sub', icon: <List size={20} /> },
              { id: 'clientes', label: 'Clientes', icon: <UserCheck size={20} /> },
              { id: 'obras', label: 'Obras', icon: <Hammer size={20} /> },
              { id: 'parceiros', label: 'Parceiros', icon: <Users size={20} /> },
              { id: 'postagens', label: 'Postagens', icon: <FileText size={20} /> },
              { id: 'produtos', label: 'Produtos', icon: <Package size={20} /> },
              { id: 'profissionais', label: 'Profissionais', icon: <Briefcase size={20} /> },
              { id: 'sobre', label: 'Sobre Nós', icon: <Info size={20} /> },
              { id: 'ajustes', label: 'Ajustes', icon: <SettingsIcon size={20} /> },
              { id: 'usuarios', label: 'Usuários', icon: <UserCheck size={20} /> },
              { id: 'sincronizacao', label: 'Sincronização', icon: <RefreshCw size={20} /> },
            ].filter(item => {
              // Only admins can see users and sync
              const isAdminEmail = ['camillasites@gmail.com', 'contato@madeireirapindorama.com.br'].includes(user?.email?.toLowerCase() || '');
              const userRole = systemUsers.find(u => u.email.toLowerCase() === user?.email?.toLowerCase())?.role;
              const isAdmin = isAdminEmail || userRole === 'admin';
              
              if ((item.id === 'usuarios' || item.id === 'sincronizacao') && !isAdmin) return false;
              return true;
            }).sort((a, b) => {
              if (a.id === 'dashboard') return -1;
              if (b.id === 'dashboard') return 1;
              if (a.id === 'sincronizacao') return 1;
              if (b.id === 'sincronizacao') return -1;
              return a.label.localeCompare(b.label);
            }).map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === item.id ? 'bg-emerald-800 font-bold' : 'hover:bg-emerald-800/50'}`}
              >
                {item.icon} {item.label}
              </button>
            ))}
            
            <div className="px-4 py-3 mb-4 bg-emerald-800/30 rounded-lg border border-emerald-700/50 mt-4">
              <p className="text-[10px] uppercase tracking-wider text-emerald-300 opacity-70 mb-1">Administrador</p>
              <p className="text-sm font-medium truncate" title={user?.email}>{user?.email}</p>
            </div>
            
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition hover:bg-red-800/50 text-red-200 hover:text-white">
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

          {/* Sync Error Alert */}
          {lastSyncError && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded shadow-sm flex items-start gap-3">
              <AlertCircle className="shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="font-bold">Erro de Sincronização / Permissão</p>
                <p className="text-sm opacity-90">Ocorreu um erro ao tentar salvar ou carregar dados. Verifique se você tem permissão de administrador.</p>
                <details className="mt-2 text-xs cursor-pointer">
                  <summary className="hover:underline">Ver detalhes técnicos</summary>
                  <pre className="mt-2 p-2 bg-red-200/50 rounded overflow-x-auto whitespace-pre-wrap font-mono">
                    {typeof lastSyncError === 'string' ? lastSyncError : JSON.stringify(lastSyncError, null, 2)}
                  </pre>
                </details>
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
                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-red-100 rounded-lg text-red-800"><Inbox /></div>
                    <span className="text-3xl font-bold text-red-900">{leads.length}</span>
                  </div>
                  <p className="text-red-800 font-medium">Novos Leads</p>
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

          {/* --- LEADS --- */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-emerald-900">Gestão de Leads</h3>
                  <p className="text-sm text-stone-500">Contatos recebidos através do formulário do site.</p>
                </div>
                
                <div className="flex items-center gap-2 bg-white p-1 border rounded-lg shadow-sm">
                  <button 
                    onClick={() => setLeadStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${leadStatusFilter === 'all' ? 'bg-emerald-100 text-emerald-800' : 'text-stone-600 hover:bg-stone-50'}`}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={() => setLeadStatusFilter('new')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${leadStatusFilter === 'new' ? 'bg-blue-100 text-blue-800' : 'text-stone-600 hover:bg-stone-50'}`}
                  >
                    Novos
                  </button>
                  <button 
                    onClick={() => setLeadStatusFilter('contacted')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${leadStatusFilter === 'contacted' ? 'bg-amber-100 text-amber-800' : 'text-stone-600 hover:bg-stone-50'}`}
                  >
                    Contatados
                  </button>
                </div>
              </div>

              {editingLead && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-bold text-emerald-900">Detalhes do Lead</h4>
                      <button onClick={() => setEditingLead(null)} className="text-stone-400 hover:text-stone-600"><X /></button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Status</label>
                          <select 
                            className="w-full p-2.5 border border-stone-200 rounded-lg bg-stone-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                            value={editingLead.status}
                            onChange={e => setEditingLead({...editingLead, status: e.target.value as LeadStatus})}
                          >
                            <option value="new">Novo</option>
                            <option value="contacted">Contatado</option>
                            <option value="qualified">Qualificado</option>
                            <option value="closed">Fechado</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Data</label>
                          <div className="p-2.5 bg-stone-100 rounded-lg text-sm text-stone-600 border border-stone-200">
                            {editingLead.createdAt ? new Date(editingLead.createdAt).toLocaleDateString('pt-BR') : '-'}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Nome</label>
                        <input 
                          className="w-full p-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                          value={editingLead.name} 
                          onChange={e => setEditingLead({...editingLead, name: e.target.value})} 
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-500 uppercase mb-1">E-mail</label>
                          <input 
                            className="w-full p-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                            value={editingLead.email} 
                            onChange={e => setEditingLead({...editingLead, email: e.target.value})} 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Telefone</label>
                          <input 
                            className="w-full p-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                            value={editingLead.phone} 
                            onChange={e => setEditingLead({...editingLead, phone: e.target.value})} 
                        />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Mensagem / Notas</label>
                        <textarea 
                          className="w-full p-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none min-h-[100px]" 
                          value={editingLead.notes} 
                          onChange={e => setEditingLead({...editingLead, notes: e.target.value})} 
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                      <button 
                        onClick={() => setEditingLead(null)} 
                        className="px-6 py-2.5 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 font-medium transition"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={() => handleSaveItem(editingLead, setEditingLead, addLead, updateLead, 'Lead')} 
                        className="px-6 py-2.5 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 font-bold shadow-md transition"
                      >
                        Salvar Alterações
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 text-xs uppercase font-bold">
                      <th className="p-4">Lead / Contato</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Data</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {leads
                      .filter(l => leadStatusFilter === 'all' || l.status === leadStatusFilter)
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map(l => (
                        <tr key={l.id} className="hover:bg-stone-50 transition group">
                          <td className="p-4">
                            <div className="font-bold text-stone-900">{l.name}</div>
                            <div className="text-xs text-stone-500 flex flex-col gap-1 mt-1">
                              <span className="flex items-center gap-1"><Mail size={12} /> {l.email}</span>
                              {l.phone && (
                                <a 
                                  href={`https://wa.me/${l.phone.replace(/\D/g, '')}`} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="flex items-center gap-1 hover:text-emerald-600 transition"
                                  title="Abrir no WhatsApp"
                                >
                                  <MessageCircle size={12} className="text-emerald-600" /> {l.phone}
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <LeadStatusBadge status={l.status} />
                              {(l.status === 'new' || l.status === 'contacted') && (
                                <button 
                                  onClick={() => updateLead({...l, status: l.status === 'new' ? 'contacted' : 'new'})}
                                  className="p-1 text-stone-400 hover:text-emerald-600 transition"
                                  title={l.status === 'new' ? "Marcar como Contatado" : "Marcar como Novo"}
                                >
                                  <Settings2 size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-stone-600">
                              {new Date(l.createdAt).toLocaleDateString('pt-BR')}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => setEditingLead(l)} 
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                title="Ver detalhes / Editar"
                              >
                                <Edit size={18} />
                              </button>
                              <button 
                                onClick={() => handleDeleteItem(l.id, deleteLead, 'Lead')} 
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                title="Excluir"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {leads.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-stone-400">
                          <Inbox size={48} className="mx-auto mb-4 opacity-20" />
                          Nenhum lead recebido ainda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
                                }, { maxSize: 800, quality: 0.5, preserveTransparency: false });
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
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                  <h3 className="text-2xl font-bold text-emerald-900">Categorias & Subcategorias</h3>
                  <p className="text-sm text-stone-500">Organize seus produtos em categorias principais e subgrupos.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Categorias */}
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2"><Layers size={20} /> Categorias Principais</h3>
                    <button onClick={() => setEditingCategory({ name: '', icon: 'Package' })} className="bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-emerald-800 transition shadow-sm"><Plus size={16} /> Nova</button>
                  </div>
                  
                  {editingCategory && (
                    <div className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-100 shadow-inner">
                      <div className="mb-4">
                        <label className="block text-xs font-bold text-emerald-700 uppercase mb-1">Nome da Categoria</label>
                        <input className="w-full p-2.5 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ex: Madeiras, Ferragens..." value={editingCategory.name} onChange={e => setEditingCategory({...editingCategory, name: e.target.value})} />
                      </div>
                      
                      <label className="block text-xs font-bold text-emerald-700 uppercase mb-2">Ícone Representativo:</label>
                      <div className="grid grid-cols-7 gap-2 mb-4 max-h-40 overflow-y-auto p-1">
                        {CATEGORY_ICONS.map((catIcon) => (
                          <button
                            key={catIcon.name}
                            type="button"
                            onClick={() => setEditingCategory({...editingCategory, icon: catIcon.name})}
                            className={`p-2 rounded-lg flex items-center justify-center border transition-all ${
                              editingCategory.icon === catIcon.name 
                                ? 'bg-emerald-600 text-white border-emerald-700 shadow-md transform scale-110' 
                                : 'bg-white text-stone-400 border-stone-200 hover:border-emerald-300 hover:bg-emerald-50'
                            }`}
                            title={catIcon.name}
                          >
                            {catIcon.icon}
                          </button>
                        ))}
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-emerald-100">
                        <button onClick={() => setEditingCategory(null)} className="px-3 py-1.5 text-sm text-stone-500 font-medium hover:text-stone-700">Cancelar</button>
                        <button onClick={() => handleSaveItem(editingCategory, setEditingCategory, addCategory, updateCategory, 'categoria')} className="px-4 py-1.5 text-sm bg-emerald-700 text-white rounded-lg font-bold shadow-md hover:bg-emerald-800 transition">Salvar Categoria</button>
                      </div>
                    </div>
                  )}

                  <ul className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {categories.length === 0 && <li className="text-center py-8 text-stone-400 italic">Nenhuma categoria cadastrada.</li>}
                    {categories.map(c => (
                      <li key={c.id} className="flex justify-between items-center p-4 bg-white border border-stone-100 rounded-xl hover:shadow-md hover:border-emerald-200 transition group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-700 group-hover:bg-emerald-100 transition">
                            {renderIcon(c.icon)}
                          </div>
                          <div>
                            <span className="font-bold text-stone-800 block">{c.name}</span>
                            <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">
                              {subcategories.filter(s => s.categoryId === c.id).length} Subcategorias
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditingCategory(c)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Editar"><Edit size={16} /></button>
                          <button onClick={() => handleDeleteItem(c.id, deleteCategory, 'categoria')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Excluir"><Trash2 size={16} /></button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Subcategorias */}
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2"><Tag size={20} /> Subcategorias</h3>
                    <button 
                      onClick={() => setEditingSubcategory({ name: '', categoryId: categories[0]?.id || '' })} 
                      disabled={categories.length === 0}
                      className={`bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-emerald-800 transition shadow-sm ${categories.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Plus size={16} /> Nova
                    </button>
                  </div>

                  {editingSubcategory && (
                    <div className="mb-6 p-4 bg-stone-50 rounded-lg border border-stone-200 shadow-inner">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Nome da Subcategoria</label>
                          <input className="w-full p-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Ex: Pinus, Eucalipto, Decks..." value={editingSubcategory.name} onChange={e => setEditingSubcategory({...editingSubcategory, name: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Categoria Vinculada</label>
                          <select className="w-full p-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white" value={editingSubcategory.categoryId} onChange={e => setEditingSubcategory({...editingSubcategory, categoryId: e.target.value})}>
                            <option value="">Selecione a Categoria Principal</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-stone-200">
                        <button onClick={() => setEditingSubcategory(null)} className="px-3 py-1.5 text-sm text-stone-500 font-medium hover:text-stone-700">Cancelar</button>
                        <button onClick={() => handleSaveItem(editingSubcategory, setEditingSubcategory, addSubcategory, updateSubcategory, 'subcategoria')} className="px-4 py-1.5 text-sm bg-emerald-700 text-white rounded-lg font-bold shadow-md hover:bg-emerald-800 transition">Salvar Subcategoria</button>
                      </div>
                    </div>
                  )}

                  <ul className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {subcategories.length === 0 && <li className="text-center py-8 text-stone-400 italic">Nenhuma subcategoria cadastrada.</li>}
                    {subcategories.map(s => {
                      const parentCat = categories.find(c => c.id === s.categoryId);
                      return (
                        <li key={s.id} className="flex justify-between items-center p-4 bg-white border border-stone-100 rounded-xl hover:shadow-md hover:border-emerald-200 transition group">
                          <div>
                            <span className="font-bold text-stone-800">{s.name}</span>
                            {parentCat ? (
                              <div className="flex items-center gap-1 mt-1">
                                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase">
                                  {renderIcon(parentCat.icon, 10)} {parentCat.name}
                                </span>
                              </div>
                            ) : (
                              <div className="text-[10px] text-red-400 font-bold mt-1 uppercase">Sem Categoria Vinculada</div>
                            )}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setEditingSubcategory(s)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Editar"><Edit size={16} /></button>
                            <button onClick={() => handleDeleteItem(s.id, deleteSubcategory, 'subcategoria')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Excluir"><Trash2 size={16} /></button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* --- MANUTENCAO --- */}
          {activeTab === 'manutencao' && (
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-amber-100 text-amber-700 rounded-2xl">
                    <Construction size={40} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-stone-900 tracking-tight">Modo Manutenção</h3>
                    <p className="text-stone-500">Controle a visibilidade pública do seu site.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="p-6 rounded-2xl border-2 transition-all duration-500 bg-stone-50 border-stone-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black uppercase tracking-widest text-stone-400">Status do Site</span>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${settingsForm.maintenanceMode ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {settingsForm.maintenanceMode ? 'Em Manutenção' : 'Ativo'}
                      </div>
                    </div>
                    
                    <h4 className="text-xl font-bold text-stone-800 mb-2">Alternar Visibilidade</h4>
                    <p className="text-sm text-stone-500 mb-6">Ao ativar, visitantes serão redirecionados para a tela de manutenção personalizada com o logo e fundo de madeira.</p>
                    
                    <button 
                      onClick={() => setSettingsForm({...settingsForm, maintenanceMode: !settingsForm.maintenanceMode})}
                      className={`w-full py-4 rounded-xl font-bold text-white transition shadow-lg flex items-center justify-center gap-2 ${settingsForm.maintenanceMode ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'}`}
                    >
                      {settingsForm.maintenanceMode ? (
                        <><Sparkles size={20} /> ATIVAR SITE (Publicar)</>
                      ) : (
                        <><Construction size={20} /> ENTRAR EM MANUTENÇÃO</>
                      )}
                    </button>
                  </div>

                  <div className="relative group rounded-2xl overflow-hidden shadow-2xl border border-stone-200 aspect-video">
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1516733257386-816766cf241c?auto=format&fit=crop&q=80")' }}
                    />
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4">
                      {settingsForm.logoUrl && <img src={settingsForm.logoUrl} alt="Logo" className="h-12 mb-2 opacity-80" />}
                      <div className="text-white text-center">
                        <p className="text-xs font-bold opacity-70">SNEAK PEEK</p>
                        <p className="font-bold">Tela de Manutenção</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
                  <Info className="text-emerald-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-emerald-800 leading-relaxed">
                    <strong>Importante:</strong> Você (administrador) ainda terá acesso total ao painel de controle mesmo com o modo de manutenção ativado. A tela de manutenção exibirá um botão de login para facilitar seu acesso.
                  </p>
                </div>

                <div className="mt-8 flex justify-end">
                   <button 
                    onClick={handleSaveSettings}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3 rounded-xl font-black shadow-xl transition flex items-center gap-2"
                   >
                     <Save size={18} /> SALVAR ALTERAÇÃO
                   </button>
                </div>
              </div>
            </div>
          )}

          {/* --- AJUSTES --- */}
          {activeTab === 'ajustes' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <div>
                  <h3 className="text-2xl font-bold text-emerald-900">Configurações do Site</h3>
                  <p className="text-stone-500 text-sm">Gerencie a identidade, segurança e status do seu site.</p>
                </div>
                
                <div className="flex items-center gap-4 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <div className="text-right">
                    <p className={`text-sm font-bold ${settingsForm.maintenanceMode ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {settingsForm.maintenanceMode ? 'SITE EM MANUTENÇÃO' : 'SITE ATIVO'}
                    </p>
                    <p className="text-[10px] text-stone-500 uppercase tracking-widest font-black">Status Global</p>
                  </div>
                  <button 
                    onClick={() => setSettingsForm({...settingsForm, maintenanceMode: !settingsForm.maintenanceMode})}
                    className={`w-14 h-8 rounded-full relative transition-colors ${settingsForm.maintenanceMode ? 'bg-amber-500' : 'bg-emerald-600'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${settingsForm.maintenanceMode ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>
              
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
                            processFile(e.target.files[0], (base64) => setSettingsForm({...settingsForm, logoUrl: base64}), { maxSize: 400 });
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
                            processFile(e.target.files[0], (base64) => setSettingsForm({...settingsForm, footerLogoUrl: base64}), { maxSize: 400 });
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
                  <h4 className="font-bold mb-4 flex items-center gap-2"><Facebook size={18} /> Marketing & Analytics</h4>
                  <div>
                    <label className="block text-sm font-medium">Facebook Pixel ID</label>
                    <input 
                      className="w-full p-2 border rounded border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="Ex: 123456789012345" 
                      value={settingsForm.facebookPixelId || ''} 
                      onChange={e => setSettingsForm({...settingsForm, facebookPixelId: e.target.value})} 
                    />
                    <p className="text-[10px] text-stone-500 mt-1">Cole aqui o número de identificação do seu Pixel do Facebook para rastreamento de conversões.</p>
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
                  <h4 className="font-bold mb-4 flex items-center gap-2"><ImageIcon size={18} /> Imagem de Fundo do Banner</h4>
                  <p className="text-sm text-stone-500 mb-4">Esta é a imagem que fica fixa no fundo da primeira seção do site.</p>
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-full md:w-1/2">
                      <input 
                        type="file" 
                        id="hero-bg-input"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            processFile(e.target.files[0], (base64) => setSettingsForm({...settingsForm, heroBgUrl: base64}), { maxSize: 1200, quality: 0.4 });
                          }
                        }}
                        className="hidden"
                      />
                      {settingsForm.heroBgUrl ? (
                        <div className="relative group aspect-video bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                          <img src={settingsForm.heroBgUrl} alt="Hero Background" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                            <button 
                              type="button"
                              onClick={() => document.getElementById('hero-bg-input')?.click()}
                              className="bg-white text-emerald-900 px-4 py-2 rounded-md text-sm font-bold"
                            >
                              Alterar Imagem
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          type="button"
                          onClick={() => document.getElementById('hero-bg-input')?.click()}
                          className="w-full aspect-video border-2 border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center text-stone-500 hover:bg-stone-50 transition"
                        >
                          <Plus size={32} />
                          <span className="text-sm mt-2">Selecionar Imagem de Fundo</span>
                        </button>
                      )}
                    </div>
                    <div className="flex-1 text-sm text-stone-600 space-y-2">
                      <p><strong>Dica:</strong> Use uma imagem de alta resolução (mínimo 1920x1080) para melhor resultado.</p>
                      <p>Esta imagem aparecerá por trás do texto e dos slides principais, com um efeito de transparência escura para garantir a leitura.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-stone-50 p-6 rounded-xl border md:col-span-2">
                  <h4 className="font-bold mb-4 flex items-center gap-2"><ImageIcon size={18} /> Imagem de Fundo dos Banners das Páginas</h4>
                  <p className="text-sm text-stone-500 mb-4">Esta imagem aparecerá no topo de todas as páginas internas (Sobre, Produtos, Obras, etc).</p>
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-full md:w-1/2">
                      <input 
                        type="file" 
                        id="page-banner-input"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            processFile(e.target.files[0], (base64) => setSettingsForm({...settingsForm, pageBannerImageUrl: base64}), { maxSize: 1200, quality: 0.4 });
                          }
                        }}
                        className="hidden"
                      />
                      {settingsForm.pageBannerImageUrl ? (
                        <div className="relative group aspect-video bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                          <img src={settingsForm.pageBannerImageUrl} alt="Page Banner Background" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                            <button 
                              type="button"
                              onClick={() => document.getElementById('page-banner-input')?.click()}
                              className="bg-white text-emerald-900 px-4 py-2 rounded-md text-sm font-bold"
                            >
                              Alterar Imagem
                            </button>
                            <button 
                              type="button"
                              onClick={() => setSettingsForm({...settingsForm, pageBannerImageUrl: ''})}
                              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-bold"
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          type="button"
                          onClick={() => document.getElementById('page-banner-input')?.click()}
                          className="w-full aspect-video border-2 border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center text-stone-500 hover:bg-stone-50 transition"
                        >
                          <Plus size={32} />
                          <span className="text-sm mt-2">Selecionar Imagem do Banner</span>
                        </button>
                      )}
                    </div>
                    <div className="flex-1 text-sm text-stone-600 space-y-2">
                      <p><strong>Dica:</strong> Uma imagem de madeira ripada escura funciona bem aqui.</p>
                      <p>Esta imagem substituirá o fundo verde dos títulos nas páginas internas.</p>
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
                            
                            if (currentCount + newFiles.length > 6) {
                              showNotification('Limite de 6 imagens no banner.', 'error');
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
                            }, { maxSize: 600, quality: 0.3, preserveTransparency: false });
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
                    <p className="text-xs text-stone-500">Você pode selecionar até 6 imagens para o slide.</p>

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
                              <div className="flex justify-between items-center mb-1">
                                <label className="block text-xs font-medium text-stone-500">Descrição</label>
                                <button
                                  type="button"
                                  onClick={() => handleGenerateDescription(idx, slide.title)}
                                  disabled={isGeneratingDesc[idx]}
                                  className="text-[10px] flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition disabled:opacity-50"
                                >
                                  {isGeneratingDesc[idx] ? (
                                    <RefreshCw size={12} className="animate-spin" />
                                  ) : (
                                    <Sparkles size={12} />
                                  )}
                                  Gerar com IA
                                </button>
                              </div>
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
                          processFile(e.target.files[0], (base64) => setAboutForm({...aboutForm, image: base64}), { maxSize: 800, quality: 0.5, preserveTransparency: false });
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
                          processFile(e.target.files[0], (base64) => setHistoryForm({...historyForm, image: base64, videoUrl: ''}), { maxSize: 800, quality: 0.5, preserveTransparency: false });
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
                <div>
                  <h3 className="text-2xl font-bold text-emerald-900">Gerenciar Produtos</h3>
                  <p className="text-stone-500 text-sm">Visualize e edite seu catálogo de produtos</p>
                </div>
                <button 
                  onClick={() => setEditingProduct({ name: '', category: '', subcategory: '', brand: '', price: undefined, description: '', image: '', images: [] })}
                  className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-800 flex items-center gap-2 shadow-sm"
                >
                  <Plus size={18} /> Novo Produto
                </button>
              </div>

              {/* Internal Product Tabs by Category */}
              <div className="mb-6 overflow-x-auto no-scrollbar border-b border-stone-200">
                <div className="flex gap-4">
                  <button
                    onClick={() => setInternalProductTab('all')}
                    className={`pb-4 px-2 text-sm font-bold transition-all relative whitespace-nowrap ${
                      internalProductTab === 'all' ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    Todos os Produtos
                    {internalProductTab === 'all' && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-full"></div>}
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setInternalProductTab(cat.name)}
                      className={`pb-4 px-2 text-sm font-bold transition-all relative whitespace-nowrap ${
                        internalProductTab === cat.name ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-600'
                      }`}
                    >
                      {cat.name}
                      {internalProductTab === cat.name && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-full"></div>}
                    </button>
                  ))}
                </div>
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
                        <input type="number" className="w-full p-2 border rounded" value={editingProduct.price ?? ''} onChange={e => setEditingProduct({...editingProduct, price: e.target.value ? Number(e.target.value) : undefined})} placeholder="Opcional" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Categoria</label>
                        <select 
                          className="w-full p-2 border rounded" 
                          value={editingProduct.category} 
                          onChange={e => setEditingProduct({...editingProduct, category: e.target.value, subcategory: ''})}
                        >
                          <option value="">Selecione...</option>
                          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Subcategoria</label>
                        <select 
                          className="w-full p-2 border rounded" 
                          value={editingProduct.subcategory} 
                          onChange={e => setEditingProduct({...editingProduct, subcategory: e.target.value})}
                          disabled={!editingProduct.category}
                        >
                          <option value="">Selecione...</option>
                          {subcategories
                            .filter(s => {
                              const parentCat = categories.find(c => c.id === s.categoryId);
                              return parentCat?.name === editingProduct.category;
                            })
                            .map(s => <option key={s.id} value={s.name}>{s.name}</option>)
                          }
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-2">Imagem Principal</label>
                        <div className="relative border-2 border-dashed border-stone-300 rounded-lg p-4 bg-stone-50 hover:bg-stone-100 transition cursor-pointer flex flex-col items-center justify-center gap-2">
                          {editingProduct.image ? (
                            <img src={editingProduct.image} alt="Preview" className="max-h-32 object-contain" />
                          ) : (
                            <ImageIcon className="text-stone-400" size={32} />
                          )}
                          <span className="text-sm text-stone-500">{editingProduct.image ? 'Clique para alterar' : 'Clique para selecionar imagem'}</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0] && editingProduct) {
                                processFile(e.target.files[0], (base64) => setEditingProduct({...editingProduct, image: base64}), { maxSize: 800, quality: 0.6, preserveTransparency: false });
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Additional Images Section */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-2">Imagens Adicionais (até 9)</label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                          {(editingProduct.images || []).map((img, idx) => (
                            <div key={idx} className="relative aspect-square border rounded overflow-hidden bg-stone-100 group">
                              <img src={img} alt="" className="w-full h-full object-cover" />
                              <button 
                                onClick={() => {
                                  const newImages = [...(editingProduct.images || [])];
                                  newImages.splice(idx, 1);
                                  setEditingProduct({ ...editingProduct, images: newImages });
                                }}
                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                          
                          {(editingProduct.images?.length || 0) < 9 && (
                            <div className="relative aspect-square border-2 border-dashed border-stone-300 rounded flex items-center justify-center bg-stone-50 hover:bg-stone-100 transition cursor-pointer">
                              <Plus className="text-stone-400" size={24} />
                              <input 
                                type="file" 
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                  if (e.target.files && editingProduct) {
                                    const remaining = 9 - (editingProduct.images?.length || 0);
                                    const filesToProcess = Array.from(e.target.files).slice(0, remaining);
                                    processFiles(filesToProcess as any, (base64s) => {
                                      setEditingProduct({
                                        ...editingProduct,
                                        images: [...(editingProduct.images || []), ...base64s]
                                      });
                                    }, { maxSize: 800, quality: 0.6, preserveTransparency: false });
                                  }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                            </div>
                          )}
                        </div>
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
                    {products
                      .filter(p => internalProductTab === 'all' || p.category === internalProductTab)
                      .map(p => (
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
                        <td className="p-4">
                          {p.price !== undefined && p.price !== null && p.price > 0 ? `R$ ${p.price.toFixed(2)}` : '-'}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => setEditingProduct(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Editar"><Edit size={18} /></button>
                          
                          {/* Compartilhamento */}
                          <a 
                            href="https://www.facebook.com/pages/Madeireira%20Pindorama/1782945151924491/#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex p-2 text-blue-700 hover:bg-blue-50 rounded"
                            title="Acessar Facebook para postar"
                          >
                            <Facebook size={18} />
                          </a>
                          <a 
                            href="https://www.instagram.com/madpindorama/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex p-2 text-pink-600 hover:bg-pink-50 rounded"
                            title="Acessar Instagram para postar"
                          >
                            <Instagram size={18} />
                          </a>

                          <button onClick={() => handleDeleteItem(p.id, deleteProduct, 'produto')} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Excluir"><Trash2 size={18} /></button>
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
                              processFile(e.target.files[0], (base64) => setEditingPartner({...editingPartner, logo: base64}), { maxSize: 400 });
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
                              processFile(e.target.files[0], (base64) => setEditingProfessional({...editingProfessional, image: base64}), { maxSize: 400, quality: 0.5, preserveTransparency: false });
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
                  onClick={() => setEditingServiceArea({ title: '', description: '', image: '' })}
                  className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-800 flex items-center gap-2"
                >
                  <Plus size={18} /> Nova Atuação
                </button>
              </div>

              {editingServiceArea && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white p-6 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-bold">{editingServiceArea.id ? 'Editar Atuação' : 'Nova Atuação'}</h4>
                      <button onClick={() => setEditingServiceArea(null)}><X /></button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium">Título</label>
                        <input className="w-full p-2 border rounded" value={editingServiceArea.title || ''} onChange={e => setEditingServiceArea({...editingServiceArea, title: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Imagem</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0] && editingServiceArea) {
                              processFile(e.target.files[0], (base64) => setEditingServiceArea({...editingServiceArea, image: base64}), { maxSize: 600, quality: 0.5, preserveTransparency: false });
                            }
                          }}
                          className="w-full p-2 border rounded"
                        />
                        {editingServiceArea.image && editingServiceArea.image.trim() !== '' && (
                          <img 
                            src={editingServiceArea.image} 
                            alt="Preview" 
                            className="mt-2 h-32 object-cover rounded-md" 
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Descrição</label>
                        <textarea 
                          className="w-full p-2 border rounded" 
                          rows={4} 
                          value={editingServiceArea.description || ''} 
                          onChange={e => setEditingServiceArea({...editingServiceArea, description: e.target.value})} 
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                      <button onClick={() => setEditingServiceArea(null)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancelar</button>
                      <button onClick={() => handleSaveItem(editingServiceArea, setEditingServiceArea, addServiceArea, updateServiceArea, 'atuação')} className="px-4 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-800">Salvar</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {serviceAreas.map(sa => (
                  <div key={sa.id} className="bg-white rounded-xl border shadow-sm overflow-hidden flex group relative">
                    <div className="w-1/3 h-40 bg-stone-100">
                      {sa.image && sa.image.trim() !== '' ? (
                        <img 
                          src={sa.image} 
                          alt={sa.title} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <ImageIcon size={32} />
                        </div>
                      )}
                    </div>
                    <div className="w-2/3 p-4">
                      <h4 className="font-bold text-stone-800 mb-2">{sa.title}</h4>
                      <p className="text-stone-600 text-sm line-clamp-3">{sa.description}</p>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
                      <button onClick={() => setEditingServiceArea(sa)} className="p-1 bg-blue-100 text-blue-600 rounded shadow-sm"><Edit size={16} /></button>
                      <button onClick={() => handleDeleteItem(sa.id, deleteServiceArea, 'atuação')} className="p-1 bg-red-100 text-red-600 rounded shadow-sm"><Trash2 size={16} /></button>
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
                              processFile(e.target.files[0], (base64) => setEditingPost({...editingPost, image: base64}), { maxSize: 800, quality: 0.5, preserveTransparency: false });
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

          {/* --- USUÁRIOS --- */}
          {activeTab === 'usuarios' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-emerald-900">Gerenciar Usuários</h3>
                  <p className="text-stone-500 text-sm">Adicione e-mails que terão permissão para acessar o painel administrativo.</p>
                </div>
                <button 
                  onClick={() => setEditingUser({ name: '', email: '', role: 'editor' })}
                  className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-800 flex items-center gap-2"
                >
                  <Plus size={18} /> Novo Usuário
                </button>
              </div>

              {editingUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white p-6 rounded-xl w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-bold">{editingUser.id ? 'Editar Usuário' : 'Novo Usuário autorizado'}</h4>
                      <button onClick={() => setEditingUser(null)}><X /></button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium">Nome</label>
                        <input className="w-full p-2 border rounded" placeholder="Nome do colaborador" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Email (Google)</label>
                        <input type="email" className="w-full p-2 border rounded" placeholder="email@gmail.com" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
                        <p className="text-[10px] text-stone-500 mt-1">O usuário deve logar usando este e-mail através do botão Google ou Criar conta com ele.</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Nível de Acesso</label>
                        <select className="w-full p-2 border rounded" value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value as any})}>
                          <option value="admin">Administrador (Pode tudo)</option>
                          <option value="editor">Editor (Pode salvar, mas não excluir)</option>
                          <option value="viewer">Visualizador (Apenas vê os dados)</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                      <button onClick={() => setEditingUser(null)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancelar</button>
                      <button onClick={() => handleSaveItem(editingUser, setEditingUser, addUser, updateUser, 'usuário')} className="px-4 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-800">Salvar Permissão</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 border-b">
                    <tr>
                      <th className="p-4 font-bold text-stone-600 text-sm">Nome</th>
                      <th className="p-4 font-bold text-stone-600 text-sm">Email</th>
                      <th className="p-4 font-bold text-stone-600 text-sm">Nível</th>
                      <th className="p-4 font-bold text-stone-600 text-sm text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-emerald-50/30">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">Sistema (Padrão)</span>
                          <span className="text-[8px] bg-emerald-100 text-emerald-700 px-1 rounded">FIXO</span>
                        </div>
                      </td>
                      <td className="p-4 text-stone-500">contato@madeireirapindorama.com.br</td>
                      <td className="p-4"><span className="text-xs bg-emerald-700 text-white px-2 py-1 rounded">PROPRIETÁRIO</span></td>
                      <td className="p-4 text-right overflow-hidden">
                        <Lock size={16} className="ml-auto opacity-20" />
                      </td>
                    </tr>
                    {systemUsers.map(u => (
                      <tr key={u.id} className="border-b hover:bg-stone-50">
                        <td className="p-4 font-medium">{u.name}</td>
                        <td className="p-4 text-stone-600">{u.email}</td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            u.role === 'editor' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {u.role === 'admin' ? 'Administrador' : u.role === 'editor' ? 'Editor' : 'Visualizador'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingUser(u)} className="p-2 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"><Edit size={18} /></button>
                            <button onClick={() => handleDeleteItem(u.id, deleteUser, 'usuário')} className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
