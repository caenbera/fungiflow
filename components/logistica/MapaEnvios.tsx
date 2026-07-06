'use client';

import { Truck, MapPin, Navigation, Eye } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { FLOTA, RESUMEN_FLOTA } from './mock-data';

const ESTADO_COLORS: Record<string, { bg: string; color: string }> = {
  'En ruta':         { bg: 'rgba(42,128,85,0.12)',  color: '#2a8055' },
  'En entrega':      { bg: 'rgba(90,42,122,0.12)',  color: '#5a2a7a' },
  'Disponible':      { bg: 'rgba(26,80,112,0.12)',  color: '#1a5070' },
  'En mantenimiento':{ bg: 'rgba(184,48,32,0.12)',  color: '#b83020' },
};

/* Minimalist SVG map of Colombia road network */
function MapaColombia() {
  const vehicles = [
    { x: 210, y: 245, label: 'TRK-001', color: '#2a8055' },
    { x: 240, y: 220, label: 'TRK-002', color: '#2a8055' },
    { x: 185, y: 260, label: 'VAN-001', color: '#5a2a7a' },
    { x: 220, y: 270, label: 'VAN-002', color: '#C59A18' },
    { x: 175, y: 300, label: 'MTC-001', color: '#1a5070' },
  ];
  const destinos = [
    { x: 150, y: 390, label: 'Cali' },
    { x: 340, y: 180, label: 'Bogotá' },
    { x: 145, y: 310, label: 'Pereira' },
    { x: 130, y: 290, label: 'Armenia' },
  ];
  const rutas = [
    { x1:210, y1:245, x2:340, y2:180 },
    { x1:240, y1:220, x2:150, y2:390 },
    { x1:185, y1:260, x2:145, y2:310 },
    { x1:220, y1:270, x2:130, y2:290 },
  ];
  return (
    <svg width="100%" height="100%" viewBox="0 0 480 420" style={{ position:'absolute', inset:0 }}>
      <defs>
        <radialGradient id="mapbg" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#e8f5ee" stopOpacity={0.9}/>
          <stop offset="100%" stopColor="#d4e8dc" stopOpacity={0.7}/>
        </radialGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="rgba(42,128,85,0.6)"/>
        </marker>
      </defs>
      {/* Background */}
      <rect width="480" height="420" fill="url(#mapbg)" rx="16"/>
      {/* Grid lines */}
      {[60,120,180,240,300,360].map(x=><line key={`v${x}`} x1={x} y1={0} x2={x} y2={420} stroke="rgba(42,128,85,0.08)" strokeWidth={1}/>)}
      {[70,140,210,280,350].map(y=><line key={`h${y}`} x1={0} y1={y} x2={480} y2={y} stroke="rgba(42,128,85,0.08)" strokeWidth={1}/>)}
      {/* Colombia outline (simplified) */}
      <path d="M180,60 L210,50 L260,55 L310,80 L350,100 L370,140 L380,190 L360,240 L350,300 L330,360 L290,400 L240,410 L190,400 L160,370 L130,330 L110,280 L100,220 L115,170 L140,120 L160,85 Z"
        fill="rgba(42,128,85,0.06)" stroke="rgba(42,128,85,0.2)" strokeWidth={1.5} strokeLinejoin="round"/>
      {/* Roads */}
      <line x1="160" y1="85" x2="340" y2="180" stroke="rgba(176,96,0,0.25)" strokeWidth={2} strokeDasharray="6,4"/>
      <line x1="200" y1="240" x2="150" y2="390" stroke="rgba(176,96,0,0.25)" strokeWidth={2} strokeDasharray="6,4"/>
      <line x1="190" y1="260" x2="340" y2="180" stroke="rgba(176,96,0,0.20)" strokeWidth={1.5} strokeDasharray="5,4"/>
      <line x1="215" y1="250" x2="130" y2="290" stroke="rgba(176,96,0,0.20)" strokeWidth={1.5} strokeDasharray="5,4"/>
      {/* Active routes */}
      {rutas.map((r,i)=>(
        <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
          stroke="rgba(42,128,85,0.55)" strokeWidth={2} strokeDasharray="8,5"
          markerEnd="url(#arrow)"/>
      ))}
      {/* Destination pins */}
      {destinos.map((d)=>(
        <g key={d.label} transform={`translate(${d.x},${d.y})`}>
          <circle r={5} fill="#b06000" opacity={0.85}/>
          <circle r={2.5} fill="white"/>
          <text x={8} y={4} fontSize={9} fontWeight={700} fill="#5a3010" opacity={0.85}>{d.label}</text>
        </g>
      ))}
      {/* Vehicle icons */}
      {vehicles.map((v)=>(
        <g key={v.label} filter="url(#glow)" transform={`translate(${v.x},${v.y})`} style={{cursor:'pointer'}}>
          <circle r={11} fill={v.color} opacity={0.9}/>
          <circle r={11} fill="none" stroke="white" strokeWidth={1.5} opacity={0.7}/>
          <text x={0} y={4} textAnchor="middle" fontSize={9} fontWeight={900} fill="white">▶</text>
          <text x={0} y={22} textAnchor="middle" fontSize={8} fontWeight={700} fill={v.color}>{v.label}</text>
        </g>
      ))}
      {/* Bodega */}
      <g transform="translate(200,245)">
        <rect x={-14} y={-10} width={28} height={20} rx={4} fill="#1a5070" opacity={0.9}/>
        <text x={0} y={4} textAnchor="middle" fontSize={9} fontWeight={900} fill="white">⊡</text>
        <text x={0} y={22} textAnchor="middle" fontSize={8} fontWeight={700} fill="#1a5070">Bodega</text>
      </g>
    </svg>
  );
}

