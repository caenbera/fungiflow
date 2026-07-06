import { Eye, Pencil, MoreVertical } from 'lucide-react';
import { PRODUCTOS_TABLA } from './mock-data';

const ESTADO_STYLE: Record<string, { color: string; dot: string; bg: string }> = {
  Óptimo: { color: '#1a6040', dot: '#22c55e', bg: 'rgba(26,96,64,0.10)' },
  Exceso: { color: '#1a5070', dot: '#3b82f6', bg: 'rgba(26,80,112,0.10)' },
  Bajo:   { color: '#b83020', dot: '#ef4444', bg: 'rgba(184,48,32,0.10)' },
};

export function TablaProductos() {
  return (
    <div className="surface-raised rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#302D28]">Productos en inventario</h3>
        <button className="text-xs font-bold text-[#7a4010] hover:underline">Ver completo →</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ tableLayout: 'fixed', minWidth: 900 }}>
          <colgroup>
            <col style={{ width: 80 }} /><col style={{ width: 150 }} /><col style={{ width: 130 }} />
            <col style={{ width: 200 }} /><col style={{ width: 70 }} /><col style={{ width: 90 }} />
            <col style={{ width: 80 }} /><col style={{ width: 130 }} /><col style={{ width: 90 }} />
            <col style={{ width: 80 }} />
          </colgroup>
          <thead>
            <tr className="border-b border-[rgba(128,96,62,0.12)]">
              {['Código','Producto','Categoría','Ubicación','Stock','Stock mínimo','Unidad','Último mov.','Estado','Acciones'].map(h => (
                <th key={h} className="text-left pb-2 pr-3 text-[#A08060] font-bold uppercase tracking-wide text-[10px] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(128,96,62,0.08)]">
            {PRODUCTOS_TABLA.map((p) => {
              const st = ESTADO_STYLE[p.estado] ?? ESTADO_STYLE['Óptimo'];
              const stockLow = p.stock < p.minimo;
              return (
                <tr key={p.codigo} className="hover:bg-[rgba(245,239,230,0.5)] transition-colors">
                  <td className="py-2.5 pr-3">
                    <span className="font-mono text-[11px] font-bold text-[#8A6D3D] surface-inset px-1.5 py-0.5 rounded">{p.codigo}</span>
                  </td>
                  <td className="py-2.5 pr-3 font-semibold text-[#302D28] truncate">{p.nombre}</td>
                  <td className="py-2.5 pr-3 text-[#6B4A2A] truncate">{p.categoria}</td>
                  <td className="py-2.5 pr-3 text-[#A08060] truncate">{p.ubicacion}</td>
                  <td className={`py-2.5 pr-3 font-extrabold ${stockLow ? 'text-red-500' : 'text-[#302D28]'}`}>
                    {p.stock.toLocaleString()}
                  </td>
                  <td className="py-2.5 pr-3 text-[#6B4A2A]">{p.minimo.toLocaleString()}</td>
                  <td className="py-2.5 pr-3 text-[#A08060]">{p.unidad}</td>
                  <td className="py-2.5 pr-3 text-[#A08060] text-[10px]">{p.movimiento}</td>
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full w-fit" style={{ background: st.bg }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: st.dot }} />
                      <span className="text-[10px] font-bold" style={{ color: st.color }}>{p.estado}</span>
                    </div>
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-1">
                      {[Eye, Pencil, MoreVertical].map((Icon, i) => (
                        <button key={i}
                          className="w-6 h-6 rounded-lg flex items-center justify-center transition-transform hover:scale-110"
                          style={{
                            background: 'linear-gradient(145deg,#FFF9EF,#E6D8C5)',
                            border: '1px solid rgba(255,255,255,0.78)',
                            boxShadow: '0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.12)',
                            color: '#6B451D',
                          }}
                        >
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
    </div>
  );
}
