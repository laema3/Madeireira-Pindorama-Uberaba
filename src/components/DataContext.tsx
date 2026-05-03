import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback, useMemo } from 'react';
import { Product, Partner, Professional, AboutData, Client, Category, Subcategory, Settings, Work, ServiceArea, Post, SystemUser, Lead } from '../types';

import { db, auth } from '../lib/firebase';
import { 
  collection, doc, onSnapshot, setDoc, addDoc, updateDoc, deleteDoc, 
  query, orderBy, Timestamp 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  message: string;
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const rawError = error instanceof Error ? error.message : String(error);
  let ptMessage = 'Ocorreu um erro ao processar os dados no servidor.';
  
  if (rawError.includes('Missing or insufficient permissions')) {
    ptMessage = 'Permissão negada pelo servidor. Certifique-se de estar logado como um usuário autorizado e que seu e-mail do Google esteja verificado.';
  } else if (rawError.includes('Quota exceeded') || rawError.includes('resource-exhausted')) {
    ptMessage = 'Limite de uso diário do Google excedido. O sistema voltará ao normal em breve.';
  } else if (rawError.includes('offline') || rawError.includes('unavailable')) {
    ptMessage = 'Erro de conexão. Verifique sua internet.';
  }

  const errInfo: FirestoreErrorInfo = {
    message: ptMessage,
    error: rawError,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return JSON.stringify(errInfo);
}

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
  leads: Lead[];
  
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

  addLead: (lead: Lead) => void;
  updateLead: (lead: Lead) => void;
  deleteLead: (id: string) => void;

  users: SystemUser[];
  addUser: (user: SystemUser) => void;
  updateUser: (user: SystemUser) => void;
  deleteUser: (id: string) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Generic Firestore Hook for Collections
function useFirestoreCollection<T>(
  collectionName: string, 
  initialData: T[], 
  handleSyncChange: (key: string, syncing: boolean, error?: string | null, firstSync?: boolean) => void,
  saveToCache: (key: string, data: any) => void,
  loadFromCache: (key: string) => any,
  pendingDeletionsRef: React.MutableRefObject<Record<string, Set<string>>>,
  setPendingDeletions: React.Dispatch<React.SetStateAction<Record<string, Set<string>>>>,
  enabled: boolean = true
) {
  const [data, setData] = useState<T[]>(() => {
    try {
      const cached = loadFromCache(collectionName);
      if (Array.isArray(cached)) return cached;
    } catch (e) {
      console.warn(`Failed to load ${collectionName} from cache`, e);
    }
    return initialData;
  });
  
  const hasSyncedOnce = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!enabled) {
      handleSyncChange(collectionName, false, null, true);
      return;
    }

    handleSyncChange(collectionName, true);
    let unsubscribe: (() => void) | undefined;
    let retryCount = 0;
    const maxRetries = 3;

    const setupListener = () => {
      if (!mountedRef.current) return;

      try {
        const q = query(collection(db, collectionName));
        unsubscribe = onSnapshot(q, (snapshot) => {
          if (!mountedRef.current) return;

          let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
          const isFromServer = !snapshot.metadata.fromCache;
          
          // Filter out pending deletions
          const pending = pendingDeletionsRef.current[collectionName];
          if (pending && pending.size > 0) {
            const stillPending = new Set(pending);
            let changed = false;

            if (isFromServer) {
              for (const id of Array.from(stillPending)) {
                if (!items.some(item => (item as any).id === id)) {
                  stillPending.delete(id);
                  changed = true;
                }
              }
            }

            if (changed) {
              setPendingDeletions(prev => ({ ...prev, [collectionName]: stillPending }));
            }

            items = items.filter(item => !stillPending.has((item as any).id));
          }

          // Sort items
          if (['categories', 'subcategories', 'products'].includes(collectionName)) {
            items.sort((a: any, b: any) => {
              const nameA = String(a.name || a.title || '').toLowerCase();
              const nameB = String(b.name || b.title || '').toLowerCase();
              return nameA.localeCompare(nameB);
            });
          }

          setData(items);
          saveToCache(collectionName, items);
          
          const isFirst = !hasSyncedOnce.current;
          if (isFirst) {
            hasSyncedOnce.current = true;
          }
          
          handleSyncChange(collectionName, snapshot.metadata.hasPendingWrites, null, isFirst);
          retryCount = 0; 
        }, (error) => {
          if (!mountedRef.current) return;

          const errJson = handleFirestoreError(error, OperationType.GET, collectionName);
          const isFirst = !hasSyncedOnce.current;
          
          if (error.code === 'resource-exhausted' || error.message.includes('Quota')) {
            const cached = loadFromCache(collectionName);
            if (cached) setData(cached);
            handleSyncChange(collectionName, false, null, true);
            return;
          }

          if (error.code === 'unavailable' && retryCount < maxRetries) {
            retryCount++;
            setTimeout(setupListener, 2000 * retryCount);
          } else {
            handleSyncChange(collectionName, false, errJson, isFirst);
          }
        });
      } catch (err) {
        console.error(`Error setting up listener for ${collectionName}:`, err);
        handleSyncChange(collectionName, false, null, true); // Don't block forever
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [collectionName, enabled, handleSyncChange, saveToCache, loadFromCache, pendingDeletionsRef, setPendingDeletions]);

  return [data, setData] as const;
}

// Generic Firestore Hook for Documents
function useFirestoreDocument<T>(
  collectionName: string, 
  docId: string, 
  initialData: T,
  handleSyncChange: (key: string, syncing: boolean, error?: string | null, firstSync?: boolean) => void,
  saveToCache: (key: string, data: any) => void,
  loadFromCache: (key: string) => any
) {
  const cacheKey = useMemo(() => `${collectionName}_${docId}`, [collectionName, docId]);
  const [data, setData] = useState<T>(() => {
    try {
      const cached = loadFromCache(cacheKey);
      if (cached) return cached;
    } catch (e) {}
    return initialData;
  });
  
  const hasSyncedOnce = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!mountedRef.current) return;
    
    handleSyncChange(cacheKey, true);
    
    let unsubscribe: () => void;
    
    try {
      unsubscribe = onSnapshot(doc(db, collectionName, docId), (docSnap) => {
        if (!mountedRef.current) return;
        
        const isFirst = !hasSyncedOnce.current;

        if (docSnap.exists()) {
          const docData = docSnap.data() as T;
          setData(docData);
          saveToCache(cacheKey, docData);
        }
        
        if (isFirst) {
          hasSyncedOnce.current = true;
        }

        handleSyncChange(cacheKey, docSnap.metadata.hasPendingWrites, null, isFirst);
      }, (error) => {
        if (!mountedRef.current) return;
        
        const errJson = handleFirestoreError(error, OperationType.GET, `${collectionName}/${docId}`);
        const isFirst = !hasSyncedOnce.current;
        
        if (error.code === 'resource-exhausted' || error.message.includes('Quota')) {
          const cached = loadFromCache(cacheKey);
          if (cached) setData(cached);
          handleSyncChange(cacheKey, false, null, true);
          return;
        }

        handleSyncChange(cacheKey, false, errJson, isFirst);
      });
    } catch (err) {
      console.error(`Error setting up document listener for ${cacheKey}:`, err);
      handleSyncChange(cacheKey, false, null, true);
    }
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [collectionName, docId, cacheKey, handleSyncChange, saveToCache, loadFromCache]);

  return [data, setData] as const;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncingStates, setSyncingStates] = useState<Record<string, boolean>>({});
  const [initialSyncDone, setInitialSyncDone] = useState<Record<string, boolean>>({});
  const [syncErrors, setSyncErrors] = useState<Record<string, string | null>>({});
  const [user, setUser] = useState<any>(null);

  const [forceLoaded, setForceLoaded] = useState(false);

  const totalItemsToLoad = 14; 
  const itemsLoadedCount = Object.values(initialSyncDone).filter(done => done).length;
  const loadingProgress = Math.min(100, Math.round((itemsLoadedCount / totalItemsToLoad) * 100));
  
  // More aggressive timeouts for the initial loader
  const [hasTimedOutShort, setHasTimedOutShort] = useState(false);
  
  useEffect(() => {
    // If after 3 seconds we have at least 1 item, or after 6 seconds regardless, show the app
    const shortTimer = setTimeout(() => setHasTimedOutShort(true), 3000);
    const forceTimer = setTimeout(() => setForceLoaded(true), 6000);
    return () => {
      clearTimeout(shortTimer);
      clearTimeout(forceTimer);
    };
  }, []);

  const isInitialLoading = !forceLoaded && !(hasTimedOutShort || itemsLoadedCount >= totalItemsToLoad);

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
      if (u) {
        console.log(`[Auth] User logged in: ${u.email} (Verified: ${u.emailVerified})`);
      } else {
        console.log('[Auth] User logged out');
      }
    });
    return () => unsubscribe();
  }, []);

  const pendingDeletionsRef = useRef<Record<string, Set<string>>>({});
  const [pendingDeletions, setPendingDeletions] = useState<Record<string, Set<string>>>(() => {
    try {
      const saved = localStorage.getItem('pending_deletions');
      if (saved) {
        const parsed = JSON.parse(saved);
        const result: Record<string, Set<string>> = {};
        for (const key in parsed) {
          result[key] = new Set(parsed[key]);
        }
        return result;
      }
    } catch (e) {
      console.warn('Failed to load pending deletions from cache:', e);
    }
    return {};
  });

  // Sync ref and localStorage with state
  useEffect(() => {
    pendingDeletionsRef.current = pendingDeletions;
    try {
      const toSave: Record<string, string[]> = {};
      for (const key in pendingDeletions) {
        if (pendingDeletions[key].size > 0) {
          toSave[key] = Array.from(pendingDeletions[key]);
        }
      }
      localStorage.setItem('pending_deletions', JSON.stringify(toSave));
    } catch (e) {
      console.warn('Failed to save pending deletions to cache:', e);
    }
  }, [pendingDeletions]);

  const handleSyncChange = useCallback((key: string, syncing: boolean, error: string | null = null, firstSync: boolean = false) => {
    setSyncingStates(prev => ({ ...prev, [key]: syncing }));
    if (firstSync) setInitialSyncDone(prev => ({ ...prev, [key]: true }));
    if (error) setSyncErrors(prev => ({ ...prev, [key]: error }));
  }, []);

  const isSyncing = Object.values(syncingStates).some(s => s);
  const lastSyncError = Object.values(syncErrors).find(e => e !== null) || null;

  // Helper to save to cache
  const saveToCache = useCallback((key: string, data: any) => {
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Failed to save to cache:', e);
    }
  }, []);

  // Helper to load from cache
  const loadFromCache = useCallback((key: string) => {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (cached) {
        return JSON.parse(cached).data;
      }
    } catch (e) {
      console.warn('Failed to load from cache:', e);
    }
    return null;
  }, []);


  // Initialize states with Firestore
  const [products, setProducts] = useFirestoreCollection<Product>('products', [], handleSyncChange, saveToCache, loadFromCache, pendingDeletionsRef, setPendingDeletions);
  const [partners, setPartners] = useFirestoreCollection<Partner>('partners', [], handleSyncChange, saveToCache, loadFromCache, pendingDeletionsRef, setPendingDeletions);
  const [professionals, setProfessionals] = useFirestoreCollection<Professional>('professionals', [], handleSyncChange, saveToCache, loadFromCache, pendingDeletionsRef, setPendingDeletions);
  const [clients, setClients] = useFirestoreCollection<Client>('clients', [], handleSyncChange, saveToCache, loadFromCache, pendingDeletionsRef, setPendingDeletions, !!user);
  const [categories, setCategories] = useFirestoreCollection<Category>('categories', [], handleSyncChange, saveToCache, loadFromCache, pendingDeletionsRef, setPendingDeletions);
  const [subcategories, setSubcategories] = useFirestoreCollection<Subcategory>('subcategories', [], handleSyncChange, saveToCache, loadFromCache, pendingDeletionsRef, setPendingDeletions);
  const [works, setWorks] = useFirestoreCollection<Work>('works', [], handleSyncChange, saveToCache, loadFromCache, pendingDeletionsRef, setPendingDeletions);
  const [serviceAreas, setServiceAreas] = useFirestoreCollection<ServiceArea>('service_areas', [], handleSyncChange, saveToCache, loadFromCache, pendingDeletionsRef, setPendingDeletions);
  const [posts, setPosts] = useFirestoreCollection<Post>('posts', [], handleSyncChange, saveToCache, loadFromCache, pendingDeletionsRef, setPendingDeletions);
  const [leads, setLeads] = useFirestoreCollection<Lead>('leads', [], handleSyncChange, saveToCache, loadFromCache, pendingDeletionsRef, setPendingDeletions, !!user);
  const [users, setUsers] = useFirestoreCollection<SystemUser>('users', [], handleSyncChange, saveToCache, loadFromCache, pendingDeletionsRef, setPendingDeletions, !!user);

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
    adminUser: 'contato@madeireirapindorama.com.br',
    adminPassword: 'mad*2026',
    heroSlides: [],
    heroBgUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=2070&auto=format&fit=crop',
    maintenanceMode: false
  }, handleSyncChange, saveToCache, loadFromCache);

  const [about, setAbout] = useFirestoreDocument<AboutData>('about', 'global', {
    title: 'Tradição e Qualidade em Madeiras',
    description: 'A Madeireira Pindorama nasceu com o propósito de oferecer o que há de melhor em madeiras nobres.',
    image: 'https://picsum.photos/seed/lumberyard/800/600'
  }, handleSyncChange, saveToCache, loadFromCache);

  const [history, setHistory] = useFirestoreDocument<AboutData>('history', 'global', {
    title: 'Nossa História',
    description: 'Fundada em 1995, começamos como uma pequena serraria familiar.',
    image: 'https://picsum.photos/seed/history/800/600'
  }, handleSyncChange, saveToCache, loadFromCache);

  // Helper to remove undefined values before sending to Firestore
  const sanitizeForFirestore = (data: any) => {
    const sanitized = { ...data };
    Object.keys(sanitized).forEach(key => {
      if (sanitized[key] === undefined) {
        sanitized[key] = null;
      }
    });
    return sanitized;
  };

  // CRUD Operations Factory
  const createCrud = useCallback(<T extends { id?: string }>(collectionName: string, setData: React.Dispatch<React.SetStateAction<T[]>>) => ({
    add: async (item: T) => {
      const id = item.id || Date.now().toString();
      const newItem = { ...item, id };
      
      console.log(`[CRUD] Adding to ${collectionName}:`, newItem);
      
      // Optimistic update
      setData(prev => [...prev, newItem]);
      
      try {
        const { id: _, ...data } = newItem;
        const sanitizedData = sanitizeForFirestore(data);
        await setDoc(doc(db, collectionName, id), sanitizedData as any);
        console.log(`[CRUD] Successfully added to ${collectionName}`);
        handleSyncChange(collectionName, false, null); // Clear error on success
      } catch (error: any) {
        console.error(`[CRUD] Error adding to ${collectionName}:`, error);
        // Rollback
        setData(prev => prev.filter(i => i.id !== id));
        const errJson = handleFirestoreError(error, OperationType.CREATE, collectionName);
        handleSyncChange(collectionName, false, errJson);
        throw new Error(errJson);
      }
    },
    update: async (item: T) => {
      if (!item.id) return;
      
      console.log(`[CRUD] Updating in ${collectionName}:`, item);
      
      // Optimistic update
      setData(prev => prev.map(i => i.id === item.id ? item : i));
      
      try {
        const { id, ...data } = item;
        const sanitizedData = sanitizeForFirestore(data);
        await setDoc(doc(db, collectionName, id), sanitizedData as any, { merge: true });
        console.log(`[CRUD] Successfully updated in ${collectionName}`);
        handleSyncChange(collectionName, false, null); // Clear error on success
      } catch (error: any) {
        console.error(`[CRUD] Error updating in ${collectionName}:`, error);
        const errJson = handleFirestoreError(error, OperationType.UPDATE, `${collectionName}/${item.id}`);
        handleSyncChange(collectionName, false, errJson);
        throw new Error(errJson);
      }
    },
    remove: async (id: string) => {
      console.log(`[CRUD] Removing from ${collectionName}:`, id);
      
      // Add to pending deletions
      setPendingDeletions(prev => {
        const newSet = new Set(prev[collectionName] || []);
        newSet.add(id);
        return { ...prev, [collectionName]: newSet };
      });

      // Capture current state for rollback BEFORE updating
      let previousData: T[] = [];
      setData(prev => {
        previousData = [...prev];
        return prev.filter(item => item.id !== id);
      });
      
      try {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
        
        // Update cache immediately
        const currentCached = loadFromCache(collectionName);
        if (Array.isArray(currentCached)) {
          const newCached = currentCached.filter((i: any) => i.id !== id);
          saveToCache(collectionName, newCached);
        }
        
        console.log(`[CRUD] Successfully removed from ${collectionName} with ID: ${id}`);
        handleSyncChange(collectionName, false, null);
        return true; // Success
      } catch (error: any) {
        console.error(`[CRUD] Error removing from ${collectionName}:`, id, error);
        
        // Remove from pending deletions on error since it failed
        setPendingDeletions(prev => {
          const newSet = new Set(prev[collectionName] || []);
          newSet.delete(id);
          return { ...prev, [collectionName]: newSet };
        });

        // Rollback on failure
        if (previousData && previousData.length > 0) {
          setData(previousData);
        }
        const errJson = handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
        handleSyncChange(collectionName, false, errJson);
        throw error; // Re-throw to be handled by UI
      }
    }
  }), [handleSyncChange, loadFromCache, saveToCache]);

  const productCrud = useMemo(() => createCrud<Product>('products', setProducts), [createCrud, setProducts]);
  const partnerCrud = useMemo(() => createCrud<Partner>('partners', setPartners), [createCrud, setPartners]);
  const clientCrud = useMemo(() => createCrud<Client>('clients', setClients), [createCrud, setClients]);
  const categoryCrud = useMemo(() => createCrud<Category>('categories', setCategories), [createCrud, setCategories]);
  const subcategoryCrud = useMemo(() => createCrud<Subcategory>('subcategories', setSubcategories), [createCrud, setSubcategories]);
  const workCrud = useMemo(() => createCrud<Work>('works', setWorks), [createCrud, setWorks]);
  const professionalCrud = useMemo(() => createCrud<Professional>('professionals', setProfessionals), [createCrud, setProfessionals]);
  const serviceAreaCrud = useMemo(() => createCrud<ServiceArea>('service_areas', setServiceAreas), [createCrud, setServiceAreas]);
  const postCrud = useMemo(() => createCrud<Post>('posts', setPosts), [createCrud, setPosts]);
  const leadCrud = useMemo(() => createCrud<Lead>('leads', setLeads), [createCrud, setLeads]);
  const baseUserCrud = useMemo(() => createCrud<SystemUser>('users', setUsers), [createCrud, setUsers]);
  
  const userCrud = useMemo(() => ({
    ...baseUserCrud,
    add: (user: SystemUser) => baseUserCrud.add({ ...user, id: user.email.toLowerCase() })
  }), [baseUserCrud]);

  const updateSettingsFn = useCallback(async (newSettings: Settings) => {
    try {
      const sanitized = sanitizeForFirestore(newSettings);
      await setDoc(doc(db, 'settings', 'global'), sanitized as any);
    } catch (error: any) {
      const errJson = handleFirestoreError(error, OperationType.WRITE, 'settings/global');
      handleSyncChange('settings', false, errJson);
      throw new Error(errJson);
    }
  }, [handleSyncChange]);

  const updateAboutFn = useCallback(async (newAbout: AboutData) => {
    try {
      const sanitized = sanitizeForFirestore(newAbout);
      await setDoc(doc(db, 'about', 'global'), sanitized as any);
    } catch (error: any) {
      const errJson = handleFirestoreError(error, OperationType.WRITE, 'about/global');
      handleSyncChange('about', false, errJson);
      throw new Error(errJson);
    }
  }, [handleSyncChange]);

  const updateHistoryFn = useCallback(async (newHistory: AboutData) => {
    try {
      const sanitized = sanitizeForFirestore(newHistory);
      await setDoc(doc(db, 'history', 'global'), sanitized as any);
    } catch (error: any) {
      const errJson = handleFirestoreError(error, OperationType.WRITE, 'history/global');
      handleSyncChange('history', false, errJson);
      throw new Error(errJson);
    }
  }, [handleSyncChange]);

  const exportData = useCallback(() => {
    return JSON.stringify({
      products, partners, professionals, about, history, clients, categories, subcategories, settings, works, serviceAreas, posts, users, leads
    }, null, 2);
  }, [products, partners, professionals, about, history, clients, categories, subcategories, settings, works, serviceAreas, posts, users, leads]);

  const importData = useCallback(async (jsonData: string) => {
    // Import logic would be complex with Firestore (batch writes), skipping for now or implementing basic
    console.warn("Import not fully implemented for Firestore yet");
    return false;
  }, []);

  const forceSyncPull = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    console.log("DataProvider: Loading status", { 
      itemsLoadedCount, 
      totalItemsToLoad, 
      isInitialLoading, 
      hasTimedOutShort,
      online: isOnline
    });
  }, [itemsLoadedCount, totalItemsToLoad, isInitialLoading, hasTimedOutShort, isOnline]);

  const value = useMemo(() => ({
    products, partners, professionals, about, history, clients, categories, subcategories, settings, works, serviceAreas, posts, users, leads,
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
    addPost: postCrud.add, updatePost: postCrud.update, deletePost: postCrud.remove,
    addUser: userCrud.add, updateUser: userCrud.update, deleteUser: userCrud.remove,
    addLead: leadCrud.add, updateLead: leadCrud.update, deleteLead: leadCrud.remove,
  }), [
    products, partners, professionals, about, history, clients, categories, subcategories, settings, works, serviceAreas, posts, users, leads,
    isSyncing, lastSyncError, isOnline, loadingProgress, isInitialLoading,
    exportData, importData, forceSyncPull,
    productCrud, partnerCrud, updateAboutFn, updateHistoryFn, clientCrud, categoryCrud, subcategoryCrud, updateSettingsFn, workCrud, professionalCrud, serviceAreaCrud, postCrud, userCrud, leadCrud
  ]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
