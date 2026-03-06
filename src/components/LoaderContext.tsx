import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hammer } from 'lucide-react';
import { useData } from './DataContext';

interface LoaderContextType {
  simulateLoading: (callback?: () => void) => void;
  isLoading: boolean;
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
  const { isInitialLoading, loadingProgress } = useData();

  const simulateLoading = (callback?: () => void) => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulatedProgress(0);
    
    const duration = 2000;
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
  };

  const isLoading = isInitialLoading || isSimulating;
  const displayProgress = isInitialLoading ? loadingProgress : Math.round(simulatedProgress);

  return (
    <LoaderContext.Provider value={{ simulateLoading, isLoading }}>
      {!isInitialLoading && children}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-stone-900 flex flex-col items-center justify-center"
          >
            <div className="relative flex flex-col items-center">
              <motion.div
                animate={{ rotate: [0, -45, 0] }}
                transition={{ 
                  duration: 0.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="bg-white p-8 rounded-full shadow-2xl mb-8"
              >
                <Hammer size={64} className="text-emerald-800" />
              </motion.div>

              <div className="w-64 h-2 bg-stone-800 rounded-full overflow-hidden mb-4">
                <motion.div 
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${displayProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white font-bold text-2xl tracking-widest"
              >
                {displayProgress}%
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-stone-400 text-sm uppercase tracking-widest"
              >
                {isInitialLoading ? 'Sincronizando Dados...' : 'Carregando Página...'}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LoaderContext.Provider>
  );
}
