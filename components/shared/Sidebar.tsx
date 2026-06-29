'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/auth-actions';
import { useAuthStore } from '@/store/auth';
import { CurrencyToggle } from './CurrencyToggle';
import {
  LayoutDashboard, FileText, Calculator,
  LogOut, ChevronLeft, ChevronRight, Star,
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
    <aside className="ff-sidebar" style={{ width: collapsed ? 72 : 240 }}>

      {/* ─── Logo ─── */}
      <div className="ff-sidebar-logo">
        <div className="ff-logo-icon">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://i.postimg.cc/DzDbvHmK/logo-original.png" alt="FungiFlow" width={28} height={28} className="object-contain" />
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div className="ff-logo-name">FungiFlow</div>
            <div className="ff-logo-tagline">Gestiona el ritmo de tu cultivo</div>
          </div>
        )}
      </div>

      {/* ─── Avatar ─── */}
      <div className="ff-avatar-card" style={{ margin: collapsed ? '8px 10px' : '8px 12px' }}>
        <div className="ff-avatar-bubble">
          {user?.photoURL
            ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={user.photoURL} alt="" className="ff-avatar-photo" />
            : <span>{getInitials(user?.displayName, user?.email)}</span>}
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div className="ff-avatar-name">{user?.displayName?.split(' ').slice(0, 2).join(' ') || 'Usuario'}</div>
            <div className="ff-avatar-email">{user?.email}</div>
          </div>
        )}
      </div>

      {/* ─── Separador ─── */}
      <div className="ff-sidebar-sep" />

      {/* ─── Navegación ─── */}
      <nav style={{ flex: 1, padding: '8px 10px', overflowY: 'auto', overflowX: 'hidden' }}>
        {!collapsed && <div className="ff-nav-label">Navegación</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={`ff-nav-item ${active ? 'ff-nav-item--active' : ''}`}
              >
                <div className={`ff-nav-icon ${active ? 'ff-nav-icon--active' : ''}`}>
                  <Icon size={15} />
                </div>
                {!collapsed && <span className="ff-nav-text">{label}</span>}
                {active && !collapsed && <span className="ff-nav-dot" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ─── Moneda ─── */}
      {!collapsed && (
        <div style={{ padding: '0 12px 12px' }}>
          <div className="ff-nav-label">Moneda</div>
          <CurrencyToggle dark />
        </div>
      )}

      {/* ─── Plan Premium ─── */}
      {!collapsed && (
        <div className="ff-premium-card">
          <div className="ff-premium-header">
            <Star size={12} style={{ color: '#CA9318' }} />
            <span className="ff-premium-title">Plan Premium</span>
          </div>
          <p className="ff-premium-desc">Desbloquea reportes avanzados y cultivos ilimitados.</p>
          <button className="ff-premium-btn">Ver planes</button>
        </div>
      )}

      {/* ─── Hongos ─── */}
      {!collapsed && (
        <div className="ff-mushroom-strip">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/musgo-inferior-izquierda.png" alt="" className="ff-mushroom-moss" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hongo-sidebar.png" alt="" className="ff-mushroom-main" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hongo-inferior-derecho.png" alt="" className="ff-mushroom-right" />
        </div>
      )}

      {/* ─── Footer ─── */}
      <div className="ff-sidebar-footer">
        <button
          onClick={handleLogout}
          className="ff-logout-btn"
          title="Cerrar sesión"
        >
          <LogOut size={14} />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
        <button
          onClick={() => setCollapsed(v => !v)}
          className="ff-collapse-btn"
          title={collapsed ? 'Expandir' : 'Colapsar'}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>
    </aside>
  );
}
