'use client';

import { useState } from 'react';
import { Plus, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, SlidersHorizontal, QrCode } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { KPIStripInv }      from '@/components/inventario/KPIStrip';
import { CategoriasGrid }   from '@/components/inventario/CategoriasGrid';
import { Movimientos }      from '@/components/inventario/Movimientos';
import { PedidosPendientes }from '@/components/inventario/PedidosPendientes';
import { TablaProductos }   from '@/components/inventario/TablaProductos';
import {
  ModalNuevoProducto, ModalEntrada, ModalSalida,
  ModalTransferencia, ModalAjuste, ModalQR,
} from '@/components/inventario/Modales';

type ModalKey = 'nuevo' | 'entrada' | 'salida' | 'transferencia' | 'ajuste' | 'qr' | null;

const ACCIONES = [
  { key: 'nuevo'       as ModalKey, label: 'Nuevo producto',       Icon: Plus,               from: '#2a8055', to: '#1a5030' },
  { key: 'entrada'     as ModalKey, label: 'Registrar entrada',    Icon: ArrowDownToLine,    from: '#1a5070', to: '#0e3050' },
  { key: 'salida'      as ModalKey, label: 'Registrar salida',     Icon: ArrowUpFromLine,    from: '#b83020', to: '#7a1a10' },
  { key: 'transferencia'as ModalKey,label: 'Transferencia',        Icon: ArrowLeftRight,     from: '#5a2a7a', to: '#3a1a50' },
  { key: 'ajuste'      as ModalKey, label: 'Ajuste de inventario', Icon: SlidersHorizontal,  from: '#b06000', to: '#7a3a00' },
  { key: 'qr'          as ModalKey, label: 'Escanear QR',          Icon: QrCode,             from: '#C59A18', to: '#8A6A08' },
];

export default function InventarioPage() {
  const [modal, setModal] = useState<ModalKey>(null);

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="surface-raised rounded-2xl px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6D3D]">Control inteligente</p>
            <h1 className="mt-0.5 text-2xl font-bold text-[#302D28]">Inventario</h1>
            <p className="mt-1 text-sm text-[#A08060]">
              Materias primas, insumos, herramientas, equipos y productos terminados.
            </p>
          </div>
          {/* Botones de acción */}
          <div className="flex flex-wrap gap-2">
            {ACCIONES.map(({ key, label, Icon, from, to }) => (
              <button
                key={key}
                onClick={() => setModal(key)}
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

      <KPIStripInv />
      <CategoriasGrid />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Movimientos />
        <PedidosPendientes />
      </div>

      <TablaProductos />

      {/* ── Modales ── */}
      {modal === 'nuevo'        && <ModalNuevoProducto  onClose={() => setModal(null)} />}
      {modal === 'entrada'      && <ModalEntrada         onClose={() => setModal(null)} />}
      {modal === 'salida'       && <ModalSalida          onClose={() => setModal(null)} />}
      {modal === 'transferencia'&& <ModalTransferencia   onClose={() => setModal(null)} />}
      {modal === 'ajuste'       && <ModalAjuste          onClose={() => setModal(null)} />}
      {modal === 'qr'           && <ModalQR              onClose={() => setModal(null)} />}
    </div>
  );
}
