'use client';

import { TopBar }             from '@/components/dashboard-v2/TopBar';
import { HeroRow }            from '@/components/dashboard-v2/HeroRow';
import { KPIStrip }           from '@/components/dashboard-v2/KPIStrip';
import { PlanoFinca }        from '@/components/dashboard-v2/PlanoFinca';
import { ProximasCosechas }  from '@/components/dashboard-v2/ProximasCosechas';
import { GraficoProduccion } from '@/components/dashboard-v2/GraficoProduccion';
import { AlertasIA }         from '@/components/dashboard-v2/AlertasIA';
import { CicloProductivo, AgendaDelDia, ActividadesRecientes, CalendarioCosechas } from '@/components/dashboard-v2/SegundaFila';
import { AccionesRapidas }    from '@/components/dashboard-v2/AccionesRapidas';

export default function DashboardV2Page() {
  return (
    <div className="space-y-4">
      <TopBar />
      <HeroRow />
      <KPIStrip />

      {/* Grid principal — AlertasIA ocupa 2 filas en la columna derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        <div className="lg:col-span-1"><PlanoFinca /></div>
        <div className="lg:col-span-1"><ProximasCosechas /></div>
        <div className="lg:col-span-1"><GraficoProduccion /></div>
        <div className="lg:col-span-1 lg:row-span-2"><AlertasIA /></div>

        <div className="lg:col-span-1"><CicloProductivo /></div>
        <div className="lg:col-span-1"><AgendaDelDia /></div>
        <div className="lg:col-span-1"><ActividadesRecientes /></div>
      </div>

      {/* Fila inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        <div className="lg:col-span-1"><CalendarioCosechas /></div>
        <div className="lg:col-span-3"><AccionesRapidas /></div>
      </div>
    </div>
  );
}
