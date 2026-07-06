'use client';

import { Search, ChevronDown } from 'lucide-react';
import { SEGMENTOS_SELECT, ESTADOS_SELECT, UBICACIONES_SELECT } from './mock-data';

interface Props {
  busqueda: string;
  segmento: string;
  estado: string;
  ubicacion: string;
  onBusqueda: (v: string) => void;
  onSegmento: (v: string) => void;
  onEstado: (v: string) => void;
  onUbicacion: (v: string) => void;
}

const selectStyle: React.CSSProperties = {
  background: 'rgba(236,228,218,0.58)',
  border: '1px solid rgba(128,96,62,0.18)',
  boxShadow: 'inset 0 2px 5px rgba(86,55,28,0.08)',
  appearance: 'none',
};

export function FiltrosClientes({ busqueda, segmento, estado, ubicacion, onBusqueda, onSegmento, onEstado, onUbicacion }: Props) {
  return (
    <div className="surface-raised rounded-2xl px-4 py-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A08060]" />
          <input
            value={busqueda}
            onChange={e => onBusqueda(e.target.value)}
            placeholder="Buscar cliente o empresa..."
            className="w-full pl-8 pr-3 py-2 rounded-xl text-sm font-medium text-[#302D28] outline-none focus:ring-2 focus:ring-[#9a5020]/30"
            style={selectStyle}
          />
        </div>
        {/* Dropdowns */}
        {[
          { label: 'Segmento', value: segmento, options: SEGMENTOS_SELECT, onChange: onSegmento },
          { label: 'Estado',   value: estado,   options: ESTADOS_SELECT,   onChange: onEstado   },
          { label: 'Ubicación',value: ubicacion,options: UBICACIONES_SELECT,onChange: onUbicacion},
        ].map(({ label, value, options, onChange }) => (
          <div key={label} className="relative">
            <select
              value={value}
              onChange={e => onChange(e.target.value)}
              className="pl-3 pr-8 py-2 rounded-xl text-sm font-medium text-[#302D28] outline-none focus:ring-2 focus:ring-[#9a5020]/30 cursor-pointer"
              style={selectStyle}
            >
              <option value="">{label}</option>
              {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A08060] pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
}
