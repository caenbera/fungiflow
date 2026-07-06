'use client';

import { ArrowRight, Thermometer, Droplets, Wind, Sun, CloudRain, Leaf, Sparkles } from 'lucide-react';
import { CULTIVO, CONDICIONES } from './mock-data';
import { IconTile } from './IconTile';

const COND_CONFIG = [
  { Icon: Thermometer, from: '#b83020', to: '#7a1a10' },
  { Icon: Droplets,    from: '#1a5070', to: '#0e3050' },
  { Icon: Wind,        from: '#1a6878', to: '#0e4050' },
  { Icon: Sun,         from: '#C59A18', to: '#8A6A08' },
  { Icon: CloudRain,   from: '#4a5a7a', to: '#2a3a5a' },
];

export function HeroRow() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr_0.9fr] gap-4">

      {/* ── Hero card ── */}
      <div className="relative rounded-2xl overflow-hidden min-h-[200px] flex flex-col justify-end"
        style={{ boxShadow: 'var(--shadow-raised)' }}>
        <img src="/carousel/02.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
        <div className="relative z-10 p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base font-bold text-white">{CULTIVO.nombre}</span>
            <span className="bg-[#1a6040]/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">
              {CULTIVO.fase}
            </span>
          </div>
          <p className="text-white/80 text-sm mb-3 leading-snug">{CULTIVO.descripcion}</p>
          <button className="flex items-center gap-1.5 text-sm font-semibold text-white bg-white/15 hover:bg-white/25 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/25 transition-colors">
            Ver detalle <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* ── Condiciones ambientales ── */}
      <div className="surface-raised rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A6D3D]">En tiempo real</p>
            <h3 className="text-sm font-bold text-[#302D28] mt-0.5">Condiciones ambientales</h3>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#1a6040] surface-inset px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-[#1a6040] rounded-full animate-pulse" />
            Óptimas
          </span>
        </div>
        <div className="grid grid-cols-5 gap-2 mb-3">
          {CONDICIONES.map(({ label, value }, i) => {
            const cfg = COND_CONFIG[i];
            return (
              <div key={label} className="surface-soft rounded-xl py-3 flex flex-col items-center gap-2">
                <IconTile Icon={cfg.Icon} from={cfg.from} to={cfg.to} size={14} tileSize={32} radius="0.55rem" />
                <span className="text-sm font-bold text-[#302D28] text-center leading-tight">{value}</span>
                <span className="text-[10px] text-[#8A6D3D] text-center leading-tight">{label}</span>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-[#A08060]">Actualizado hace 5 min · Sensor Hub v2</p>
      </div>

      {/* ── Pulso del cultivo ── */}
      <div className="surface-raised rounded-2xl p-5 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <IconTile Icon={Sparkles} from="#C59A18" to="#8A6A08" size={16} tileSize={36} radius="0.65rem" />
          <h3 className="text-sm font-bold text-[#302D28]">Pulso del Cultivo</h3>
        </div>
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-shrink-0">
            <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
              <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(90,62,43,0.12)" strokeWidth="8" />
              <circle cx="40" cy="40" r="30" fill="none" stroke="#1a6040" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 30 * 0.96} ${2 * Math.PI * 30 * 0.04}`}
                strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-extrabold text-[#1a6040] leading-none">96%</span>
              <span className="text-[9px] text-[#1a6040] font-bold">Excelente</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#6B4A2A] leading-snug mb-3">
              La finca presenta condiciones óptimas. Producción estimada de <strong>1,250 kg</strong> en los próximos 7 días.
            </p>
            <button className="flex items-center gap-1 text-xs font-bold text-[#7a4010] hover:underline">
              Ver recomendaciones IA <ArrowRight size={12} />
            </button>
          </div>
        </div>
        <div className="mt-3 surface-inset rounded-xl px-3 py-2 flex items-center gap-2">
          <Leaf size={13} className="text-[#1a6040] flex-shrink-0" />
          <span className="text-xs text-[#1a6040] font-semibold">Dos lotes alcanzan su punto ideal mañana</span>
        </div>
      </div>
    </div>
  );
}
