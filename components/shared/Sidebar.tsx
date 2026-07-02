'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/auth-actions';
import { useAuthStore } from '@/store/auth';
import { CurrencyToggle } from './CurrencyToggle';
import {
  LayoutDashboard, FileText, Users, Package,
  ClipboardList, ShoppingCart, Truck, BarChart3,
  Settings, LogOut, ChevronLeft, ChevronRight,
  Crown, ChevronDown, Boxes, Calculator,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard',     label: 'Dashboard',        icon: LayoutDashboard },
  { href: '/cotizaciones',  label: 'Cotizaciones',     icon: FileText },
  { href: '#clientes',      label: 'Clientes',         icon: Users },
  { href: '#productos',     label: 'Productos',        icon: Package },
  { href: '#inventario',    label: 'Inventario',       icon: ClipboardList },
  { href: '#ordenes',       label: 'Órdenes de compra',icon: Boxes },
  { href: '#produccion',    label: 'Producción',       icon: ShoppingCart },
  { href: '#logistica',     label: 'Logística',        icon: Truck },
  { href: '#reportes',      label: 'Reportes',         icon: BarChart3 },
  { href: '#configuracion', label: 'Configuración',    icon: Settings },
  { href: '/calculadoras',  label: 'Calculadoras',     icon: Calculator, compactOnly: true },
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

  const handleLogout = async () => { await logout(); router.push('/login'); };

  const visibleItems = NAV_ITEMS.filter(i => !i.compactOnly || pathname.startsWith('/calculadoras'));

  return (
    <aside className={`ff-sidebar${collapsed ? ' ff-sidebar--collapsed' : ''}`}
           style={{ width: collapsed ? 76 : 272 }}>

      {/* ── HEADER ── */}
      <div className="ff-sidebar-header">
        <div className="ff-sidebar-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="FungiFlow" />
        </div>
        {!collapsed && (
          <div className="ff-sidebar-brand">
            <span className="ff-sidebar-brand-title">FungiFlow</span>
            <span className="ff-sidebar-brand-subtitle">Plataforma Integral</span>
          </div>
        )}
      </div>

      {/* ── SCROLL AREA ── */}
      <div className="ff-sidebar-scroll">

        {/* User Card */}
        {!collapsed && (
          <div className="ff-sidebar-user">
            <div className="ff-avatar">
              {user?.photoURL
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={user.photoURL} alt="" />
                : <span className="ff-avatar-initials">{getInitials(user?.displayName, user?.email)}</span>
              }
            </div>
            <div className="ff-user-info">
              <span className="ff-user-name">{user?.displayName?.split(' ').slice(0,2).join(' ') || 'Carlos Mendoza'}</span>
              <span className="ff-user-role">Administrador</span>
            </div>
            <ChevronDown size={14} className="ff-user-chevron" />
          </div>
        )}

        {/* Nav */}
        <nav className="ff-sidebar-nav">
          {visibleItems.map(({ href, label, icon: Icon }) => {
            const isReal = href.startsWith('/');
            const active = isReal && pathname.startsWith(href);
            const cls = `ff-nav-item${active ? ' active' : ''}${!isReal ? ' disabled' : ''}`;
            const inner = (
              <>
                <span className={`ff-nav-icon${active ? ' active' : ''}`}>
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                </span>
                {!collapsed && <span className="ff-nav-label">{label}</span>}
              </>
            );
            return isReal
              ? <Link key={href} href={href} className={cls} title={collapsed ? label : undefined}>{inner}</Link>
              : <button key={href} type="button" className={cls} title={collapsed ? label : undefined}>{inner}</button>;
          })}
        </nav>

        {/* Currency */}
        {!collapsed && (
          <div className="ff-currency-panel">
            <CurrencyToggle dark />
          </div>
        )}

        {/* Premium */}
        <div className="ff-premium-card">
          <div className="ff-premium-icon"><Crown size={16} /></div>
          {!collapsed && (
            <>
              <p className="ff-premium-label">Plan Premium</p>
              <p className="ff-premium-sub">Funciones avanzadas y almacenamiento ilimitado.</p>
              <button className="ff-premium-btn">Ver planes</button>
            </>
          )}
        </div>

      </div>

      {/* ── FOOTER ── */}
      <div className="ff-sidebar-footer">
        <button onClick={handleLogout} className="ff-footer-btn ff-footer-exit" title="Cerrar sesión">
          <LogOut size={15} />
          {!collapsed && <span>Salir</span>}
        </button>
        <button onClick={() => setCollapsed(v => !v)} className="ff-footer-btn ff-footer-collapse"
                title={collapsed ? 'Expandir' : 'Colapsar'}>
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          {!collapsed && <span>Colapsar</span>}
        </button>
      </div>
    </aside>
  );
}
