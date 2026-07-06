import { TrendingUp, TrendingDown, Minus, Scale, Package, Archive, Calendar, Warehouse, DollarSign } from 'lucide-react';
import { KPIS } from './mock-data';
import { IconTile } from './IconTile';

const KPI_CONFIG = [
  { Icon: Scale,     from: '#2a8055', to: '#1a5030' },
  { Icon: Package,   from: '#9a5020', to: '#6a3010' },
  { Icon: Archive,   from: '#1a5070', to: '#0e3050' },
  { Icon: Calendar,  from: '#5a2a7a', to: '#3a1a50' },
  { Icon: Warehouse, from: '#1a6040', to: '#0e4028' },
  { Icon: DollarSign,from: '#C59A18', to: '#8A6A08' },
];

export function KPIStrip() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      {KPIS.map(({ label, value, delta, up }, i) => {
        const cfg = KPI_CONFIG[i];
        return (
          <div key={label} className="surface-raised rounded-2xl px-4 py-4">
            <div className="flex items-start justify-between mb-3">
              <IconTile Icon={cfg.Icon} from={cfg.from} to={cfg.to} size={15} tileSize={34} />
              <span className={`text-[10px] font-bold flex items-center gap-0.5 mt-1 ${
                up === true ? 'text-[#1a6040]' : up === false ? 'text-red-500' : 'text-[#A08060]'
              }`}>
                {up === true  && <TrendingUp size={11} />}
                {up === false && <TrendingDown size={11} />}
                {up === null  && <Minus size={11} />}
              </span>
            </div>
            <p className={`font-extrabold text-[#302D28] leading-none ${
              value.length > 10 ? 'text-sm' : value.length > 7 ? 'text-base' : 'text-xl'
            }`}>{value}</p>
            <p className="text-[11px] text-[#8A6D3D] font-semibold mt-1 leading-tight">{label}</p>
            <div className="accent-rule mt-2 w-7" />
            <p className={`text-[10px] font-semibold mt-1.5 ${up === true ? 'text-[#1a6040]' : up === false ? 'text-red-500' : 'text-[#A08060]'}`}>
              {delta}
            </p>
          </div>
        );
      })}
    </div>
  );
}
