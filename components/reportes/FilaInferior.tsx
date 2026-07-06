'use client';

import { useState } from 'react';
import { List, Calendar, Activity, Download, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { HISTORIAL, PROGRAMADOS, INDICADORES } from './mock-data';

const MODULO_COLORS: Record<string, string> = {
  Producción:'#2a8055', Finanzas:'#b06000', Comercial:'#1a5070',
  Inventario:'#5a2a7a', Logística:'#C59A18',
};

const btnSt: React.CSSProperties = { background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.10)' };

/* ── Historial de reportes ── */
function HistorialReportes() {
  const [page, setPage] = useState(1);
  const PER = 8; const total = 25;
  const pages = Math.ceil(total / PER);
  return (
    <div className="surface-raised rounded-2xl overflow-hidden flex flex-col">
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconTile Icon={List} from="#1a5070" to="#0e3050" size={14} tileSize={30} radius="0.5rem"/>
          <h3 className="text-sm font-bold text-[#302D28]">Historial de reportes generados</h3>
        </div>
      </div>
      <div className="surface-inset mx-4 mb-3 rounded-xl overflow-hidden">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-[rgba(128,96,62,0.12)]">
              {['Nombre del reporte','Módulo','Fecha generado','Rango de fechas','Generado por','Formato','Acciones'].map(h=>(
                <th key={h} className="px-2 py-2.5 text-left font-bold text-[#8A6D3D] first:pl-3 last:pr-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HISTORIAL.map((h, i) => {
              const mc = MODULO_COLORS[h.modulo] ?? '#6B4A2A';
              return (
                <tr key={i} className="border-b border-[rgba(128,96,62,0.06)] last:border-0 hover:bg-[rgba(128,96,62,0.04)]">
                  <td className="px-2 py-2 pl-3 font-semibold text-[#302D28] max-w-[160px] truncate">{h.nombre}</td>
                  <td className="px-2 py-2">
                    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold" style={{ background:`${mc}18`, color:mc }}>{h.modulo}</span>
                  </td>
                  <td className="px-2 py-2 text-[#A08060] whitespace-nowrap">{h.fecha}</td>
                  <td className="px-2 py-2 text-[#A08060] whitespace-nowrap">{h.rango}</td>
                  <td className="px-2 py-2 text-[#6B4A2A]">{h.generado}</td>
                  <td className="px-2 py-2">
                    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold"
                      style={{ background: h.formato==='PDF' ? 'rgba(184,48,32,0.12)':'rgba(42,128,85,0.12)', color: h.formato==='PDF'?'#b83020':'#2a8055' }}>
                      {h.formato}
                    </span>
                  </td>
                  <td className="px-2 py-2 pr-3">
                    <div className="flex gap-1">
                      <button className="p-1 rounded-lg" style={btnSt}><Download size={10} className="text-[#6B4A2A]"/></button>
                      <button className="p-1 rounded-lg" style={btnSt}><MoreHorizontal size={10} className="text-[#6B4A2A]"/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-4 pb-4 flex items-center justify-between">
        <span className="text-[11px] text-[#A08060]">Mostrando 1 a {Math.min(page*PER, total)} de {total} reportes</span>
        <div className="flex items-center gap-1">
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="p-1.5 rounded-lg disabled:opacity-40" style={btnSt}><ChevronLeft size={12} className="text-[#6B4A2A]"/></button>
          {Array.from({length:pages},(_,i)=>i+1).map(n=>(
            <button key={n} onClick={()=>setPage(n)}
              className="w-7 h-7 rounded-lg text-[11px] font-bold"
              style={n===page ? { background:'linear-gradient(145deg,#2a8055,#1a5030)', color:'white', border:'1px solid rgba(255,255,255,0.18)', boxShadow:'0 3px 8px rgba(42,128,85,0.30)' } : btnSt}>
              {n}
            </button>
          ))}
          <button onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages} className="p-1.5 rounded-lg disabled:opacity-40" style={btnSt}><ChevronRight size={12} className="text-[#6B4A2A]"/></button>
        </div>
      </div>
    </div>
  );
}

/* ── Panel derecho ── */
function PanelDerecho() {
  return (
    <div className="flex flex-col gap-3">
      {/* Reportes programados */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IconTile Icon={Calendar} from="#5a2a7a" to="#3a1a50" size={13} tileSize={28} radius="0.45rem"/>
            <h3 className="text-sm font-bold text-[#302D28]">Reportes programados</h3>
          </div>
          <button className="text-[11px] font-bold text-[#7a4010] hover:underline">Ver todos</button>
        </div>
        <div className="space-y-2">
          {PROGRAMADOS.map((r) => (
            <div key={r.label} className="flex items-center gap-2 p-2 rounded-xl" style={{ background:'rgba(236,228,218,0.38)' }}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: r.color }}/>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-[#302D28] truncate">{r.label}</p>
                <p className="text-[10px] text-[#A08060]">{r.sub}</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#2a8055] flex-shrink-0" title="Activo"/>
            </div>
          ))}
        </div>
      </div>

      {/* Indicadores clave */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IconTile Icon={Activity} from="#C59A18" to="#8A6A08" size={13} tileSize={28} radius="0.45rem"/>
            <h3 className="text-sm font-bold text-[#302D28]">Indicadores clave</h3>
          </div>
          <button className="px-2 py-1 rounded-lg text-[11px] font-bold text-[#6B4A2A]"
            style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.10)' }}>
            Este mes ▾
          </button>
        </div>
        <div className="space-y-2">
          {INDICADORES.map((ind) => (
            <div key={ind.label} className="flex items-center justify-between py-1 border-b border-[rgba(128,96,62,0.06)] last:border-0">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ind.color }}/>
                <span className="text-[11px] text-[#6B4A2A]">{ind.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#302D28]">{ind.value}</span>
                <span className="text-[10px] font-semibold" style={{ color: ind.up ? '#2a8055' : '#b83020' }}>
                  {ind.up ? '↑' : '↓'} {ind.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FilaInferior() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-start">
      <div className="lg:col-span-2"><HistorialReportes/></div>
      <div className="lg:col-span-1"><PanelDerecho/></div>
    </div>
  );
}
