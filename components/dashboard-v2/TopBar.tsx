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
    <div className="surface-raised rounded-2xl px-4 py-3">

      {/* ── Mobile layout: date row + icons row ── */}
      <div className="sm:hidden flex flex-col gap-2.5">
        {/* Row 1: date + time */}
        <div className="flex items-center gap-2.5">
          <IconTile Icon={CalendarDays} from="#9a5020" to="#6a3010" size={17} tileSize={38} radius="0.7rem" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8A6D3D] capitalize">{fechaCorta}</p>
            <p className="text-sm font-semibold text-[#302D28]">{hora}</p>
          </div>
        </div>
        {/* Row 2: icons + user */}
        <div className="flex items-center gap-2">
          <button className="relative hover:scale-105 transition-transform">
            <IconTile Icon={Bell} from="#b06000" to="#7a3a00" size={16} tileSize={34} radius="0.65rem" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center border border-white">3</span>
          </button>
          <button className="hover:scale-105 transition-transform">
            <IconTile Icon={Mail} from="#1a5070" to="#0e3050" size={16} tileSize={34} radius="0.65rem" />
          </button>
          <button className="ml-auto surface-soft flex items-center gap-2 pl-2.5 pr-2.5 py-1.5 rounded-xl hover:scale-[1.02] transition-transform">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#8B5E2D] to-[#4B2E16] flex items-center justify-center text-white text-xs font-bold overflow-hidden flex-shrink-0 border border-white/50">
              {user?.photoURL
                ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                : getInitials(user?.displayName, user?.email)
              }
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold text-[#302D28] leading-none">{nombreCorto}</p>
              <p className="text-[9px] text-[#8A6D3D] leading-none mt-0.5">Administrador</p>
            </div>
            <ChevronDown size={11} className="text-[#A08060]" />
          </button>
        </div>
      </div>

      {/* ── Desktop layout: single row ── */}
      <div className="hidden sm:flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <IconTile Icon={CalendarDays} from="#9a5020" to="#6a3010" size={17} tileSize={38} radius="0.7rem" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A6D3D] capitalize">{fechaCompleta}</p>
            <p className="text-sm font-semibold text-[#302D28]">{hora}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative hover:scale-105 transition-transform">
            <IconTile Icon={Bell} from="#b06000" to="#7a3a00" size={16} tileSize={36} radius="0.65rem" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center border border-white">3</span>
          </button>
          <button className="hover:scale-105 transition-transform">
            <IconTile Icon={Mail} from="#1a5070" to="#0e3050" size={16} tileSize={36} radius="0.65rem" />
          </button>
          <button className="surface-soft flex items-center gap-2.5 pl-3 pr-2.5 py-2 rounded-xl hover:scale-[1.02] transition-transform">
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

    </div>
  );
}
