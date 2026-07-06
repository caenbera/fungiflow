'use client';

import { KPIS_LOG } from './mock-data';

function Spark({ data, from, to }: { data: number[]; from: string; to: string }) {
  const min = Math.min(...data); const max = Math.max(...data);
  const W = 64; const H = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / (max - min || 1)) * H;
    return `${x},${y}`;
  }).join(' ');
  const fill = `${pts} ${W},${H} 0,${H}`;
  const id = `sp-log-${from.slice(1)}`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={from} stopOpacity={0.35}/>
          <stop offset="100%" stopColor={to} stopOpacity={0}/>
        </linearGradient>
      </defs>
      <polygon points={fill} fill={`url(#${id})`}/>
      <polyline points={pts} fill="none" stroke={from} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}

export function KPIStripLogistica() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {KPIS_LOG.map((k) => (
        <div key={k.label} className="surface-raised rounded-2xl px-4 py-3 flex flex-col gap-1">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#8A6D3D] leading-tight">{k.label}</p>
          <div className="flex items-end justify-between gap-2 mt-0.5">
            <div>
              <p className="text-xl font-extrabold text-[#302D28] leading-none">{k.value}</p>
              <p className="text-[10px] font-semibold mt-1" style={{ color: k.up ? '#2a8055' : '#b83020' }}>
                {k.change} <span className="text-[#A08060] font-normal">{k.vs}</span>
              </p>
            </div>
            <Spark data={k.spark} from={k.from} to={k.to}/>
          </div>
        </div>
      ))}
    </div>
  );
}
