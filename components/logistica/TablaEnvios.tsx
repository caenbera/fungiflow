'use client';

import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, Printer } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { List } from 'lucide-react';
import { ENVIOS, ESTADOS_SELECT, FECHA_SELECT, type EstadoEnvio } from './mock-data';

const ESTADO_COLORS: Record<EstadoEnvio, { bg: string; color: string }> = {
  'En tránsito': { bg:'rgba(90,42,122,0.12)',  color:'#5a2a7a' },
  'Programado':  { bg:'rgba(197,154,24,0.12)', color:'#C59A18' },
  'Pendiente':   { bg:'rgba(26,80,112,0.12)',  color:'#1a5070' },
  'Entregado':   { bg:'rgba(42,128,85,0.12)',  color:'#2a8055' },
  'Incidencia':  { bg:'rgba(184,48,32,0.12)',  color:'#b83020' },
};

const btnSt:React.CSSProperties={background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)',border:'1px solid rgba(255,255,255,0.78)',boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.10)'};

export function TablaEnvios() {
  const [search, setSearch] = useState('');
  const [estadoFil, setEstadoFil] = useState<EstadoEnvio | ''>('');
  const [fechaFil, setFechaFil] = useState('');
  const [page, setPage] = useState(1);
  const PER = 6;

  const filtered = ENVIOS.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.guia.toLowerCase().includes(q) || e.cliente.toLowerCase().includes(q) || e.destino.toLowerCase().includes(q);
    const matchEstado = !estadoFil || e.estado === estadoFil;
    return matchSearch && matchEstado;
  });
  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const rows = filtered.slice((page-1)*PER, page*PER);

  return (
    <div className="surface-raised rounded-2xl overflow-hidden">
      <div className="px-4 pt-4 pb-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconTile Icon={List} from="#1a5070" to="#0e3050" size={14} tileSize={30} radius="0.5rem"/>
            <div>
              <h3 className="text-sm font-bold text-[#302D28]">Listado de envíos</h3>
              <p className="text-[10px] text-[#A08060]">{filtered.length} envíos encontrados</p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-[#6B4A2A]" style={btnSt}>
            <Printer size={11}/> Exportar
          </button>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[160px]">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#A08060]"/>
            <input value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar guía, cliente o destino..."
              className="w-full pl-7 pr-3 py-2 rounded-xl text-[11px] font-medium text-[#302D28] outline-none"
              style={{ background:'rgba(236,228,218,0.58)', border:'1px solid rgba(128,96,62,0.18)', boxShadow:'inset 0 2px 5px rgba(86,55,28,0.08)' }}/>
          </div>
          <select value={estadoFil} onChange={e=>{ setEstadoFil(e.target.value as EstadoEnvio|''); setPage(1); }}
            className="py-2 px-2.5 rounded-xl text-[11px] font-medium text-[#302D28] outline-none cursor-pointer"
            style={{ background:'rgba(236,228,218,0.58)', border:'1px solid rgba(128,96,62,0.18)' }}>
            <option value="">Todos los estados</option>
            {ESTADOS_SELECT.map(e=><option key={e} value={e}>{e}</option>)}
          </select>
          <select value={fechaFil} onChange={e=>setFechaFil(e.target.value)}
            className="py-2 px-2.5 rounded-xl text-[11px] font-medium text-[#302D28] outline-none cursor-pointer"
            style={{ background:'rgba(236,228,218,0.58)', border:'1px solid rgba(128,96,62,0.18)' }}>
            <option value="">Fecha: todas</option>
            {FECHA_SELECT.map(f=><option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <div className="surface-inset mx-4 mb-4 rounded-xl overflow-hidden">
        <table className="w-full text-[11px]">
          <colgroup>
            <col className="w-[110px]"/><col className="w-[120px]"/><col/><col className="w-[80px]"/>
            <col className="w-[80px]"/><col className="w-[95px]"/><col className="w-[120px]"/>
            <col className="w-[80px]"/><col className="w-[70px]"/>
          </colgroup>
          <thead>
            <tr className="border-b border-[rgba(128,96,62,0.12)]">
              {['N° Guía','Cliente','Destino','Fecha envío','F. estimada','Estado','Transportista','Valor','Acciones'].map(h=>(
                <th key={h} className="px-2 py-2.5 text-left font-bold text-[#8A6D3D] first:pl-3 last:pr-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => {
              const es = ESTADO_COLORS[e.estado];
              return (
                <tr key={e.id} className="border-b border-[rgba(128,96,62,0.06)] last:border-0 hover:bg-[rgba(128,96,62,0.04)] transition-colors">
                  <td className="px-2 py-2 pl-3 font-bold text-[#302D28]">{e.guia}</td>
                  <td className="px-2 py-2 text-[#6B4A2A] font-medium truncate max-w-[110px]">{e.cliente}</td>
                  <td className="px-2 py-2 text-[#A08060] truncate max-w-[100px]">{e.destino}</td>
                  <td className="px-2 py-2 text-[#A08060] whitespace-nowrap">
                    <div>{e.fechaEnvio}</div>
                    <div className="text-[#C59A18] font-semibold">{e.horaEnvio}</div>
                  </td>
                  <td className="px-2 py-2 text-[#A08060]">{e.fechaEstimada}</td>
                  <td className="px-2 py-2">
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold" style={{ background:es.bg, color:es.color }}>{e.estado}</span>
                  </td>
                  <td className="px-2 py-2 text-[#6B4A2A] truncate">{e.transportista}</td>
                  <td className="px-2 py-2 font-bold text-[#302D28]">${e.valor.toLocaleString('es-CO')}</td>
                  <td className="px-2 py-2 pr-3">
                    <div className="flex gap-1">
                      <button className="p-1 rounded-lg hover:scale-110 transition-transform" style={btnSt} title="Ver detalle"><Eye size={11} className="text-[#6B4A2A]"/></button>
                      <button className="p-1 rounded-lg hover:scale-110 transition-transform" style={btnSt} title="Imprimir guía"><Printer size={11} className="text-[#6B4A2A]"/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr><td colSpan={9} className="px-3 py-8 text-center text-[11px] text-[#A08060]">No hay envíos que coincidan con los filtros.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <span className="text-[11px] text-[#A08060]">
          Mostrando {Math.min((page-1)*PER+1, filtered.length)}–{Math.min(page*PER, filtered.length)} de {filtered.length}
        </span>
        <div className="flex gap-1">
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
            className="p-1.5 rounded-lg disabled:opacity-40" style={btnSt}>
            <ChevronLeft size={12} className="text-[#6B4A2A]"/>
          </button>
          {Array.from({length:pages},(_,i)=>i+1).map(n=>(
            <button key={n} onClick={()=>setPage(n)}
              className="w-7 h-7 rounded-lg text-[11px] font-bold transition-all"
              style={n===page ? { background:'linear-gradient(145deg,#2a8055,#1a5030)', color:'white', border:'1px solid rgba(255,255,255,0.18)', boxShadow:'0 3px 8px rgba(42,128,85,0.30)' } : btnSt}>
              {n}
            </button>
          ))}
          <button onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages}
            className="p-1.5 rounded-lg disabled:opacity-40" style={btnSt}>
            <ChevronRight size={12} className="text-[#6B4A2A]"/>
          </button>
        </div>
      </div>
    </div>
  );
}
