'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/auth-actions';
import { useAuthStore } from '@/store/auth';
import { CurrencyToggle } from './CurrencyToggle';
import {
  LayoutDashboard, FileText, Users, Package,
  ClipboardList, ShoppingCart, Truck, BarChart3,
  Settings, LogOut, ChevronLeft, ChevronRight, CheckSquare, X,
  Crown, ChevronDown, Boxes, Calculator,
  Building2, CreditCard, Receipt, Layers,
  DollarSign, Shield, Key, ScrollText,
  Search, Globe, Languages, HardDrive,
  BookOpen, HeadphonesIcon, Bell, Activity,
  LineChart, Code2, Puzzle, Store, FileStack, Cpu,
} from 'lucide-react';

/* ── Nav items ─────────────────────────────────────────── */

const ADMIN_GROUPS = [
  {
    label: 'Principal',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/blueprints', label: 'Blueprints de Cultivo', icon: FileStack },
    ],
  },
  {
    label: 'Comercial',
    items: [
      { href: '/clientes',      label: 'Clientes',      icon: Users    },
      { href: '/cotizaciones',  label: 'Cotizaciones',  icon: FileText },
    ],
  },
  {
    label: 'Inventario & Compras',
    items: [
      { href: '/productos',    label: 'Productos',         icon: Package    },
      { href: '/inventario',   label: 'Inventario',        icon: ClipboardList },
      { href: '/marketplace',  label: 'Marketplace',       icon: Store      },
      { href: '/proveedores',  label: 'Proveedores',       icon: Building2  },
      { href: '/ordenes',      label: 'Órdenes de compra', icon: Boxes      },
    ],
  },
  {
    label: 'Operaciones',
    items: [
      { href: '/produccion', label: 'Producción', icon: ShoppingCart },
      { href: '/logistica',  label: 'Logística',  icon: Truck        },
    ],
  },
  {
    label: 'Análisis',
    items: [
      { href: '/reportes', label: 'Reportes', icon: BarChart3 },
    ],
  },
  {
    label: 'Herramientas',
    items: [
      { href: '/calculadoras', label: 'Calculadoras',      icon: Calculator  },
      { href: '/checklists',   label: 'Listas de Chequeo', icon: CheckSquare },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { href: '/configuracion', label: 'Configuración', icon: Settings },
    ],
  },
];

const SUPERADMIN_GROUPS = [
  {
    label: 'Plataforma',
    items: [
      { href: '/superadmin',             label: 'Dashboard General', icon: LayoutDashboard },
      { href: '/superadmin/empresas',    label: 'Empresas',          icon: Building2 },
      { href: '/superadmin/clientes',    label: 'Clientes',          icon: Users },
      { href: '/superadmin/planes',      label: 'Planes',            icon: Layers },
      { href: '/superadmin/blueprints',  label: 'Blueprints de Cultivo', icon: FileStack },
    ],
  },
  {
    label: 'Finanzas',
    items: [
      { href: '/superadmin/facturacion',   label: 'Facturación',    icon: Receipt },
      { href: '/superadmin/suscripciones', label: 'Suscripciones',  icon: CreditCard },
      { href: '/superadmin/pagos',         label: 'Pagos',          icon: DollarSign },
      { href: '/superadmin/monedas',       label: 'Monedas',        icon: Globe },
    ],
  },
  {
    label: 'Usuarios & Acceso',
    items: [
      { href: '/superadmin/usuarios',   label: 'Usuarios',   icon: Users },
      { href: '/superadmin/permisos',   label: 'Permisos',   icon: Shield },
      { href: '/superadmin/roles',      label: 'Roles',      icon: Key },
      { href: '/superadmin/paises',     label: 'Países',     icon: Globe },
      { href: '/superadmin/idiomas',    label: 'Idiomas',    icon: Languages },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { href: '/superadmin/logs',          label: 'Logs',               icon: ScrollText },
      { href: '/superadmin/auditoria',     label: 'Auditoría',          icon: Search },
      { href: '/superadmin/configuracion', label: 'Config. Global',     icon: Settings },
      { href: '/superadmin/backups',       label: 'Backups',            icon: HardDrive },
    ],
  },
  {
    label: 'Crecimiento',
    items: [
      { href: '/superadmin/analitica',      label: 'Analítica',        icon: LineChart },
      { href: '/superadmin/uso',            label: 'Uso del sistema',  icon: Activity },
      { href: '/superadmin/notificaciones', label: 'Notificaciones',   icon: Bell },
    ],
  },
  {
    label: 'Plataforma Avanzada',
    items: [
      { href: '/superadmin/api',           label: 'API',              icon: Code2 },
      { href: '/superadmin/integraciones', label: 'Integraciones',    icon: Puzzle },
      { href: '/superadmin/marketplace',   label: 'Marketplace',      icon: Store },
      { href: '/superadmin/plantillas',    label: 'Plantillas',       icon: FileStack },
      { href: '/superadmin/ia',            label: 'IA',               icon: Cpu },
    ],
  },
  {
    label: 'Soporte',
    items: [
      { href: '/superadmin/soporte',      label: 'Soporte',           icon: HeadphonesIcon },
      { href: '/superadmin/conocimiento', label: 'Base de conocimiento', icon: BookOpen },
    ],
  },
];

/* ── Helpers ────────────────────────────────────────────── */

function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    const p = name.trim().split(' ');
    return (p[0][0] + (p[1]?.[0] ?? '')).toUpperCase();
  }
  return email?.[0]?.toUpperCase() ?? 'CM';
}

/* ── Nav item component ─────────────────────────────────── */

