import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { Hammer } from 'lucide-react';
import { useData } from './DataContext';

interface LoaderContextType {
  simulateLoading: (callback?: () => void) => void;
  isLoading: boolean;
  progress: number;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export function useLoader() {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
}

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(0);

  const simulateLoading = useCallback((callback?: () => void) => {
    if (isSimulating) {
      if (callback) callback();
      return;
    }
    setIsSimulating(true);
    setSimulatedProgress(0);
    
    const duration = 400;
    const interval = 20;
    const steps = duration / interval;
    const increment = 100 / steps;
    
    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(timer);
        setTimeout(() => {
          setIsSimulating(false);
          if (callback) callback();
        }, 200);
      }
      setSimulatedProgress(currentProgress);
    }, interval);
  }, [isSimulating]);

  const value = useMemo(() => ({ 
    simulateLoading, 
    isLoading: isSimulating,
    progress: Math.round(simulatedProgress)
  }), [simulateLoading, isSimulating, simulatedProgress]);

  return (
    <LoaderContext.Provider value={value}>
      {children}
    </LoaderContext.Provider>
  );
}

export function GlobalLoader() {
  const { isInitialLoading, loadingProgress } = useData();
  const { isLoading: isSimulating, progress: simulatedProgress } = useLoader();
  
  const isActuallyLoading = isInitialLoading || isSimulating;
  const rawProgress = isInitialLoading ? loadingProgress : simulatedProgress;
  const displayProgress = typeof rawProgress === 'number' && !isNaN(rawProgress) 
    ? Math.max(0, Math.min(100, rawProgress)) 
    : 0;

  if (!isActuallyLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-stone-900 flex flex-col items-center justify-center transition-opacity duration-500">
      <div className="relative flex flex-col items-center">
        <div className="bg-white p-8 rounded-full shadow-2xl mb-8 animate-bounce">
          <Hammer size={64} className="text-emerald-800" />
        </div>

        <div className="w-64 h-2 bg-stone-800 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${displayProgress}%` }}
          />
        </div>

        <div className="text-white font-bold text-2xl tracking-widest">
          {displayProgress}%
        </div>
        
        <div className="mt-2 text-stone-400 text-sm uppercase tracking-widest">
          {isInitialLoading ? 'Sincronizando Dados...' : 'Carregando Página...'}
        </div>
      </div>
    </div>
  );
}
