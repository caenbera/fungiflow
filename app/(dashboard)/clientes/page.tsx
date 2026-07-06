'use client';

import { useState, useMemo } from 'react';
import { UserPlus, Upload, Layers, Download } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { KPIStripCli }       from '@/components/clientes/KPIStrip';
import { FiltrosClientes }   from '@/components/clientes/FiltrosClientes';
import { TablaClientes }     from '@/components/clientes/TablaClientes';
import { GraficosLaterales } from '@/components/clientes/GraficosLaterales';
import { AnalyticsFila }     from '@/components/clientes/AnalyticsFila';
import { ModalNuevoCliente, ModalImportar } from '@/components/clientes/Modales';
import { CLIENTES_TABLA } from '@/components/clientes/mock-data';

type ModalKey = 'nuevo' | 'importar' | null;

const ACCIONES = [
  { key: 'nuevo'   as ModalKey, label: 'Nuevo cliente',    Icon: UserPlus, from: '#5a2a7a', to: '#3a1a50' },
  { key: 'importar'as ModalKey, label: 'Importar clientes',Icon: Upload,   from: '#1a5070', to: '#0e3050' },
  { key: null,                  label: 'Segmentar',         Icon: Layers,   from: '#b06000', to: '#7a3a00' },
  { key: null,                  label: 'Exportar',          Icon: Download, from: '#2a8055', to: '#1a5030' },
];

export default function ClientesPage() {
  const [modal, setModal] = useState<ModalKey>(null);
  const [busqueda, setBusqueda]   = useState('');
  const [segmento, setSegmento]   = useState('');
  const [estado,   setEstado]     = useState('');
  const [ubicacion,setUbicacion]  = useState('');

  const filtrados = useMemo(() => CLIENTES_TABLA.filter(c => {
    const q = busqueda.toLowerCase();
    if (q && !c.nombre.toLowerCase().includes(q) && !c.empresa.toLowerCase().includes(q)) return false;
    if (segmento && c.segmento !== segmento) return false;
    if (estado   && c.estado   !== estado)   return false;
    if (ubicacion&& c.ubicacion!== ubicacion) return false;
    return true;
  }), [busqueda, segmento, estado, ubicacion]);

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="surface-raised rounded-2xl px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6D3D]">Gestión de relaciones</p>
            <h1 className="mt-0.5 text-2xl font-bold text-[#302D28]">Clientes</h1>
            <p className="mt-1 text-sm text-[#A08060]">
              Directorio, análisis de comportamiento y segmentación de clientes.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ACCIONES.map(({ key, label, Icon, from, to }) => (
              <button
                key={label}
                onClick={() => key && setModal(key)}
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

      <KPIStripCli />
      <FiltrosClientes
        busqueda={busqueda} segmento={segmento} estado={estado} ubicacion={ubicacion}
        onBusqueda={setBusqueda} onSegmento={setSegmento} onEstado={setEstado} onUbicacion={setUbicacion}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        <div className="lg:col-span-3"><TablaClientes clientes={filtrados} /></div>
        <div className="lg:col-span-1"><GraficosLaterales /></div>
      </div>

      <AnalyticsFila />

      {modal === 'nuevo'    && <ModalNuevoCliente onClose={() => setModal(null)} />}
      {modal === 'importar' && <ModalImportar     onClose={() => setModal(null)} />}
    </div>
  );
}
