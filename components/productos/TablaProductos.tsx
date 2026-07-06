'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronDown, SlidersHorizontal, Eye, Pencil, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Producto, CategoriaProducto, EstadoProducto, DisponibilidadProducto } from './mock-data';
import { PRODUCTOS_TABLA, CATEGORIAS_SELECT, ESTADOS_SELECT, DISP_SELECT } from './mock-data';

type Tab = 'Todos' | CategoriaProducto;
const TABS: Tab[] = ['Todos', 'Hongos frescos', 'Productos procesados', 'Insumos y kits', 'Equipos y herramientas'];

const DISP_STYLE: Record<DisponibilidadProducto, { color: string; bg: string }> = {
  'Stock óptimo': { color: '#1a6040', bg: 'rgba(26,96,64,0.10)'  },
  'Stock bajo':   { color: '#b06000', bg: 'rgba(176,96,0,0.10)'  },
  'Crítico':      { color: '#b83020', bg: 'rgba(184,48,32,0.10)' },
  'Agotado':      { color: '#6B4A2A', bg: 'rgba(107,74,42,0.10)' },
};

const CAT_STYLE: Record<string, { color: string; bg: string }> = {
  'Hongos frescos':         { color: '#1a5030', bg: 'rgba(26,96,64,0.12)'   },
  'Productos procesados':   { color: '#7a3a00', bg: 'rgba(176,96,0,0.12)'   },
  'Insumos y kits':         { color: '#3a1a50', bg: 'rgba(90,42,122,0.12)'  },
  'Equipos y herramientas': { color: '#0e3050', bg: 'rgba(26,80,112,0.12)'  },
  'Empaques y etiquetas':   { color: '#8A6A08', bg: 'rgba(197,154,24,0.12)' },
  'Otros':                  { color: '#6B4A2A', bg: 'rgba(107,74,42,0.12)'  },
};

const EST_DOT: Record<EstadoProducto, string> = {
  Activo:   '#22c55e',
  Inactivo: '#94a3b8',
  Borrador: '#C59A18',
};

const PAGE_SIZE = 8;

const selectStyle: React.CSSProperties = {
  background: 'rgba(236,228,218,0.58)',
  border: '1px solid rgba(128,96,62,0.18)',
  boxShadow: 'inset 0 2px 5px rgba(86,55,28,0.08)',
  appearance: 'none',
};

function ProductoImg({ src, nombre }: { src: string; nombre: string }) {
  return (
    <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold text-white"
      style={{ background: 'linear-gradient(145deg,#C59A18,#8A6A08)', boxShadow: '0 2px 6px rgba(0,0,0,0.18)' }}>
      {nombre.charAt(0)}
    </div>
  );
}

