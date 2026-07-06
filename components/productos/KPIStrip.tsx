'use client';

import { IconTile } from '@/components/dashboard-v2/IconTile';
import { Package, CheckSquare, Barcode, DollarSign, Boxes, AlertTriangle } from 'lucide-react';
import { KPIS_PROD } from './mock-data';

const ICONS = [Package, CheckSquare, Barcode, DollarSign, Boxes, AlertTriangle];

function Spark({ data, up }: { data: number[]; up: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 64, h = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  const color = up ? '#22c55e' : '#ef4444';
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <defs>
        <linearGradient id={`spg-${up}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} /><stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={`url(#spg-${up})`} opacity={0.18} />
    </svg>
  );
}

export function KPIStripProd() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
      {KPIS_PROD.map((k, i) => {
        const Icon = ICONS[i];
        return (
          <div key={k.label} className="surface-raised rounded-2xl px-4 py-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <IconTile Icon={Icon} from={k.from} to={k.to} size={14} tileSize={30} radius="0.5rem" />
              <Spark data={k.spark} up={k.up} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#A08060]">{k.label}</p>
              <p className="text-xl font-extrabold text-[#302D28] leading-tight">{k.value}</p>
            </div>
            <div className="flex items-center gap-1">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${k.up ? 'text-[#1a6040] bg-[rgba(26,96,64,0.10)]' : 'text-[#b83020] bg-[rgba(184,48,32,0.10)]'}`}>
                {k.change}
              </span>
              <span className="text-[10px] text-[#A08060]">vs. mes anterior</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
