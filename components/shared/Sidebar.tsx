'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/auth-actions';
import { useAuthStore } from '@/store/auth';
import { CurrencyToggle } from './CurrencyToggle';
import { ChevronDown } from 'lucide-react';

const B = 'https://i.postimg.cc';

const NAV_ITEMS = [
  {
    href: '/dashboard', label: 'Dashboard',
    icons: { default: `${B}/sDMdJkhP/dashboard-hover-01.png`, active: `${B}/kX23y0bF/dashboard-active-01.png` },
  },
  {
    href: '/cotizaciones', label: 'Cotizaciones',
    icons: { default: `${B}/JnKVTmxG/cotizaciones-default-01.png`, active: `${B}/d1nPWv6D/cotizaciones-active-01.png` },
  },
  {
    href: '#clientes', label: 'Clientes',
    icons: { default: `${B}/qqbr70Ct/clientes-default-01.png`, active: `${B}/yxQKNBSg/clientes-active-01.png` },
  },
  {
    href: '#productos', label: 'Productos',
    icons: { default: `${B}/502k2z56/productos-default-01.png`, active: `${B}/HxkPkM0r/productos-active-01.png` },
  },
  {
    href: '#inventario', label: 'Inventario',
    icons: { default: `${B}/CKV3Sd6N/inventario-default-01.png`, active: `${B}/JzXffjx9/inventario-active-01.png` },
  },
  {
    href: '#ordenes', label: 'Órdenes de compra',
    icons: { default: `${B}/KcsC40Hn/ordenes-compra-default-01.png`, active: `${B}/9XNszLnT/ordenes-compra-active-01.png` },
  },
  {
    href: '#produccion', label: 'Producción',
    icons: { default: `${B}/g237SmkL/produccion-default-01.png`, active: `${B}/HkbNZdsV/produccion-active-01.png` },
  },
  {
    href: '#logistica', label: 'Logística',
    icons: { default: `${B}/0jr3cSrL/logistica-default-01.png`, active: `${B}/T1hSCbhz/logistica-active-01.png` },
  },
  {
    href: '#reportes', label: 'Reportes',
    icons: { default: `${B}/mkcXQG5L/reportes-default-01.png`, active: `${B}/GtB7k153/reportes-active-01.png` },
  },
  {
    href: '#configuracion', label: 'Configuración',
    icons: { default: `${B}/CKGVqbfJ/configuracion-default-01.png`, active: `${B}/GpF1yvsK/configuracion-active-01.png` },
  },
  {
    href: '/calculadoras', label: 'Calculadoras', compactOnly: true,
    icons: { default: `${B}/CKGVqbfJ/configuracion-default-01.png`, active: `${B}/GpF1yvsK/configuracion-active-01.png` },
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
    <aside className={`ff-sidebar${collapsed ? ' ff-sidebar--collapsed' : ''}`}>
      {/* Ambient light overlay — z-index 2, above wood/frame pseudo-elements */}
      <div className="ff-sidebar-light" aria-hidden="true" />

      {/* All content above the PNG layers */}
      <div className="ff-sidebar-content">

        {/* Header */}
        <div className="ff-sidebar-header">
          <div className="ff-sidebar-logo">
            <div className="ff-sidebar-logo-base" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${B}/CKcsmLX4/logo-01.png`} alt="FungiFlow" />
          </div>
          {!collapsed && (
            <div className="ff-sidebar-brand">
              <div className="ff-sidebar-brand-title">FungiFlow</div>
              <div className="ff-sidebar-brand-subtitle">Plataforma Integral</div>
            </div>
          )}
        </div>

        {/* User Card */}
        {!collapsed && (
          <>
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
            <div className="ff-sidebar-divider" />
          </>
        )}

        {/* Navigation */}
        <nav className="ff-sidebar-nav">
          {visibleItems.map(({ href, label, icons }) => {
            const isRealRoute = href.startsWith('/');
            const active = isRealRoute && pathname.startsWith(href);
            const cls = `ff-sidebar-item${active ? ' active' : ''}${!isRealRoute ? ' disabled' : ''}`;

            const inner = (
              <>
                <div className="ff-active-shadow" aria-hidden="true" />
                <div className="ff-active-button" aria-hidden="true" />
                <span className="ff-sidebar-icon">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={active ? icons.active : icons.default} alt="" width={34} height={34} />
                </span>
                {!collapsed && <span className="ff-sidebar-label">{label}</span>}
              </>
            );

            return isRealRoute ? (
              <Link key={href} href={href} title={collapsed ? label : undefined} className={cls}>
                {inner}
              </Link>
            ) : (
              <button key={href} type="button" title={collapsed ? label : undefined} className={cls}>
                {inner}
              </button>
            );
          })}
        </nav>

        {/* Currency Toggle */}
        {!collapsed && (
          <div className="ff-currency-panel">
            <CurrencyToggle dark />
          </div>
        )}

        {/* Premium Card */}
        {!collapsed && (
          <div className="ff-premium-section">
            <div className="ff-premium-shadow" />
            <div className="ff-premium-base" />
            <div className="ff-premium-glow" />
            <div className="ff-premium-crown" />
            <span className="ff-premium-title">Plan Premium</span>
            <p className="ff-premium-desc">Accede a funciones avanzadas y más espacio de almacenamiento.</p>
            <div className="ff-premium-mushroom" />
            <div className="ff-premium-btn-shadow" />
            <button className="ff-premium-btn">Ver planes</button>
          </div>
        )}

        {/* Footer */}
        <div className="ff-sidebar-footer">
          <button onClick={handleLogout} className="ff-footer-item ff-footer-exit" title="Cerrar sesión">
            <div className="ff-footer-round">
              <div className="ff-footer-round-base" />
            </div>
            {!collapsed && <span className="ff-footer-label">Salir</span>}
          </button>
          <button onClick={() => setCollapsed((v) => !v)} className="ff-footer-item ff-footer-collapse" title={collapsed ? 'Expandir' : 'Colapsar menú'}>
            <div className="ff-footer-round">
              <div className="ff-footer-round-base" />
            </div>
            {!collapsed && <span className="ff-footer-label">Colapsar menú</span>}
          </button>
        </div>

      </div>
    </aside>
  );
}
