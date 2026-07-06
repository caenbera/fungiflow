'use client';

import { useState, useEffect } from 'react';
import { Bell, Mail, ChevronDown, CalendarDays } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { IconTile } from './IconTile';

function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    const p = name.trim().split(' ');
    return (p[0][0] + (p[1]?.[0] ?? '')).toUpperCase();
  }
  return email?.[0]?.toUpperCase() ?? 'U';
}

export function TopBar() {
  const { user } = useAuthStore();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const fechaCompleta  = now.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const fechaCorta     = now.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' });
  const hora           = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  const nombreCorto    = user?.displayName?.split(' ')[0] || 'Usuario';

  return (
    <div className="surface-raised rounded-2xl px-4 py-3 flex items-center justify-between gap-2">

      {/* Date */}
      <div className="flex items-center gap-2.5 min-w-0">
        <IconTile Icon={CalendarDays} from="#9a5020" to="#6a3010" size={17} tileSize={38} radius="0.7rem" />
        <div className="min-w-0">
          {/* Mobile: short date */}
          <p className="sm:hidden text-[11px] font-bold uppercase tracking-[0.12em] text-[#8A6D3D] capitalize truncate">{fechaCorta}</p>
          {/* Desktop: full date */}
          <p className="hidden sm:block text-xs font-bold uppercase tracking-[0.14em] text-[#8A6D3D] capitalize">{fechaCompleta}</p>
          <p className="text-sm font-semibold text-[#302D28]">{hora}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button className="relative hover:scale-105 transition-transform">
          <IconTile Icon={Bell} from="#b06000" to="#7a3a00" size={16} tileSize={36} radius="0.65rem" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center border border-white">3</span>
        </button>

        <button className="hover:scale-105 transition-transform">
          <IconTile Icon={Mail} from="#1a5070" to="#0e3050" size={16} tileSize={36} radius="0.65rem" />
        </button>

        {/* Mobile: avatar only */}
        <button className="sm:hidden surface-soft flex items-center gap-1.5 pl-2 pr-2 py-1.5 rounded-xl hover:scale-[1.02] transition-transform">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#8B5E2D] to-[#4B2E16] flex items-center justify-center text-white text-xs font-bold overflow-hidden flex-shrink-0 border border-white/50">
            {user?.photoURL
              ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
              : getInitials(user?.displayName, user?.email)
            }
          </div>
          <div className="text-left">
            <p className="text-[11px] font-bold text-[#302D28] leading-none truncate max-w-[72px]">{nombreCorto}</p>
            <p className="text-[9px] text-[#8A6D3D] leading-none mt-0.5">Admin</p>
          </div>
        </button>

        {/* Desktop: full user card */}
        <button className="hidden sm:flex surface-soft items-center gap-2.5 pl-3 pr-2.5 py-2 rounded-xl hover:scale-[1.02] transition-transform">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#8B5E2D] to-[#4B2E16] flex items-center justify-center text-white text-xs font-bold overflow-hidden flex-shrink-0 border border-white/50">
            {user?.photoURL
              ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
              : getInitials(user?.displayName, user?.email)
            }
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-[#302D28] leading-none">
              {user?.displayName?.split(' ').slice(0, 2).join(' ') || 'Usuario'}
            </p>
            <p className="text-[10px] text-[#8A6D3D] leading-none mt-0.5">Administrador</p>
          </div>
          <ChevronDown size={13} className="text-[#A08060]" />
        </button>
      </div>
    </div>
  );
}
