'use client';

import { useState } from 'react';
import { Plus, PackagePlus, Upload, BarChart3 } from 'lucide-react';
import { KPIStripLogistica }    from '@/components/logistica/KPIStrip';
import { MapaEnvios }           from '@/components/logistica/MapaEnvios';
import { EstadoEnvios }         from '@/components/logistica/EstadoEnvios';
import { SidebarLogistica }     from '@/components/logistica/SidebarLogistica';
import { TablaEnvios }          from '@/components/logistica/TablaEnvios';
import { AnalyticsFilaLogistica }from '@/components/logistica/AnalyticsFila';
import { ModalNuevaGuia, ModalProgramarRecoleccion } from '@/components/logistica/Modales';

type ModalKey = 'guia' | 'recoleccion' | null;

const ACCIONES = [
  { key: 'guia'        as ModalKey, label: 'Nueva guía',           Icon: Plus,        from: '#2a8055', to: '#1a5030' },
  { key: 'recoleccion' as ModalKey, label: 'Programar recolección', Icon: PackagePlus, from: '#1a5070', to: '#0e3050' },
  { key: null,                      label: 'Importar guías',        Icon: Upload,      from: '#5a2a7a', to: '#3a1a50' },
  { key: null,                      label: 'Reportes',              Icon: BarChart3,   from: '#b06000', to: '#7a3a00' },
];

export default function LogisticaPage() {
  const [modal, setModal] = useState<ModalKey>(null);

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="surface-raised rounded-2xl px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6D3D]">Distribución & envíos</p>
            <h1 className="mt-0.5 text-2xl font-bold text-[#302D28]">Logística</h1>
            <p className="mt-1 text-sm text-[#A08060]">
              Gestiona envíos, rutas, entregas y devoluciones en tiempo real.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ACCIONES.map(({ key, label, Icon, from, to }) => (
              <button key={label} onClick={() => key && setModal(key)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.03] active:scale-95"
                style={{ background:`linear-gradient(145deg,${from},${to})`, border:'1px solid rgba(255,255,255,0.18)', boxShadow:'0 1px 0 rgba(255,255,255,0.22) inset, 0 5px 14px rgba(0,0,0,0.18)' }}>
                <Icon size={13} strokeWidth={2}/>{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <KPIStripLogistica/>

      {/* Map + Estado + Tabla | Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <MapaEnvios/>
          <EstadoEnvios/>
          <TablaEnvios/>
        </div>
        <div className="lg:col-span-1">
          <SidebarLogistica/>
        </div>
      </div>
      <AnalyticsFilaLogistica/>

      {modal === 'guia'        && <ModalNuevaGuia              onClose={() => setModal(null)}/>}
      {modal === 'recoleccion' && <ModalProgramarRecoleccion   onClose={() => setModal(null)}/>}
    </div>
  );
}