function NavItem({
  href, label, icon: Icon, active, disabled, collapsed,
}: {
  href: string; label: string; icon: React.ElementType;
  active: boolean; disabled: boolean; collapsed: boolean;
}) {
  const cls = `ff-nav-item${active ? ' active' : ''}${disabled ? ' disabled' : ''}`;
  const inner = (
    <>
      <span className={`ff-nav-icon${active ? ' active' : ''}`}>
        <Icon size={18} strokeWidth={active ? 2.5 : 2} />
      </span>
      {!collapsed && <span className="ff-nav-label">{label}</span>}
    </>
  );
  const isReal = href.startsWith('/');
  return isReal
    ? <Link href={href} className={cls} title={collapsed ? label : undefined}>{inner}</Link>
    : <button type="button" className={cls} title={collapsed ? label : undefined}>{inner}</button>;
}

/* ── Collapsible section ────────────────────────────────── */

function NavSection({
  label, items, collapsed, pathname, defaultOpen = true,
}: {
  label: string; items: { href: string; label: string; icon: React.ElementType }[];
  collapsed: boolean; pathname: string; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="ff-nav-section">
      {!collapsed && (
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className="ff-nav-section-header"
        >
          <span className="ff-nav-section-label">{label}</span>
          <ChevronDown
            size={13}
            className="ff-nav-section-chevron"
            style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform .2s' }}
          />
        </button>
      )}
      <div
        className="ff-nav-section-body"
        style={{ maxHeight: open || collapsed ? '9999px' : '0', overflow: 'hidden', transition: 'max-height .25s ease' }}
      >
        {items.map(({ href, label: lbl, icon }) => {
          const isReal = href.startsWith('/');
          const active = isReal && pathname === href;
          return (
            <NavItem
              key={href} href={href} label={lbl} icon={icon}
              active={active} disabled={!isReal} collapsed={collapsed}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ── Sidebar ────────────────────────────────────────────── */

export function Sidebar({
  mobileOpen = false,
  onMobileClose,
}: {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const isSuperAdmin = role === 'superadmin';

  // Close mobile nav on route change
  useEffect(() => { onMobileClose?.(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = async () => { await logout(); router.push('/login'); };

  const sidebarPanel = (
    <aside
      className={`ff-sidebar${collapsed ? ' ff-sidebar--collapsed' : ''}`}
      style={{ width: collapsed ? 76 : 272 }}
    >
      {/* ── HEADER ── */}
      <div className="ff-sidebar-header">
        <div className="ff-sidebar-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://i.postimg.cc/DzDbvHmK/logo-original.png" alt="FungiFlow" />
        </div>
        {!collapsed && (
          <div className="ff-sidebar-brand">
            <span className="ff-sidebar-brand-title">FungiFlow</span>
            <span className="ff-sidebar-brand-subtitle">
              {isSuperAdmin ? 'Super Admin' : 'Plataforma Integral'}
            </span>
          </div>
        )}
        {/* Close button — mobile only */}
        <button
          onClick={onMobileClose}
          className="lg:hidden ml-auto flex items-center justify-center w-8 h-8 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
          aria-label="Cerrar menú">
          <X size={18} />
        </button>
      </div>

      {/* ── SCROLL AREA ── */}
      <div className="ff-sidebar-scroll">

        {/* User card */}
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
              <span className="ff-user-name">
                {user?.displayName?.split(' ').slice(0, 2).join(' ') || 'Usuario'}
              </span>
              <span className="ff-user-role" style={{ color: isSuperAdmin ? '#F5CC60' : undefined }}>
                {isSuperAdmin ? '⭐ Super Admin' : 'Administrador'}
              </span>
            </div>
            <ChevronDown size={14} className="ff-user-chevron" />
          </div>
        )}

        {/* ── SUPERADMIN NAV ── */}
        {isSuperAdmin && (
          <>
            {!collapsed && (
              <div className="ff-nav-group-title">Super Administrador</div>
            )}
            {SUPERADMIN_GROUPS.map((group) => (
              <NavSection
                key={group.label}
                label={group.label}
                items={group.items}
                collapsed={collapsed}
                pathname={pathname}
                defaultOpen={false}
              />
            ))}

            {!collapsed && (
              <div className="ff-nav-group-title" style={{ marginTop: 12 }}>Administrador</div>
            )}
          </>
        )}

        {/* ── ADMIN NAV ── */}
        {ADMIN_GROUPS.map((group) => (
          <NavSection
            key={group.label}
            label={group.label}
            items={group.items}
            collapsed={collapsed}
            pathname={pathname}
            defaultOpen={false}
          />
        ))}

        {/* Currency */}
        {!collapsed && (
          <div className="ff-currency-panel">
            <CurrencyToggle dark />
          </div>
        )}

        {/* Premium (solo para admin normal) */}
        {!isSuperAdmin && (
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
        )}
      </div>

      {/* ── FOOTER ── */}
      <div className="ff-sidebar-footer">
        <button onClick={handleLogout} className="ff-footer-btn ff-footer-exit" title="Cerrar sesión">
          <LogOut size={15} />
          {!collapsed && <span>Salir</span>}
        </button>
        <button
          onClick={() => setCollapsed(v => !v)}
          className="ff-footer-btn ff-footer-collapse hidden lg:flex"
          title={collapsed ? 'Expandir' : 'Colapsar'}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          {!collapsed && <span>Colapsar</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      <div className="hidden lg:block flex-shrink-0" style={{ width: collapsed ? 76 : 272 }}>
        {sidebarPanel}
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          onClick={onMobileClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          {/* Panel — stop propagation so clicking inside doesn't close */}
          <div
            className="relative z-10 flex-shrink-0"
            style={{ width: 272 }}
            onClick={e => e.stopPropagation()}
          >
            {sidebarPanel}
          </div>
        </div>
      )}
    </>
  );
}
