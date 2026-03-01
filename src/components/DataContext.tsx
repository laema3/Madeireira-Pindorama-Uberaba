import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Partner, Professional, AboutData, Client, Category, Subcategory, Settings, Work } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS, PARTNERS as INITIAL_PARTNERS, PROFESSIONALS as INITIAL_PROFESSIONALS } from '../data';

interface DataContextType {
  products: Product[];
  partners: Partner[];
  professionals: Professional[];
  about: AboutData;
  history: AboutData;
  clients: Client[];
  categories: Category[];
  subcategories: Subcategory[];
  settings: Settings;
  works: Work[];
  
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  
  addPartner: (partner: Partner) => void;
  updatePartner: (partner: Partner) => void;
  deletePartner: (id: string) => void;
  
  updateAbout: (data: AboutData) => void;
  updateHistory: (data: AboutData) => void;

  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;

  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;

  addSubcategory: (subcategory: Subcategory) => void;
  updateSubcategory: (subcategory: Subcategory) => void;
  deleteSubcategory: (id: string) => void;

  updateSettings: (settings: Settings) => void;

  addWork: (work: Work) => void;
  updateWork: (work: Work) => void;
  deleteWork: (id: string) => void;

  addProfessional: (professional: Professional) => void;
  updateProfessional: (professional: Professional) => void;
  deleteProfessional: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Helper hook for localStorage persistence
function usePersistedState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}

