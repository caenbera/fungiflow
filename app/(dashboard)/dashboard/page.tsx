'use client';

import { useAuthStore } from '@/store/auth';
import { ResumenDashboard } from '@/components/dashboard/ResumenDashboard';
import { useCurrencyStore } from '@/store/currency';
import { useCotizacionesStore } from '@/store/cotizaciones';
import { CurrencyFlag } from '@/components/shared/CurrencyFlag';

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
    <div className="space-y-7">
      <header className="surface-raised rounded-2xl px-5 py-5 md:px-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6D3D]">Panel integral</p>
            <h1 className="mt-1 text-2xl font-bold text-[#302D28] md:text-3xl">
              Hola, {user?.displayName?.split(' ')[0] || 'bienvenido/a'}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Proyecto activo con lectura financiera, costos por categoría y resumen de inversión.
            </p>
            <div className="accent-rule mt-4" />
          </div>
          <div className="surface-inset rounded-xl px-4 py-3 text-sm">
            <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Moneda activa</span>
            <CurrencyFlag currency={currency} className="mt-1 font-bold text-[#5A3E2B]" />
          </div>
        </div>
      </header>

      {loading ? (
        <div className="surface-soft rounded-xl p-5 text-sm text-muted-foreground">Cargando datos...</div>
      ) : resumen.length === 0 ? (
        <div className="surface-soft rounded-xl p-6 text-sm text-muted-foreground">
          Aún no hay cotizaciones. Ve a <strong className="text-[#5A3E2B]">Cotizaciones</strong> y crea tu primera.
        </div>
      ) : (
        <ResumenDashboard
          cotizaciones={resumen}
          proyectoNombre="Cultivo Orellana - Fase 1"
        />
      )}
    </div>
  );
}
