'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Scale, BarChart2, History } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { PRODUCCION_ESPECIE, RENDIMIENTO_LOTE, HISTORIAL } from './mock-data';

/* ── 3D Donut ── */
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
  const id=`pp3d-${color.slice(1)}`;
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

const tooltipStyle={background:'rgba(255,249,239,0.96)',border:'1px solid rgba(128,96,62,0.2)',borderRadius:8,fontSize:11,boxShadow:'0 4px 12px rgba(0,0,0,0.12)'};

export function AnalyticsFilaProduccion() {
  const [hov, setHov] = useState<number|null>(null);
  const total = PRODUCCION_ESPECIE.reduce((s,d)=>s+d.value,0);
  const cx=85;const cy=72;const oR=60;const iR=36;const depth=14;
  let cursor=0;
  const segs=PRODUCCION_ESPECIE.map(d=>{const sw=(d.value/total)*360;const st=cursor;cursor+=sw;return{...d,start:st,end:cursor};});

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

      {/* Producción por especie */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <IconTile Icon={Scale} from="#2a8055" to="#1a5030" size={14} tileSize={30} radius="0.5rem"/>
            <h3 className="text-sm font-bold text-[#302D28]">Producción por especie (kg)</h3>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <svg width={170} height={150} viewBox="0 0 170 150" style={{overflow:'visible',flexShrink:0}}>
            {segs.map((seg,i)=>(
              <Seg key={seg.name} cx={cx} cy={cy} oR={oR} iR={iR} depth={depth}
                s={seg.start} e={seg.end} color={seg.color}
                hov={hov===i} onHov={v=>setHov(v?i:null)}/>
            ))}
            <text x={cx} y={cy+2} textAnchor="middle" fontSize={9} fontWeight={700} fill="#A08060" letterSpacing="0.05em">Total</text>
            <text x={cx} y={cy+16} textAnchor="middle" fontSize={16} fontWeight={900} fill="#302D28">1,250</text>
            <text x={cx} y={cy+28} textAnchor="middle" fontSize={9} fontWeight={600} fill="#A08060">kg</text>
          </svg>
          <div className="space-y-2 flex-1">
            {PRODUCCION_ESPECIE.map(d=>(
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:d.color}}/>
                  <span className="text-[11px] text-[#6B4A2A] font-medium">{d.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-[#302D28]">{d.pct}%</span>
                  <span className="text-[10px] text-[#A08060] ml-1">({d.value} kg)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rendimiento por lote */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IconTile Icon={BarChart2} from="#5a2a7a" to="#3a1a50" size={14} tileSize={30} radius="0.5rem"/>
            <h3 className="text-sm font-bold text-[#302D28]">Rendimiento por lote (%)</h3>
          </div>
          <button className="flex items-center gap-1 text-[11px] font-bold text-[#6B4A2A] px-2 py-1 rounded-lg"
            style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.10)' }}>
            Este mes <ChevronDown size={10}/>
          </button>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={RENDIMIENTO_LOTE} margin={{top:16,right:4,left:-20,bottom:0}} barSize={28}>
            <XAxis dataKey="lote" tick={{fontSize:9,fill:'#A08060'}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:9,fill:'#A08060'}} axisLine={false} tickLine={false} domain={[0,45]} tickFormatter={v=>`${v}%`}/>
            <Tooltip formatter={v=>[`${v}%`,'Rendimiento']} contentStyle={tooltipStyle}/>
            <Bar dataKey="pct" radius={[5,5,0,0]} label={{ position:'top', fontSize:10, fontWeight:700, fill:'#302D28', formatter:(v:unknown)=>`${v}%` }}>
              {RENDIMIENTO_LOTE.map((_, i) => (
                <Cell key={i} fill="url(#barProd)"/>
              ))}
            </Bar>
            <defs>
              <linearGradient id="barProd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2a8055"/><stop offset="100%" stopColor="#1a5030"/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Historial de producción */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IconTile Icon={History} from="#C59A18" to="#8A6A08" size={14} tileSize={30} radius="0.5rem"/>
            <h3 className="text-sm font-bold text-[#302D28]">Historial de producción</h3>
          </div>
          <button className="text-[11px] font-bold text-[#7a4010] hover:underline">Ver todos</button>
        </div>
        <div className="space-y-2.5">
          {HISTORIAL.map((h, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                style={{ background: h.bg, border: `1px solid ${h.color}22` }}>
                <span className="text-[10px] font-extrabold" style={{ color: h.color }}>
                  {h.accion.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-[#302D28] truncate">{h.accion}</p>
                <p className="text-[10px] font-bold" style={{ color: h.color }}>{h.lote}</p>
                <p className="text-[10px] text-[#A08060]">{h.detalle}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] text-[#A08060] whitespace-nowrap">{h.fecha}</p>
                <p className="text-[10px] text-[#A08060]">{h.hora}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function ChevronDown({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}
