'use client';

import { useAuthStore } from '@/store/auth';
import { ResumenDashboard } from '@/components/dashboard/ResumenDashboard';
import { useCurrencyStore } from '@/store/currency';
import { useCotizacionesStore } from '@/store/cotizaciones';
import { currencyLabel } from '@/lib/currencies';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { currency } = useCurrencyStore();
  const { cotizaciones, loading } = useCotizacionesStore();

  const resumen = cotizaciones.map((c) => ({
    categoria: c.categoria,
    nombre: c.nombre,
    total: c.total,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Hola, {user?.displayName?.split(' ')[0] || 'bienvenido/a'} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Proyecto activo · Precios en <strong>{currencyLabel(currency)}</strong>
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando datos...</p>
      ) : resumen.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aún no hay cotizaciones. Ve a <strong>Cotizaciones</strong> y crea tu primera.
        </p>
      ) : (
        <ResumenDashboard
          cotizaciones={resumen}
          proyectoNombre="Cultivo Orellana — Fase 1"
        />
      )}
    </div>
  );
}
