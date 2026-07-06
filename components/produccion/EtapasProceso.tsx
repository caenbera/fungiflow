'use client';

import { Sprout, FlameKindling, Syringe, Microscope, Flower2, Wheat, ChevronRight } from 'lucide-react';
import { ETAPAS_FLUJO } from './mock-data';

const ETAPA_ICONS = [Sprout, FlameKindling, Syringe, Microscope, Flower2, Wheat];

export function EtapasProceso() {
  const maxLotes = Math.max(...ETAPAS_FLUJO.map(e => e.lotes));

  return (
    <div className="surface-raised rounded-2xl px-5 py-4">
      <h3 className="text-sm font-bold text-[#302D28] mb-4">Etapas del proceso</h3>
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {ETAPAS_FLUJO.map((etapa, i) => {
          const Icon = ETAPA_ICONS[i];
          const isActive = etapa.nombre === 'Colonización';
          const isLargest = etapa.lotes === maxLotes;
          return (
            <div key={etapa.nombre} className="flex items-center gap-1 flex-shrink-0">
              <div
                className="flex flex-col items-center gap-2 px-4 py-3 rounded-2xl cursor-pointer transition-all hover:scale-[1.02]"
                style={{
                  background: isActive
                    ? `linear-gradient(145deg,${etapa.from}22,${etapa.to}11)`
                    : 'rgba(245,239,230,0.6)',
                  border: isActive
                    ? `1.5px solid ${etapa.from}44`
                    : '1.5px solid rgba(128,96,62,0.10)',
                  boxShadow: isActive
                    ? `0 4px 16px ${etapa.from}22, 0 1px 0 rgba(255,255,255,0.7) inset`
                    : '0 1px 0 rgba(255,255,255,0.7) inset, 0 2px 6px rgba(0,0,0,0.06)',
                  minWidth: 108,
                }}
              >
                {/* Icon tile */}
                <span
                  className="flex items-center justify-center text-white"
                  style={{
                    width: 36, height: 36, borderRadius: '0.65rem',
                    background: `linear-gradient(145deg,${etapa.from},${etapa.to})`,
                    border: '1px solid rgba(255,255,255,0.22)',
                    boxShadow: '0 1px 0 rgba(255,255,255,0.28) inset, 0 -2px 3px rgba(0,0,0,0.20) inset, 0 6px 14px rgba(0,0,0,0.18)',
                  }}
                >
                  <Icon size={16} strokeWidth={1.8}/>
                </span>
                <div className="text-center">
                  <p className={`text-[11px] font-bold ${isActive ? 'text-[#302D28]' : 'text-[#6B4A2A]'}`}>{etapa.nombre}</p>
                  <p className={`text-[13px] font-extrabold ${isActive ? 'text-[#302D28]' : 'text-[#A08060]'}`}>
                    {etapa.lotes} <span className="text-[10px] font-semibold">lotes</span>
                  </p>
                </div>
                {/* Mini bar */}
                <div className="w-full h-1 rounded-full surface-inset overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${(etapa.lotes / maxLotes) * 100}%`, background: `linear-gradient(90deg,${etapa.from},${etapa.to})` }}/>
                </div>
              </div>
              {i < ETAPAS_FLUJO.length - 1 && (
                <ChevronRight size={14} className="text-[#C8B89A] flex-shrink-0"/>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
