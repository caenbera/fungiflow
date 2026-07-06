'use client';

import { Layers, ShoppingCart, Package, Store, Truck, DollarSign, BarChart2, Cpu, FileText, GraduationCap } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';

const MODULOS = [
  { label:'Producción',             Icon:ShoppingCart, from:'#2a8055', to:'#1a5030' },
  { label:'Inventario',             Icon:Package,      from:'#1a5070', to:'#0e3050' },
  { label:'Comercial',              Icon:Store,        from:'#5a2a7a', to:'#3a1a50' },
  { label:'Logística',              Icon:Truck,        from:'#b06000', to:'#7a3a00' },
  { label:'Finanzas',               Icon:DollarSign,   from:'#C59A18', to:'#8A6A08' },
  { label:'Analítica',              Icon:BarChart2,    from:'#b83020', to:'#7a1a10' },
  { label:'Inteligencia Artificial',Icon:Cpu,          from:'#1a5070', to:'#0e3050' },
  { label:'Documentos',             Icon:FileText,     from:'#5a2a7a', to:'#3a1a50' },
  { label:'Academia',               Icon:GraduationCap,from:'#2a8055', to:'#1a5030' },
];

export function ModulosActivados() {
  return (
    <div className="surface-raised rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <IconTile Icon={Layers} from="#5a2a7a" to="#3a1a50" size={14} tileSize={30} radius="0.5rem"/>
          <h3 className="text-sm font-bold text-[#302D28]">Módulos activados</h3>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3 mb-3">
        {MODULOS.map((m) => (
          <div key={m.label} className="flex flex-col items-center gap-2 p-3 rounded-xl"
            style={{ background:'rgba(236,228,218,0.38)', border:'1px solid rgba(128,96,62,0.08)' }}>
            <IconTile Icon={m.Icon} from={m.from} to={m.to} size={16} tileSize={36} radius="0.6rem"/>
            <p className="text-[10px] font-semibold text-[#302D28] text-center leading-tight">{m.label}</p>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold"
              style={{ background:'rgba(42,128,85,0.12)', color:'#2a8055' }}>
              Activado
            </span>
          </div>
        ))}
      </div>
      <button className="w-full py-2 rounded-xl text-[11px] font-bold text-[#6B4A2A]"
        style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.10)' }}>
        Personalizar módulos
      </button>
    </div>
  );
}
