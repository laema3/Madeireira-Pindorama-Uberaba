import React from 'react';
import { useWaterData } from '../hooks/useWaterData';
import { HistoryChart } from './HistoryChart';
import { Droplet, Plus, History, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const DAILY_GOAL = 64; // oz

export function WaterTracker() {
  const { entries, addWater, removeWater, getTodayTotal, getWeeklyHistory, loading } = useWaterData();
  const todayTotal = getTodayTotal();
  const progress = Math.min((todayTotal / DAILY_GOAL) * 100, 100);
  
  const todayEntries = entries
    .filter(e => e.timestamp >= new Date().setHours(0,0,0,0))
    .sort((a, b) => b.timestamp - a.timestamp);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
        <p>Loading your hydration data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Water Tracker</h1>
        <p className="text-slate-500">Stay hydrated, stay healthy.</p>
      </div>

      {/* Progress Circle / Main Display */}
      <div className="relative flex justify-center items-center py-8">
        <svg className="w-64 h-64 transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            className="stroke-slate-100"
            strokeWidth="16"
            fill="none"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            className="stroke-blue-500 transition-all duration-1000 ease-out"
            strokeWidth="16"
            fill="none"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <Droplet className="w-10 h-10 text-blue-500 mb-2" fill="currentColor" />
          <span className="text-5xl font-bold text-slate-800">{todayTotal}</span>
          <span className="text-slate-500 font-medium">/ {DAILY_GOAL} oz</span>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-3 gap-4">
        {[8, 12, 16].map(amount => (
          <button
            key={amount}
            onClick={() => addWater(amount)}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors active:scale-95"
          >
            <Plus className="w-6 h-6 mb-1" />
            <span className="font-bold text-lg">{amount}</span>
            <span className="text-xs font-medium opacity-80">oz</span>
          </button>
        ))}
      </div>

      {/* History Chart */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6">
          <History className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-800">Last 7 Days</h2>
        </div>
        <HistoryChart data={getWeeklyHistory()} />
      </div>

      {/* Today's Log */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Today's Log</h2>
        {todayEntries.length === 0 ? (
          <p className="text-center text-slate-400 py-4">No water logged yet today.</p>
        ) : (
          <div className="space-y-3">
            {todayEntries.map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                    <Droplet className="w-5 h-5" fill="currentColor" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{entry.amount} oz</p>
                    <p className="text-xs text-slate-500">{format(entry.timestamp, 'h:mm a')}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeWater(entry.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
