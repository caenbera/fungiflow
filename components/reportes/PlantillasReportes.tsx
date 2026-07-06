'use client';

import { FileText, TrendingUp, DollarSign, Package, Truck } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';

const PLANTILLAS = [
  { Icon:TrendingUp,  label:'Reporte de producción',  sub:'Análisis detallado por lotes, especies y etapas.',      from:'#2a8055', to:'#1a5030' },
  { Icon:DollarSign,  label:'Reporte de ventas',       sub:'Desempeño de ventas por producto, cliente y canal.',   from:'#1a5070', to:'#0e3050' },
  { Icon:FileText,    label:'Reporte financiero',      sub:'Estado de resultados, flujo de caja y márgenes.',      from:'#b06000', to:'#7a3a00' },
  { Icon:Package,     label:'Reporte de inventario',   sub:'Movimientos, valuación y rotación de inventario.',    from:'#5a2a7a', to:'#3a1a50' },
  { Icon:Truck,       label:'Reporte de logística',    sub:'Envíos, entregas, costos y desempeño de transporte.', from:'#C59A18', to:'#8A6A08' },
];

export function PlantillasReportes() {
  return (
    <div className="surface-raised rounded-2xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <IconTile Icon={FileText} from="#b06000" to="#7a3a00" size={14} tileSize={30} radius="0.5rem"/>
          <h3 className="text-sm font-bold text-[#302D28]">Plantillas de reportes</h3>
        </div>
        <button className="text-[11px] font-bold text-[#7a4010] hover:underline">Ver todas</button>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        {PLANTILLAS.map((p) => (
          <div key={p.label} className="flex items-center gap-2.5 p-2.5 rounded-xl"
            style={{ background:'rgba(236,228,218,0.38)', border:'1px solid rgba(128,96,62,0.08)' }}>
            <IconTile Icon={p.Icon} from={p.from} to={p.to} size={13} tileSize={28} radius="0.45rem"/>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-[#302D28] leading-tight">{p.label}</p>
              <p className="text-[10px] text-[#A08060] leading-tight truncate">{p.sub}</p>
            </div>
            <button className="flex-shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white"
              style={{ background:`linear-gradient(145deg,${p.from},${p.to})`, boxShadow:`0 3px 8px ${p.from}44` }}>
              Generar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
