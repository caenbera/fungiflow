'use client';

import { useState } from 'react';
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import type { Proveedor, CategoriaProveedor, EstadoProveedor } from './mock-data';

const CAT_STYLE: Record<CategoriaProveedor, { color: string; bg: string }> = {
  'Materias primas': { color: '#5a2a0a', bg: 'rgba(154,80,32,0.13)' },
  'Insumos':         { color: '#1a4a0a', bg: 'rgba(42,128,85,0.13)'  },
  'Empaques':        { color: '#1a3a6a', bg: 'rgba(26,80,112,0.13)'  },
  'Equipos':         { color: '#4a1a6a', bg: 'rgba(90,42,122,0.13)'  },
  'Logística':       { color: '#0e4a5a', bg: 'rgba(14,74,90,0.13)'   },
  'Micelio':         { color: '#6a4a0a', bg: 'rgba(197,154,24,0.13)' },
};

const ESTADO_STYLE: Record<EstadoProveedor, { color: string; dot: string; bg: string }> = {
  'Activo':        { color: '#1a6040', dot: '#22c55e', bg: 'rgba(26,96,64,0.10)'   },
  'Inactivo':      { color: '#6B4A2A', dot: '#94a3b8', bg: 'rgba(107,74,42,0.10)'  },
  'En evaluación': { color: '#7a4a00', dot: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
};

function evalLabel(n: number): string {
  if (n >= 4.5) return 'Excelente';
  if (n >= 3.5) return 'Bueno';
  if (n >= 2.5) return 'Regular';
  return 'Deficiente';
}

function evalColor(n: number): string {
  if (n >= 4.5) return '#2a8055';
  if (n >= 3.5) return '#C59A18';
  if (n >= 2.5) return '#b06000';
  return '#b83020';
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={11}
          fill={i <= Math.round(value) ? evalColor(value) : 'transparent'}
          stroke={i <= Math.round(value) ? evalColor(value) : '#C0A880'}
          strokeWidth={1.5}
        />
      ))}
      <span className="ml-1 text-[10px] font-extrabold" style={{ color: evalColor(value) }}>{value.toFixed(1)}</span>
    </div>
  );
}

const fmtMoney = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
};

const PAGE_SIZE = 8;

interface Props {
  proveedores: Proveedor[];
  onEliminar?: (p: Proveedor) => void;
  onEditar?: (p: Proveedor) => void;
}

export function TablaProveedores({ proveedores, onEliminar, onEditar }: Props) {
  const [page, setPage] = useState(0);
  const total = proveedores.length;
  const pages = Math.ceil(total / PAGE_SIZE);
  const slice = proveedores.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const btnCls = 'w-6 h-6 rounded-lg flex items-center justify-center transition-transform hover:scale-110 flex-shrink-0';
  const btnStyle = { background: 'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border: '1px solid rgba(255,255,255,0.78)', boxShadow: '0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.12)', color: '#6B451D' };

  return (
    <div className="surface-raised rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#302D28]">Lista de proveedores</h3>
        <span className="text-xs text-[#A08060] font-medium">{total} resultado{total !== 1 ? 's' : ''}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ tableLayout: 'fixed', minWidth: 820 }}>
          <colgroup>
            <col style={{ width: 180 }} />
            <col style={{ width: 110 }} />
            <col style={{ width: 160 }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 110 }} />
            <col style={{ width: 130 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 80 }} />
          </colgroup>
          <thead>
            <tr className="border-b border-[rgba(128,96,62,0.12)]">
              {['Proveedor', 'Categoría', 'Productos', 'Última compra', 'Compras (12m)', 'Evaluación', 'Estado', 'Acciones'].map(h => (
                <th key={h} className="text-left pb-2 pr-3 text-[#A08060] font-bold uppercase tracking-wide text-[10px] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(128,96,62,0.08)]">
            {slice.map((p) => {
              const cat = CAT_STYLE[p.categoria];
              const est = ESTADO_STYLE[p.estado];
              return (
                <tr key={p.id} className="hover:bg-[rgba(245,239,230,0.5)] transition-colors">
                  {/* Proveedor */}
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white"
                        style={{ background: `linear-gradient(135deg,${cat.color},${cat.color}bb)` }}>
                        {p.nombre.split(' ').map(w => w[0]).slice(0, 2).join('')}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#302D28] truncate leading-tight">{p.nombre}</p>
                        <p className="text-[9px] text-[#A08060] font-mono leading-tight">NIT {p.nit}</p>
                      </div>
                    </div>
                  </td>
                  {/* Categoría */}
                  <td className="py-2.5 pr-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ color: cat.color, background: cat.bg }}>{p.categoria}</span>
                  </td>
                  {/* Productos */}
                  <td className="py-2.5 pr-3 text-[#6B4A2A] truncate">{p.productos}</td>
                  {/* Última compra */}
                  <td className="py-2.5 pr-3 text-[#A08060] text-[10px]">{p.ultimaCompra}</td>
                  {/* Compras 12m */}
                  <td className="py-2.5 pr-3">
                    <p className="font-extrabold text-[#302D28]">{fmtMoney(p.compras12m)}</p>
                    <p className="text-[9px] text-[#A08060]">{p.ordenes12m} órd.</p>
                  </td>
                  {/* Evaluación */}
                  <td className="py-2.5 pr-3">
                    <Stars value={p.evaluacion} />
                  </td>
                  {/* Estado */}
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full w-fit" style={{ background: est.bg }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: est.dot }} />
                      <span className="text-[10px] font-bold whitespace-nowrap" style={{ color: est.color }}>{p.estado}</span>
                    </div>
                  </td>
                  {/* Acciones */}
                  <td className="py-2.5">
                    <div className="flex items-center gap-1">
                      <button className={btnCls} style={btnStyle} title="Ver detalle"><Eye size={11} strokeWidth={2} /></button>
                      <button className={btnCls} style={btnStyle} title="Editar" onClick={() => onEditar?.(p)}><Pencil size={11} strokeWidth={2} /></button>
                      <button className={btnCls} style={{ ...btnStyle, color: '#b83020' }} title="Eliminar" onClick={() => onEliminar?.(p)}><Trash2 size={11} strokeWidth={2} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {slice.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-xs text-[#A08060]">No hay proveedores con esos filtros.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-[#A08060]">
            Mostrando {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} de {total}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform hover:scale-110 disabled:opacity-40"
              style={btnStyle}><ChevronLeft size={12} /></button>
            {Array.from({ length: pages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold transition-transform hover:scale-110"
                style={{ ...btnStyle, background: i === page ? 'linear-gradient(145deg,#9a5020,#6a3010)' : btnStyle.background, color: i === page ? '#fff' : '#6B451D' }}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(pages - 1, p + 1))} disabled={page === pages - 1}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform hover:scale-110 disabled:opacity-40"
              style={btnStyle}><ChevronRight size={12} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
