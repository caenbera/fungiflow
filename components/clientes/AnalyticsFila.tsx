'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell,
} from 'recharts';
import { BarChart2, TrendingUp, ShoppingBag, Clock } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { VENTAS_POR_CLIENTE, NUEVOS_CLIENTES, COMPORTAMIENTO, ANTIGUEDAD_DONUT } from './mock-data';

const tooltipStyle = {
  background: 'rgba(255,249,239,0.96)',
  border: '1px solid rgba(128,96,62,0.2)',
  borderRadius: 8,
  fontSize: 11,
  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
};

export function AnalyticsFila() {
  const totalAnt = ANTIGUEDAD_DONUT.reduce((s, d) => s + d.value, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">

      {/* Bar — Ventas por cliente */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <IconTile Icon={BarChart2} from="#1a5070" to="#0e3050" size={14} tileSize={30} radius="0.5rem" />
          <h3 className="text-sm font-bold text-[#302D28]">Ventas por cliente</h3>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={VENTAS_POR_CLIENTE} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={14}>
            <XAxis dataKey="nombre" tick={{ fontSize: 9, fill: '#A08060' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: '#A08060' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
            <Tooltip formatter={(v) => [`$${v}M`, 'Ventas']} contentStyle={tooltipStyle} />
            <Bar dataKey="ventas" radius={[4, 4, 0, 0]}
              fill="url(#barGrad)"
            />
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9a5020" />
                <stop offset="100%" stopColor="#C59A18" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line — Nuevos clientes */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <IconTile Icon={TrendingUp} from="#2a8055" to="#1a5030" size={14} tileSize={30} radius="0.5rem" />
          <h3 className="text-sm font-bold text-[#302D28]">Nuevos clientes</h3>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={NUEVOS_CLIENTES} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,96,62,0.1)" />
            <XAxis dataKey="mes" tick={{ fontSize: 9, fill: '#A08060' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: '#A08060' }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => [v, 'Nuevos']} contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="nuevos" stroke="#2a8055" strokeWidth={2} dot={{ r: 3, fill: '#2a8055' }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Comportamiento de compra */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <IconTile Icon={ShoppingBag} from="#b06000" to="#7a3a00" size={14} tileSize={30} radius="0.5rem" />
          <h3 className="text-sm font-bold text-[#302D28]">Comportamiento de compra</h3>
        </div>
        <div className="space-y-3 mt-2">
          {COMPORTAMIENTO.map(b => (
            <div key={b.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium text-[#6B4A2A]">{b.label}</span>
                <span className="text-[11px] font-extrabold text-[#302D28]">{b.pct}%</span>
              </div>
              <div className="h-2 rounded-full surface-inset overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${b.pct}%`, background: b.color, boxShadow: `0 0 6px ${b.color}66` }} />
              </div>
            </div>
          ))}
          <div className="pt-2 border-t border-[rgba(128,96,62,0.10)]">
            <div className="grid grid-cols-2 gap-2">
              <div className="surface-inset rounded-xl p-2 text-center">
                <p className="text-base font-extrabold text-[#302D28]">6.2</p>
                <p className="text-[9px] text-[#A08060] font-bold uppercase tracking-wide">Pedidos/año prom.</p>
              </div>
              <div className="surface-inset rounded-xl p-2 text-center">
                <p className="text-base font-extrabold text-[#302D28]">42 días</p>
                <p className="text-[9px] text-[#A08060] font-bold uppercase tracking-wide">Ciclo de recompra</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Antigüedad donut */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <IconTile Icon={Clock} from="#5a2a7a" to="#3a1a50" size={14} tileSize={30} radius="0.5rem" />
          <h3 className="text-sm font-bold text-[#302D28]">Antigüedad de clientes</h3>
        </div>
        <div className="relative">
          <ResponsiveContainer width="100%" height={100}>
            <PieChart>
              <Pie data={ANTIGUEDAD_DONUT} cx="50%" cy="50%" innerRadius={30} outerRadius={44} paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                {ANTIGUEDAD_DONUT.map((d, i) => (
                  <Cell key={i} fill={d.color} stroke="rgba(255,255,255,0.5)" strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v} clientes`, '']} contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-sm font-extrabold text-[#302D28]">{totalAnt}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1 mt-1">
          {ANTIGUEDAD_DONUT.map(d => (
            <div key={d.name} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
              <span className="text-[10px] text-[#6B4A2A] truncate">{d.name}</span>
              <span className="text-[10px] font-bold text-[#302D28] ml-auto">{d.value}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
