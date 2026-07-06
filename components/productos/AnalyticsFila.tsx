'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart2, RefreshCw, Clock } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { VALOR_POR_CATEGORIA, ROTACION_DATA, PROXIMOS_VENCER } from './mock-data';

const tooltipStyle = {
  background: 'rgba(255,249,239,0.96)',
  border: '1px solid rgba(128,96,62,0.2)',
  borderRadius: 8, fontSize: 11,
  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
};

const BAR_COLORS = ['#2a8055','#b06000','#5a2a7a','#1a5070','#C59A18'];

const urgencyColor = (dias: number) => {
  if (dias <= 20) return { color: '#b83020', bg: 'rgba(184,48,32,0.10)' };
  if (dias <= 30) return { color: '#b06000', bg: 'rgba(176,96,0,0.10)'  };
  return              { color: '#1a6040', bg: 'rgba(26,96,64,0.10)'  };
};

export function AnalyticsFilaProd() {
  const maxValor = VALOR_POR_CATEGORIA[0].valor;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

      {/* Valor por categoría */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IconTile Icon={BarChart2} from="#2a8055" to="#1a5030" size={14} tileSize={30} radius="0.5rem"/>
            <h3 className="text-sm font-bold text-[#302D28]">Valor del inventario por categoría</h3>
          </div>
          <button className="text-[11px] font-bold text-[#7a4010] hover:underline">Ver reporte</button>
        </div>
        <div className="space-y-2.5">
          {VALOR_POR_CATEGORIA.map((c, i) => (
            <div key={c.nombre}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium text-[#6B4A2A] truncate max-w-[140px]">{c.nombre}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold text-[#302D28]">${c.valor}M</span>
                  <span className="text-[10px] text-[#A08060]">({c.pct}%)</span>
                </div>
              </div>
              <div className="h-2 rounded-full surface-inset overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${(c.valor / maxValor) * 100}%`, background: BAR_COLORS[i], boxShadow: `0 0 5px ${BAR_COLORS[i]}66` }}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rotación de productos */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <IconTile Icon={RefreshCw} from="#1a5070" to="#0e3050" size={14} tileSize={30} radius="0.5rem"/>
            <h3 className="text-sm font-bold text-[#302D28]">Rotación de productos</h3>
          </div>
          <button className="text-[11px] font-bold text-[#7a4010] hover:underline">Ver reporte</button>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-extrabold text-[#302D28]">4.2</span>
          <span className="text-sm text-[#6B4A2A] font-semibold">veces</span>
          <span className="text-[11px] font-bold text-[#1a6040] bg-[rgba(26,96,64,0.10)] px-1.5 py-0.5 rounded-full">↑ 0.8 vs mes anterior</span>
        </div>
        <ResponsiveContainer width="100%" height={110}>
          <LineChart data={ROTACION_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,96,62,0.1)"/>
            <XAxis dataKey="mes" tick={{ fontSize: 9, fill: '#A08060' }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fontSize: 9, fill: '#A08060' }} axisLine={false} tickLine={false} domain={[2.5,5]}/>
            <Tooltip formatter={(v) => [v, 'Rotación']} contentStyle={tooltipStyle}/>
            <Line type="monotone" dataKey="valor" stroke="#1a5070" strokeWidth={2.5}
              dot={{ r: 3, fill: '#1a5070' }} activeDot={{ r: 5 }}/>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Próximos a vencer */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IconTile Icon={Clock} from="#b83020" to="#7a1a10" size={14} tileSize={30} radius="0.5rem"/>
            <h3 className="text-sm font-bold text-[#302D28]">Productos próximos a vencer</h3>
          </div>
          <button className="text-[11px] font-bold text-[#7a4010] hover:underline">Ver todos</button>
        </div>
        <div className="space-y-3">
          {PROXIMOS_VENCER.map(p => {
            const urg = urgencyColor(p.dias);
            return (
              <div key={p.nombre} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(145deg,#b83020,#7a1a10)', boxShadow: '0 2px 6px rgba(0,0,0,0.18)' }}>
                  {p.nombre.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-[#302D28] truncate">{p.nombre}</p>
                  <p className="text-[10px] text-[#A08060]">Vence en {p.dias} días</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[11px] font-extrabold text-[#302D28]">{p.stock} uds</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ color: urg.color, background: urg.bg }}>
                    {p.dias <= 20 ? 'Urgente' : p.dias <= 30 ? 'Pronto' : 'Programado'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
