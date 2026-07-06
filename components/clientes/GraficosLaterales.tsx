'use client';

import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { SEGMENTOS_DONUT, TOP_CLIENTES } from './mock-data';

const fmtM = (n: number) => `$${(n / 1_000_000).toFixed(1)}M`;

/* ── 3D Donut SVG ── */
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function darken(hex: string, amt = 40): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (n >> 16) - amt);
  const g = Math.max(0, ((n >> 8) & 0xff) - amt);
  const b = Math.max(0, (n & 0xff) - amt);
  return `#${[r,g,b].map(v => v.toString(16).padStart(2,'0')).join('')}`;
}

function lighten(hex: string, amt = 30): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (n >> 16) + amt);
  const g = Math.min(255, ((n >> 8) & 0xff) + amt);
  const b = Math.min(255, (n & 0xff) + amt);
  return `#${[r,g,b].map(v => v.toString(16).padStart(2,'0')).join('')}`;
}

interface Seg3DProps {
  cx: number; cy: number;
  outerR: number; innerR: number;
  depth: number;
  startDeg: number; endDeg: number;
  color: string;
  hovered: boolean;
  onHover: (on: boolean) => void;
  label: string; value: number; total: number;
}

function Segment3D({ cx, cy, outerR, innerR, depth, startDeg, endDeg, color, hovered, onHover, label, value, total }: Seg3DProps) {
  const gap = 2.5;
  const s = startDeg + gap;
  const e = endDeg - gap;
  if (e - s < 1) return null;

  const liftY = hovered ? -4 : 0;
  const extraR = hovered ? 3 : 0;
  const oR = outerR + extraR;
  const iR = innerR;
  const large = (e - s) > 180 ? 1 : 0;

  const o1 = polar(cx, cy + liftY, oR, s);
  const o2 = polar(cx, cy + liftY, oR, e);
  const i1 = polar(cx, cy + liftY, iR, s);
  const i2 = polar(cx, cy + liftY, iR, e);

  const ob1 = polar(cx, cy + liftY + depth, oR, s);
  const ob2 = polar(cx, cy + liftY + depth, oR, e);
  const ib1 = polar(cx, cy + liftY + depth, iR, s);
  const ib2 = polar(cx, cy + liftY + depth, iR, e);

  const topFace = [
    `M ${o1.x} ${o1.y}`,
    `A ${oR} ${oR} 0 ${large} 1 ${o2.x} ${o2.y}`,
    `L ${i2.x} ${i2.y}`,
    `A ${iR} ${iR} 0 ${large} 0 ${i1.x} ${i1.y}`,
    'Z',
  ].join(' ');

  // Outer side wall
  const outerSide = [
    `M ${o1.x} ${o1.y}`,
    `A ${oR} ${oR} 0 ${large} 1 ${o2.x} ${o2.y}`,
    `L ${ob2.x} ${ob2.y}`,
    `A ${oR} ${oR} 0 ${large} 0 ${ob1.x} ${ob1.y}`,
    'Z',
  ].join(' ');

  // Inner side wall
  const innerSide = [
    `M ${i1.x} ${i1.y}`,
    `A ${iR} ${iR} 0 ${large} 1 ${i2.x} ${i2.y}`,
    `L ${ib2.x} ${ib2.y}`,
    `A ${iR} ${iR} 0 ${large} 0 ${ib1.x} ${ib1.y}`,
    'Z',
  ].join(' ');

  // Left end cap
  const leftCap = `M ${o1.x} ${o1.y} L ${ob1.x} ${ob1.y} L ${ib1.x} ${ib1.y} L ${i1.x} ${i1.y} Z`;
  // Right end cap
  const rightCap = `M ${o2.x} ${o2.y} L ${ob2.x} ${ob2.y} L ${ib2.x} ${ib2.y} L ${i2.x} ${i2.y} Z`;

  const dark = darken(color, 50);
  const mid  = darken(color, 25);
  const bright = lighten(color, 20);

  const id = `seg3d-${label.replace(/\s/g,'')}`;

  return (
    <g
      style={{ cursor: 'pointer', transition: 'transform .15s' }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <defs>
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bright} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
        <linearGradient id={`${id}-side`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={mid} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
      </defs>
      {/* Side walls — drawn first (below top face) */}
      <path d={innerSide} fill={dark} opacity={0.6} />
      <path d={outerSide} fill={`url(#${id}-side)`} stroke="rgba(255,255,255,0.18)" strokeWidth={0.5} />
      <path d={leftCap}   fill={mid}  stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
      <path d={rightCap}  fill={mid}  stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
      {/* Top face */}
      <path d={topFace} fill={`url(#${id}-top)`}
        stroke="rgba(255,255,255,0.38)" strokeWidth={hovered ? 1.5 : 0.8}
        style={{ filter: hovered ? `drop-shadow(0 0 6px ${color}88)` : undefined }}
      />
    </g>
  );
}

function Donut3D({ data, total }: { data: typeof SEGMENTOS_DONUT; total: number }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const cx = 100; const cy = 68;
  const outerR = 58; const innerR = 34; const depth = 14;
  const W = 200; const H = 155;

  let cursor = 0;
  const segs = data.map(d => {
    const sweep = (d.value / total) * 360;
    const start = cursor;
    cursor += sweep;
    return { ...d, start, end: cursor };
  });

  return (
    <div className="relative flex flex-col items-center">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
        {segs.map((seg, i) => (
          <Segment3D
            key={seg.name}
            cx={cx} cy={cy} outerR={outerR} innerR={innerR} depth={depth}
            startDeg={seg.start} endDeg={seg.end}
            color={seg.color}
            hovered={hovered === i}
            onHover={(on) => setHovered(on ? i : null)}
            label={seg.name} value={seg.value} total={total}
          />
        ))}
        {/* Center hole label */}
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize={16} fontWeight={800} fill="#302D28">{total}</text>
        <text x={cx} y={cy + 16} textAnchor="middle" fontSize={8} fontWeight={700} fill="#A08060" letterSpacing="0.1em">TOTAL</text>
      </svg>
    </div>
  );
}

export function GraficosLaterales() {
  const total = SEGMENTOS_DONUT.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex flex-col gap-3">
      {/* Donut 3D */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <IconTile Icon={Trophy} from="#5a2a7a" to="#3a1a50" size={14} tileSize={30} radius="0.5rem" />
          <h3 className="text-sm font-bold text-[#302D28]">Clientes por segmento</h3>
        </div>
        <div className="flex justify-center">
          <Donut3D data={SEGMENTOS_DONUT} total={total} />
        </div>
        <div className="space-y-1.5 mt-2">
          {SEGMENTOS_DONUT.map(d => (
            <div key={d.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span className="text-[11px] text-[#6B4A2A] font-medium">{d.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#302D28]">{d.value}</span>
                <span className="text-[10px] text-[#A08060]">{Math.round(d.value / total * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top clientes */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <IconTile Icon={Trophy} from="#C59A18" to="#8A6A08" size={14} tileSize={30} radius="0.5rem" />
          <h3 className="text-sm font-bold text-[#302D28]">Top clientes por ventas</h3>
        </div>
        <div className="space-y-2">
          {TOP_CLIENTES.map((c, i) => {
            const maxVentas = TOP_CLIENTES[0].ventas;
            const pct = (c.ventas / maxVentas) * 100;
            return (
              <div key={c.nombre}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold w-4 text-center"
                      style={{ color: i === 0 ? '#C59A18' : i === 1 ? '#94a3b8' : i === 2 ? '#b06000' : '#A08060' }}>
                      {i + 1}
                    </span>
                    <span className="text-[11px] font-semibold text-[#302D28] truncate max-w-[110px]">{c.nombre}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-extrabold text-[#302D28]">{fmtM(c.ventas)}</span>
                    <span className={`text-[10px] font-bold ${c.cambio >= 0 ? 'text-[#1a6040]' : 'text-[#b83020]'}`}>
                      {c.cambio >= 0 ? '+' : ''}{c.cambio}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full surface-inset overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: `linear-gradient(90deg,#9a5020,#C59A18)`, boxShadow: '0 0 6px rgba(197,154,24,0.4)' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
