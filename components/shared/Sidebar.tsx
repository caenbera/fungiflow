'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/auth-actions';
import { useAuthStore } from '@/store/auth';
import { CurrencyToggle } from './CurrencyToggle';
import {
  LayoutDashboard, FileText, Calculator,
  LogOut, ChevronLeft, ChevronRight, Star, ChevronDown,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/cotizaciones', label: 'Cotizaciones', icon: FileText },
  { href: '/calculadoras', label: 'Calculadoras', icon: Calculator },
];

function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    const p = name.trim().split(' ');
    return (p[0][0] + (p[1]?.[0] ?? '')).toUpperCase();
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
    <aside className="ff-sidebar" style={{ width: collapsed ? 68 : 230 }}>

      {/* ─── Logo ─── */}
      <div className="ff-sidebar-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://i.postimg.cc/DzDbvHmK/logo-original.png"
          alt="FungiFlow"
          width={40}
          height={40}
          className="ff-logo-img"
        />
        {!collapsed && (
          <div>
            <div className="ff-logo-name">FungiFlow</div>
            <div className="ff-logo-tagline">Plataforma Integral</div>
          </div>
        )}
      </div>

      {/* ─── Avatar ─── */}
      {!collapsed && (
        <div className="ff-avatar-card">
          <div className="ff-avatar-bubble">
            {user?.photoURL
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={user.photoURL} alt="" className="ff-avatar-photo" />
              : <span>{getInitials(user?.displayName, user?.email)}</span>}
          </div>
          <div className="ff-avatar-info">
            <div className="ff-avatar-name">
              {user?.displayName?.split(' ').slice(0, 2).join(' ') || 'Usuario'}
            </div>
            <div className="ff-avatar-role">Administrador</div>
          </div>
          <ChevronDown size={14} style={{ color: '#C9A87A', flexShrink: 0 }} />
        </div>
      )}

      {/* ─── Navegación ─── */}
      <nav className="ff-nav">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`ff-nav-item ${active ? 'ff-nav-item--active' : ''}`}
            >
              <Icon size={18} className="ff-nav-icon-svg" />
              {!collapsed && <span className="ff-nav-label">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ─── Moneda (solo expandido) ─── */}
      {!collapsed && (
        <div className="ff-currency-section">
          <CurrencyToggle dark />
        </div>
      )}

      {/* ─── Spacer ─── */}
      <div style={{ flex: 1 }} />

      {/* ─── Plan Premium ─── */}
      <div className="ff-premium-card" style={{ margin: collapsed ? '0 8px 8px' : '0 12px 8px' }}>
        <div className="ff-premium-inner">
          <Star size={13} className="ff-premium-star" />
          {!collapsed && <span className="ff-premium-title">Plan Premium</span>}
        </div>
        {!collapsed && (
          <>
            <p className="ff-premium-desc">
              Funciones avanzadas y almacenamiento ilimitado.
            </p>
            <button className="ff-premium-btn">Ver planes</button>
          </>
        )}
      </div>

      {/* ─── Hongos decorativos ─── */}
      {!collapsed && (
        <div className="ff-mushroom-strip">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/musgo-inferior-izquierda.png" alt="" className="ff-mushroom-moss" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hongo-sidebar.png" alt="" className="ff-mushroom-center" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hongo-inferior-derecho.png" alt="" className="ff-mushroom-right" />
        </div>
      )}

      {/* ─── Footer: colapsar ─── */}
      <div className="ff-sidebar-footer">
        {!collapsed && (
          <button onClick={handleLogout} className="ff-logout-btn">
            <LogOut size={14} />
            <span>Cerrar sesión</span>
          </button>
        )}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="ff-collapse-btn"
          title={collapsed ? 'Expandir' : 'Colapsar menú'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
        {!collapsed && <span className="ff-collapse-label">Colapsar menú</span>}
      </div>

    </aside>
  );
}
