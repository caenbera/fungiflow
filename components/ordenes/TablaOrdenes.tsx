'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronDown, SlidersHorizontal, Eye, MoreVertical, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { ORDENES, ESTADOS_SELECT, PROVEEDORES_SELECT, FECHA_SELECT } from './mock-data';
import type { EstadoOrden } from './mock-data';

const ESTADO_STYLE: Record<EstadoOrden, { color: string; bg: string }> = {
  'En proceso': { color: '#8A6A08', bg: 'rgba(197,154,24,0.14)' },
  'Pendiente':  { color: '#1a4070', bg: 'rgba(26,80,112,0.12)'  },
  'Completada': { color: '#1a6040', bg: 'rgba(26,96,64,0.12)'   },
  'Cancelada':  { color: '#7a1a1a', bg: 'rgba(184,48,32,0.12)'  },
};

const PAGE_SIZE = 8;

const selStyle: React.CSSProperties = {
  background: 'rgba(236,228,218,0.58)',
  border: '1px solid rgba(128,96,62,0.18)',
  boxShadow: 'inset 0 2px 5px rgba(86,55,28,0.08)',
  appearance: 'none',
};

function ProductosDots({ n }: { n: number }) {
  const dots = Math.min(n, 4);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: dots }, (_, i) => (
        <div key={i} className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold text-white"
          style={{ background: `linear-gradient(135deg,#C59A18,#8A6A08)`, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
          P
        </div>
      ))}
      {n > 4 && <span className="text-[10px] font-bold text-[#A08060]">+{n - 4}</span>}
    </div>
  );
}

export function TablaOrdenes() {
  const [busqueda, setBusqueda] = useState('');
  const [estado,   setEstado]   = useState('');
  const [prov,     setProv]     = useState('');
  const [fecha,    setFecha]    = useState('Últimos 30 días');
  const [page,     setPage]     = useState(0);

  const resetPage = (fn: () => void) => { fn(); setPage(0); };

  const filtrados = useMemo(() => ORDENES.filter(o => {
    const q = busqueda.toLowerCase();
    if (q && !o.numero.toLowerCase().includes(q) && !o.proveedor.toLowerCase().includes(q)) return false;
    if (estado && o.estado !== estado) return false;
    if (prov   && o.proveedor !== prov) return false;
    return true;
  }), [busqueda, estado, prov]);

  const pages = Math.ceil(filtrados.length / PAGE_SIZE);
  const slice = filtrados.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const fmt = (n: number) => `$${n.toLocaleString('es-CO')}`;

  return (
    <div className="surface-raised rounded-2xl p-4 flex flex-col gap-3">
      <h3 className="text-sm font-bold text-[#302D28]">Listado de órdenes de compra</h3>

      {/* Filtros */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A08060]"/>
          <input value={busqueda} onChange={e => resetPage(() => setBusqueda(e.target.value))}
            placeholder="Buscar por número, proveedor o producto..."
            className="w-full pl-8 pr-3 py-2 rounded-xl text-xs font-medium text-[#302D28] outline-none focus:ring-2 focus:ring-[#9a5020]/30"
            style={selStyle}/>
        </div>
        {[
          { label:'Estado',   value:estado, options:ESTADOS_SELECT,   onChange:(v:string)=>resetPage(()=>setEstado(v)) },
          { label:'Proveedor',value:prov,   options:PROVEEDORES_SELECT,onChange:(v:string)=>resetPage(()=>setProv(v))  },
          { label:'Fecha',    value:fecha,  options:FECHA_SELECT,      onChange:(v:string)=>setFecha(v)               },
        ].map(({ label, value, options, onChange }) => (
          <div key={label} className="relative">
            <select value={value} onChange={e => onChange(e.target.value)}
              className="pl-3 pr-7 py-2 rounded-xl text-xs font-medium text-[#302D28] outline-none cursor-pointer"
              style={selStyle}>
              <option value="">{label === 'Fecha' ? value : label}</option>
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
            <col style={{width:90}}/><col style={{width:180}}/><col style={{width:80}}/>
            <col style={{width:110}}/><col style={{width:110}}/><col style={{width:90}}/>
            <col style={{width:100}}/><col style={{width:120}}/><col style={{width:70}}/>
          </colgroup>
          <thead>
            <tr className="border-b border-[rgba(128,96,62,0.12)]">
              {['N° Orden','Proveedor','Fecha','Productos','Valor total','Estado','Entrega estimada','Recibido','Acciones'].map(h => (
                <th key={h} className="text-left pb-2 pr-3 text-[#A08060] font-bold uppercase tracking-wide text-[10px] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(128,96,62,0.08)]">
            {slice.map(o => {
              const st = ESTADO_STYLE[o.estado];
              const done = o.recibidoPct === 100;
              return (
                <tr key={o.id} className="hover:bg-[rgba(245,239,230,0.5)] transition-colors">
                  <td className="py-2.5 pr-3">
                    <span className="font-mono text-[10px] font-bold text-[#2a5080] hover:underline cursor-pointer">{o.numero}</span>
                  </td>
                  <td className="py-2.5 pr-3 font-semibold text-[#302D28] truncate">{o.proveedor}</td>
                  <td className="py-2.5 pr-3 text-[#A08060]">{o.fecha}</td>
                  <td className="py-2.5 pr-3"><ProductosDots n={o.productos}/></td>
                  <td className="py-2.5 pr-3 font-extrabold text-[#302D28]">{fmt(o.valorTotal)}</td>
                  <td className="py-2.5 pr-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap" style={{ color:st.color, background:st.bg }}>{o.estado}</span>
                  </td>
                  <td className="py-2.5 pr-3 text-[#A08060] text-[10px]">{o.entregaEstimada}</td>
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full surface-inset overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{ width:`${o.recibidoPct}%`, background: done ? '#16a34a' : 'linear-gradient(90deg,#C59A18,#9a5020)' }}/>
                      </div>
                      <span className="text-[10px] font-bold text-[#302D28] w-7 text-right flex-shrink-0">{o.recibidoPct}%</span>
                      {done && <CheckCircle2 size={12} className="text-[#16a34a] flex-shrink-0"/>}
                    </div>
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
          Mostrando {filtrados.length===0?0:page*PAGE_SIZE+1}–{Math.min((page+1)*PAGE_SIZE,filtrados.length)} de {filtrados.length} órdenes
        </span>
        <div className="flex items-center gap-1">
          <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0}
            className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-40"
            style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.12)', color:'#6B451D' }}>
            <ChevronLeft size={12}/>
          </button>
          {Array.from({length:Math.min(pages,4)},(_,i)=>(
            <button key={i} onClick={()=>setPage(i)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold"
              style={{ background:i===page?'linear-gradient(145deg,#9a5020,#6a3010)':'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.12)', color:i===page?'#fff':'#6B451D' }}>
              {i+1}
            </button>
          ))}
          {pages>4&&<span className="text-[#A08060] text-xs px-1">…</span>}
          {pages>4&&(
            <button onClick={()=>setPage(pages-1)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold"
              style={{ background:page===pages-1?'linear-gradient(145deg,#9a5020,#6a3010)':'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.12)', color:page===pages-1?'#fff':'#6B451D' }}>
              {pages}
            </button>
          )}
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
