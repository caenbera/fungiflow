import { COSECHAS } from './mock-data';

export function ProximasCosechas() {
  return (
    <div className="surface-raised rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#302D28]">Próximas cosechas</h3>
        <button className="text-xs text-[#7a4010] font-bold hover:underline">Ver todas</button>
      </div>
      <div className="space-y-3">
        {COSECHAS.map(({ lote, kg, dias, pct, img }) => (
          <div
            key={lote}
            className="flex items-center gap-3 p-2 rounded-xl"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.58), rgba(245,239,230,0.90))',
              border: '1px solid rgba(255,255,255,0.66)',
              boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 0 -1px 2px rgba(92,62,33,0.08) inset, 0 4px 10px rgba(86,55,28,0.08)',
            }}
          >
            <div
              className="flex-shrink-0 rounded-xl overflow-hidden"
              style={{
                width: 48, height: 48,
                boxShadow: '0 2px 8px rgba(86,55,28,0.18), 0 1px 0 rgba(255,255,255,0.5) inset',
              }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#302D28]">{lote}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-extrabold text-[#1a6040]">{kg} kg</span>
                <span className="text-[10px] text-[#A08060]">en {dias} días</span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <div
                  className="flex-1 rounded-full overflow-hidden"
                  style={{
                    height: 6,
                    background: 'rgba(236,228,218,0.58)',
                    border: '1px solid rgba(128,96,62,0.12)',
                    boxShadow: 'inset 0 2px 4px rgba(86,55,28,0.12)',
                  }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg, #1a6040, #2a8055)',
                      boxShadow: '0 1px 0 rgba(255,255,255,0.4) inset',
                    }}
                  />
                </div>
                <span className="text-[10px] font-bold text-[#1a6040]">{pct}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
