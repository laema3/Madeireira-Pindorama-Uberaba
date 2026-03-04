import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Partner, Professional, AboutData, Client, Category, Subcategory, Settings, Work, ServiceArea, Post } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS, PARTNERS as INITIAL_PARTNERS, PROFESSIONALS as INITIAL_PROFESSIONALS } from '../data';
import { supabase } from '../lib/supabase';

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
  serviceAreas: ServiceArea[];
  posts: Post[];
  
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

  addServiceArea: (serviceArea: ServiceArea) => void;
  updateServiceArea: (serviceArea: ServiceArea) => void;
  deleteServiceArea: (id: string) => void;

  addPost: (post: Post) => void;
  updatePost: (post: Post) => void;
  deletePost: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Helper hook for persistence (Backend + LocalStorage Fallback)
function usePersistedState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try backend first
        const response = await fetch(`/api/data/${key}`);
        if (response.ok) {
          const data = await response.json();
          if (data !== null) {
            setState(data);
          } else {
            // If not in backend, check localStorage
            const item = localStorage.getItem(key);
            if (item) setState(JSON.parse(item));
          }
        } else {
          // Fallback to localStorage if response not ok
          const item = localStorage.getItem(key);
          if (item) setState(JSON.parse(item));
        }
      } catch (error) {
        console.error(`Error loading data for ${key}:`, error);
        // Fallback to localStorage
        const item = localStorage.getItem(key);
        if (item) setState(JSON.parse(item));
      } finally {
        setIsInitialized(true);
      }
    };
    loadData();
  }, [key]);

  // Save on change
  useEffect(() => {
    if (!isInitialized) return;

    const saveData = async () => {
      try {
        const serialized = JSON.stringify(state);
        
        // Save to localStorage
        localStorage.setItem(key, serialized);
        
        // Save to backend
        await fetch(`/api/data/${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: serialized
        });
      } catch (error) {
        console.error(`Error saving data for ${key}:`, error);
      }
    };
    
    // Debounce save to avoid too many requests
    const timer = setTimeout(saveData, 500);
    return () => clearTimeout(timer);
  }, [key, state, isInitialized]);

  return [state, setState];
}

export function DataProvider({ children }: { children: ReactNode }) {
  const isSupabaseConfigured = Boolean((import.meta as any).env.VITE_SUPABASE_URL && (import.meta as any).env.VITE_SUPABASE_ANON_KEY);

  // Initialize states
  const [products, setProducts] = usePersistedState<Product[]>('products', 
    INITIAL_PRODUCTS.map(p => ({
      ...p,
      id: String(p.id),
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
    image: 'https://picsum.photos/seed/history/800/600',
    videoUrl: ''
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
    logoUrl: '',
    footerLogoUrl: '',
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
    ],
    heroSlides: [
      { url: 'https://picsum.photos/seed/lumber1/1920/1080', title: 'Madeiras Nobres', description: 'Qualidade e procedência garantida para o seu projeto.' },
      { url: 'https://picsum.photos/seed/lumber2/1920/1080', title: 'Estruturas Completas', description: 'Tudo o que você precisa para a sua obra.' },
      { url: 'https://picsum.photos/seed/lumber3/1920/1080', title: 'Acabamentos Finos', description: 'Detalhes que fazem a diferença.' },
      { url: 'https://picsum.photos/seed/lumber4/1920/1080', title: 'Sustentabilidade', description: 'Madeira de reflorestamento e manejo sustentável.' },
      { url: 'https://picsum.photos/seed/lumber5/1920/1080', title: 'Atendimento Especializado', description: 'Nossa equipe está pronta para te ajudar.' }
    ]
  });

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

  const [serviceAreas, setServiceAreas] = usePersistedState<ServiceArea[]>('serviceAreas', []);
  const [posts, setPosts] = usePersistedState<Post[]>('posts', []);

  // Ensure admin credentials exist (migration for existing users)
  useEffect(() => {
    if (!settings.adminUser || !settings.adminPassword || !settings.heroImages || !settings.heroSlides) {
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
        ],
        heroSlides: prev.heroSlides || (prev.heroImages ? prev.heroImages.map((url, i) => ({
          url,
          title: i === 0 ? 'Madeiras Nobres' : i === 1 ? 'Estruturas Completas' : i === 2 ? 'Acabamentos Finos' : i === 3 ? 'Sustentabilidade' : 'Atendimento Especializado',
          description: i === 0 ? 'Qualidade e procedência garantida para o seu projeto.' : i === 1 ? 'Tudo o que você precisa para a sua obra.' : i === 2 ? 'Detalhes que fazem a diferença.' : i === 3 ? 'Madeira de reflorestamento e manejo sustentável.' : 'Nossa equipe está pronta para te ajudar.'
        })) : [
          { url: 'https://picsum.photos/seed/lumber1/1920/1080', title: 'Madeiras Nobres', description: 'Qualidade e procedência garantida para o seu projeto.' },
          { url: 'https://picsum.photos/seed/lumber2/1920/1080', title: 'Estruturas Completas', description: 'Tudo o que você precisa para a sua obra.' },
          { url: 'https://picsum.photos/seed/lumber3/1920/1080', title: 'Acabamentos Finos', description: 'Detalhes que fazem a diferença.' },
          { url: 'https://picsum.photos/seed/lumber4/1920/1080', title: 'Sustentabilidade', description: 'Madeira de reflorestamento e manejo sustentável.' },
          { url: 'https://picsum.photos/seed/lumber5/1920/1080', title: 'Atendimento Especializado', description: 'Nossa equipe está pronta para te ajudar.' }
        ])
      }));
    }
  }, [settings.adminUser, settings.adminPassword, settings.heroImages, settings.heroSlides, setSettings]);

  // Supabase Fetch Effect
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const fetchSupabaseData = async () => {
      try {
        const [
          { data: prodData }, { data: partData }, { data: cliData },
          { data: catData }, { data: subData }, { data: workData },
          { data: profData }, { data: setData }, { data: abtData }, { data: histData },
          { data: saData }, { data: postData }
        ] = await Promise.all([
          supabase.from('products').select('*'),
          supabase.from('partners').select('*'),
          supabase.from('clients').select('*'),
          supabase.from('categories').select('*'),
          supabase.from('subcategories').select('*'),
          supabase.from('works').select('*'),
          supabase.from('professionals').select('*'),
          supabase.from('settings').select('*').limit(1).maybeSingle(),
          supabase.from('about').select('*').limit(1).maybeSingle(),
          supabase.from('history').select('*').limit(1).maybeSingle(),
          supabase.from('service_areas').select('*'),
          supabase.from('posts').select('*')
        ]);

        if (prodData && prodData.length > 0) setProducts(prodData);
        if (partData && partData.length > 0) setPartners(partData);
        if (cliData && cliData.length > 0) setClients(cliData);
        if (catData && catData.length > 0) setCategories(catData);
        if (subData && subData.length > 0) setSubcategories(subData);
        if (workData && workData.length > 0) setWorks(workData);
        if (profData && profData.length > 0) setProfessionals(profData);
        if (saData && saData.length > 0) setServiceAreas(saData);
        if (postData && postData.length > 0) setPosts(postData);
        
        if (setData) setSettings(setData);
        if (abtData) setAbout(abtData);
        if (histData) setHistory(histData);
      } catch (error) {
        console.error("Error fetching from Supabase:", error);
      }
    };

    fetchSupabaseData();
  }, [isSupabaseConfigured]);

  // --- CRUD Operations ---
  const createCrud = <T extends { id?: string }>(table: string, stateSetter: React.Dispatch<React.SetStateAction<T[]>>) => ({
    add: async (item: T) => {
      const newItem = { ...item, id: item.id || Date.now().toString() };
      // Update local state immediately (optimistic)
      stateSetter(prev => [...prev, newItem]);
      
      if (isSupabaseConfigured) {
        const { error } = await supabase.from(table).insert([newItem]);
        if (error) console.error(`Error adding to ${table} in Supabase:`, error);
      }
    },
    update: async (item: T) => {
      // Update local state immediately (optimistic)
      stateSetter(prev => prev.map(i => i.id === item.id ? item : i));
      
      if (isSupabaseConfigured) {
        const { error } = await supabase.from(table).update(item as any).eq('id', item.id);
        if (error) console.error(`Error updating ${table} in Supabase:`, error);
      }
    },
    remove: async (id: string) => {
      // Update local state immediately (optimistic)
      stateSetter(prev => prev.filter(i => i.id !== id));
      
      if (isSupabaseConfigured) {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) console.error(`Error deleting from ${table} in Supabase:`, error);
      }
    }
  });

  const productCrud = createCrud<Product>('products', setProducts);
  const partnerCrud = createCrud<Partner>('partners', setPartners);
  const clientCrud = createCrud<Client>('clients', setClients);
  const categoryCrud = createCrud<Category>('categories', setCategories);
  const subcategoryCrud = createCrud<Subcategory>('subcategories', setSubcategories);
  const workCrud = createCrud<Work>('works', setWorks);
  const professionalCrud = createCrud<Professional>('professionals', setProfessionals);
  const serviceAreaCrud = createCrud<ServiceArea>('service_areas', setServiceAreas);
  const postCrud = createCrud<Post>('posts', setPosts);

  const updateSettings = async (newSettings: Settings) => {
    setSettings(newSettings);
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('settings').upsert({ ...newSettings, id: '1' });
      if (error) console.error('Error updating settings in Supabase:', error);
    }
  };

  const updateAbout = async (newAbout: AboutData) => {
    setAbout(newAbout);
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('about').upsert({ ...newAbout, id: '1' });
      if (error) console.error('Error updating about in Supabase:', error);
    }
  };

  const updateHistory = async (newHistory: AboutData) => {
    setHistory(newHistory);
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('history').upsert({ ...newHistory, id: '1' });
      if (error) console.error('Error updating history in Supabase:', error);
    }
  };

  return (
    <DataContext.Provider value={{
      products, partners, professionals, about, history, clients, categories, subcategories, settings, works, serviceAreas, posts,
      addProduct: productCrud.add, updateProduct: productCrud.update, deleteProduct: productCrud.remove,
      addPartner: partnerCrud.add, updatePartner: partnerCrud.update, deletePartner: partnerCrud.remove,
      updateAbout, updateHistory,
      addClient: clientCrud.add, updateClient: clientCrud.update, deleteClient: clientCrud.remove,
      addCategory: categoryCrud.add, updateCategory: categoryCrud.update, deleteCategory: categoryCrud.remove,
      addSubcategory: subcategoryCrud.add, updateSubcategory: subcategoryCrud.update, deleteSubcategory: subcategoryCrud.remove,
      updateSettings,
      addWork: workCrud.add, updateWork: workCrud.update, deleteWork: workCrud.remove,
      addProfessional: professionalCrud.add, updateProfessional: professionalCrud.update, deleteProfessional: professionalCrud.remove,
      addServiceArea: serviceAreaCrud.add, updateServiceArea: serviceAreaCrud.update, deleteServiceArea: serviceAreaCrud.remove,
      addPost: postCrud.add, updatePost: postCrud.update, deletePost: postCrud.remove
    }}>
      {children}
    </DataContext.Provider>
  );
}
