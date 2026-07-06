'use client';

import {
  FlaskConical,
  Sprout,
  TriangleAlert,
  FileText,
  ShoppingCart,
  BarChart2,
  Sparkles,
} from 'lucide-react';

const ACCIONES = [
  { label: 'Nuevo lote',              Icon: FlaskConical,   from: '#2a8055', to: '#1a5030' },
  { label: 'Registrar cosecha',       Icon: Sprout,         from: '#9a5020', to: '#6a3010' },
  { label: 'Registrar contaminación', Icon: TriangleAlert,  from: '#b06000', to: '#7a3a00' },
  { label: 'Crear cotización',        Icon: FileText,       from: '#1a5070', to: '#0e3050' },
  { label: 'Comprar materia prima',   Icon: ShoppingCart,   from: '#5a2a7a', to: '#3a1a50' },
  { label: 'Ver reportes',            Icon: BarChart2,      from: '#1a6040', to: '#0e4028' },
  { label: 'Asistente IA',            Icon: Sparkles,       from: '#C59A18', to: '#8A6A08' },
];

export function AccionesRapidas() {
  return (
    <div className="surface-raised rounded-2xl p-5">
      <h3 className="text-sm font-bold text-[#302D28] mb-4">Acciones rápidas</h3>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
        {ACCIONES.map(({ label, Icon, from, to }) => (
          <button
            key={label}
            className="flex flex-col items-center gap-2.5 p-3 rounded-2xl transition-all duration-150 active:scale-95"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.72), rgba(245,239,230,0.96))',
              border: '1px solid rgba(255,255,255,0.76)',
              boxShadow: '0 1px 0 rgba(255,255,255,0.78) inset, 0 -2px 3px rgba(92,62,33,0.10) inset, 0 8px 18px rgba(86,55,28,0.10), 0 2px 4px rgba(86,55,28,0.08)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 0 rgba(255,255,255,0.78) inset, 0 -2px 3px rgba(92,62,33,0.10) inset, 0 14px 28px rgba(86,55,28,0.14), 0 3px 6px rgba(86,55,28,0.10)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 0 rgba(255,255,255,0.78) inset, 0 -2px 3px rgba(92,62,33,0.10) inset, 0 8px 18px rgba(86,55,28,0.10), 0 2px 4px rgba(86,55,28,0.08)';
            }}
          >
            {/* Ícono estilo icon-tile-3d pero con gradiente de color */}
            <span
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: `linear-gradient(145deg, ${from}, ${to})`,
                border: '1px solid rgba(255,255,255,0.22)',
                boxShadow: `0 1px 0 rgba(255,255,255,0.28) inset, 0 -2px 3px rgba(0,0,0,0.20) inset, 0 6px 14px rgba(0,0,0,0.18), 0 2px 4px rgba(0,0,0,0.12)`,
                color: '#fff',
              }}
            >
              <Icon size={19} strokeWidth={1.8} />
            </span>
            <span className="text-[10px] font-bold text-[#6B4A2A] text-center leading-tight">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
