'use client';

import { useState } from 'react';
import { Star, ShieldCheck, AlertCircle, ChevronRight } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { EVAL_DONUT, PROVEEDORES } from './mock-data';

/* ── Helpers ── */
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function darken(hex: string, amt = 40) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (n >> 16) - amt);
  const g = Math.max(0, ((n >> 8) & 0xff) - amt);
  const b = Math.max(0, (n & 0xff) - amt);
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
}
function lighten(hex: string, amt = 30) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (n >> 16) + amt);
  const g = Math.min(255, ((n >> 8) & 0xff) + amt);
  const b = Math.min(255, (n & 0xff) + amt);
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

/* ── Donut 3D ── */
function Segment3D({ cx, cy, outerR, innerR, depth, startDeg, endDeg, color, hovered, onHover }: {
  cx: number; cy: number; outerR: number; innerR: number; depth: number;
  startDeg: number; endDeg: number; color: string; hovered: boolean; onHover: (v: boolean) => void;
}) {
  const gap = 2.5;
  const s = startDeg + gap;
  const e = endDeg - gap;
  if (e - s < 1) return null;
  const liftY = hovered ? -4 : 0;
  const oR = outerR + (hovered ? 3 : 0);
  const large = (e - s) > 180 ? 1 : 0;
  const o1 = polar(cx, cy + liftY, oR, s); const o2 = polar(cx, cy + liftY, oR, e);
  const i1 = polar(cx, cy + liftY, innerR, s); const i2 = polar(cx, cy + liftY, innerR, e);
  const ob1 = polar(cx, cy + liftY + depth, oR, s); const ob2 = polar(cx, cy + liftY + depth, oR, e);
  const ib1 = polar(cx, cy + liftY + depth, innerR, s); const ib2 = polar(cx, cy + liftY + depth, innerR, e);
  const topFace = `M ${o1.x} ${o1.y} A ${oR} ${oR} 0 ${large} 1 ${o2.x} ${o2.y} L ${i2.x} ${i2.y} A ${innerR} ${innerR} 0 ${large} 0 ${i1.x} ${i1.y} Z`;
  const outerSide = `M ${o1.x} ${o1.y} A ${oR} ${oR} 0 ${large} 1 ${o2.x} ${o2.y} L ${ob2.x} ${ob2.y} A ${oR} ${oR} 0 ${large} 0 ${ob1.x} ${ob1.y} Z`;
  const id = `ev3d-${color.slice(1)}`;
  return (
    <g style={{ cursor: 'pointer' }} onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>
      <defs>
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lighten(color, 20)} /><stop offset="100%" stopColor={color} />
        </linearGradient>
        <linearGradient id={`${id}-side`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={darken(color, 25)} /><stop offset="100%" stopColor={darken(color, 50)} />
        </linearGradient>
      </defs>
      <path d={outerSide} fill={`url(#${id}-side)`} stroke="rgba(255,255,255,0.18)" strokeWidth={0.5} />
      <path d={`M ${o1.x} ${o1.y} L ${ob1.x} ${ob1.y} L ${ib1.x} ${ib1.y} L ${i1.x} ${i1.y} Z`} fill={darken(color, 25)} stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
      <path d={`M ${o2.x} ${o2.y} L ${ob2.x} ${ob2.y} L ${ib2.x} ${ib2.y} L ${i2.x} ${i2.y} Z`} fill={darken(color, 25)} stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
      <path d={topFace} fill={`url(#${id}-top)`} stroke="rgba(255,255,255,0.38)" strokeWidth={hovered ? 1.5 : 0.8} />
    </g>
  );
}

