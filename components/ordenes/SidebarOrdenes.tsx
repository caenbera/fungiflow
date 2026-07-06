'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users2 } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { COMPRAS_TREND, COMPRAS_CATEGORIA, PROVEEDORES_RANK } from './mock-data';

const tooltipStyle = {
  background:'rgba(255,249,239,0.96)', border:'1px solid rgba(128,96,62,0.2)',
  borderRadius:8, fontSize:11, boxShadow:'0 4px 12px rgba(0,0,0,0.12)',
};

const fmtM = (n: number) => `$${(n/1_000_000).toFixed(1)}M`;

export function SidebarOrdenes() {
  const maxProv = PROVEEDORES_RANK[1].valor; // Fungi Equipos es el mayor

  return (
    <div className="flex flex-col gap-3">

      {/* Resumen de compras */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <IconTile Icon={TrendingUp} from="#2a8055" to="#1a5030" size={14} tileSize={30} radius="0.5rem"/>
            <h3 className="text-sm font-bold text-[#302D28]">Resumen de compras</h3>
          </div>
          <button className="text-[11px] font-bold text-[#7a4010] hover:underline">Ver reporte</button>
        </div>
        <p className="text-2xl font-extrabold text-[#302D28] mb-2">$152,430,000</p>
        <ResponsiveContainer width="100%" height={110}>
          <AreaChart data={COMPRAS_TREND} margin={{top:4,right:4,left:-24,bottom:0}}>
            <defs>
              <linearGradient id="areaOrd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2a8055" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#2a8055" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="mes" tick={{fontSize:9,fill:'#A08060'}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:9,fill:'#A08060'}} axisLine={false} tickLine={false} tickFormatter={v=>`${v}M`}/>
            <Tooltip formatter={(v)=>[`$${v}M`,'Valor']} contentStyle={tooltipStyle}/>
            <Area type="monotone" dataKey="valor" stroke="#2a8055" strokeWidth={2}
              fill="url(#areaOrd)" dot={{r:3,fill:'#2a8055'}} activeDot={{r:5}}/>
          </AreaChart>
        </ResponsiveContainer>
        {/* Desglose categorías */}
        <div className="mt-3 space-y-1.5 border-t border-[rgba(128,96,62,0.1)] pt-3">
          {COMPRAS_CATEGORIA.map(c=>(
            <div key={c.nombre} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{background:c.color}}/>
                <span className="text-[10px] text-[#6B4A2A] font-medium truncate max-w-[110px]">{c.nombre}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold text-[#302D28]">{fmtM(c.valor)}</span>
                <span className="text-[9px] text-[#A08060]">{c.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proveedores principales */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IconTile Icon={Users2} from="#5a2a7a" to="#3a1a50" size={14} tileSize={30} radius="0.5rem"/>
            <h3 className="text-sm font-bold text-[#302D28]">Proveedores principales</h3>
          </div>
          <button className="text-[11px] font-bold text-[#7a4010] hover:underline">Ver todos</button>
        </div>
        <div className="space-y-2.5">
          {PROVEEDORES_RANK.map((p,i)=>(
            <div key={p.nombre}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold w-4 text-center"
                    style={{color:i===0?'#C59A18':i===1?'#94a3b8':i===2?'#b06000':'#A08060'}}>
                    {p.rank}
                  </span>
                  <span className="text-[11px] font-semibold text-[#302D28] truncate max-w-[120px]">{p.nombre}</span>
                </div>
                <span className="text-[11px] font-extrabold text-[#302D28]">{fmtM(p.valor)}</span>
              </div>
              <div className="h-1.5 rounded-full surface-inset overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{width:`${p.pct}%`,background:'linear-gradient(90deg,#5a2a7a,#C59A18)',boxShadow:'0 0 5px rgba(90,42,122,0.4)'}}/>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
