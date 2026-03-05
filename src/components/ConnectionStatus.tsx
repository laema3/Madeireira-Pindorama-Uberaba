import React from 'react';
import { useData } from './DataContext';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export function ConnectionStatus() {
  const { isOnline, isSyncing, lastSyncError } = useData();

  if (!isOnline) {
    return (
      <div className="fixed bottom-6 left-24 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50 text-sm font-medium animate-pulse">
        <WifiOff size={16} />
        <span>Offline</span>
      </div>
    );
  }

  if (lastSyncError) {
    return (
      <div className="fixed bottom-6 left-24 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50 text-sm font-medium" title={lastSyncError}>
        <WifiOff size={16} />
        <span>Erro de Sincronização</span>
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div className="fixed bottom-6 left-24 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50 text-sm font-medium">
        <RefreshCw size={16} className="animate-spin" />
        <span>Sincronizando...</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-24 bg-green-600 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 z-50 text-xs font-medium opacity-75 hover:opacity-100 transition-opacity">
      <Wifi size={14} />
      <span>Online</span>
    </div>
  );
}
