'use client';

import { X, Upload } from 'lucide-react';
import { type ReactNode } from 'react';
import { SEGMENTOS_SELECT, ESTADOS_SELECT, UBICACIONES_SELECT } from './mock-data';

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(30,15,5,0.55)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-lg surface-raised rounded-2xl overflow-hidden" style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.28)' }}>
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

const fieldCls = "w-full rounded-xl px-3 py-2.5 text-sm text-[#302D28] font-medium outline-none transition-all focus:ring-2 focus:ring-[#9a5020]/30";
const fieldStyle: React.CSSProperties = { background:'rgba(236,228,218,0.58)', border:'1px solid rgba(128,96,62,0.18)', boxShadow:'inset 0 2px 5px rgba(86,55,28,0.10)' };
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
      style={{ background:`linear-gradient(145deg,${from},${to})`, border:'1px solid rgba(255,255,255,0.18)', boxShadow:'0 1px 0 rgba(255,255,255,0.22) inset, 0 6px 16px rgba(0,0,0,0.18)' }}>
      {label}
    </button>
  );
}

/* ══ 1. Nuevo cliente ══ */
export function ModalNuevoCliente({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Nuevo cliente" onClose={onClose}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nombre"><Input placeholder="Nombre completo" /></Field>
        <Field label="Empresa"><Input placeholder="Nombre de la empresa" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Teléfono"><Input placeholder="+57 310 000 0000" /></Field>
        <Field label="Email"><Input type="email" placeholder="correo@empresa.co" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Segmento"><Select options={SEGMENTOS_SELECT} /></Field>
        <Field label="Estado"><Select options={ESTADOS_SELECT} /></Field>
      </div>
      <Field label="Ubicación"><Select options={UBICACIONES_SELECT} /></Field>
      <Field label="Notas (opcional)"><Textarea placeholder="Observaciones del cliente..." /></Field>
      <BtnPrimary label="Crear cliente" from="#5a2a7a" to="#3a1a50" />
    </Modal>
  );
}

/* ══ 2. Importar clientes ══ */
export function ModalImportar({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Importar clientes" onClose={onClose}>
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="w-full rounded-2xl surface-inset flex flex-col items-center justify-center py-8 cursor-pointer hover:opacity-80 transition-opacity"
          style={{ border: '2px dashed rgba(128,96,62,0.25)' }}>
          <Upload size={28} className="mb-2" style={{ color: '#9a5020' }} />
          <p className="text-sm font-bold text-[#302D28]">Arrastra tu archivo aquí</p>
          <p className="text-xs text-[#A08060] mt-1">Formatos soportados: CSV, XLSX</p>
        </div>
        <p className="text-xs text-[#A08060] text-center max-w-xs">
          El archivo debe contener columnas: nombre, empresa, teléfono, email, segmento, ubicación.
        </p>
        <button className="text-xs font-bold text-[#9a5020] hover:underline">Descargar plantilla de ejemplo</button>
      </div>
      <Field label="O ingresa una URL de archivo">
        <Input placeholder="https://docs.google.com/spreadsheets/..." />
      </Field>
      <BtnPrimary label="Importar clientes" from="#1a5070" to="#0e3050" />
    </Modal>
  );
}
