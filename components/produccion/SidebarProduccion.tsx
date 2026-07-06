'use client';

import { Wind, Bell } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { CONDICIONES, ALERTAS_PROD } from './mock-data';

function MiniSpark({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const w = 72, h = 24;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts} stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" opacity={0.7}/>
    </svg>
  );
}

export function SidebarProduccion() {
  return (
    <div className="flex flex-col gap-3">

      {/* Condiciones ambientales */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IconTile Icon={Wind} from="#1a5070" to="#0e3050" size={14} tileSize={30} radius="0.5rem"/>
            <h3 className="text-sm font-bold text-[#302D28]">Condiciones ambientales</h3>
          </div>
          <button className="text-[11px] font-bold text-[#7a4010] hover:underline">Ver detalle</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CONDICIONES.map(c => (
            <div key={c.label} className="surface-inset rounded-xl p-2.5 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#A08060] uppercase tracking-wide">{c.label}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-[#1a6040] bg-[rgba(26,96,64,0.12)]">
                  {c.estado}
                </span>
              </div>
              <p className="text-base font-extrabold text-[#302D28]">
                {c.value}<span className="text-[11px] font-semibold text-[#A08060] ml-0.5">{c.unit}</span>
              </p>
              <MiniSpark data={c.spark} color={c.color}/>
            </div>
          ))}
        </div>
      </div>

      {/* Alertas */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IconTile Icon={Bell} from="#b83020" to="#7a1a10" size={14} tileSize={30} radius="0.5rem"/>
            <h3 className="text-sm font-bold text-[#302D28]">Alertas</h3>
          </div>
          <button className="text-[11px] font-bold text-[#7a4010] hover:underline">Ver todas</button>
        </div>
        <div className="space-y-2">
          {ALERTAS_PROD.map((a, i) => (
            <div key={i}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
              style={{ background: a.bg, border: `1px solid ${a.color}22` }}>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: a.color }}/>
                <span className="text-[11px] font-semibold text-[#302D28] leading-tight">{a.label}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-sm font-extrabold" style={{ color: a.color }}>{a.count}</span>
                <span className="text-[10px] font-bold" style={{ color: a.color }}>›</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
