import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Partner, Professional, AboutData, Client, Category, Subcategory, Settings, Work, ServiceArea, Post } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS, PARTNERS as INITIAL_PARTNERS, PROFESSIONALS as INITIAL_PROFESSIONALS } from '../data';
import { db, auth } from '../lib/firebase';
import { 
  collection, doc, onSnapshot, setDoc, addDoc, updateDoc, deleteDoc, 
  query, orderBy, Timestamp 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

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
  
  isSyncing: boolean;
  lastSyncError: string | null;
  isOnline: boolean;
  
  exportData: () => string;
  importData: (jsonData: string) => Promise<boolean>;
  forceSyncPull: () => void;
  
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

export function DataProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncingStates, setSyncingStates] = useState<Record<string, boolean>>({});
  const [syncErrors, setSyncErrors] = useState<Record<string, string | null>>({});
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleSyncChange = (key: string, syncing: boolean, error: string | null = null) => {
    setSyncingStates(prev => ({ ...prev, [key]: syncing }));
    if (error) setSyncErrors(prev => ({ ...prev, [key]: error }));
  };

  const isSyncing = Object.values(syncingStates).some(s => s);
  const lastSyncError = Object.values(syncErrors).find(e => e !== null) || null;

  // Generic Firestore Hook for Collections
  function useFirestoreCollection<T>(collectionName: string, initialData: T[], enabled: boolean = true) {
    const [data, setData] = useState<T[]>(initialData);

    useEffect(() => {
      if (!enabled) {
        setData(initialData);
        return;
      }

      handleSyncChange(collectionName, true);
      const q = query(collection(db, collectionName));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
        setData(items);
        handleSyncChange(collectionName, snapshot.metadata.hasPendingWrites);
      }, (error) => {
        console.error(`Error fetching ${collectionName}:`, error);
        handleSyncChange(collectionName, false, error.message);
      });
      return () => unsubscribe();
    }, [collectionName, enabled]);

    return [data, setData] as const;
  }

  // Generic Firestore Hook for Documents
  function useFirestoreDocument<T>(collectionName: string, docId: string, initialData: T) {
    const [data, setData] = useState<T>(initialData);

    useEffect(() => {
      handleSyncChange(collectionName, true);
      const unsubscribe = onSnapshot(doc(db, collectionName, docId), (docSnap) => {
        if (docSnap.exists()) {
          setData(docSnap.data() as T);
        } 
        // Removed auto-initialization to prevent infinite loops with security rules
        handleSyncChange(collectionName, docSnap.metadata.hasPendingWrites);
      }, (error) => {
        // Only log/show error if it's NOT a permission error on a read (which shouldn't happen for public docs, but good practice)
        // or if we really care. For now, we suppress the sync error for missing docs to avoid UI noise.
        console.error(`Error fetching ${collectionName}/${docId}:`, error);
        handleSyncChange(collectionName, false, error.message);
      });
      return () => unsubscribe();
    }, [collectionName, docId]);

    return [data, setData] as const;
  }

  // Initialize states with Firestore
  const [products] = useFirestoreCollection<Product>('products', INITIAL_PRODUCTS.map(p => ({...p, id: String(p.id)})));
  const [partners] = useFirestoreCollection<Partner>('partners', INITIAL_PARTNERS.map(p => ({...p, id: String(p.id)})));
  const [professionals] = useFirestoreCollection<Professional>('professionals', INITIAL_PROFESSIONALS.map(p => ({...p, id: String(p.id)})));
  // Only fetch clients if user is logged in (admin)
  const [clients] = useFirestoreCollection<Client>('clients', [], !!user);
  const [categories] = useFirestoreCollection<Category>('categories', []);
  const [subcategories] = useFirestoreCollection<Subcategory>('subcategories', []);
  const [works] = useFirestoreCollection<Work>('works', []);
  const [serviceAreas] = useFirestoreCollection<ServiceArea>('service_areas', []);
  const [posts] = useFirestoreCollection<Post>('posts', []);

  const [settings, setSettings] = useFirestoreDocument<Settings>('settings', 'global', {
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
    heroSlides: []
  });

  const [about, setAbout] = useFirestoreDocument<AboutData>('about', 'global', {
    title: 'Tradição e Qualidade em Madeiras',
    description: 'A Madeireira Pindorama nasceu com o propósito de oferecer o que há de melhor em madeiras nobres.',
    image: 'https://picsum.photos/seed/lumberyard/800/600'
  });

  const [history, setHistory] = useFirestoreDocument<AboutData>('history', 'global', {
    title: 'Nossa História',
    description: 'Fundada em 1995, começamos como uma pequena serraria familiar.',
    image: 'https://picsum.photos/seed/history/800/600'
  });

  // CRUD Operations
  const createCrud = <T extends { id?: string }>(collectionName: string) => ({
    add: async (item: T) => {
      try {
        await addDoc(collection(db, collectionName), item);
      } catch (error: any) {
        console.error(`Error adding to ${collectionName}:`, error);
        handleSyncChange(collectionName, false, `Erro ao adicionar: ${error.message}`);
      }
    },
    update: async (item: T) => {
      if (!item.id) return;
      try {
        const { id, ...data } = item;
        await updateDoc(doc(db, collectionName, id), data as any);
      } catch (error: any) {
        console.error(`Error updating ${collectionName}:`, error);
        handleSyncChange(collectionName, false, `Erro ao atualizar: ${error.message}`);
      }
    },
    remove: async (id: string) => {
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch (error: any) {
        console.error(`Error deleting from ${collectionName}:`, error);
        handleSyncChange(collectionName, false, `Erro ao excluir: ${error.message}`);
      }
    }
  });

  const productCrud = createCrud<Product>('products');
  const partnerCrud = createCrud<Partner>('partners');
  const clientCrud = createCrud<Client>('clients');
  const categoryCrud = createCrud<Category>('categories');
  const subcategoryCrud = createCrud<Subcategory>('subcategories');
  const workCrud = createCrud<Work>('works');
  const professionalCrud = createCrud<Professional>('professionals');
  const serviceAreaCrud = createCrud<ServiceArea>('service_areas');
  const postCrud = createCrud<Post>('posts');

  const updateSettingsFn = async (newSettings: Settings) => {
    // Optimistic update is tricky with single doc if we want to revert on error, 
    // but for now we rely on onSnapshot to fix it if it fails.
    // setSettings(newSettings); 
    try {
      await setDoc(doc(db, 'settings', 'global'), newSettings);
    } catch (error: any) {
      console.error('Error updating settings:', error);
      handleSyncChange('settings', false, `Erro ao salvar configurações: ${error.message}`);
    }
  };

  const updateAboutFn = async (newAbout: AboutData) => {
    try {
      await setDoc(doc(db, 'about', 'global'), newAbout);
    } catch (error: any) {
      console.error('Error updating about:', error);
      handleSyncChange('about', false, `Erro ao salvar Sobre Nós: ${error.message}`);
    }
  };

  const updateHistoryFn = async (newHistory: AboutData) => {
    try {
      await setDoc(doc(db, 'history', 'global'), newHistory);
    } catch (error: any) {
      console.error('Error updating history:', error);
      handleSyncChange('history', false, `Erro ao salvar História: ${error.message}`);
    }
  };

  const exportData = () => {
    return JSON.stringify({
      products, partners, professionals, about, history, clients, categories, subcategories, settings, works, serviceAreas, posts
    }, null, 2);
  };

  const importData = async (jsonData: string) => {
    // Import logic would be complex with Firestore (batch writes), skipping for now or implementing basic
    console.warn("Import not fully implemented for Firestore yet");
    return false;
  };

  const forceSyncPull = () => {
    window.location.reload();
  };

  return (
    <DataContext.Provider value={{
      products, partners, professionals, about, history, clients, categories, subcategories, settings, works, serviceAreas, posts,
      isSyncing, lastSyncError, isOnline,
      exportData, importData, forceSyncPull,
      addProduct: productCrud.add, updateProduct: productCrud.update, deleteProduct: productCrud.remove,
      addPartner: partnerCrud.add, updatePartner: partnerCrud.update, deletePartner: partnerCrud.remove,
      updateAbout: updateAboutFn, updateHistory: updateHistoryFn,
      addClient: clientCrud.add, updateClient: clientCrud.update, deleteClient: clientCrud.remove,
      addCategory: categoryCrud.add, updateCategory: categoryCrud.update, deleteCategory: categoryCrud.remove,
      addSubcategory: subcategoryCrud.add, updateSubcategory: subcategoryCrud.update, deleteSubcategory: subcategoryCrud.remove,
      updateSettings: updateSettingsFn,
      addWork: workCrud.add, updateWork: workCrud.update, deleteWork: workCrud.remove,
      addProfessional: professionalCrud.add, updateProfessional: professionalCrud.update, deleteProfessional: professionalCrud.remove,
      addServiceArea: serviceAreaCrud.add, updateServiceArea: serviceAreaCrud.update, deleteServiceArea: serviceAreaCrud.remove,
      addPost: postCrud.add, updatePost: postCrud.update, deletePost: postCrud.remove
    }}>
      {children}
    </DataContext.Provider>
  );
}