export function TablaProductosProd() {
  const [tab, setTab]           = useState<Tab>('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCat]     = useState('');
  const [estado, setEst]        = useState('');
  const [disp, setDisp]         = useState('');
  const [page, setPage]         = useState(0);

  const filtrados = useMemo(() => {
    return PRODUCTOS_TABLA.filter(p => {
      if (tab !== 'Todos' && p.categoria !== tab) return false;
      const q = busqueda.toLowerCase();
      if (q && !p.nombre.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
      if (categoria && p.categoria !== categoria) return false;
      if (estado   && p.estado    !== estado)    return false;
      if (disp     && p.disponibilidad !== disp) return false;
      return true;
    });
  }, [tab, busqueda, categoria, estado, disp]);

  const pages = Math.ceil(filtrados.length / PAGE_SIZE);
  const slice = filtrados.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const fmtCOP = (n: number) => `$${n.toLocaleString('es-CO')} COP`;

  const resetPage = (fn: () => void) => { fn(); setPage(0); };

  return (
    <div className="surface-raised rounded-2xl p-4 flex flex-col gap-3">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-[rgba(128,96,62,0.12)] pb-0 -mx-1">
        {TABS.map(t => (
          <button key={t} onClick={() => resetPage(() => setTab(t))}
            className="px-3 py-2 text-xs font-bold rounded-t-lg transition-all whitespace-nowrap"
            style={{
              color: tab === t ? '#302D28' : '#A08060',
              background: tab === t ? 'rgba(245,239,230,0.8)' : 'transparent',
              borderBottom: tab === t ? '2px solid #9a5020' : '2px solid transparent',
            }}>
            {t}
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A08060]" />
          <input value={busqueda} onChange={e => resetPage(() => setBusqueda(e.target.value))}
            placeholder="Buscar producto, SKU o código..."
            className="w-full pl-8 pr-3 py-2 rounded-xl text-xs font-medium text-[#302D28] outline-none focus:ring-2 focus:ring-[#9a5020]/30"
            style={selectStyle} />
        </div>
        {[
          { label: 'Categoría',    value: categoria, options: CATEGORIAS_SELECT, onChange: (v: string) => resetPage(() => setCat(v)) },
          { label: 'Estado',       value: estado,    options: ESTADOS_SELECT,    onChange: (v: string) => resetPage(() => setEst(v)) },
          { label: 'Disponibilidad',value: disp,     options: DISP_SELECT,       onChange: (v: string) => resetPage(() => setDisp(v)) },
        ].map(({ label, value, options, onChange }) => (
          <div key={label} className="relative">
            <select value={value} onChange={e => onChange(e.target.value)}
              className="pl-3 pr-7 py-2 rounded-xl text-xs font-medium text-[#302D28] outline-none cursor-pointer"
              style={selectStyle}>
              <option value="">{label}</option>
              {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A08060] pointer-events-none" />
          </div>
        ))}
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
          style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 3px 8px rgba(88,57,31,0.12)', color:'#6B451D' }}>
          <SlidersHorizontal size={12} />Filtros
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ tableLayout: 'fixed', minWidth: 820 }}>
          <colgroup>
            <col style={{ width: 190 }} /><col style={{ width: 80 }} /><col style={{ width: 130 }} />
            <col style={{ width: 110 }} /><col style={{ width: 100 }} /><col style={{ width: 130 }} />
            <col style={{ width: 80 }} /><col style={{ width: 80 }} />
          </colgroup>
          <thead>
            <tr className="border-b border-[rgba(128,96,62,0.12)]">
              {['Producto','SKU','Categoría','Presentación','Precio venta','Stock disponible','Estado','Acciones'].map(h => (
                <th key={h} className="text-left pb-2 pr-3 text-[#A08060] font-bold uppercase tracking-wide text-[10px] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(128,96,62,0.08)]">
            {slice.map(p => {
              const cat = CAT_STYLE[p.categoria] ?? CAT_STYLE['Otros'];
              const dsp = DISP_STYLE[p.disponibilidad];
              return (
                <tr key={p.id} className="hover:bg-[rgba(245,239,230,0.5)] transition-colors">
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2">
                      <ProductoImg src={p.imagen} nombre={p.nombre} />
                      <div className="min-w-0">
                        <p className="font-semibold text-[#302D28] truncate">{p.nombre}</p>
                        <p className="text-[10px] text-[#A08060] truncate italic">{p.nombreCientifico}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className="font-mono text-[10px] font-bold text-[#8A6D3D] surface-inset px-1.5 py-0.5 rounded">{p.sku}</span>
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap" style={{ color: cat.color, background: cat.bg }}>{p.categoria}</span>
                  </td>
                  <td className="py-2.5 pr-3 text-[#6B4A2A]">{p.presentacion}</td>
                  <td className="py-2.5 pr-3 font-extrabold text-[#302D28]">{fmtCOP(p.precioVenta)}</td>
                  <td className="py-2.5 pr-3">
                    <p className="font-extrabold text-[#302D28]">{p.stock.toLocaleString()} uds</p>
                    <span className="text-[10px] font-bold" style={{ color: dsp.color }}>{p.disponibilidad}</span>
                  </td>
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: EST_DOT[p.estado] }} />
                      <span className="text-[11px] font-semibold text-[#6B4A2A]">{p.estado}</span>
                    </div>
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-1">
                      {[Eye, Pencil, MoreVertical].map((Icon, i) => (
                        <button key={i} className="w-6 h-6 rounded-lg flex items-center justify-center transition-transform hover:scale-110"
                          style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.12)', color:'#6B451D' }}>
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

      {/* Paginación */}
      <div className="flex items-center justify-between pt-1 border-t border-[rgba(128,96,62,0.08)]">
        <span className="text-[11px] text-[#A08060]">
          Mostrando {filtrados.length === 0 ? 0 : page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtrados.length)} de {filtrados.length} productos
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform hover:scale-110 disabled:opacity-40"
            style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.12)', color:'#6B451D' }}>
            <ChevronLeft size={12} />
          </button>
          {Array.from({ length: Math.min(pages, 5) }, (_, i) => (
            <button key={i} onClick={() => setPage(i)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold transition-transform hover:scale-110"
              style={{ background: i === page ? 'linear-gradient(145deg,#9a5020,#6a3010)' : 'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.12)', color: i === page ? '#fff' : '#6B451D' }}>
              {i + 1}
            </button>
          ))}
          {pages > 5 && <span className="text-[#A08060] text-xs px-1">…</span>}
          {pages > 5 && (
            <button onClick={() => setPage(pages - 1)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold"
              style={{ background: page === pages - 1 ? 'linear-gradient(145deg,#9a5020,#6a3010)' : 'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.12)', color: page === pages - 1 ? '#fff' : '#6B451D' }}>
              {pages}
            </button>
          )}
          <button onClick={() => setPage(p => Math.min(pages - 1, p + 1))} disabled={page >= pages - 1}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform hover:scale-110 disabled:opacity-40"
            style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.12)', color:'#6B451D' }}>
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
