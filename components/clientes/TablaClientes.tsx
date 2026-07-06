'use client';

import { Eye, Pencil, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { Cliente, Segmento, EstadoCliente } from './mock-data';

const SEGMENTO_STYLE: Record<Segmento, { color: string; bg: string }> = {
  VIP:        { color: '#5a1a7a', bg: 'rgba(124,58,237,0.12)' },
  Regular:    { color: '#1a4070', bg: 'rgba(37,99,235,0.10)'  },
  Ocasional:  { color: '#0e5a6a', bg: 'rgba(8,145,178,0.10)'  },
  Nuevo:      { color: '#1a5030', bg: 'rgba(22,163,74,0.10)'  },
  'En riesgo':{ color: '#7a1a1a', bg: 'rgba(220,38,38,0.10)'  },
};

const ESTADO_STYLE: Record<EstadoCliente, { color: string; dot: string; bg: string }> = {
  Activo:    { color: '#1a6040', dot: '#22c55e', bg: 'rgba(26,96,64,0.10)'  },
  Inactivo:  { color: '#6B4A2A', dot: '#94a3b8', bg: 'rgba(107,74,42,0.10)' },
  'En riesgo':{ color: '#b83020', dot: '#ef4444', bg: 'rgba(184,48,32,0.10)' },
};

const PAGE_SIZE = 8;

interface Props {
  clientes: Cliente[];
  onVerCliente?: (c: Cliente) => void;
}

export function TablaClientes({ clientes, onVerCliente }: Props) {
  const [page, setPage] = useState(0);
  const total = clientes.length;
  const pages = Math.ceil(total / PAGE_SIZE);
  const slice = clientes.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const fmtMoney = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
    return `$${n}`;
  };

  return (
    <div className="surface-raised rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#302D28]">Lista de clientes</h3>
        <span className="text-xs text-[#A08060] font-medium">{total} resultado{total !== 1 ? 's' : ''}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ tableLayout: 'fixed', minWidth: 780 }}>
          <colgroup>
            <col style={{ width: 90 }} /><col style={{ width: 160 }} /><col style={{ width: 170 }} />
            <col style={{ width: 85 }} /><col style={{ width: 90 }} /><col style={{ width: 80 }} />
            <col style={{ width: 90 }} /><col style={{ width: 110 }} /><col style={{ width: 80 }} />
          </colgroup>
          <thead>
            <tr className="border-b border-[rgba(128,96,62,0.12)]">
              {['ID','Nombre','Empresa','Segmento','Estado','Ubicación','Ventas','Última compra','Acciones'].map(h => (
                <th key={h} className="text-left pb-2 pr-3 text-[#A08060] font-bold uppercase tracking-wide text-[10px] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(128,96,62,0.08)]">
            {slice.map((c) => {
              const seg = SEGMENTO_STYLE[c.segmento];
              const est = ESTADO_STYLE[c.estado];
              return (
                <tr key={c.id} className="hover:bg-[rgba(245,239,230,0.5)] transition-colors">
                  <td className="py-2.5 pr-3">
                    <span className="font-mono text-[10px] font-bold text-[#8A6D3D] surface-inset px-1.5 py-0.5 rounded">{c.id}</span>
                  </td>
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white"
                        style={{ background: `linear-gradient(135deg,${SEGMENTO_STYLE[c.segmento].bg === 'rgba(124,58,237,0.12)' ? '#7c3aed,#5a1a7a' : '#2563eb,#1a4070'})` }}>
                        {c.nombre.split(' ').map(p => p[0]).slice(0,2).join('')}
                      </div>
                      <span className="font-semibold text-[#302D28] truncate">{c.nombre}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3 text-[#6B4A2A] truncate">{c.empresa}</td>
                  <td className="py-2.5 pr-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ color: seg.color, background: seg.bg }}>{c.segmento}</span>
                  </td>
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full w-fit" style={{ background: est.bg }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: est.dot }} />
                      <span className="text-[10px] font-bold" style={{ color: est.color }}>{c.estado}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3 text-[#A08060]">{c.ubicacion}</td>
                  <td className="py-2.5 pr-3 font-extrabold text-[#302D28]">{fmtMoney(c.ventas)}</td>
                  <td className="py-2.5 pr-3 text-[#A08060] text-[10px]">{c.ultimaCompra}</td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-1">
                      {[Eye, Pencil, MoreVertical].map((Icon, i) => (
                        <button key={i}
                          onClick={i === 0 && onVerCliente ? () => onVerCliente(c) : undefined}
                          className="w-6 h-6 rounded-lg flex items-center justify-center transition-transform hover:scale-110"
                          style={{
                            background: 'linear-gradient(145deg,#FFF9EF,#E6D8C5)',
                            border: '1px solid rgba(255,255,255,0.78)',
                            boxShadow: '0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.12)',
                            color: '#6B451D',
                          }}>
                          <Icon size={11} strokeWidth={2} />
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
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
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform hover:scale-110 disabled:opacity-40"
              style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.12)', color:'#6B451D' }}
            >
              <ChevronLeft size={12} />
            </button>
            {Array.from({ length: pages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold transition-transform hover:scale-110"
                style={{
                  background: i === page ? 'linear-gradient(145deg,#9a5020,#6a3010)' : 'linear-gradient(145deg,#FFF9EF,#E6D8C5)',
                  border: '1px solid rgba(255,255,255,0.78)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.12)',
                  color: i === page ? '#fff' : '#6B451D',
                }}>
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(pages - 1, p + 1))}
              disabled={page === pages - 1}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform hover:scale-110 disabled:opacity-40"
              style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.12)', color:'#6B451D' }}
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
