'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import { CATEGORIAS_PROV, type CategoriaProveedor, type EstadoProveedor } from './mock-data';

interface Props {
  busqueda: string;
  categoria: string;
  estado: string;
  evaluacion: string;
  onBusqueda: (v: string) => void;
  onCategoria: (v: string) => void;
  onEstado: (v: string) => void;
  onEvaluacion: (v: string) => void;
}

const selectCls = 'surface-inset rounded-xl px-3 py-2 text-xs font-semibold text-[#302D28] outline-none appearance-none cursor-pointer min-w-[130px]';

export function FiltrosProveedores({ busqueda, categoria, estado, evaluacion, onBusqueda, onCategoria, onEstado, onEvaluacion }: Props) {
  return (
    <div className="surface-raised rounded-2xl px-4 py-3 flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="flex items-center gap-2 surface-inset rounded-xl px-3 py-2 flex-1 min-w-[200px]">
        <Search size={13} className="text-[#A08060] flex-shrink-0" />
        <input
          value={busqueda}
          onChange={e => onBusqueda(e.target.value)}
          placeholder="Buscar proveedor por nombre o NIT..."
          className="bg-transparent text-xs text-[#302D28] placeholder:text-[#C0A880] outline-none w-full"
        />
      </div>

      {/* Categoría */}
      <select value={categoria} onChange={e => onCategoria(e.target.value)} className={selectCls}>
        <option value="">Categoría: Todas</option>
        {CATEGORIAS_PROV.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      {/* Estado */}
      <select value={estado} onChange={e => onEstado(e.target.value)} className={selectCls}>
        <option value="">Estado: Todos</option>
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
        <option value="En evaluación">En evaluación</option>
      </select>

      {/* Evaluación */}
      <select value={evaluacion} onChange={e => onEvaluacion(e.target.value)} className={selectCls}>
        <option value="">Evaluación: Todas</option>
        <option value="Excelente">Excelente (4.5 - 5)</option>
        <option value="Bueno">Bueno (3.5 - 4.4)</option>
        <option value="Regular">Regular (2.5 - 3.4)</option>
        <option value="Deficiente">Deficiente (1 - 2.4)</option>
      </select>

      <div className="ml-auto flex items-center gap-1.5 text-[11px] text-[#A08060] font-medium">
        <SlidersHorizontal size={13} />
        Filtros
      </div>
    </div>
  );
}
