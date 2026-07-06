import { FlaskConical, Wheat, Package, Box, Sprout, Wrench, MapPin, ScanBarcode, type LucideIcon } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import type { CATEGORIAS_INV } from './mock-data';

type Cat = typeof CATEGORIAS_INV[number];

const CAT_ICONS: Record<string, LucideIcon> = {
  micelio: Sprout, materiaprima: Wheat, bolsas: Package, empaques: Box,
  terminados: FlaskConical, equipos: Wrench, ubicaciones: MapPin, lotes: ScanBarcode,
};

function estadoColor(estado: string) {
  if (estado === 'Óptimo')   return { text: '#1a6040', bg: 'rgba(26,96,64,0.10)', dot: '#22c55e' };
  if (estado === 'Atención') return { text: '#b06000', bg: 'rgba(176,80,0,0.10)',  dot: '#f97316' };
  return                            { text: '#b83020', bg: 'rgba(184,48,32,0.10)', dot: '#ef4444' };
}

export function CategoriaCard({ cat }: { cat: Cat }) {
  const Icon = CAT_ICONS[cat.id] ?? Package;
  const st   = estadoColor(cat.estado);
  const capColor = cat.capacidad >= 75 ? '#1a6040' : cat.capacidad >= 50 ? '#C59A18' : '#b83020';

  return (
    <div className="surface-raised rounded-2xl p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start gap-3">
        <IconTile Icon={Icon} from={cat.from} to={cat.to} size={18} tileSize={40} radius="0.75rem" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#302D28] leading-tight">{cat.label}</p>
          <p className="text-[11px] text-[#A08060] mt-0.5">{cat.items} ítems</p>
        </div>
      </div>

      {/* Stock */}
      <div className="surface-inset rounded-xl px-3 py-2">
        <p className="text-[10px] text-[#A08060] font-semibold uppercase tracking-wide">Stock</p>
        <p className="text-base font-extrabold text-[#302D28] leading-tight mt-0.5">{cat.stock}</p>
      </div>

      {/* Capacidad */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-[#6B4A2A] font-semibold">Capacidad</span>
          <span className="text-[11px] font-bold" style={{ color: capColor }}>{cat.capacidad}%</span>
        </div>
        <div className="w-full rounded-full overflow-hidden" style={{
          height: 7,
          background: 'rgba(236,228,218,0.58)',
          border: '1px solid rgba(128,96,62,0.12)',
          boxShadow: 'inset 0 2px 4px rgba(86,55,28,0.14)',
        }}>
          <div className="h-full rounded-full" style={{
            width: `${cat.capacidad}%`,
            background: `linear-gradient(90deg, ${capColor}, ${capColor}cc)`,
            boxShadow: '0 1px 0 rgba(255,255,255,0.35) inset',
          }} />
        </div>
      </div>

      {/* Estado + botón */}
      <div className="flex items-center justify-between pt-0.5">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: st.bg }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />
          <span className="text-[11px] font-bold" style={{ color: st.text }}>{cat.estado}</span>
        </div>
        <button className="text-[11px] font-bold text-[#7a4010] hover:underline">Ver detalles →</button>
      </div>
    </div>
  );
}
