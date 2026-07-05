import {
  Building2, Users, Layers, Receipt, CreditCard,
  DollarSign, Shield, ScrollText, Settings, LineChart,
  Activity, Bell, Code2, Puzzle, Store, HeadphonesIcon,
} from 'lucide-react';

const MODULES = [
  { group: 'Plataforma', color: '#7a4010', items: [
    { label: 'Empresas',      href: '/superadmin/empresas',      icon: Building2 },
    { label: 'Clientes',      href: '/superadmin/clientes',      icon: Users },
    { label: 'Planes',        href: '/superadmin/planes',        icon: Layers },
    { label: 'Suscripciones', href: '/superadmin/suscripciones', icon: CreditCard },
  ]},
  { group: 'Finanzas', color: '#1a6040', items: [
    { label: 'Facturación', href: '/superadmin/facturacion', icon: Receipt },
    { label: 'Pagos',       href: '/superadmin/pagos',       icon: DollarSign },
  ]},
  { group: 'Usuarios & Acceso', color: '#1a3060', items: [
    { label: 'Usuarios',  href: '/superadmin/usuarios',  icon: Users },
    { label: 'Roles',     href: '/superadmin/roles',     icon: Shield },
    { label: 'Permisos',  href: '/superadmin/permisos',  icon: Shield },
  ]},
  { group: 'Sistema', color: '#4a1a6a', items: [
    { label: 'Logs',         href: '/superadmin/logs',          icon: ScrollText },
    { label: 'Auditoría',    href: '/superadmin/auditoria',     icon: ScrollText },
    { label: 'Config. Global', href: '/superadmin/configuracion', icon: Settings },
  ]},
  { group: 'Crecimiento', color: '#1a5a4a', items: [
    { label: 'Analítica',     href: '/superadmin/analitica',      icon: LineChart },
    { label: 'Uso del sistema', href: '/superadmin/uso',          icon: Activity },
    { label: 'Notificaciones', href: '/superadmin/notificaciones', icon: Bell },
  ]},
  { group: 'Plataforma Avanzada', color: '#2a4a7a', items: [
    { label: 'API',          href: '/superadmin/api',           icon: Code2 },
    { label: 'Integraciones', href: '/superadmin/integraciones', icon: Puzzle },
    { label: 'Marketplace',  href: '/superadmin/marketplace',   icon: Store },
  ]},
  { group: 'Soporte', color: '#6a3a10', items: [
    { label: 'Soporte',           href: '/superadmin/soporte',      icon: HeadphonesIcon },
    { label: 'Base de conocimiento', href: '/superadmin/conocimiento', icon: HeadphonesIcon },
  ]},
];

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#2a1408]" style={{ fontFamily: 'var(--font-serif)' }}>
          Dashboard General
        </h1>
        <p className="mt-1 text-sm text-[#8a7060]">Vista completa de la plataforma FungiFlow SaaS</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Empresas activas', value: '—' },
          { label: 'Usuarios totales', value: '—' },
          { label: 'Ingresos MRR', value: '—' },
          { label: 'Uptime', value: '—' },
        ].map(({ label, value }) => (
          <div key={label} className="surface-raised rounded-2xl px-5 py-4">
            <p className="text-2xl font-bold text-[#2a1408]">{value}</p>
            <p className="text-xs text-[#8a7060] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Module groups */}
      {MODULES.map(({ group, color, items }) => (
        <div key={group}>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color }}>
            {group}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map(({ label, href, icon: Icon }) => (
              <a
                key={href}
                href={href}
                className="surface-raised rounded-2xl px-4 py-4 flex items-center gap-3 hover:shadow-md transition-shadow group"
              >
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}18` }}
                >
                  <Icon size={18} style={{ color }} />
                </span>
                <span className="text-sm font-semibold text-[#3d2010] group-hover:text-[#7a4010] transition-colors">
                  {label}
                </span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
