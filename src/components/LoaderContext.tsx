import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hammer } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(false);

  const simulateLoading = (callback?: () => void) => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (callback) callback();
    }, 2000);
  };

  return (
    <LoaderContext.Provider value={{ simulateLoading, isLoading }}>
      {children}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-stone-900/80 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ rotate: [0, -45, 0] }}
              transition={{ 
                duration: 0.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="bg-white p-6 rounded-full shadow-2xl"
            >
              <Hammer size={48} className="text-emerald-800" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-white font-bold text-xl tracking-wider"
            >
              CARREGANDO...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </LoaderContext.Provider>
  );
}
