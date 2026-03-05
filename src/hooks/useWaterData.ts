import { useState, useEffect } from 'react';
import { startOfDay, format, subDays, isSameDay } from 'date-fns';

export interface WaterEntry {
  id: string;
  amount: number; // in oz
  timestamp: number;
}

export function useWaterData() {
  const [entries, setEntries] = useState<WaterEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    fetch('/api/data/water_entries')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          setEntries(data);
        }
      })
      .catch(err => console.error('Failed to load water data:', err))
      .finally(() => setLoading(false));
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (loading) return; // Don't save while initially loading
    
    fetch('/api/data/water_entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entries)
    }).catch(err => console.error('Failed to save water data:', err));
  }, [entries, loading]);

  const addWater = (amount: number) => {
    const newEntry: WaterEntry = {
      id: crypto.randomUUID(),
      amount,
      timestamp: Date.now(),
    };
    setEntries(prev => [...prev, newEntry]);
  };

  const removeWater = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const getTodayTotal = () => {
    const today = startOfDay(new Date()).getTime();
    return entries
      .filter(e => e.timestamp >= today)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getWeeklyHistory = () => {
    const history = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dayTotal = entries
        .filter(e => isSameDay(new Date(e.timestamp), date))
        .reduce((sum, e) => sum + e.amount, 0);
        
      history.push({
        date: format(date, 'EEE'), // Mon, Tue, etc.
        fullDate: format(date, 'MMM d'),
        amount: dayTotal
      });
    }
    
    return history;
  };

  return {
    entries,
    addWater,
    removeWater,
    getTodayTotal,
    getWeeklyHistory,
    loading
  };
}
