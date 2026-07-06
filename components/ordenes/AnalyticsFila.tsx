'use client';

import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, Bell } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { ESTADO_DONUT, TIEMPO_ENTREGA, AHORROS_TREND, ALERTAS } from './mock-data';

/* ── 3D Donut reutilizable ── */
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
  const id=`od3d-${color.slice(1)}`;
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

export function AnalyticsFilaOrd() {
  const [hov, setHov] = useState<number|null>(null);
  const total = ESTADO_DONUT.reduce((s,d)=>s+d.value,0);
  const cx=70;const cy=62;const oR=52;const iR=30;const depth=12;
  let cursor=0;
  const segs=ESTADO_DONUT.filter(d=>d.value>0).map(d=>{const sw=(d.value/total)*360;const st=cursor;cursor+=sw;return{...d,start:st,end:cursor};});

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">

      {/* Estado de órdenes — donut 3D */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-[#302D28]">Estado de órdenes</h3>
          <button className="text-[11px] font-bold text-[#7a4010] hover:underline">Ver reporte</button>
        </div>
        <div className="flex gap-3 items-center">
          <svg width={140} height={130} viewBox="0 0 140 130" style={{overflow:'visible',flexShrink:0}}>
            {segs.map((seg,i)=>(
              <Seg key={seg.name} cx={cx} cy={cy} oR={oR} iR={iR} depth={depth}
                s={seg.start} e={seg.end} color={seg.color}
                hov={hov===i} onHov={v=>setHov(v?i:null)}/>
            ))}
            <text x={cx} y={cy+4} textAnchor="middle" fontSize={14} fontWeight={800} fill="#302D28">Total</text>
            <text x={cx} y={cy+16} textAnchor="middle" fontSize={18} fontWeight={900} fill="#302D28">{total}</text>
          </svg>
          <div className="space-y-1.5">
            {ESTADO_DONUT.map(d=>(
              <div key={d.name} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:d.color}}/>
                  <span className="text-[10px] text-[#6B4A2A] font-medium">{d.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-[#302D28]">{d.value}</span>
                  <span className="text-[9px] text-[#A08060]">({d.pct}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tiempo promedio de entrega */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <IconTile Icon={Clock} from="#1a5070" to="#0e3050" size={14} tileSize={30} radius="0.5rem"/>
            <h3 className="text-sm font-bold text-[#302D28]">Tiempo promedio de entrega</h3>
          </div>
          <button className="text-[11px] font-bold text-[#7a4010] hover:underline">Ver reporte</button>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-extrabold text-[#302D28]">5.6</span>
          <span className="text-sm font-semibold text-[#6B4A2A]">días</span>
          <span className="text-[11px] font-bold text-[#b83020] bg-[rgba(184,48,32,0.10)] px-1.5 py-0.5 rounded-full">↓ 1.2 días vs mes anterior</span>
        </div>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={TIEMPO_ENTREGA} margin={{top:4,right:4,left:-24,bottom:0}} barSize={18}>
            <XAxis dataKey="mes" tick={{fontSize:9,fill:'#A08060'}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:9,fill:'#A08060'}} axisLine={false} tickLine={false} domain={[0,12]}/>
            <Tooltip formatter={v=>[`${v} días`,'Promedio']} contentStyle={tooltipStyle}/>
            <Bar dataKey="dias" radius={[4,4,0,0]} fill="url(#barOrd)"/>
            <defs>
              <linearGradient id="barOrd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2a8055"/><stop offset="100%" stopColor="#1a5030"/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Ahorros por negociación */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <IconTile Icon={TrendingUp} from="#C59A18" to="#8A6A08" size={14} tileSize={30} radius="0.5rem"/>
            <h3 className="text-sm font-bold text-[#302D28]">Ahorros por negociación</h3>
          </div>
          <button className="text-[11px] font-bold text-[#7a4010] hover:underline">Ver reporte</button>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-extrabold text-[#302D28]">$6,780,000</span>
          <span className="text-[10px] font-bold text-[#6B4A2A]">COP</span>
        </div>
        <span className="text-[11px] font-bold text-[#1a6040] bg-[rgba(26,96,64,0.10)] px-1.5 py-0.5 rounded-full">↑ 11.3% vs mes anterior</span>
        <ResponsiveContainer width="100%" height={90} className="mt-2">
          <LineChart data={AHORROS_TREND} margin={{top:4,right:8,left:-24,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,96,62,0.1)"/>
            <XAxis dataKey="mes" tick={{fontSize:9,fill:'#A08060'}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:9,fill:'#A08060'}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}M`}/>
            <Tooltip formatter={v=>[`$${v}M`,'Ahorros']} contentStyle={tooltipStyle}/>
            <Line type="monotone" dataKey="valor" stroke="#C59A18" strokeWidth={2.5}
              dot={{r:3,fill:'#C59A18'}} activeDot={{r:5}}/>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Alertas y pendientes */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <IconTile Icon={Bell} from="#b83020" to="#7a1a10" size={14} tileSize={30} radius="0.5rem"/>
          <h3 className="text-sm font-bold text-[#302D28]">Alertas y pendientes</h3>
        </div>
        <div className="space-y-2">
          {ALERTAS.map((a,i)=>(
            <div key={i} className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
              style={{background:a.bg, border:`1px solid ${a.color}22`}}>
              <span className="text-[11px] font-semibold text-[#302D28] leading-tight">{a.label}</span>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-sm font-extrabold" style={{color:a.color}}>{a.count}</span>
                <span className="text-[10px] font-bold" style={{color:a.color}}>›</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
