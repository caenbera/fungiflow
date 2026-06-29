'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/auth-actions';
import { useAuthStore } from '@/store/auth';
import { CurrencyToggle } from './CurrencyToggle';
import {
  LayoutDashboard,
  FileText,
  Calculator,
  Users,
  Package,
  ClipboardList,
  ShoppingCart,
  Truck,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Crown,
  ChevronDown,
  Boxes,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/cotizaciones', label: 'Cotizaciones', icon: FileText },
  { href: '#clientes', label: 'Clientes', icon: Users },
  { href: '#productos', label: 'Productos', icon: Package },
  { href: '#inventario', label: 'Inventario', icon: ClipboardList },
  { href: '#ordenes', label: 'Ã“rdenes de compra', icon: Boxes },
  { href: '#produccion', label: 'ProducciÃ³n', icon: ShoppingCart },
  { href: '#logistica', label: 'LogÃ­stica', icon: Truck },
  { href: '#reportes', label: 'Reportes', icon: BarChart3 },
  { href: '#configuracion', label: 'ConfiguraciÃ³n', icon: Settings },
  { href: '/calculadoras', label: 'Calculadoras', icon: Calculator, compactOnly: true },
];

function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    const p = name.trim().split(' ');
    return (p[0][0] + (p[1]?.[0] ?? '')).toUpperCase();
  }
  return email?.[0]?.toUpperCase() ?? 'CM';
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

  const visibleItems = NAV_ITEMS.filter((item) => !item.compactOnly || pathname.startsWith('/calculadoras'));

  return (
    <aside className={collapsed ? 'ff-sidebar ff-sidebar--collapsed' : 'ff-sidebar'} style={{ width: collapsed ? 78 : 252 }}>
      <div className="ff-sidebar-glow" />

      <div className="ff-section ff-logo-section">
        <div className="ff-logo-icon-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="FungiFlow" width={42} height={42} className="ff-logo-img" />
        </div>
        {!collapsed && (
          <div className="ff-logo-text">
            <span className="ff-logo-name">FungiFlow</span>
            <span className="ff-logo-sub">Plataforma Integral</span>
          </div>
        )}
      </div>

      <div className="ff-divider" />

      {!collapsed && (
        <div className="ff-section ff-user-section">
          <div className="ff-user-avatar">
            {user?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photoURL} alt="" className="ff-user-photo" />
            ) : (
              <span className="ff-user-initials">{getInitials(user?.displayName, user?.email)}</span>
            )}
          </div>
          <div className="ff-user-info">
            <span className="ff-user-name">{user?.displayName?.split(' ').slice(0, 2).join(' ') || 'Carlos Mendoza'}</span>
            <span className="ff-user-role">Administrador</span>
          </div>
          <ChevronDown size={14} className="ff-user-chevron" />
        </div>
      )}

      <nav className="ff-nav-section">
        {visibleItems.map(({ href, label, icon: Icon }) => {
          const isRealRoute = href.startsWith('/');
          const active = isRealRoute && pathname.startsWith(href);
          const itemClass = 'ff-nav-item ' + (active ? 'ff-nav-item--active ' : '') + (!isRealRoute ? 'ff-nav-item--disabled' : '');
          const content = (
            <>
              <span className={'ff-nav-icon ' + (active ? 'ff-nav-icon--active' : '')}>
                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
              </span>
              {!collapsed && <span className="ff-nav-label">{label}</span>}
            </>
          );

          return isRealRoute ? (
            <Link key={href} href={href} title={collapsed ? label : undefined} className={itemClass}>
              {content}
            </Link>
          ) : (
            <button key={href} type="button" title={collapsed ? label : undefined} className={itemClass}>
              {content}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="ff-section ff-currency-panel">
          <CurrencyToggle dark />
        </div>
      )}

      <div className="ff-premium-section">
        <div className="ff-premium-header">
          <span className="ff-premium-star"><Crown size={17} /></span>
          {!collapsed && <span className="ff-premium-title">Plan Premium</span>}
        </div>
        {!collapsed && (
          <>
            <p className="ff-premium-desc">Funciones avanzadas y almacenamiento ilimitado.</p>
            <button className="ff-premium-btn">Ver planes</button>
          </>
        )}
      </div>

      <div className="ff-sidebar-spacer" />

      <div className="ff-footer-section">
        <button onClick={handleLogout} className="ff-logout-btn" title="Cerrar sesión">
          <LogOut size={14} />
          {!collapsed && <span>Salir</span>}
        </button>
        <button onClick={() => setCollapsed((v) => !v)} className="ff-collapse-btn" title={collapsed ? 'Expandir' : 'Colapsar menú'}>
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          {!collapsed && <span>Colapsar menú</span>}
        </button>
      </div>
    </aside>
  );
}
