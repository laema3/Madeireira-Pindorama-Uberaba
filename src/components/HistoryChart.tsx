import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface HistoryChartProps {
  data: {
    date: string;
    fullDate: string;
    amount: number;
  }[];
}

export function HistoryChart({ data }: HistoryChartProps) {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-slate-800 text-white text-xs py-1 px-2 rounded shadow-lg">
                    {payload[0].payload.fullDate}: {payload[0].value} oz
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="amount" radius={[4, 4, 4, 4]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.amount >= 64 ? '#3b82f6' : '#93c5fd'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
