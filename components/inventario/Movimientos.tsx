import { MOVIMIENTOS, type TipoMovimiento } from './mock-data';

const TIPO_STYLE: Record<TipoMovimiento, { label: string; from: string; to: string }> = {
  Entrada:      { label: 'Entrada',      from: '#2a8055', to: '#1a5030' },
  Salida:       { label: 'Salida',       from: '#b83020', to: '#7a1a10' },
  Transferencia:{ label: 'Transferencia',from: '#1a5070', to: '#0e3050' },
  Ajuste:       { label: 'Ajuste',       from: '#b06000', to: '#7a3a00' },
};

export function Movimientos() {
  return (
    <div className="surface-raised rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#302D28]">Movimientos recientes</h3>
        <button className="text-xs font-bold text-[#7a4010] hover:underline">Ver todos</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[rgba(128,96,62,0.12)]">
              {['Fecha','Tipo','Producto','Cantidad','Origen / Destino','Usuario'].map(h => (
                <th key={h} className="text-left pb-2 pr-4 text-[#A08060] font-bold uppercase tracking-wide text-[10px] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(128,96,62,0.08)]">
            {MOVIMIENTOS.map((m, i) => {
              const st = TIPO_STYLE[m.tipo];
              return (
                <tr key={i} className="hover:bg-[rgba(245,239,230,0.5)] transition-colors">
                  <td className="py-2.5 pr-4 text-[#6B4A2A] whitespace-nowrap font-medium">{m.fecha}</td>
                  <td className="py-2.5 pr-4">
                    <span
                      className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-white whitespace-nowrap"
                      style={{
                        background: `linear-gradient(135deg, ${st.from}, ${st.to})`,
                        boxShadow: '0 1px 0 rgba(255,255,255,0.2) inset, 0 2px 5px rgba(0,0,0,0.15)',
                      }}
                    >{st.label}</span>
                  </td>
                  <td className="py-2.5 pr-4 font-semibold text-[#302D28] whitespace-nowrap">{m.producto}</td>
                  <td className="py-2.5 pr-4 font-bold text-[#302D28] whitespace-nowrap">{m.cantidad}</td>
                  <td className="py-2.5 pr-4 text-[#6B4A2A] max-w-[200px] truncate">{m.origen}</td>
                  <td className="py-2.5 text-[#A08060] whitespace-nowrap">{m.usuario}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
