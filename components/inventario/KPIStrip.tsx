import { TrendingUp, TrendingDown, Wheat, Package, DollarSign, ArrowDownToLine, ArrowUpFromLine, TriangleAlert } from 'lucide-react';
import { KPIS_INV } from './mock-data';
import { IconTile } from '@/components/dashboard-v2/IconTile';

const KPI_CONFIG = [
  { Icon: Wheat,           from: '#9a5020', to: '#6a3010' },
  { Icon: Package,         from: '#2a8055', to: '#1a5030' },
  { Icon: DollarSign,      from: '#C59A18', to: '#8A6A08' },
  { Icon: ArrowDownToLine, from: '#1a5070', to: '#0e3050' },
  { Icon: ArrowUpFromLine, from: '#5a2a7a', to: '#3a1a50' },
  { Icon: TriangleAlert,   from: '#b83020', to: '#7a1a10' },
];

export function KPIStripInv() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      {KPIS_INV.map(({ label, value, delta, up }, i) => {
        const { Icon, from, to } = KPI_CONFIG[i];
        return (
          <div key={label} className="surface-raised rounded-2xl px-4 py-4">
            <div className="flex items-start justify-between mb-3">
              <IconTile Icon={Icon} from={from} to={to} size={15} tileSize={34} />
              <span className={`text-[10px] font-bold flex items-center gap-0.5 mt-1 ${up ? 'text-[#1a6040]' : 'text-red-500'}`}>
                {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              </span>
            </div>
            <p className="text-xl font-extrabold text-[#302D28] leading-none">{value}</p>
            <p className="text-[11px] text-[#8A6D3D] font-semibold mt-1 leading-tight">{label}</p>
            <div className="accent-rule mt-2 w-7" />
            <p className={`text-[10px] font-semibold mt-1.5 ${up ? 'text-[#1a6040]' : 'text-red-500'}`}>{delta}</p>
          </div>
        );
      })}
    </div>
  );
}
