import { type LucideIcon } from 'lucide-react';

interface IconTileProps {
  Icon: LucideIcon;
  from: string;
  to: string;
  size?: number;
  tileSize?: number;
  radius?: string;
}

export function IconTile({ Icon, from, to, size = 16, tileSize = 36, radius = '0.6rem' }: IconTileProps) {
  return (
    <span
      className="flex items-center justify-center flex-shrink-0"
      style={{
        width: tileSize,
        height: tileSize,
        borderRadius: radius,
        background: `linear-gradient(145deg, ${from}, ${to})`,
        border: '1px solid rgba(255,255,255,0.22)',
        boxShadow:
          '0 1px 0 rgba(255,255,255,0.28) inset, 0 -2px 3px rgba(0,0,0,0.20) inset, 0 6px 14px rgba(0,0,0,0.18), 0 2px 4px rgba(0,0,0,0.12)',
        color: '#fff',
      }}
    >
      <Icon size={size} strokeWidth={1.8} />
    </span>
  );
}
