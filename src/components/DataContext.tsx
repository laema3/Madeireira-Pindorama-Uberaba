import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Partner, Professional, AboutData, Client, Category, Subcategory, Settings, Work, ServiceArea, Post } from '../types';
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
  isInitialLoading: boolean;
  loadingProgress: number;
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
  const [initialSyncDone, setInitialSyncDone] = useState<Record<string, boolean>>({});
  const [syncErrors, setSyncErrors] = useState<Record<string, string | null>>({});
  const [user, setUser] = useState<any>(null);

  const [forceLoaded, setForceLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setForceLoaded(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const totalItemsToLoad = 12; // 9 collections + 3 documents
  const itemsLoadedCount = Object.values(initialSyncDone).filter(done => done).length;
  const loadingProgress = Math.round((itemsLoadedCount / totalItemsToLoad) * 100);
  const isInitialLoading = !forceLoaded && itemsLoadedCount < totalItemsToLoad;

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

  const handleSyncChange = (key: string, syncing: boolean, error: string | null = null, firstSync: boolean = false) => {
    setSyncingStates(prev => ({ ...prev, [key]: syncing }));
    if (firstSync) setInitialSyncDone(prev => ({ ...prev, [key]: true }));
    if (error) setSyncErrors(prev => ({ ...prev, [key]: error }));
  };

  const isSyncing = Object.values(syncingStates).some(s => s);
  const lastSyncError = Object.values(syncErrors).find(e => e !== null) || null;

  // Generic Firestore Hook for Collections
  function useFirestoreCollection<T>(collectionName: string, initialData: T[], enabled: boolean = true) {
    const [data, setData] = useState<T[]>(initialData);
    const [hasSyncedOnce, setHasSyncedOnce] = useState(false);

    useEffect(() => {
      handleSyncChange(collectionName, true);
      let unsubscribe: () => void;
      let retryCount = 0;
      const maxRetries = 3;

      const setupListener = () => {
        const q = query(collection(db, collectionName));
        unsubscribe = onSnapshot(q, (snapshot) => {
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
          setData(items);
          
          const isFirstSync = !hasSyncedOnce;
          if (isFirstSync) setHasSyncedOnce(true);
          
          handleSyncChange(collectionName, snapshot.metadata.hasPendingWrites, null, isFirstSync);
          retryCount = 0; // Reset retry count on success
        }, (error) => {
          console.error(`Error fetching ${collectionName}:`, error);
          
          // Handle connection errors with retry
          if (error.code === 'unavailable' && retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying connection for ${collectionName} (${retryCount}/${maxRetries})...`);
            setTimeout(setupListener, 2000 * retryCount); // Exponential backoff
          } else {
            handleSyncChange(collectionName, false, error.message, true);
          }
        });
      };

      if (enabled) {
        setupListener();
      } else {
        setData(initialData);
        // If disabled (like clients for non-admin), mark as done to not block loader
        handleSyncChange(collectionName, false, null, true);
      }

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }, [collectionName, enabled]);

    return [data, setData] as const;
  }

  // Generic Firestore Hook for Documents
  function useFirestoreDocument<T>(collectionName: string, docId: string, initialData: T) {
    const [data, setData] = useState<T>(initialData);
    const [hasSyncedOnce, setHasSyncedOnce] = useState(false);

    useEffect(() => {
      handleSyncChange(`${collectionName}_${docId}`, true);
      const unsubscribe = onSnapshot(doc(db, collectionName, docId), (docSnap) => {
        if (docSnap.exists()) {
          setData(docSnap.data() as T);
        } 
        
        const isFirstSync = !hasSyncedOnce;
        if (isFirstSync) setHasSyncedOnce(true);

        handleSyncChange(`${collectionName}_${docId}`, docSnap.metadata.hasPendingWrites, null, isFirstSync);
      }, (error) => {
        console.error(`Error fetching ${collectionName}/${docId}:`, error);
        handleSyncChange(`${collectionName}_${docId}`, false, error.message, true);
      });
      return () => unsubscribe();
    }, [collectionName, docId]);

    return [data, setData] as const;
  }

  // Initialize states with Firestore - Start with empty arrays instead of mock data
  const [products] = useFirestoreCollection<Product>('products', []);
  const [partners] = useFirestoreCollection<Partner>('partners', []);
  const [professionals] = useFirestoreCollection<Professional>('professionals', []);
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
      isSyncing, lastSyncError, isOnline, loadingProgress, isInitialLoading,
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
