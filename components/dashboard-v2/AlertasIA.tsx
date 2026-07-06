import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { ALERTAS_IA } from './mock-data';
import { IconTile } from './IconTile';

const iconMap = {
  warning: { Icon: AlertTriangle, from: '#b06000', to: '#7a3a00', bg: 'linear-gradient(145deg,#FFF3E0,#FFE0B2)', border: 'rgba(176,80,0,0.18)' },
  success: { Icon: CheckCircle,   from: '#2a8055', to: '#1a5030', bg: 'linear-gradient(145deg,#E8F5E0,#C8E6C0)', border: 'rgba(26,96,64,0.18)'  },
  info:    { Icon: Info,          from: '#1a5070', to: '#0e3050', bg: 'linear-gradient(145deg,#E0EAF5,#C2D8F0)', border: 'rgba(26,64,96,0.18)'  },
};

export function AlertasIA() {
  return (
    <div className="surface-raised rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#302D28]">Alertas IA</h3>
        <button className="text-xs text-[#7a4010] font-bold hover:underline">Ver todas</button>
      </div>
      <div className="space-y-2.5">
        {ALERTAS_IA.map(({ tipo, titulo, desc, tiempo }) => {
          const cfg = iconMap[tipo as keyof typeof iconMap];
          return (
            <div
              key={titulo}
              className="flex gap-3 p-3 rounded-xl"
              style={{
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                boxShadow: '0 1px 0 rgba(255,255,255,0.6) inset, 0 3px 8px rgba(0,0,0,0.06)',
              }}
            >
              <IconTile Icon={cfg.Icon} from={cfg.from} to={cfg.to} size={13} tileSize={28} radius="0.5rem" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#302D28] leading-tight">{titulo}</p>
                <p className="text-[10px] text-[#6B4A2A] leading-snug mt-0.5">{desc}</p>
                <p className="text-[10px] text-[#A08060] mt-1">{tiempo}</p>
              </div>
            </div>
          );
        })}
      </div>
      <button className="mt-3 w-full text-xs font-bold text-[#7a4010] hover:underline text-center">
        Ver todas las alertas IA →
      </button>
    </div>
  );
}
