const LABELS: Record<string, string> = {
  empresas: 'Empresas', clientes: 'Clientes', planes: 'Planes',
  facturacion: 'Facturación', suscripciones: 'Suscripciones', pagos: 'Pagos',
  usuarios: 'Usuarios', permisos: 'Permisos', roles: 'Roles',
  logs: 'Logs', auditoria: 'Auditoría', monedas: 'Monedas',
  paises: 'Países', idiomas: 'Idiomas', configuracion: 'Configuración Global',
  backups: 'Backups', conocimiento: 'Base de conocimiento', soporte: 'Soporte',
  notificaciones: 'Notificaciones', uso: 'Uso del sistema', analitica: 'Analítica',
  api: 'API', integraciones: 'Integraciones', marketplace: 'Marketplace',
  plantillas: 'Plantillas', ia: 'Inteligencia Artificial',
};

export default async function SuperAdminModulePage({
  params,
}: {
  params: Promise<{ modulo: string }>;
}) {
  const { modulo } = await params;
  const label = LABELS[modulo] ?? modulo;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#7a4010] mb-1">
          Super Administrador
        </p>
        <h1
          className="text-3xl font-extrabold text-[#2a1408]"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {label}
        </h1>
      </div>

      <div className="surface-raised rounded-2xl px-8 py-16 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#7a4010]/10 flex items-center justify-center">
          <span className="text-3xl">🚧</span>
        </div>
        <h2 className="text-xl font-bold text-[#3d2010]">Módulo en construcción</h2>
        <p className="text-sm text-[#8a7060] max-w-xs">
          El módulo <strong>{label}</strong> estará disponible próximamente.
          La estructura y navegación ya están listas.
        </p>
        <a
          href="/superadmin"
          className="mt-2 text-sm font-semibold text-[#7a4010] hover:underline"
        >
          ← Volver al Dashboard General
        </a>
      </div>
    </div>
  );
}
