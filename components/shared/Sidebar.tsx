'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/auth-actions';
import { useAuthStore } from '@/store/auth';
import { CurrencyToggle } from './CurrencyToggle';
import { Crown, ChevronDown } from 'lucide-react';

const ICON_BASE = 'https://i.postimg.cc';

const NAV_ITEMS = [
  {
    href: '/dashboard', label: 'Dashboard',
    icons: {
      default: `${ICON_BASE}/sDMdJkhP/dashboard-hover-01.png`,
      hover:   `${ICON_BASE}/sDMdJkhP/dashboard-hover-01.png`,
      active:  `${ICON_BASE}/kX23y0bF/dashboard-active-01.png`,
    },
  },
  {
    href: '/cotizaciones', label: 'Cotizaciones',
    icons: {
      default: `${ICON_BASE}/JnKVTmxG/cotizaciones-default-01.png`,
      hover:   `${ICON_BASE}/NMbqNYDK/cotizaciones-hover-01.png`,
      active:  `${ICON_BASE}/d1nPWv6D/cotizaciones-active-01.png`,
    },
  },
  {
    href: '#clientes', label: 'Clientes',
    icons: {
      default: `${ICON_BASE}/qqbr70Ct/clientes-default-01.png`,
      hover:   `${ICON_BASE}/NFJt0Yr2/clientes-hover-01.png`,
      active:  `${ICON_BASE}/yxQKNBSg/clientes-active-01.png`,
    },
  },
  {
    href: '#productos', label: 'Productos',
    icons: {
      default: `${ICON_BASE}/502k2z56/productos-default-01.png`,
      hover:   `${ICON_BASE}/d1VSVCR7/productos-hover-01.png`,
      active:  `${ICON_BASE}/HxkPkM0r/productos-active-01.png`,
    },
  },
  {
    href: '#inventario', label: 'Inventario',
    icons: {
      default: `${ICON_BASE}/CKV3Sd6N/inventario-default-01.png`,
      hover:   `${ICON_BASE}/q7dP4gZw/inventario-hover-01.png`,
      active:  `${ICON_BASE}/JzXffjx9/inventario-active-01.png`,
    },
  },
  {
    href: '#ordenes', label: 'Órdenes de compra',
    icons: {
      default: `${ICON_BASE}/KcsC40Hn/ordenes-compra-default-01.png`,
      hover:   `${ICON_BASE}/qBZWg152/ordenes-compra-hover-01.png`,
      active:  `${ICON_BASE}/9XNszLnT/ordenes-compra-active-01.png`,
    },
  },
  {
    href: '#produccion', label: 'Producción',
    icons: {
      default: `${ICON_BASE}/g237SmkL/produccion-default-01.png`,
      hover:   `${ICON_BASE}/kgWH1qX6/produccion-hover-01.png`,
      active:  `${ICON_BASE}/HkbNZdsV/produccion-active-01.png`,
    },
  },
  {
    href: '#logistica', label: 'Logística',
    icons: {
      default: `${ICON_BASE}/0jr3cSrL/logistica-default-01.png`,
      hover:   `${ICON_BASE}/T1hSCbhB/logistica-hover-01.png`,
      active:  `${ICON_BASE}/T1hSCbhz/logistica-active-01.png`,
    },
  },
  {
    href: '#reportes', label: 'Reportes',
    icons: {
      default: `${ICON_BASE}/mkcXQG5L/reportes-default-01.png`,
      hover:   `${ICON_BASE}/3NySgHcK/reportes-hover-01.png`,
      active:  `${ICON_BASE}/GtB7k153/reportes-active-01.png`,
    },
  },
  {
    href: '#configuracion', label: 'Configuración',
    icons: {
      default: `${ICON_BASE}/CKGVqbfJ/configuracion-default-01.png`,
      hover:   `${ICON_BASE}/nL4tDqQ0/configuracion-hover-01.png`,
      active:  `${ICON_BASE}/GpF1yvsK/configuracion-active-01.png`,
    },
  },
  {
    href: '/calculadoras', label: 'Calculadoras', compactOnly: true,
    icons: {
      default: `${ICON_BASE}/CKGVqbfJ/configuracion-default-01.png`,
      hover:   `${ICON_BASE}/nL4tDqQ0/configuracion-hover-01.png`,
      active:  `${ICON_BASE}/GpF1yvsK/configuracion-active-01.png`,
    },
  },
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
    <aside className={collapsed ? 'ff-sidebar ff-sidebar--collapsed' : 'ff-sidebar'} style={{ width: collapsed ? 78 : 312 }}>
      {/* PNG frame overlay */}
      <div className="ff-sidebar-frame" aria-hidden="true" />
      <div className="ff-sidebar-ao" aria-hidden="true" />

      {/* Header */}
      <div className="ff-sidebar-header">
        <div className="ff-sidebar-brand">
          <div className="ff-sidebar-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://i.postimg.cc/CKcsmLX4/logo-01.png" alt="FungiFlow" />
          </div>
          {!collapsed && (
            <div>
              <div className="ff-sidebar-brand-title">FungiFlow</div>
              <div className="ff-sidebar-brand-subtitle">Plataforma Integral</div>
            </div>
          )}
        </div>
        <div className="ff-sidebar-divider" />
      </div>

      {/* Scroll Area */}
      <div className="ff-sidebar-scroll">
        {!collapsed && (
          <div className="ff-sidebar-user">
            <div className="ff-avatar">
              {user?.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt="" />
              ) : (
                <div className="ff-avatar-initials">{getInitials(user?.displayName, user?.email)}</div>
              )}
            </div>
            <div className="ff-user-info">
              <span className="ff-user-name">{user?.displayName?.split(' ').slice(0, 2).join(' ') || 'Carlos Mendoza'}</span>
              <span className="ff-user-role">Administrador</span>
            </div>
            <ChevronDown size={14} className="ff-user-chevron" />
          </div>
        )}

        <nav className="ff-sidebar-nav">
          {visibleItems.map(({ href, label, icons }) => {
            const isRealRoute = href.startsWith('/');
            const active = isRealRoute && pathname.startsWith(href);
            const itemClass = 'ff-sidebar-item' + (active ? ' active' : '') + (!isRealRoute ? ' disabled' : '');
            const iconStyle = {
              '--icon-default': `url(${icons.default})`,
              '--icon-hover':   `url(${icons.hover})`,
              '--icon-active':  `url(${icons.active})`,
            } as React.CSSProperties;

            const content = (
              <>
                <span className="ff-sidebar-icon" style={iconStyle} />
                {!collapsed && <span className="ff-sidebar-label">{label}</span>}
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
          <div className="ff-currency-panel">
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
      </div>

      {/* Footer */}
      <div className="ff-sidebar-footer">
        <div className="ff-sidebar-divider" />
        <div className="ff-footer-section">
          <button onClick={handleLogout} className="ff-logout-btn" title="Cerrar sesión">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ICON_BASE}/L470mnJn/salir-default-01.png`} width={22} height={22} alt="" />
            {!collapsed && <span>Salir</span>}
          </button>
          <button onClick={() => setCollapsed((v) => !v)} className="ff-collapse-btn" title={collapsed ? 'Expandir' : 'Colapsar menú'}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ICON_BASE}/K8gbm6GC/colapsar-menu-default-01.png`} width={22} height={22} alt="" />
            {!collapsed && <span>Colapsar menú</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
