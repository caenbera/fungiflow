'use client';

import { useState } from 'react';
import { PieChart } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { DISTRIBUCION_INGRESOS } from './mock-data';

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
  const id=`repd-${color.slice(1)}-${Math.round(s)}`;
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

export function DistribucionIngresos() {
  const [hov, setHov] = useState<number|null>(null);
  const total = DISTRIBUCION_INGRESOS.reduce((s,d)=>s+d.value,0);
  const cx=85; const cy=78; const oR=65; const iR=40; const depth=14;
  let cursor=0;
  const segs = DISTRIBUCION_INGRESOS.map(d=>{const sw=(d.value/total)*360;const st=cursor;cursor+=sw;return{...d,start:st,end:cursor};});

  return (
    <div className="surface-raised rounded-2xl p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <IconTile Icon={PieChart} from="#5a2a7a" to="#3a1a50" size={14} tileSize={30} radius="0.5rem"/>
        <div>
          <h3 className="text-sm font-bold text-[#302D28]">Distribución de ingresos</h3>
          <p className="text-[10px] text-[#A08060]">por categoría</p>
        </div>
        <button className="ml-auto px-2 py-1 rounded-lg text-[11px] font-bold text-[#6B4A2A]"
          style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.10)' }}>
          Este mes ▾
        </button>
      </div>

      <div className="flex justify-center">
        <svg width={170} height={160} viewBox="0 0 170 160" style={{overflow:'visible'}}>
          {segs.map((seg,i)=>(
            <Seg key={seg.name} cx={cx} cy={cy} oR={oR} iR={iR} depth={depth}
              s={seg.start} e={seg.end} color={seg.color}
              hov={hov===i} onHov={v=>setHov(v?i:null)}/>
          ))}
          <text x={cx} y={cy+2} textAnchor="middle" fontSize={8} fontWeight={700} fill="#A08060">Total</text>
          <text x={cx} y={cy+16} textAnchor="middle" fontSize={13} fontWeight={900} fill="#302D28">$152.4M</text>
          <text x={cx} y={cy+28} textAnchor="middle" fontSize={8} fontWeight={600} fill="#A08060">COP</text>
        </svg>
      </div>

      <div className="space-y-1.5 mt-2">
        {DISTRIBUCION_INGRESOS.map((d,i)=>(
          <div key={d.name} className="flex items-center gap-2"
            onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:d.color}}/>
            <span className="text-[10px] text-[#6B4A2A] flex-1 min-w-0 truncate">{d.name}</span>
            <span className="text-[10px] font-bold text-[#302D28]">{d.pct}%</span>
            <span className="text-[9px] text-[#A08060] w-16 text-right">(${(d.value/1000).toFixed(0)}k)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
