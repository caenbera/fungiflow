'use client';

import { Clock, AlertTriangle, FileText, Route } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { PROXIMAS_ENTREGAS, ALERTAS_LOG, DOCS_PENDIENTES } from './mock-data';

const ESTADO_COLORS: Record<string, { bg: string; color: string }> = {
  'En tránsito': { bg:'rgba(90,42,122,0.12)',  color:'#5a2a7a' },
  'Programado':  { bg:'rgba(197,154,24,0.12)', color:'#C59A18' },
  'Pendiente':   { bg:'rgba(26,80,112,0.12)',  color:'#1a5070' },
  'Entregado':   { bg:'rgba(42,128,85,0.12)',  color:'#2a8055' },
  'Incidencia':  { bg:'rgba(184,48,32,0.12)',  color:'#b83020' },
};

export function SidebarLogistica() {
  return (
    <div className="space-y-3">

      {/* Próximas entregas */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <IconTile Icon={Clock} from="#2a8055" to="#1a5030" size={13} tileSize={28} radius="0.45rem"/>
          <h3 className="text-sm font-bold text-[#302D28]">Próximas entregas</h3>
        </div>
        <div className="space-y-2">
          {PROXIMAS_ENTREGAS.map((e, i) => {
            const es = ESTADO_COLORS[e.estado] ?? { bg:'rgba(128,96,62,0.1)', color:'#6B4A2A' };
            return (
              <div key={i} className="flex items-start gap-2">
                <div className="text-right flex-shrink-0 w-10 mt-0.5">
                  <p className="text-[11px] font-extrabold text-[#302D28]">{e.hora}</p>
                </div>
                <div className="flex-1 min-w-0 p-2 rounded-xl" style={{ background:'rgba(236,228,218,0.38)' }}>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-[11px] font-semibold text-[#302D28] truncate">{e.cliente}</p>
                    <span className="flex-shrink-0 px-1.5 py-0.5 rounded-md text-[9px] font-bold" style={{ background:es.bg, color:es.color }}>{e.estado}</span>
                  </div>
                  <p className="text-[10px] text-[#A08060] truncate">{e.lugar}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alertas logísticas */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <IconTile Icon={AlertTriangle} from="#b83020" to="#7a1a10" size={13} tileSize={28} radius="0.45rem"/>
          <h3 className="text-sm font-bold text-[#302D28]">Alertas logísticas</h3>
        </div>
        <div className="space-y-2">
          {ALERTAS_LOG.map((a, i) => (
            <div key={i} className="flex items-start gap-2.5 p-2 rounded-xl" style={{ background:a.bg }}>
              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold flex-shrink-0 mt-0.5"
                style={{ background:`${a.color}22`, color:a.color }}>{a.tipo}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-[#302D28] leading-tight">{a.label}</p>
                <p className="text-[10px] text-[#A08060] leading-tight">{a.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documentos pendientes */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <IconTile Icon={FileText} from="#C59A18" to="#8A6A08" size={13} tileSize={28} radius="0.45rem"/>
          <h3 className="text-sm font-bold text-[#302D28]">Documentos pendientes</h3>
        </div>
        <div className="space-y-2">
          {DOCS_PENDIENTES.map((d, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: d.color }}/>
                <span className="text-[11px] text-[#6B4A2A] font-medium">{d.label}</span>
              </div>
              <span className="text-[12px] font-extrabold text-[#302D28]">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Optimización de rutas */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <IconTile Icon={Route} from="#5a2a7a" to="#3a1a50" size={13} tileSize={28} radius="0.45rem"/>
          <h3 className="text-sm font-bold text-[#302D28]">Optimización de rutas</h3>
        </div>
        <div className="p-2.5 rounded-xl mb-2" style={{ background:'rgba(42,128,85,0.08)', border:'1px solid rgba(42,128,85,0.15)' }}>
          <p className="text-[10px] font-bold text-[#2a8055] uppercase tracking-wide">Ahorro mensual estimado</p>
          <p className="text-lg font-extrabold text-[#302D28] mt-0.5">$1,250,000</p>
        </div>
        {[
          { label:'Reducción km recorridos', value:'12.4%', icon:'↓' },
          { label:'Reducción tiempo ruta',   value:'18.7%', icon:'↓' },
          { label:'Ahorro combustible',      value:'9.3%',  icon:'↓' },
        ].map((r) => (
          <div key={r.label} className="flex items-center justify-between py-1 border-b border-[rgba(128,96,62,0.06)] last:border-0">
            <span className="text-[11px] text-[#6B4A2A]">{r.label}</span>
            <span className="text-[11px] font-bold text-[#2a8055]">{r.icon} {r.value}</span>
          </div>
        ))}
        <button className="mt-3 w-full py-2 rounded-xl text-[11px] font-bold text-white"
          style={{ background:'linear-gradient(145deg,#5a2a7a,#3a1a50)', border:'1px solid rgba(255,255,255,0.15)', boxShadow:'0 1px 0 rgba(255,255,255,0.15) inset, 0 4px 10px rgba(90,42,122,0.25)' }}>
          Calcular rutas óptimas
        </button>
      </div>

    </div>
  );
}
