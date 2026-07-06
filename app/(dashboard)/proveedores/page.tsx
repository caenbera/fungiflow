'use client';

import { useState, useMemo } from 'react';
import { Plus, Download } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { KPIStripProv }        from '@/components/proveedores/KPIStrip';
import { FiltrosProveedores }  from '@/components/proveedores/FiltrosProveedores';
import { TablaProveedores }    from '@/components/proveedores/TablaProveedores';
import { PanelLateral }        from '@/components/proveedores/PanelLateral';
import { ModalNuevoProveedor } from '@/components/proveedores/ModalNuevoProveedor';
import { PROVEEDORES } from '@/components/proveedores/mock-data';
import type { CategoriaProveedor, EstadoProveedor } from '@/components/proveedores/mock-data';

function evalLabel(n: number) {
  if (n >= 4.5) return 'Excelente';
  if (n >= 3.5) return 'Bueno';
  if (n >= 2.5) return 'Regular';
  return 'Deficiente';
}

const ACCIONES = [
  { label: 'Nuevo proveedor', Icon: Plus,     from: '#9a5020', to: '#6a3010', modal: 'nuevo' as const },
  { label: 'Exportar',        Icon: Download,  from: '#2a8055', to: '#1a5030', modal: null },
];

export default function ProveedoresPage() {
  const [modalNuevo, setModalNuevo] = useState(false);
  const [busqueda,   setBusqueda]   = useState('');
  const [categoria,  setCategoria]  = useState('');
  const [estado,     setEstado]     = useState('');
  const [evaluacion, setEvaluacion] = useState('');

  const filtrados = useMemo(() => PROVEEDORES.filter(p => {
    const q = busqueda.toLowerCase();
    if (q && !p.nombre.toLowerCase().includes(q) && !p.nit.includes(q)) return false;
    if (categoria && p.categoria !== (categoria as CategoriaProveedor)) return false;
    if (estado    && p.estado    !== (estado    as EstadoProveedor))     return false;
    if (evaluacion && evalLabel(p.evaluacion) !== evaluacion)            return false;
    return true;
  }), [busqueda, categoria, estado, evaluacion]);

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="surface-raised rounded-2xl px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6D3D]">Gestión de abastecimiento</p>
            <h1 className="mt-0.5 text-2xl font-bold text-[#302D28]">Proveedores</h1>
            <p className="mt-1 text-sm text-[#A08060]">
              Gestiona y evalúa a todos tus proveedores en un solo lugar.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ACCIONES.map(({ label, Icon, from, to, modal }) => (
              <button
                key={label}
                onClick={() => modal === 'nuevo' && setModalNuevo(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.03] active:scale-95"
                style={{
                  background: `linear-gradient(145deg,${from},${to})`,
                  border: '1px solid rgba(255,255,255,0.18)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.22) inset, 0 5px 14px rgba(0,0,0,0.18)',
                }}
              >
                <Icon size={13} strokeWidth={2} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <KPIStripProv />

      <FiltrosProveedores
        busqueda={busqueda}   categoria={categoria}   estado={estado}   evaluacion={evaluacion}
        onBusqueda={setBusqueda} onCategoria={setCategoria} onEstado={setEstado} onEvaluacion={setEvaluacion}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        <div className="lg:col-span-3">
          <TablaProveedores proveedores={filtrados} />
        </div>
        <div className="lg:col-span-1">
          <PanelLateral />
        </div>
      </div>

      {modalNuevo && <ModalNuevoProveedor onClose={() => setModalNuevo(false)} />}
    </div>
  );
}
