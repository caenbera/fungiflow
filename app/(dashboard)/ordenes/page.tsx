'use client';

import { useState } from 'react';
import { Plus, Upload, Download, Users2, Settings2 } from 'lucide-react';
import { KPIStripOrd }     from '@/components/ordenes/KPIStrip';
import { TablaOrdenes }    from '@/components/ordenes/TablaOrdenes';
import { SidebarOrdenes }  from '@/components/ordenes/SidebarOrdenes';
import { AnalyticsFilaOrd }from '@/components/ordenes/AnalyticsFila';
import { ModalNuevaOrden } from '@/components/ordenes/Modales';

type ModalKey = 'nueva' | null;

const ACCIONES = [
  { key: 'nueva' as ModalKey, label: 'Nueva orden de compra', Icon: Plus,      from: '#2a8055', to: '#1a5030' },
  { key: null,                label: 'Importar',               Icon: Upload,    from: '#1a5070', to: '#0e3050' },
  { key: null,                label: 'Exportar',               Icon: Download,  from: '#b06000', to: '#7a3a00' },
  { key: null,                label: 'Proveedores',            Icon: Users2,    from: '#5a2a7a', to: '#3a1a50' },
  { key: null,                label: 'Configuración',          Icon: Settings2, from: '#6B4A2A', to: '#4a2a10' },
];

export default function OrdenesPage() {
  const [modal, setModal] = useState<ModalKey>(null);

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="surface-raised rounded-2xl px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6D3D]">Gestión de compras</p>
            <h1 className="mt-0.5 text-2xl font-bold text-[#302D28]">Órdenes de compra</h1>
            <p className="mt-1 text-sm text-[#A08060]">
              Gestiona y da seguimiento a todas tus órdenes de compra.
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

      <KPIStripOrd/>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        <div className="lg:col-span-3"><TablaOrdenes/></div>
        <div className="lg:col-span-1"><SidebarOrdenes/></div>
      </div>

      <AnalyticsFilaOrd/>

      {modal === 'nueva' && <ModalNuevaOrden onClose={() => setModal(null)}/>}
    </div>
  );
}
