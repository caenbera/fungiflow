'use client';

import { useAuthStore } from '@/store/auth';
import { ResumenDashboard } from '@/components/dashboard/ResumenDashboard';
import { useCurrencyStore } from '@/store/currency';

// Demo data — en producción esto viene de Firestore
const DEMO_COTIZACIONES = [
  { categoria: 'construccion' as const, nombre: 'Bodega principal', total: 12_000_000 },
  { categoria: 'equipos' as const, nombre: 'Autoclave + mezcladora', total: 8_500_000 },
  { categoria: 'materiaprima' as const, nombre: 'Aserrín y sustratos', total: 3_200_000 },
  { categoria: 'consumibles' as const, nombre: 'Bolsas y tapones', total: 1_100_000 },
  { categoria: 'manodeobra' as const, nombre: '2 trabajadores x 3 meses', total: 5_400_000 },
  { categoria: 'servicios' as const, nombre: 'Electricidad y agua', total: 900_000 },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { currency } = useCurrencyStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Hola, {user?.displayName?.split(' ')[0] || 'bienvenido/a'} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Proyecto activo · Precios en <strong>{currency}</strong>
        </p>
      </div>

      <ResumenDashboard
        cotizaciones={DEMO_COTIZACIONES}
        proyectoNombre="Cultivo Orellana — Fase 1"
      />
    </div>
  );
}
