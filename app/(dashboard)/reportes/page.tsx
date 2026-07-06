'use client';

import { Plus, Calendar, Download, Filter } from 'lucide-react';
import { KPIStripReportes }    from '@/components/reportes/KPIStrip';
import { RendimientoGeneral }  from '@/components/reportes/RendimientoGeneral';
import { DistribucionIngresos }from '@/components/reportes/DistribucionIngresos';
import { PlantillasReportes }  from '@/components/reportes/PlantillasReportes';
import { FilaMedia }           from '@/components/reportes/FilaMedia';
import { FilaInferior }        from '@/components/reportes/FilaInferior';

const FILTROS = [
  { label:'Rango de fechas', value:'01/05/2024 - 31/05/2024', icon:'📅' },
  { label:'Granja',          value:'Todas',                    icon:'🌿' },
  { label:'Tipo de reporte', value:'Todos',                    icon:'📋' },
  { label:'Módulo',          value:'Todos',                    icon:'📦' },
];

export default function ReportesPage() {
  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="surface-raised rounded-2xl px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6D3D]">Analítica & métricas</p>
            <h1 className="mt-0.5 text-2xl font-bold text-[#302D28]">Reportes</h1>
            <p className="mt-1 text-sm text-[#A08060]">
              Analiza el rendimiento de tu operación con reportes inteligentes y personalizables.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label:'Nuevo reporte',     Icon:Plus,     from:'#2a8055', to:'#1a5030' },
              { label:'Programar reporte', Icon:Calendar, from:'#1a5070', to:'#0e3050' },
              { label:'Exportar datos',    Icon:Download, from:'#5a2a7a', to:'#3a1a50' },
            ].map(({ label, Icon, from, to }) => (
              <button key={label}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.03] active:scale-95"
                style={{ background:`linear-gradient(145deg,${from},${to})`, border:'1px solid rgba(255,255,255,0.18)', boxShadow:'0 1px 0 rgba(255,255,255,0.22) inset, 0 5px 14px rgba(0,0,0,0.18)' }}>
                <Icon size={13} strokeWidth={2}/>{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="surface-raised rounded-2xl px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          {FILTROS.map((f) => (
            <div key={f.label} className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-[#8A6D3D] uppercase tracking-wide">{f.label}</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-[#302D28]"
                style={{ background:'rgba(236,228,218,0.58)', border:'1px solid rgba(128,96,62,0.18)', boxShadow:'inset 0 2px 5px rgba(86,55,28,0.08)' }}>
                <span>{f.icon}</span>{f.value} <span className="text-[#A08060]">▾</span>
              </button>
            </div>
          ))}
          <div className="flex flex-col gap-0.5 ml-auto">
            <span className="text-[10px] font-bold text-[#8A6D3D] uppercase tracking-wide opacity-0">–</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-[#6B4A2A]"
              style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.10)' }}>
              <Filter size={11}/> Filtros
            </button>
          </div>
        </div>
      </div>

      <KPIStripReportes/>

      {/* Fila principal: Rendimiento + Distribución + Plantillas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        <div className="lg:col-span-5"><RendimientoGeneral/></div>
        <div className="lg:col-span-4"><DistribucionIngresos/></div>
        <div className="lg:col-span-3"><PlantillasReportes/></div>
      </div>

      <FilaMedia/>
      <FilaInferior/>

    </div>
  );
}