export function MapaEnvios() {
  return (
    <div className="surface-raised rounded-2xl overflow-hidden">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconTile Icon={Navigation} from="#2a8055" to="#1a5030" size={14} tileSize={30} radius="0.5rem"/>
          <div>
            <h3 className="text-sm font-bold text-[#302D28]">Mapa de envíos en tiempo real</h3>
            <p className="text-[10px] text-[#A08060]">5 vehículos activos • Actualizado hace 2 min</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-[#6B4A2A]"
          style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.10)' }}>
          <Eye size={11}/>Pantalla completa
        </button>
      </div>

      {/* Map area */}
      <div className="relative mx-4 mb-3 rounded-xl overflow-hidden" style={{ height: 240 }}>
        <MapaColombia/>
        {/* Fleet summary overlay */}
        <div className="absolute bottom-2 right-2 rounded-xl p-2.5"
          style={{ background:'rgba(255,249,239,0.92)', backdropFilter:'blur(8px)', border:'1px solid rgba(128,96,62,0.14)', boxShadow:'0 4px 12px rgba(0,0,0,0.10)' }}>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#8A6D3D] mb-1.5">Resumen de flota</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {RESUMEN_FLOTA.map((r) => (
              <div key={r.tipo} className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold text-[#302D28]">{r.count}</span>
                <span className="text-[10px] text-[#6B4A2A]">{r.label ?? r.tipo}</span>
              </div>
            ))}
          </div>
          <button className="mt-2 w-full py-1 rounded-lg text-[10px] font-bold text-white"
            style={{ background:'linear-gradient(145deg,#2a8055,#1a5030)' }}>
            Ver toda la flota
          </button>
        </div>
      </div>

      {/* Fleet table */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <IconTile Icon={Truck} from="#5a2a7a" to="#3a1a50" size={12} tileSize={24} radius="0.4rem"/>
          <h4 className="text-xs font-bold text-[#302D28]">Flota</h4>
        </div>
        <div className="rounded-xl overflow-hidden surface-inset">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-[rgba(128,96,62,0.10)]">
                {['Vehículo','Tipo','Conductor','Estado','Ubicación','Comb.'].map(h=>(
                  <th key={h} className="px-2 py-2 text-left font-bold text-[#8A6D3D] first:pl-3 last:pr-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FLOTA.map((v) => {
                const es = ESTADO_COLORS[v.estado] ?? { bg:'rgba(128,96,62,0.1)', color:'#6B4A2A' };
                return (
                  <tr key={v.id} className="border-b border-[rgba(128,96,62,0.06)] last:border-0 hover:bg-[rgba(128,96,62,0.04)]">
                    <td className="px-2 py-1.5 pl-3 font-bold text-[#302D28]">{v.codigo}</td>
                    <td className="px-2 py-1.5 text-[#6B4A2A]">{v.tipo}</td>
                    <td className="px-2 py-1.5 text-[#6B4A2A]">{v.conductor}</td>
                    <td className="px-2 py-1.5">
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold" style={{ background: es.bg, color: es.color }}>{v.estado}</span>
                    </td>
                    <td className="px-2 py-1.5 text-[#A08060] max-w-[100px] truncate">{v.ubicacion}</td>
                    <td className="px-2 py-1.5 pr-3">
                      <div className="flex items-center gap-1">
                        <div className="flex-1 h-1.5 rounded-full bg-[rgba(128,96,62,0.12)]">
                          <div className="h-full rounded-full" style={{ width:`${v.bateria}%`, background: v.bateria>50?'#2a8055':v.bateria>25?'#C59A18':'#b83020' }}/>
                        </div>
                        <span className="text-[10px] font-bold text-[#6B4A2A] w-6">{v.bateria}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
