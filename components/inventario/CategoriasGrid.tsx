import { Lightbulb, ChevronRight } from 'lucide-react';
import { CATEGORIAS_INV, IA_RECOMENDACIONES, ALERTAS_INV } from './mock-data';
import { CategoriaCard } from './CategoriaCard';
import { IconTile } from '@/components/dashboard-v2/IconTile';

export function CategoriasGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
      {/* Grid 4×2 categorías */}
      <div className="lg:col-span-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#302D28]">Inventario por categoría</h3>
          <button className="text-xs font-bold text-[#7a4010] hover:underline">Ver todo →</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIAS_INV.map(cat => <CategoriaCard key={cat.id} cat={cat} />)}
        </div>
      </div>

      {/* Panel lateral IA + Alertas */}
      <div className="lg:col-span-1 space-y-3">
        {/* IA recomienda */}
        <div className="surface-raised rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <IconTile Icon={Lightbulb} from="#C59A18" to="#8A6A08" size={14} tileSize={30} radius="0.55rem" />
            <h3 className="text-sm font-bold text-[#302D28]">IA recomienda</h3>
          </div>
          <div className="space-y-2.5">
            {IA_RECOMENDACIONES.map(({ texto, desc }) => (
              <div key={texto}
                className="p-2.5 rounded-xl"
                style={{
                  background: 'linear-gradient(145deg,rgba(255,255,255,0.58),rgba(245,239,230,0.90))',
                  border: '1px solid rgba(255,255,255,0.66)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 0 3px 8px rgba(86,55,28,0.07)',
                }}
              >
                <p className="text-[11px] font-bold text-[#302D28] leading-snug">{texto}</p>
                {desc && <p className="text-[10px] text-[#A08060] mt-0.5 leading-snug">{desc}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Alertas */}
        <div className="surface-raised rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#302D28]">Alertas</h3>
            <button className="text-xs font-bold text-[#7a4010] hover:underline">Ver todas</button>
          </div>
          <div className="space-y-2">
            {ALERTAS_INV.map(({ label, count, color }) => (
              <div key={label}
                className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer"
                style={{
                  background: 'linear-gradient(145deg,rgba(255,255,255,0.58),rgba(245,239,230,0.90))',
                  border: '1px solid rgba(255,255,255,0.66)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.88) inset, 0 3px 8px rgba(86,55,28,0.07)',
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-[11px] font-semibold text-[#302D28]">{label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[11px] font-bold w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{
                      background: `${color}18`,
                      color,
                      boxShadow: `0 1px 0 rgba(255,255,255,0.5) inset, 0 2px 5px ${color}20`,
                    }}
                  >{count}</span>
                  <ChevronRight size={12} className="text-[#A08060]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
