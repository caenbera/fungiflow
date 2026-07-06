'use client';

import { X, Upload } from 'lucide-react';
import { type ReactNode } from 'react';
import { CATEGORIAS_SELECT, ESTADOS_SELECT, PRESENTACIONES_SELECT, UNIDADES_SELECT } from './mock-data';

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(30,15,5,0.55)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-lg surface-raised rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.28)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(128,96,62,0.14)]">
          <h2 className="text-base font-bold text-[#302D28]">{title}</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
            style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 3px 8px rgba(88,57,31,0.12)', color:'#6B451D' }}>
            <X size={14}/>
          </button>
        </div>
        <div className="px-5 py-4 space-y-3 max-h-[75vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

const fCls = "w-full rounded-xl px-3 py-2.5 text-sm text-[#302D28] font-medium outline-none transition-all focus:ring-2 focus:ring-[#9a5020]/30";
const fStyle: React.CSSProperties = { background:'rgba(236,228,218,0.58)', border:'1px solid rgba(128,96,62,0.18)', boxShadow:'inset 0 2px 5px rgba(86,55,28,0.10)' };
const lCls = "block text-[11px] font-bold text-[#8A6D3D] uppercase tracking-wide mb-1";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div><label className={lCls}>{label}</label>{children}</div>;
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={fCls} style={fStyle}/>;
}
function Select({ options, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }) {
  return (
    <select {...props} className={fCls} style={fStyle}>
      <option value="">Seleccionar...</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} rows={3} className={fCls} style={fStyle}/>;
}
function BtnPrimary({ label, from, to, onClick }: { label: string; from: string; to: string; onClick?: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95"
      style={{ background:`linear-gradient(145deg,${from},${to})`, border:'1px solid rgba(255,255,255,0.18)', boxShadow:'0 1px 0 rgba(255,255,255,0.22) inset, 0 6px 16px rgba(0,0,0,0.18)' }}>
      {label}
    </button>
  );
}

/* ══ 1. Nuevo producto ══ */
export function ModalNuevoProductoProd({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Nuevo producto" onClose={onClose}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="SKU"><Input placeholder="HGF-005"/></Field>
        <Field label="Categoría"><Select options={CATEGORIAS_SELECT}/></Field>
      </div>
      <Field label="Nombre del producto"><Input placeholder="Ej. Maitake fresco"/></Field>
      <Field label="Nombre científico / descripción corta"><Input placeholder="Ej. Grifola frondosa"/></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Precio de venta"><Input type="number" placeholder="0"/></Field>
        <Field label="Presentación"><Select options={PRESENTACIONES_SELECT}/></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Stock inicial"><Input type="number" placeholder="0"/></Field>
        <Field label="Stock mínimo"><Input type="number" placeholder="0"/></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Unidad de medida"><Select options={UNIDADES_SELECT}/></Field>
        <Field label="Estado"><Select options={ESTADOS_SELECT}/></Field>
      </div>
      <Field label="Descripción (opcional)"><Textarea placeholder="Descripción detallada del producto..."/></Field>
      <BtnPrimary label="Crear producto" from="#2a8055" to="#1a5030" onClick={onClose}/>
    </Modal>
  );
}

/* ══ 2. Importar productos ══ */
export function ModalImportarProd({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Importar productos" onClose={onClose}>
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="w-full rounded-2xl surface-inset flex flex-col items-center justify-center py-8 cursor-pointer hover:opacity-80 transition-opacity"
          style={{ border: '2px dashed rgba(128,96,62,0.25)' }}>
          <Upload size={28} className="mb-2" style={{ color: '#9a5020' }}/>
          <p className="text-sm font-bold text-[#302D28]">Arrastra tu archivo aquí</p>
          <p className="text-xs text-[#A08060] mt-1">Formatos: CSV, XLSX — máx. 5 MB</p>
        </div>
        <p className="text-xs text-[#A08060] text-center max-w-xs">
          El archivo debe incluir: SKU, nombre, categoría, precio, stock, presentación.
        </p>
        <button className="text-xs font-bold text-[#9a5020] hover:underline">Descargar plantilla de ejemplo</button>
      </div>
      <BtnPrimary label="Importar productos" from="#1a5070" to="#0e3050"/>
    </Modal>
  );
}