export function DataProvider({ children }: { children: ReactNode }) {
  // Initialize products with new fields (mock data adjustment)
  const [products, setProducts] = usePersistedState<Product[]>('products', 
    INITIAL_PRODUCTS.map(p => ({
      ...p,
      id: String(p.id), // Ensure ID is string
      price: 100 + Math.random() * 500,
      brand: 'Genérica',
      subcategory: 'Geral'
    }))
  );
  
  const [partners, setPartners] = usePersistedState<Partner[]>('partners', 
    INITIAL_PARTNERS.map(p => ({ ...p, id: String(p.id) }))
  );
  const [professionals, setProfessionals] = usePersistedState<Professional[]>('professionals', 
    INITIAL_PROFESSIONALS.map(p => ({ ...p, id: String(p.id) }))
  );
  
  const [about, setAbout] = usePersistedState<AboutData>('about', {
    title: 'Tradição e Qualidade em Madeiras',
    description: 'A Madeireira Pindorama nasceu com o propósito de oferecer o que há de melhor em madeiras nobres e materiais para construção. Com mais de duas décadas de história, nos consolidamos como referência na região, sempre prezando pela procedência legal de nossos produtos e pelo respeito ao meio ambiente.',
    image: 'https://picsum.photos/seed/lumberyard/800/600'
  });

  const [history, setHistory] = usePersistedState<AboutData>('history', {
    title: 'Nossa História',
    description: 'Fundada em 1995, começamos como uma pequena serraria familiar. Hoje, somos líderes de mercado, mas mantemos o atendimento próximo e personalizado que nos trouxe até aqui.',
    image: 'https://picsum.photos/seed/history/800/600'
  });

  const [clients, setClients] = usePersistedState<Client[]>('clients', [
    { id: '1', name: 'Construtora Silva', email: 'contato@silva.com', phone: '(11) 99999-1111', address: 'Rua A, 123' },
    { id: '2', name: 'Marcenaria Arte', email: 'arte@marcenaria.com', phone: '(11) 98888-2222', address: 'Av B, 456' }
  ]);

  const [categories, setCategories] = usePersistedState<Category[]>('categories', [
    { id: '1', name: 'Estrutural' },
    { id: '2', name: 'Acabamento' },
    { id: '3', name: 'Chapas' }
  ]);

  const [subcategories, setSubcategories] = usePersistedState<Subcategory[]>('subcategories', [
    { id: '1', name: 'Vigas', categoryId: '1' },
    { id: '2', name: 'Caibros', categoryId: '1' },
    { id: '3', name: 'Decks', categoryId: '2' },
    { id: '4', name: 'Forros', categoryId: '2' },
    { id: '5', name: 'MDF', categoryId: '3' },
    { id: '6', name: 'Compensados', categoryId: '3' }
  ]);

  const [settings, setSettings] = usePersistedState<Settings>('settings', {
    logoUrl: '', // Empty means default icon
    footerText: '© 2026 Madeireira Pindorama. Todos os direitos reservados.',
    facebookUrl: '#',
    instagramUrl: '#',
    whatsappUrl: 'https://wa.me/5511999999999',
    googleTagId: '',
    facebookPixelId: '',
    address: 'Av. das Araucárias, 1234 - Distrito Industrial',
    phone: '(11) 3333-4444',
    email: 'contato@madeireirapindorama.com.br',
    adminUser: 'admin',
    adminPassword: 'admin*2026',
    heroImages: [
      'https://picsum.photos/seed/lumber1/1920/1080',
      'https://picsum.photos/seed/lumber2/1920/1080',
      'https://picsum.photos/seed/lumber3/1920/1080',
      'https://picsum.photos/seed/lumber4/1920/1080',
      'https://picsum.photos/seed/lumber5/1920/1080'
    ]
  });

  // Ensure admin credentials exist (migration for existing users)
  useEffect(() => {
    if (!settings.adminUser || !settings.adminPassword || !settings.heroImages) {
      setSettings(prev => ({
        ...prev,
        adminUser: prev.adminUser || 'admin',
        adminPassword: prev.adminPassword || 'admin*2026',
        heroImages: prev.heroImages || [
          'https://picsum.photos/seed/lumber1/1920/1080',
          'https://picsum.photos/seed/lumber2/1920/1080',
          'https://picsum.photos/seed/lumber3/1920/1080',
          'https://picsum.photos/seed/lumber4/1920/1080',
          'https://picsum.photos/seed/lumber5/1920/1080'
        ]
      }));
    }
  }, [settings.adminUser, settings.adminPassword, settings.heroImages, setSettings]);

  const [works, setWorks] = usePersistedState<Work[]>('works', [
    {
      id: '1',
      title: 'Pergolado Residencial',
      description: 'Estrutura completa em Garapeira com acabamento em verniz náutico.',
      images: [
        'https://picsum.photos/seed/pergola1/800/600',
        'https://picsum.photos/seed/pergola2/800/600',
        'https://picsum.photos/seed/pergola3/800/600'
      ]
    },
    {
      id: '2',
      title: 'Deck de Piscina',
      description: 'Deck em Cumaru com sistema de fixação oculta.',
      images: [
        'https://picsum.photos/seed/deck1/800/600',
        'https://picsum.photos/seed/deck2/800/600'
      ]
    }
  ]);

  // --- CRUD Operations ---

  const addProduct = (product: Product) => setProducts(prev => [...prev, product]);
  const updateProduct = (updatedProduct: Product) => setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

  const addPartner = (partner: Partner) => setPartners(prev => [...prev, partner]);
  const updatePartner = (updatedPartner: Partner) => setPartners(prev => prev.map(p => p.id === updatedPartner.id ? updatedPartner : p));
  const deletePartner = (id: string) => setPartners(prev => prev.filter(p => p.id !== id));

  const updateAbout = (data: AboutData) => setAbout(data);
  const updateHistory = (data: AboutData) => setHistory(data);

  const addClient = (client: Client) => setClients(prev => [...prev, client]);
  const updateClient = (updatedClient: Client) => setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  const deleteClient = (id: string) => setClients(prev => prev.filter(c => c.id !== id));

  const addCategory = (category: Category) => setCategories(prev => [...prev, category]);
  const updateCategory = (updatedCategory: Category) => setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
  const deleteCategory = (id: string) => setCategories(prev => prev.filter(c => c.id !== id));

  const addSubcategory = (subcategory: Subcategory) => setSubcategories(prev => [...prev, subcategory]);
  const updateSubcategory = (updatedSubcategory: Subcategory) => setSubcategories(prev => prev.map(s => s.id === updatedSubcategory.id ? updatedSubcategory : s));
  const deleteSubcategory = (id: string) => setSubcategories(prev => prev.filter(s => s.id !== id));

  const updateSettings = (newSettings: Settings) => setSettings(newSettings);

  const addWork = (work: Work) => setWorks(prev => [...prev, work]);
  const updateWork = (updatedWork: Work) => setWorks(prev => prev.map(w => w.id === updatedWork.id ? updatedWork : w));
  const deleteWork = (id: string) => setWorks(prev => prev.filter(w => w.id !== id));

  const addProfessional = (professional: Professional) => setProfessionals(prev => [...prev, professional]);
  const updateProfessional = (updatedProfessional: Professional) => setProfessionals(prev => prev.map(p => p.id === updatedProfessional.id ? updatedProfessional : p));
  const deleteProfessional = (id: string) => setProfessionals(prev => prev.filter(p => p.id !== id));

  return (
    <DataContext.Provider value={{
      products, partners, professionals, about, history, clients, categories, subcategories, settings, works,
      addProduct, updateProduct, deleteProduct,
      addPartner, updatePartner, deletePartner,
      updateAbout, updateHistory,
      addClient, updateClient, deleteClient,
      addCategory, updateCategory, deleteCategory,
      addSubcategory, updateSubcategory, deleteSubcategory,
      updateSettings,
      addWork, updateWork, deleteWork,
      addProfessional, updateProfessional, deleteProfessional
    }}>
      {children}
    </DataContext.Provider>
  );
}
