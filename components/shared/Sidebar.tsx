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
  const router   = useRouter();
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => { await logout(); router.push('/login'); };

  return (
    <aside className="ff-sidebar" style={{ width: collapsed ? 68 : 232 }}>

      {/* ══ LOGO ══ */}
      <div className="ff-section ff-logo-section">
        <div className="ff-logo-icon-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://i.postimg.cc/DzDbvHmK/logo-original.png" alt="" width={30} height={30} className="ff-logo-img" />
        </div>
        {!collapsed && (
          <div className="ff-logo-text">
            <span className="ff-logo-name">FungiFlow</span>
            <span className="ff-logo-sub">Plataforma Integral</span>
          </div>
        )}
      </div>

      <div className="ff-divider" />

      {/* ══ USUARIO ══ */}
      {!collapsed && (
        <>
          <div className="ff-section ff-user-section">
            <div className="ff-user-avatar">
              {user?.photoURL
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={user.photoURL} alt="" className="ff-user-photo" />
                : <span className="ff-user-initials">{getInitials(user?.displayName, user?.email)}</span>
              }
            </div>
            <div className="ff-user-info">
              <span className="ff-user-name">{user?.displayName?.split(' ').slice(0,2).join(' ') || 'Usuario'}</span>
              <span className="ff-user-role">Administrador</span>
            </div>
            <ChevronDown size={13} className="ff-user-chevron" />
          </div>
          <div className="ff-divider" />
        </>
      )}

      {/* ══ NAVEGACIÓN ══ */}
      <nav className="ff-nav-section">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href} title={collapsed ? label : undefined}
              className={`ff-nav-item ${active ? 'ff-nav-item--active' : ''}`}>
              <span className={`ff-nav-icon ${active ? 'ff-nav-icon--active' : ''}`}>
                <Icon size={16} strokeWidth={active ? 2.5 : 1.8} />
              </span>
              {!collapsed && <span className="ff-nav-label">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="ff-divider" />

      {/* ══ MONEDA ══ */}
      {!collapsed && (
        <>
          <div className="ff-section" style={{ paddingTop: 10, paddingBottom: 10 }}>
            <CurrencyToggle dark />
          </div>
          <div className="ff-divider" />
        </>
      )}

      {/* ══ PLAN PREMIUM ══ */}
      <div className="ff-section ff-premium-section">
        <div className="ff-premium-header">
          <span className="ff-premium-star"><Star size={11} /></span>
          {!collapsed && <span className="ff-premium-title">Plan Premium</span>}
        </div>
        {!collapsed && (
          <>
            <p className="ff-premium-desc">Funciones avanzadas y almacenamiento ilimitado.</p>
            <button className="ff-premium-btn">Ver planes</button>
          </>
        )}
      </div>

      {/* ══ FLEX SPACER ══ */}
      <div style={{ flex: 1 }} />

      {/* ══ HONGOS — integrados en la superficie ══ */}
      {!collapsed && (
        <div className="ff-fungi-zone">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/musgo-inferior-izquierda.png"  alt="" className="ff-fungi-moss"   />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hongo-sidebar.png"             alt="" className="ff-fungi-center" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hongo-inferior-derecho.png"    alt="" className="ff-fungi-right"  />
          {/* Gradiente de fusión superior */}
          <div className="ff-fungi-fade" />
        </div>
      )}

      {/* ══ FOOTER / COLAPSAR ══ */}
      <div className="ff-footer-section">
        {!collapsed && (
          <button onClick={handleLogout} className="ff-logout-btn">
            <LogOut size={13} />
          </button>
        )}
        <button onClick={() => setCollapsed(v => !v)} className="ff-collapse-btn"
          title={collapsed ? 'Expandir' : 'Colapsar menú'}>
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
        {!collapsed && <span className="ff-collapse-label">Colapsar menú</span>}
      </div>

    </aside>
  );
}
