import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Watcher } from '../types';

interface CoherenceChartProps {
  watchers: Watcher[];
}

const CoherenceChart: React.FC<CoherenceChartProps> = ({ watchers }) => {
  
  // Transform data for Recharts
  // We take the history of the first watcher to define time steps, then map all watchers to that time
  const dataLength = watchers[0]?.history.length || 0;
  const data = Array.from({ length: dataLength }).map((_, index) => {
    const point: any = { name: index.toString() };
    watchers.forEach(w => {
      point[w.id] = w.history[index];
    });
    return point;
  });

  return (
    <div className="h-full w-full bg-slate-900/50 rounded-lg p-4 border border-slate-800">
      <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-2">GLOBAL COHERENCE METRICS</h3>
      <div className="h-[150px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" hide />
            <YAxis hide domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            {watchers.map((w, i) => (
              <Area 
                key={w.id}
                type="monotone" 
                dataKey={w.id} 
                stroke={i === 0 ? "#fbbf24" : "#22d3ee"} 
                fillOpacity={0.1} 
                fill={i === 0 ? "#fbbf24" : "#22d3ee"} 
                strokeWidth={2}
                isAnimationActive={false}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CoherenceChart;