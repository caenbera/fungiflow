'use client';

import { useState } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, CartesianGrid,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { RENDIMIENTO_BARS } from './mock-data';

const TABS = ['Ingresos','Producción','Ventas','Costo','Margen'] as const;
const tooltipStyle = { background:'rgba(255,249,239,0.96)', border:'1px solid rgba(128,96,62,0.2)', borderRadius:8, fontSize:11, boxShadow:'0 4px 12px rgba(0,0,0,0.12)' };

export function RendimientoGeneral() {
  const [tab, setTab] = useState<typeof TABS[number]>('Ingresos');

  return (
    <div className="surface-raised rounded-2xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <IconTile Icon={TrendingUp} from="#2a8055" to="#1a5030" size={14} tileSize={30} radius="0.5rem"/>
          <h3 className="text-sm font-bold text-[#302D28]">Rendimiento general</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[#A08060] font-medium">Comparar con:</span>
          <button className="px-2 py-1 rounded-lg text-[11px] font-bold text-[#6B4A2A]"
            style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.10)' }}>
            Mes anterior ▾
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-3">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
            style={t === tab
              ? { background:'linear-gradient(145deg,#2a8055,#1a5030)', color:'white', border:'1px solid rgba(255,255,255,0.18)', boxShadow:'0 3px 8px rgba(42,128,85,0.25)' }
              : { background:'transparent', color:'#8A6D3D' }}>
            {t}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={RENDIMIENTO_BARS} margin={{ top:8, right:4, left:-20, bottom:0 }} barGap={2}>
          <defs>
            <linearGradient id="barActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2a8055"/><stop offset="100%" stopColor="#1a5030"/>
            </linearGradient>
            <linearGradient id="barAnterior" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a0c8b0" stopOpacity={0.7}/><stop offset="100%" stopColor="#70a880" stopOpacity={0.5}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,96,62,0.08)" vertical={false}/>
          <XAxis dataKey="fecha" tick={{ fontSize:9, fill:'#A08060' }} axisLine={false} tickLine={false}/>
          <YAxis tick={{ fontSize:9, fill:'#A08060' }} axisLine={false} tickLine={false}/>
          <Tooltip contentStyle={tooltipStyle}/>
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:10, paddingTop:4 }}
            formatter={(v) => <span style={{ color:'#6B4A2A' }}>{v}</span>}/>
          <Bar dataKey="actual"   name="Período actual"   fill="url(#barActual)"   radius={[4,4,0,0]} barSize={14}/>
          <Bar dataKey="anterior" name="Período anterior" fill="url(#barAnterior)" radius={[4,4,0,0]} barSize={14}/>
          <Line dataKey="objetivo" name="Objetivo" stroke="#C59A18" strokeWidth={2} strokeDasharray="5 4" dot={false} type="monotone"/>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
