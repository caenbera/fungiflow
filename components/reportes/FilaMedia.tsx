'use client';

import { useState } from 'react';
import { BarChart2, Users } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { PRODUCCION_ESPECIE, VENTAS_CANAL, TOP_CLIENTES } from './mock-data';

/* ── 3D Donut helpers ── */
function polar(cx:number,cy:number,r:number,deg:number){const rad=(deg-90)*(Math.PI/180);return{x:cx+r*Math.cos(rad),y:cy+r*Math.sin(rad)};}
function darken(hex:string,amt=40){const n=parseInt(hex.slice(1),16);const r=Math.max(0,(n>>16)-amt);const g=Math.max(0,((n>>8)&0xff)-amt);const b=Math.max(0,(n&0xff)-amt);return`#${[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('')}`;}
function lighten(hex:string,amt=30){const n=parseInt(hex.slice(1),16);const r=Math.min(255,(n>>16)+amt);const g=Math.min(255,((n>>8)&0xff)+amt);const b=Math.min(255,(n&0xff)+amt);return`#${[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('')}`;}
function Seg({cx,cy,oR,iR,depth,s,e,color,hov,onHov}:{cx:number;cy:number;oR:number;iR:number;depth:number;s:number;e:number;color:string;hov:boolean;onHov:(v:boolean)=>void}){
  const gap=2.5;const sa=s+gap;const ea=e-gap;if(ea-sa<1)return null;
  const ly=hov?-3:0;const ex=hov?2:0;const OR=oR+ex;const large=(ea-sa)>180?1:0;
  const o1=polar(cx,cy+ly,OR,sa);const o2=polar(cx,cy+ly,OR,ea);
  const i1=polar(cx,cy+ly,iR,sa);const i2=polar(cx,cy+ly,iR,ea);
  const ob1=polar(cx,cy+ly+depth,OR,sa);const ob2=polar(cx,cy+ly+depth,OR,ea);
  const ib1=polar(cx,cy+ly+depth,iR,sa);const ib2=polar(cx,cy+ly+depth,iR,ea);
  const top=`M${o1.x} ${o1.y} A${OR} ${OR} 0 ${large} 1 ${o2.x} ${o2.y} L${i2.x} ${i2.y} A${iR} ${iR} 0 ${large} 0 ${i1.x} ${i1.y}Z`;
  const side=`M${o1.x} ${o1.y} A${OR} ${OR} 0 ${large} 1 ${o2.x} ${o2.y} L${ob2.x} ${ob2.y} A${OR} ${OR} 0 ${large} 0 ${ob1.x} ${ob1.y}Z`;
  const inn=`M${i1.x} ${i1.y} A${iR} ${iR} 0 ${large} 1 ${i2.x} ${i2.y} L${ib2.x} ${ib2.y} A${iR} ${iR} 0 ${large} 0 ${ib1.x} ${ib1.y}Z`;
  const lc=`M${o1.x} ${o1.y} L${ob1.x} ${ob1.y} L${ib1.x} ${ib1.y} L${i1.x} ${i1.y}Z`;
  const rc=`M${o2.x} ${o2.y} L${ob2.x} ${ob2.y} L${ib2.x} ${ib2.y} L${i2.x} ${i2.y}Z`;
  const dk=darken(color,50);const md=darken(color,25);const br=lighten(color,20);
  const id=`repvc-${color.slice(1)}-${Math.round(s)}`;
  return(
    <g style={{cursor:'pointer'}} onMouseEnter={()=>onHov(true)} onMouseLeave={()=>onHov(false)}>
      <defs>
        <linearGradient id={`${id}-t`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={br}/><stop offset="100%" stopColor={color}/></linearGradient>
        <linearGradient id={`${id}-s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={md}/><stop offset="100%" stopColor={dk}/></linearGradient>
      </defs>
      <path d={inn} fill={dk} opacity={0.5}/>
      <path d={side} fill={`url(#${id}-s)`} stroke="rgba(255,255,255,0.18)" strokeWidth={0.5}/>
      <path d={lc} fill={md} stroke="rgba(255,255,255,0.12)" strokeWidth={0.5}/>
      <path d={rc} fill={md} stroke="rgba(255,255,255,0.12)" strokeWidth={0.5}/>
      <path d={top} fill={`url(#${id}-t)`} stroke="rgba(255,255,255,0.38)" strokeWidth={hov?1.5:0.8}
        style={{filter:hov?`drop-shadow(0 0 5px ${color}88)`:undefined}}/>
    </g>
  );
}

/* ── Producción por especie ── */
function ProduccionEspecie() {
  const max = Math.max(...PRODUCCION_ESPECIE.map(d=>d.kg));
  return (
    <div className="surface-raised rounded-2xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <IconTile Icon={BarChart2} from="#2a8055" to="#1a5030" size={14} tileSize={30} radius="0.5rem"/>
          <h3 className="text-sm font-bold text-[#302D28]">Producción por especie (kg)</h3>
        </div>
        <button className="px-2 py-1 rounded-lg text-[11px] font-bold text-[#6B4A2A]"
          style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.10)' }}>
          Este mes ▾
        </button>
      </div>
      <div className="flex flex-col gap-3 flex-1 justify-center">
        {PRODUCCION_ESPECIE.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="text-[10px] text-[#6B4A2A] w-36 flex-shrink-0 truncate">{d.name}</span>
            <div className="flex-1 h-2 rounded-full bg-[rgba(128,96,62,0.10)]">
              <div className="h-full rounded-full transition-all"
                style={{ width:`${(d.kg/max)*100}%`, background:`linear-gradient(90deg,${d.color},${d.color}bb)` }}/>
            </div>
            <span className="text-[11px] font-bold text-[#302D28] w-14 text-right flex-shrink-0">{d.kg.toLocaleString()} kg</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Ventas por canal ── */
function VentasCanal() {
  const [hov, setHov] = useState<number|null>(null);
  const total = VENTAS_CANAL.reduce((s,d)=>s+d.value,0);
  const cx=70; const cy=70; const oR=58; const iR=35; const depth=12;
  let cursor=0;
  const segs = VENTAS_CANAL.map(d=>{const sw=(d.value/total)*360;const st=cursor;cursor+=sw;return{...d,start:st,end:cursor};});
  return (
    <div className="surface-raised rounded-2xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <IconTile Icon={BarChart2} from="#1a5070" to="#0e3050" size={14} tileSize={30} radius="0.5rem"/>
          <h3 className="text-sm font-bold text-[#302D28]">Ventas por canal</h3>
        </div>
        <button className="px-2 py-1 rounded-lg text-[11px] font-bold text-[#6B4A2A]"
          style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.10)' }}>
          Este mes ▾
        </button>
      </div>
      <div className="flex items-center gap-3 flex-1">
        <svg width={140} height={140} viewBox="0 0 140 140" style={{overflow:'visible',flexShrink:0}}>
          {segs.map((seg,i)=>(
            <Seg key={seg.name} cx={cx} cy={cy} oR={oR} iR={iR} depth={depth}
              s={seg.start} e={seg.end} color={seg.color}
              hov={hov===i} onHov={v=>setHov(v?i:null)}/>
          ))}
          <text x={cx} y={cy+2} textAnchor="middle" fontSize={8} fontWeight={700} fill="#A08060">Total</text>
          <text x={cx} y={cy+14} textAnchor="middle" fontSize={14} fontWeight={900} fill="#302D28">{(total/1000).toFixed(1)}k</text>
          <text x={cx} y={cy+26} textAnchor="middle" fontSize={8} fontWeight={600} fill="#A08060">kg</text>
        </svg>
        <div className="flex-1 min-w-0 space-y-2">
          {VENTAS_CANAL.map((d,i)=>(
            <div key={d.name} className="flex items-center gap-1.5"
              onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:d.color}}/>
              <span className="text-[10px] text-[#6B4A2A] flex-1 min-w-0 truncate">{d.name}</span>
              <span className="text-[10px] font-bold text-[#302D28]">{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Top clientes ── */
function TopClientes() {
  const max = TOP_CLIENTES[0].kg;
  return (
    <div className="surface-raised rounded-2xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <IconTile Icon={Users} from="#C59A18" to="#8A6A08" size={14} tileSize={30} radius="0.5rem"/>
          <h3 className="text-sm font-bold text-[#302D28]">Top 5 clientes por ventas (kg)</h3>
        </div>
        <button className="px-2 py-1 rounded-lg text-[11px] font-bold text-[#6B4A2A]"
          style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.10)' }}>
          Este mes ▾
        </button>
      </div>
      <div className="flex flex-col gap-2.5 flex-1 justify-center">
        {TOP_CLIENTES.map((c) => (
          <div key={c.nombre} className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-lg flex-shrink-0 flex items-center justify-center text-[9px] font-extrabold text-white"
              style={{ background:c.color }}>{c.rank}</span>
            <span className="flex-1 text-[11px] text-[#302D28] font-medium min-w-0 truncate">{c.nombre}</span>
            <div className="flex items-center gap-1.5">
              <div className="w-20 h-1.5 rounded-full bg-[rgba(128,96,62,0.10)]">
                <div className="h-full rounded-full" style={{ width:`${(c.kg/max)*100}%`, background:c.color }}/>
              </div>
              <span className="text-[10px] font-bold text-[#302D28] w-12 text-right">{c.kg.toLocaleString()} kg</span>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-3 w-full py-2 rounded-xl text-[11px] font-bold text-[#6B4A2A] hover:scale-[1.01] transition-transform"
        style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.10)' }}>
        Ver todos los clientes
      </button>
    </div>
  );
}

export function FilaMedia() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <ProduccionEspecie/>
      <VentasCanal/>
      <TopClientes/>
    </div>
  );
}