function Donut3D() {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = EVAL_DONUT.reduce((s, d) => s + d.value, 0);
  const cx = 90; const cy = 65;
  const outerR = 52; const innerR = 30; const depth = 12;
  let cursor = 0;
  const segs = EVAL_DONUT.map(d => {
    const sweep = (d.value / total) * 360;
    const start = cursor; cursor += sweep;
    return { ...d, start, end: cursor };
  });
  return (
    <svg width={180} height={140} viewBox="0 0 180 140" style={{ overflow: 'visible' }}>
      {segs.map((seg, i) => (
        <Segment3D key={seg.name} cx={cx} cy={cy} outerR={outerR} innerR={innerR} depth={depth}
          startDeg={seg.start} endDeg={seg.end} color={seg.color}
          hovered={hovered === i} onHover={on => setHovered(on ? i : null)} />
      ))}
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={16} fontWeight={800} fill="#302D28">{total}</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize={7} fontWeight={700} fill="#A08060" letterSpacing="0.1em">TOTAL</text>
    </svg>
  );
}

/* ── Panel lateral ── */
export function PanelLateral() {
  const total = EVAL_DONUT.reduce((s, d) => s + d.value, 0);
  const estrategicos = PROVEEDORES.filter(p => p.estrategico);

  const alertas = [
    { label: 'Órdenes con entregas atrasadas', count: 3, color: '#b83020', Icon: AlertCircle },
    { label: 'Proveedores por evaluar',         count: 6, color: '#b06000', Icon: Star },
    { label: 'Contratos por vencer (30 días)',  count: 4, color: '#C59A18', Icon: AlertCircle },
  ];

  return (
    <div className="flex flex-col gap-3">

      {/* Donut evaluación */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <IconTile Icon={Star} from="#C59A18" to="#8A6A08" size={14} tileSize={30} radius="0.5rem" />
          <h3 className="text-sm font-bold text-[#302D28]">Evaluación de proveedores</h3>
        </div>
        <div className="flex justify-center">
          <Donut3D />
        </div>
        <div className="space-y-1.5 mt-1">
          {EVAL_DONUT.map(d => (
            <div key={d.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span className="text-[11px] text-[#6B4A2A] font-medium">{d.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#302D28]">{d.value}</span>
                <span className="text-[10px] text-[#A08060]">({Math.round(d.value / total * 100)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proveedores estratégicos */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IconTile Icon={ShieldCheck} from="#2a8055" to="#1a5030" size={14} tileSize={30} radius="0.5rem" />
            <h3 className="text-sm font-bold text-[#302D28]">Proveedores estratégicos</h3>
          </div>
          <span className="text-[10px] text-[#A08060] font-medium cursor-pointer hover:text-[#302D28] transition-colors">Ver todos</span>
        </div>
        <div className="space-y-2">
          {estrategicos.map(p => (
            <div key={p.id} className="flex items-center gap-2 surface-inset rounded-xl px-3 py-2">
              <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#2a8055,#1a5030)' }}>
                {p.nombre.split(' ').map(w => w[0]).slice(0, 2).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-[#302D28] truncate leading-tight">{p.nombre}</p>
                <p className="text-[9px] text-[#A08060] leading-tight">{p.descripcionEstrategico}</p>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-[#1a6040] bg-[rgba(26,96,64,0.12)] flex-shrink-0">
                Estratégico
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Alertas y pendientes */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IconTile Icon={AlertCircle} from="#b83020" to="#7a1a10" size={14} tileSize={30} radius="0.5rem" />
            <h3 className="text-sm font-bold text-[#302D28]">Alertas y pendientes</h3>
          </div>
          <span className="text-[10px] text-[#A08060] font-medium cursor-pointer hover:text-[#302D28] transition-colors">Ver todas</span>
        </div>
        <div className="space-y-1.5">
          {alertas.map(a => (
            <div key={a.label} className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-[rgba(245,239,230,0.5)] transition-colors cursor-pointer">
              <a.Icon size={13} style={{ color: a.color }} className="flex-shrink-0" />
              <span className="flex-1 text-[11px] text-[#6B4A2A] font-medium leading-tight">{a.label}</span>
              <span className="text-[11px] font-extrabold flex-shrink-0" style={{ color: a.color }}>{a.count}</span>
              <ChevronRight size={11} className="text-[#C0A880] flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
