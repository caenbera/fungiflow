'use client';

import { X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import {
  CATEGORIAS_SELECT, UNIDADES_SELECT, BODEGAS_SELECT,
  PRODUCTOS_SELECT, MOTIVOS_AJUSTE,
} from './mock-data';

/* ── Base Modal ── */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(30,15,5,0.55)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-lg surface-raised rounded-2xl overflow-hidden" style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.28)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(128,96,62,0.14)]">
          <h2 className="text-base font-bold text-[#302D28]">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
            style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 3px 8px rgba(88,57,31,0.12)', color:'#6B451D' }}>
            <X size={14} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-3 max-h-[75vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

/* ── Field helpers ── */
const fieldCls = "w-full rounded-xl px-3 py-2.5 text-sm text-[#302D28] font-medium outline-none transition-all focus:ring-2 focus:ring-[#9a5020]/30";
const fieldStyle = { background:'rgba(236,228,218,0.58)', border:'1px solid rgba(128,96,62,0.18)', boxShadow:'inset 0 2px 5px rgba(86,55,28,0.10)' };
const labelCls = "block text-[11px] font-bold text-[#8A6D3D] uppercase tracking-wide mb-1";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div><label className={labelCls}>{label}</label>{children}</div>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={fieldCls} style={fieldStyle} />;
}

function Select({ options, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }) {
  return (
    <select {...props} className={fieldCls} style={fieldStyle}>
      <option value="">Seleccionar...</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} rows={3} className={fieldCls} style={fieldStyle} />;
}

function BtnPrimary({ label, from, to, onClick }: { label: string; from: string; to: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95"
      style={{ background: `linear-gradient(145deg,${from},${to})`, border:'1px solid rgba(255,255,255,0.18)', boxShadow:'0 1px 0 rgba(255,255,255,0.22) inset, 0 6px 16px rgba(0,0,0,0.18)' }}>
      {label}
    </button>
  );
}

/* ══ 1. Nuevo producto ══ */
export function ModalNuevoProducto({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Nuevo producto" onClose={onClose}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Código"><Input placeholder="MP-004" /></Field>
        <Field label="Categoría"><Select options={CATEGORIAS_SELECT} /></Field>
      </div>
      <Field label="Nombre del producto"><Input placeholder="Ej. Aserrín de roble" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Stock inicial"><Input type="number" placeholder="0" /></Field>
        <Field label="Stock mínimo"><Input type="number" placeholder="0" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Unidad de medida"><Select options={UNIDADES_SELECT} /></Field>
        <Field label="Bodega / Ubicación"><Select options={BODEGAS_SELECT} /></Field>
      </div>
      <Field label="Descripción (opcional)"><Textarea placeholder="Descripción del producto..." /></Field>
      <BtnPrimary label="Crear producto" from="#2a8055" to="#1a5030" onClick={onClose} />
    </Modal>
  );
}

/* ══ 2. Registrar entrada ══ */
export function ModalEntrada({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Registrar entrada" onClose={onClose}>
      <Field label="Producto"><Select options={PRODUCTOS_SELECT} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Cantidad"><Input type="number" placeholder="0" /></Field>
        <Field label="Unidad"><Select options={UNIDADES_SELECT} /></Field>
      </div>
      <Field label="Proveedor"><Input placeholder="Nombre del proveedor" /></Field>
      <Field label="Fecha de entrada"><Input type="date" /></Field>
      <Field label="Notas (opcional)"><Textarea placeholder="Observaciones sobre la entrada..." /></Field>
      <BtnPrimary label="Registrar entrada" from="#2a8055" to="#1a5030" />
    </Modal>
  );
}

/* ══ 3. Registrar salida ══ */
export function ModalSalida({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Registrar salida" onClose={onClose}>
      <Field label="Producto"><Select options={PRODUCTOS_SELECT} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Cantidad"><Input type="number" placeholder="0" /></Field>
        <Field label="Unidad"><Select options={UNIDADES_SELECT} /></Field>
      </div>
      <Field label="Destino"><Input placeholder="Ej. Producción - Lote PRD-1255" /></Field>
      <Field label="Fecha de salida"><Input type="date" /></Field>
      <Field label="Motivo"><Input placeholder="Motivo de la salida" /></Field>
      <BtnPrimary label="Registrar salida" from="#b83020" to="#7a1a10" />
    </Modal>
  );
}

/* ══ 4. Transferencia ══ */
export function ModalTransferencia({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Transferencia entre bodegas" onClose={onClose}>
      <Field label="Producto"><Select options={PRODUCTOS_SELECT} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Cantidad"><Input type="number" placeholder="0" /></Field>
        <Field label="Unidad"><Select options={UNIDADES_SELECT} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Bodega origen"><Select options={BODEGAS_SELECT} /></Field>
        <Field label="Bodega destino"><Select options={BODEGAS_SELECT} /></Field>
      </div>
      <Field label="Fecha"><Input type="date" /></Field>
      <Field label="Notas (opcional)"><Textarea placeholder="Observaciones..." /></Field>
      <BtnPrimary label="Confirmar transferencia" from="#1a5070" to="#0e3050" />
    </Modal>
  );
}

/* ══ 5. Ajuste de inventario ══ */
export function ModalAjuste({ onClose }: { onClose: () => void }) {
  const [stock, setStock] = useState('');
  const [nuevo, setNuevo] = useState('');
  const diff = Number(nuevo) - Number(stock);

  return (
    <Modal title="Ajuste de inventario" onClose={onClose}>
      <Field label="Producto"><Select options={PRODUCTOS_SELECT} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Stock actual">
          <Input type="number" placeholder="0" value={stock} onChange={e => setStock(e.target.value)} />
        </Field>
        <Field label="Stock real (conteo)">
          <Input type="number" placeholder="0" value={nuevo} onChange={e => setNuevo(e.target.value)} />
        </Field>
      </div>
      {stock && nuevo && (
        <div className="px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
          style={{ background: diff >= 0 ? 'rgba(26,96,64,0.10)' : 'rgba(184,48,32,0.10)', color: diff >= 0 ? '#1a6040' : '#b83020' }}>
          <span>{diff >= 0 ? '↑' : '↓'}</span>
          <span>Diferencia: {diff > 0 ? '+' : ''}{diff}</span>
        </div>
      )}
      <Field label="Motivo del ajuste"><Select options={MOTIVOS_AJUSTE} /></Field>
      <Field label="Observaciones"><Textarea placeholder="Detalle del ajuste..." /></Field>
      <BtnPrimary label="Aplicar ajuste" from="#b06000" to="#7a3a00" />
    </Modal>
  );
}

/* ══ 6. Escanear QR ══ */
export function ModalQR({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Escanear código QR" onClose={onClose}>
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="w-48 h-48 rounded-2xl surface-inset flex items-center justify-center"
          style={{ border: '2px dashed rgba(128,96,62,0.25)' }}>
          <div className="text-center">
            <p className="text-3xl mb-2">📷</p>
            <p className="text-xs text-[#A08060] font-semibold">Cámara no disponible<br/>en esta versión</p>
          </div>
        </div>
        <p className="text-xs text-[#A08060] text-center max-w-xs">
          El escaneo QR estará disponible en la app móvil. Por ahora puedes ingresar el código manualmente.
        </p>
        <Field label="Código QR manual">
          <Input placeholder="Ingresa el código del producto" />
        </Field>
        <div className="w-full"><BtnPrimary label="Buscar producto" from="#9a5020" to="#6a3010" /></div>
      </div>
    </Modal>
  );
}
