import { PEDIDOS } from './mock-data';

export function PedidosPendientes() {
  return (
    <div className="surface-raised rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#302D28]">Pedidos pendientes</h3>
        <button className="text-xs font-bold text-[#7a4010] hover:underline">Ver todos</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[rgba(128,96,62,0.12)]">
              {['Proveedor','Producto','Cantidad','Entrega estimada'].map(h => (
                <th key={h} className="text-left pb-2 pr-4 text-[#A08060] font-bold uppercase tracking-wide text-[10px] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(128,96,62,0.08)]">
            {PEDIDOS.map((p, i) => (
              <tr key={i} className="hover:bg-[rgba(245,239,230,0.5)] transition-colors">
                <td className="py-2.5 pr-4 font-semibold text-[#302D28] whitespace-nowrap">{p.proveedor}</td>
                <td className="py-2.5 pr-4 text-[#6B4A2A] whitespace-nowrap">{p.producto}</td>
                <td className="py-2.5 pr-4 font-bold text-[#302D28] whitespace-nowrap">{p.cantidad}</td>
                <td className="py-2.5">
                  <span
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold"
                    style={{
                      background: 'linear-gradient(145deg,rgba(255,255,255,0.72),rgba(245,239,230,0.96))',
                      border: '1px solid rgba(255,255,255,0.76)',
                      boxShadow: '0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(86,55,28,0.10)',
                      color: '#6B4A2A',
                    }}
                  >{p.entrega}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
