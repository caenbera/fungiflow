'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/auth-actions';
import { useAuthStore } from '@/store/auth';
import { CurrencyToggle } from './CurrencyToggle';
import {
  LayoutDashboard, FileText, Calculator, LogOut,
  ChevronLeft, ChevronRight, Star,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/cotizaciones', label: 'Cotizaciones', icon: FileText },
  { href: '/calculadoras', label: 'Calculadoras', icon: Calculator },
];

function getInitials(name: string | null | undefined, email: string | null | undefined) {
  if (name) {
    const parts = name.trim().split(' ');
    return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
  }
  return email?.[0]?.toUpperCase() ?? 'U';
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <aside
      className="sidebar-wood relative flex flex-col h-screen sticky top-0 shrink-0 transition-all duration-300 overflow-hidden"
      style={{ width: collapsed ? '68px' : '236px' }}
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://i.postimg.cc/DzDbvHmK/logo-original.png"
          alt="FungiFlow"
          width={36}
          height={36}
          className="shrink-0 object-contain rounded-lg"
        />
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-semibold text-sm leading-tight" style={{ color: '#ECE4DA' }}>FungiFlow</p>
            <p className="text-[10px] leading-tight" style={{ color: '#907966', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
              Gestiona el ritmo de tu cultivo
            </p>
          </div>
        )}
      </div>

      {/* ── Avatar / Usuario ── */}
      <div
        className="flex items-center gap-3 mx-3 mt-3 mb-1 rounded-xl px-2 py-2"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        <div
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: 'linear-gradient(135deg,#CA9318,#845C10)', color: '#FEF0CF' }}
        >
          {user?.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            getInitials(user?.displayName, user?.email)
          )}
        </div>
        {!collapsed && (
          <div className="overflow-hidden flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: '#ECE4DA' }}>
              {user?.displayName?.split(' ').slice(0, 2).join(' ') || 'Usuario'}
            </p>
            <p className="text-[10px] truncate" style={{ color: '#907966' }}>
              {user?.email}
            </p>
          </div>
        )}
      </div>

      {/* ── Navegación ── */}
      <nav className="flex-1 px-2 pt-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative"
              style={
                active
                  ? {
                      background: 'rgba(202,147,24,0.15)',
                      color: '#F2C85F',
                      boxShadow: 'inset 0 0 0 1px rgba(202,147,24,0.25)',
                    }
                  : { color: '#B49F8B' }
              }
              onMouseEnter={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <Icon
                size={17}
                className="shrink-0"
                style={{ color: active ? '#F2C85F' : '#907966' }}
              />
              {!collapsed && <span className="truncate">{label}</span>}
              {active && !collapsed && (
                <span
                  className="absolute right-2 w-1.5 h-1.5 rounded-full"
                  style={{ background: '#CA9318' }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Currency toggle (solo expandido) ── */}
      {!collapsed && (
        <div className="px-3 pb-2">
          <p className="text-[10px] uppercase tracking-widest mb-2 px-1" style={{ color: '#605B52' }}>Moneda</p>
          <CurrencyToggle dark />
        </div>
      )}

      {/* ── Plan Premium card ── */}
      {!collapsed && (
        <div
          className="mx-3 mb-3 rounded-xl p-3 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(202,147,24,0.18) 0%, rgba(147,97,58,0.18) 100%)',
            border: '1px solid rgba(202,147,24,0.2)',
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Star size={13} style={{ color: '#CA9318' }} />
            <span className="text-xs font-semibold" style={{ color: '#F2C85F' }}>Plan Premium</span>
          </div>
          <p className="text-[10px] leading-snug mb-2" style={{ color: '#907966' }}>
            Desbloquea reportes avanzados y cultivos ilimitados.
          </p>
          <button
            className="w-full text-[10px] font-semibold py-1.5 rounded-lg transition-opacity hover:opacity-90"
            style={{ background: '#CA9318', color: '#342117' }}
          >
            Ver planes
          </button>
        </div>
      )}

      {/* ── Hongos decorativos ── */}
      {!collapsed && (
        <div className="relative h-32 shrink-0 overflow-hidden">
          {/* Musgo esquina izquierda */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/musgo-inferior-izquierda.png"
            alt=""
            className="absolute bottom-0 left-0 h-20 object-contain pointer-events-none select-none opacity-70"
          />
          {/* Hongo central */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hongo-sidebar.png"
            alt=""
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-28 object-contain pointer-events-none select-none"
          />
          {/* Hongo derecho */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hongo-inferior-derecho.png"
            alt=""
            className="absolute bottom-0 right-0 h-16 object-contain pointer-events-none select-none opacity-60"
          />
        </div>
      )}

      {/* ── Logout + Colapsar ── */}
      <div
        className="flex items-center px-3 py-3 gap-2"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className="flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg flex-1 transition-all hover:opacity-80"
          style={{ color: '#907966' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#C0392B'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#907966'; }}
        >
          <LogOut size={14} className="shrink-0" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
        <button
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#907966' }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </aside>
  );
}
