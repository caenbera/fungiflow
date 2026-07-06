'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GALPON_DATA } from './mock-data';

const COLORS = ['#1a6040', '#2a8055', '#3a9a6a', '#4ab47f'];

export function GraficoProduccion() {
  return (
    <div className="surface-raised rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#302D28]">Producción por galpón (kg)</h3>
        <span className="text-[10px] text-[#8A6D3D] font-semibold surface-inset px-2.5 py-1 rounded-full">Esta semana</span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={GALPON_DATA} barSize={28}>
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#a8927a' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#a8927a' }} axisLine={false} tickLine={false} width={32} />
          <Tooltip
            contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,.12)' }}
            cursor={{ fill: '#f5ede0' }}
          />
          <Bar dataKey="kg" radius={[6, 6, 0, 0]}>
            {GALPON_DATA.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
