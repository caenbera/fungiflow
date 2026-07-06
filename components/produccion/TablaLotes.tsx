'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronDown, SlidersHorizontal, Eye, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { LOTES, ETAPAS_FLUJO, ESTADOS_SELECT, PRODUCTOS_SELECT, ETAPA_COLORES } from './mock-data';
import type { EstadoLote, EtapaLote } from './mock-data';

const ESTADO_DOT: Record<EstadoLote, string> = {
  'En curso':   '#22c55e',
  'Listo':      '#C59A18',
  'Pausado':    '#94a3b8',
  'Completado': '#2a8055',
};

const PAGE_SIZE = 5;
const selStyle: React.CSSProperties = {
  background: 'rgba(236,228,218,0.58)',
  border: '1px solid rgba(128,96,62,0.18)',
  boxShadow: 'inset 0 2px 5px rgba(86,55,28,0.08)',
  appearance: 'none',
};

function ProgressBar({ pct, etapa }: { pct: number; etapa: EtapaLote }) {
  const { color } = ETAPA_COLORES[etapa];
  const done = pct === 100;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full surface-inset overflow-hidden min-w-[70px]">
        <div className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: done ? '#16a34a' : color, boxShadow: `0 0 4px ${color}66` }}/>
      </div>
      <span className="text-[10px] font-bold text-[#302D28] w-7 text-right flex-shrink-0">{pct}%</span>
    </div>
  );
}

export function TablaLotes() {
  const [busqueda, setBusqueda] = useState('');
  const [estado,   setEstado]   = useState('');
  const [producto, setProducto] = useState('');
  const [page,     setPage]     = useState(0);

  const resetPage = (fn: () => void) => { fn(); setPage(0); };

  const filtrados = useMemo(() => LOTES.filter(l => {
    const q = busqueda.toLowerCase();
    if (q && !l.numero.toLowerCase().includes(q) && !l.producto.toLowerCase().includes(q)) return false;
    if (estado   && l.estado   !== estado)   return false;
    if (producto && !l.producto.toLowerCase().includes(producto.split(' ')[0].toLowerCase())) return false;
    return true;
  }), [busqueda, estado, producto]);

  const pages = Math.ceil(filtrados.length / PAGE_SIZE);
  const slice = filtrados.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="surface-raised rounded-2xl p-4 flex flex-col gap-3">
      <h3 className="text-sm font-bold text-[#302D28]">Lotes en producción</h3>

      {/* Filtros */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A08060]"/>
          <input value={busqueda} onChange={e => resetPage(() => setBusqueda(e.target.value))}
            placeholder="Buscar lote, producto o ubicación..."
            className="w-full pl-8 pr-3 py-2 rounded-xl text-xs font-medium text-[#302D28] outline-none focus:ring-2 focus:ring-[#9a5020]/30"
            style={selStyle}/>
        </div>
        {[
          { label:'Estado',   value:estado,   options:ESTADOS_SELECT,  onChange:(v:string)=>resetPage(()=>setEstado(v))   },
          { label:'Producto', value:producto, options:PRODUCTOS_SELECT, onChange:(v:string)=>resetPage(()=>setProducto(v)) },
        ].map(({ label, value, options, onChange }) => (
          <div key={label} className="relative">
            <select value={value} onChange={e => onChange(e.target.value)}
              className="pl-3 pr-7 py-2 rounded-xl text-xs font-medium text-[#302D28] outline-none cursor-pointer"
              style={selStyle}>
              <option value="">{label}: Todos</option>
              {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A08060] pointer-events-none"/>
          </div>
        ))}
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
          style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 3px 8px rgba(88,57,31,0.12)', color:'#6B451D' }}>
          <SlidersHorizontal size={12}/>Filtros
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ tableLayout:'fixed', minWidth:860 }}>
          <colgroup>
            <col style={{width:110}}/><col style={{width:175}}/><col style={{width:100}}/>
            <col style={{width:80}}/><col style={{width:130}}/><col style={{width:140}}/>
            <col style={{width:130}}/><col style={{width:72}}/><col style={{width:70}}/>
          </colgroup>
          <thead>
            <tr className="border-b border-[rgba(128,96,62,0.12)]">
              {['Lote','Producto','Etapa actual','Inicio','Progreso','Ubicación','Próxima acción','Estado','Acciones'].map(h => (
                <th key={h} className="text-left pb-2 pr-3 text-[#A08060] font-bold uppercase tracking-wide text-[10px] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(128,96,62,0.08)]">
            {slice.map(l => {
              const etapaSt = ETAPA_COLORES[l.etapa];
              const dot     = ESTADO_DOT[l.estado];
              return (
                <tr key={l.id} className="hover:bg-[rgba(245,239,230,0.5)] transition-colors">
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dot }}/>
                      <span className="font-mono text-[10px] font-bold text-[#2a5080] hover:underline cursor-pointer">{l.numero}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3">
                    <div>
                      <p className="font-semibold text-[#302D28] truncate">{l.producto}</p>
                      <p className="text-[10px] text-[#A08060] italic truncate">{l.nombreCientifico}</p>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap"
                      style={{ color: etapaSt.color, background: etapaSt.bg }}>{l.etapa}</span>
                  </td>
                  <td className="py-2.5 pr-3 text-[#A08060] text-[10px] whitespace-nowrap">{l.inicio}</td>
                  <td className="py-2.5 pr-3"><ProgressBar pct={l.progreso} etapa={l.etapa}/></td>
                  <td className="py-2.5 pr-3 text-[#6B4A2A] text-[11px] truncate">{l.ubicacion}</td>
                  <td className="py-2.5 pr-3 text-[#6B4A2A] text-[11px] truncate">{l.proximaAccion}</td>
                  <td className="py-2.5 pr-3">
                    <span className="text-[10px] font-bold" style={{ color: l.estado === 'Listo' ? '#8A6A08' : '#1a6040' }}>{l.estado}</span>
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-1">
                      {[Eye, MoreVertical].map((Icon, i) => (
                        <button key={i} className="w-6 h-6 rounded-lg flex items-center justify-center transition-transform hover:scale-110"
                          style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.12)', color:'#6B451D' }}>
                          <Icon size={11} strokeWidth={2}/>
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between pt-1 border-t border-[rgba(128,96,62,0.08)]">
        <span className="text-[11px] text-[#A08060]">
          Mostrando {filtrados.length===0?0:page*PAGE_SIZE+1}–{Math.min((page+1)*PAGE_SIZE,filtrados.length)} de {filtrados.length} lotes
        </span>
        <div className="flex items-center gap-1">
          <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0}
            className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-40"
            style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.12)', color:'#6B451D' }}>
            <ChevronLeft size={12}/>
          </button>
          {Array.from({length:Math.min(pages,5)},(_,i)=>(
            <button key={i} onClick={()=>setPage(i)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold"
              style={{ background:i===page?'linear-gradient(145deg,#9a5020,#6a3010)':'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.12)', color:i===page?'#fff':'#6B451D' }}>
              {i+1}
            </button>
          ))}
          {pages>5&&<span className="text-[#A08060] text-xs px-1">…</span>}
          <button onClick={()=>setPage(p=>Math.min(pages-1,p+1))} disabled={page>=pages-1}
            className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-40"
            style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.12)', color:'#6B451D' }}>
            <ChevronRight size={12}/>
          </button>
        </div>
      </div>
    </div>
  );
}
