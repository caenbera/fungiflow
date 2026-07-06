'use client';

import { KPIS_REP } from './mock-data';

function Spark({ data, from, to }: { data: number[]; from: string; to: string }) {
  const min = Math.min(...data); const max = Math.max(...data);
  const W = 60; const H = 24;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / (max - min || 1)) * H;
    return `${x},${y}`;
  }).join(' ');
  const id = `sp-rep-${from.slice(1)}`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow:'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={from} stopOpacity={0.3}/>
          <stop offset="100%" stopColor={to} stopOpacity={0}/>
        </linearGradient>
      </defs>
      <polygon points={`${pts} ${W},${H} 0,${H}`} fill={`url(#${id})`}/>
      <polyline points={pts} fill="none" stroke={from} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}

export function KPIStripReportes() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {KPIS_REP.map((k) => (
        <div key={k.label} className="surface-raised rounded-2xl px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#8A6D3D] leading-tight mb-1">{k.label}</p>
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-lg font-extrabold text-[#302D28] leading-tight">{k.value}</p>
              <p className="text-[10px] font-semibold mt-0.5" style={{ color: k.up ? '#2a8055' : '#b83020' }}>
                {k.change} <span className="text-[#A08060] font-normal">vs mes anterior</span>
              </p>
            </div>
            <Spark data={k.spark} from={k.from} to={k.to}/>
          </div>
        </div>
      ))}
    </div>
  );
}
