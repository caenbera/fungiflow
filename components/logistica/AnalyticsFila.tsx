'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingDown, Award } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { DESEMPENO, COSTOS_TREND } from './mock-data';

const tooltipStyle={background:'rgba(255,249,239,0.96)',border:'1px solid rgba(128,96,62,0.2)',borderRadius:8,fontSize:11,boxShadow:'0 4px 12px rgba(0,0,0,0.12)'};

export function AnalyticsFilaLogistica() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

      {/* Desempeño de entregas */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <IconTile Icon={Award} from="#2a8055" to="#1a5030" size={14} tileSize={30} radius="0.5rem"/>
          <h3 className="text-sm font-bold text-[#302D28]">Desempeño de entregas</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {DESEMPENO.map((d) => (
            <div key={d.label} className="surface-inset rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#8A6D3D] leading-tight mb-1">{d.label}</p>
              <p className="text-xl font-extrabold leading-none" style={{ color: d.color }}>{d.value}</p>
              <p className="text-[10px] font-semibold mt-1" style={{ color: '#2a8055' }}>{d.change} vs mes anterior</p>
            </div>
          ))}
        </div>
      </div>

      {/* Costos logísticos */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <IconTile Icon={TrendingDown} from="#b06000" to="#7a3a00" size={14} tileSize={30} radius="0.5rem"/>
            <div>
              <h3 className="text-sm font-bold text-[#302D28]">Costos logísticos</h3>
              <p className="text-[10px] text-[#A08060]">Tendencia mensual</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-extrabold text-[#302D28]">$8.43M</p>
            <p className="text-[10px] font-semibold text-[#2a8055]">-6.8% vs mes anterior</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={COSTOS_TREND} margin={{top:10,right:4,left:-20,bottom:0}}>
            <defs>
              <linearGradient id="costLog" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b06000" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#b06000" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="fecha" tick={{fontSize:9,fill:'#A08060'}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:9,fill:'#A08060'}} axisLine={false} tickLine={false} domain={[8,9.5]} tickFormatter={v=>`$${v}M`}/>
            <Tooltip formatter={(v)=>[`$${v}M`,'Costo']} contentStyle={tooltipStyle}/>
            <Area type="monotone" dataKey="valor" stroke="#b06000" strokeWidth={2} fill="url(#costLog)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
