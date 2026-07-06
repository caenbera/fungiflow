'use client';

import { useState } from 'react';
import { Tag, Star, BarChart3, Sparkles } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { CATEGORIAS_SIDEBAR, DESTACADOS, STOCK_ESTADO, NUEVOS_PRODUCTOS } from './mock-data';

/* ── 3D Donut (reutilizado del patrón de clientes) ── */
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function darken(hex: string, amt = 40) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (n >> 16) - amt);
  const g = Math.max(0, ((n >> 8) & 0xff) - amt);
  const b = Math.max(0, (n & 0xff) - amt);
  return `#${[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('')}`;
}
function lighten(hex: string, amt = 30) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (n >> 16) + amt);
  const g = Math.min(255, ((n >> 8) & 0xff) + amt);
  const b = Math.min(255, (n & 0xff) + amt);
  return `#${[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('')}`;
}

function Seg3D({ cx,cy,outerR,innerR,depth,startDeg,endDeg,color,hovered,onHover }: {
  cx:number;cy:number;outerR:number;innerR:number;depth:number;
  startDeg:number;endDeg:number;color:string;hovered:boolean;onHover:(v:boolean)=>void;
}) {
  const gap=2.5; const s=startDeg+gap; const e=endDeg-gap;
  if(e-s<1) return null;
  const lift=hovered?-3:0; const extra=hovered?2:0;
  const oR=outerR+extra; const iR=innerR; const large=(e-s)>180?1:0;
  const o1=polar(cx,cy+lift,oR,s); const o2=polar(cx,cy+lift,oR,e);
  const i1=polar(cx,cy+lift,iR,s); const i2=polar(cx,cy+lift,iR,e);
  const ob1=polar(cx,cy+lift+depth,oR,s); const ob2=polar(cx,cy+lift+depth,oR,e);
  const ib1=polar(cx,cy+lift+depth,iR,s); const ib2=polar(cx,cy+lift+depth,iR,e);
  const top=`M${o1.x} ${o1.y} A${oR} ${oR} 0 ${large} 1 ${o2.x} ${o2.y} L${i2.x} ${i2.y} A${iR} ${iR} 0 ${large} 0 ${i1.x} ${i1.y}Z`;
  const side=`M${o1.x} ${o1.y} A${oR} ${oR} 0 ${large} 1 ${o2.x} ${o2.y} L${ob2.x} ${ob2.y} A${oR} ${oR} 0 ${large} 0 ${ob1.x} ${ob1.y}Z`;
  const inner=`M${i1.x} ${i1.y} A${iR} ${iR} 0 ${large} 1 ${i2.x} ${i2.y} L${ib2.x} ${ib2.y} A${iR} ${iR} 0 ${large} 0 ${ib1.x} ${ib1.y}Z`;
  const lc=`M${o1.x} ${o1.y} L${ob1.x} ${ob1.y} L${ib1.x} ${ib1.y} L${i1.x} ${i1.y}Z`;
  const rc=`M${o2.x} ${o2.y} L${ob2.x} ${ob2.y} L${ib2.x} ${ib2.y} L${i2.x} ${i2.y}Z`;
  const dk=darken(color,50); const md=darken(color,25); const br=lighten(color,20);
  const id=`ps3d-${color.slice(1)}`;
  return (
    <g style={{cursor:'pointer'}} onMouseEnter={()=>onHover(true)} onMouseLeave={()=>onHover(false)}>
      <defs>
        <linearGradient id={`${id}-t`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={br}/><stop offset="100%" stopColor={color}/></linearGradient>
        <linearGradient id={`${id}-s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={md}/><stop offset="100%" stopColor={dk}/></linearGradient>
      </defs>
      <path d={inner} fill={dk} opacity={0.5}/>
      <path d={side} fill={`url(#${id}-s)`} stroke="rgba(255,255,255,0.18)" strokeWidth={0.5}/>
      <path d={lc} fill={md} stroke="rgba(255,255,255,0.12)" strokeWidth={0.5}/>
      <path d={rc} fill={md} stroke="rgba(255,255,255,0.12)" strokeWidth={0.5}/>
      <path d={top} fill={`url(#${id}-t)`} stroke="rgba(255,255,255,0.38)" strokeWidth={hovered?1.5:0.8}
        style={{filter:hovered?`drop-shadow(0 0 5px ${color}88)`:undefined}}/>
    </g>
  );
}

function Donut3DStock() {
  const [hovered,setHovered]=useState<number|null>(null);
  const total=STOCK_ESTADO.reduce((s,d)=>s+d.value,0);
  const cx=80;const cy=60;const oR=50;const iR=30;const depth=11;
  let cursor=0;
  const segs=STOCK_ESTADO.map(d=>{const sw=(d.value/total)*360;const st=cursor;cursor+=sw;return{...d,start:st,end:cursor};});
  return (
    <div>
      <div className="flex justify-center">
        <svg width={160} height={130} viewBox="0 0 160 130" style={{overflow:'visible'}}>
          {segs.map((seg,i)=>(
            <Seg3D key={seg.name} cx={cx} cy={cy} outerR={oR} innerR={iR} depth={depth}
              startDeg={seg.start} endDeg={seg.end} color={seg.color}
              hovered={hovered===i} onHover={v=>setHovered(v?i:null)}/>
          ))}
          <text x={cx} y={cy+4} textAnchor="middle" fontSize={13} fontWeight={800} fill="#302D28">278,450</text>
          <text x={cx} y={cy+15} textAnchor="middle" fontSize={7} fontWeight={700} fill="#A08060" letterSpacing="0.1em">UNIDADES</text>
        </svg>
      </div>
      <div className="space-y-1">
        {STOCK_ESTADO.map(d=>(
          <div key={d.name} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{background:d.color}}/>
              <span className="text-[11px] text-[#6B4A2A] font-medium">{d.name}</span>
            </div>
            <span className="text-[11px] font-bold text-[#302D28]">{d.pct}% ({(d.value/1000).toFixed(0)}K)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SidebarProductos() {
  return (
    <div className="flex flex-col gap-3">

      {/* Categorías */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IconTile Icon={Tag} from="#b06000" to="#7a3a00" size={14} tileSize={30} radius="0.5rem"/>
            <h3 className="text-sm font-bold text-[#302D28]">Categorías</h3>
          </div>
          <button className="text-[11px] font-bold text-[#7a4010] hover:underline">Ver todas</button>
        </div>
        <div className="space-y-2">
          {CATEGORIAS_SIDEBAR.map(c=>(
            <div key={c.nombre} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm"
                  style={{background:`linear-gradient(135deg,${c.from},${c.to})`}}/>
                <span className="text-[11px] text-[#6B4A2A] font-medium truncate max-w-[130px]">{c.nombre}</span>
              </div>
              <span className="text-[11px] font-bold text-[#302D28]">{c.count} productos</span>
            </div>
          ))}
        </div>
      </div>

      {/* Productos destacados */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IconTile Icon={Star} from="#C59A18" to="#8A6A08" size={14} tileSize={30} radius="0.5rem"/>
            <h3 className="text-sm font-bold text-[#302D28]">Productos destacados</h3>
          </div>
          <button className="text-[11px] font-bold text-[#7a4010] hover:underline">Ver todos</button>
        </div>
        <div className="space-y-2.5">
          {DESTACADOS.map((d,i)=>(
            <div key={d.nombre} className="flex items-center gap-2.5">
              <span className="text-[11px] font-extrabold w-4 text-center flex-shrink-0"
                style={{color:i===0?'#C59A18':i===1?'#94a3b8':'#b06000'}}>
                {d.rank}
              </span>
              <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                style={{background:'linear-gradient(145deg,#C59A18,#8A6A08)',boxShadow:'0 2px 6px rgba(0,0,0,0.15)'}}>
                {d.nombre.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-[#302D28] truncate">{d.nombre}</p>
                <p className="text-[10px] text-[#A08060]">{d.tag}</p>
              </div>
              <span className="text-[11px] font-extrabold text-[#302D28] flex-shrink-0">{d.valor}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stock por estado */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <IconTile Icon={BarChart3} from="#2a8055" to="#1a5030" size={14} tileSize={30} radius="0.5rem"/>
          <h3 className="text-sm font-bold text-[#302D28]">Stock por estado</h3>
        </div>
        <Donut3DStock/>
      </div>

      {/* Nuevos productos */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IconTile Icon={Sparkles} from="#5a2a7a" to="#3a1a50" size={14} tileSize={30} radius="0.5rem"/>
            <h3 className="text-sm font-bold text-[#302D28]">Nuevos productos</h3>
          </div>
          <button className="text-[11px] font-bold text-[#7a4010] hover:underline">Ver todos</button>
        </div>
        {NUEVOS_PRODUCTOS.map(p=>(
          <div key={p.nombre} className="flex gap-2.5">
            <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold text-white"
              style={{background:'linear-gradient(145deg,#5a2a7a,#3a1a50)',boxShadow:'0 2px 8px rgba(0,0,0,0.18)'}}>
              {p.nombre.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-[#302D28] truncate">{p.nombre}</p>
              <p className="text-[10px] text-[#A08060]">Lanzado el {p.fecha}</p>
              <p className="text-[10px] text-[#A08060]">Ventas: {p.ventas} uds · Ingresos: ${p.ingresos.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
