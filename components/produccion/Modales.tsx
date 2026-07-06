'use client';

import { X } from 'lucide-react';
import { type ReactNode } from 'react';
import { PRODUCTOS_SELECT, ETAPAS_SELECT, ESTADOS_SELECT, UBICACIONES_SELECT } from './mock-data';

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:'rgba(30,15,5,0.55)', backdropFilter:'blur(4px)' }}>
      <div className="w-full max-w-lg surface-raised rounded-2xl overflow-hidden"
        style={{ boxShadow:'0 24px 60px rgba(0,0,0,0.28)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(128,96,62,0.14)]">
          <h2 className="text-base font-bold text-[#302D28]">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
            style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 3px 8px rgba(88,57,31,0.12)', color:'#6B451D' }}>
            <X size={14}/>
          </button>
        </div>
        <div className="px-5 py-4 space-y-3 max-h-[75vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

const fCls="w-full rounded-xl px-3 py-2.5 text-sm text-[#302D28] font-medium outline-none transition-all focus:ring-2 focus:ring-[#9a5020]/30";
const fStyle:React.CSSProperties={background:'rgba(236,228,218,0.58)',border:'1px solid rgba(128,96,62,0.18)',boxShadow:'inset 0 2px 5px rgba(86,55,28,0.10)'};
const lCls="block text-[11px] font-bold text-[#8A6D3D] uppercase tracking-wide mb-1";
function Field({label,children}:{label:string;children:ReactNode}){return<div><label className={lCls}>{label}</label>{children}</div>;}
function Input(props:React.InputHTMLAttributes<HTMLInputElement>){return<input {...props} className={fCls} style={fStyle}/>;}
function Select({options,...props}:React.SelectHTMLAttributes<HTMLSelectElement>&{options:string[]}){
  return(<select {...props} className={fCls} style={fStyle}><option value="">Seleccionar...</option>{options.map(o=><option key={o} value={o}>{o}</option>)}</select>);
}
function Textarea(props:React.TextareaHTMLAttributes<HTMLTextAreaElement>){return<textarea {...props} rows={3} className={fCls} style={fStyle}/>;}
function BtnPrimary({label,from,to,onClick}:{label:string;from:string;to:string;onClick?:()=>void}){
  return(<button onClick={onClick} className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95"
    style={{background:`linear-gradient(145deg,${from},${to})`,border:'1px solid rgba(255,255,255,0.18)',boxShadow:'0 1px 0 rgba(255,255,255,0.22) inset, 0 6px 16px rgba(0,0,0,0.18)'}}>{label}</button>);
}

export function ModalNuevaProduccion({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Nueva producción" onClose={onClose}>
      <div className="grid grid-cols-2 gap-3">
        <Field label="N° Lote"><Input placeholder="LOT-2024-059"/></Field>
        <Field label="Producto"><Select options={PRODUCTOS_SELECT}/></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Etapa inicial"><Select options={ETAPAS_SELECT}/></Field>
        <Field label="Ubicación"><Select options={UBICACIONES_SELECT}/></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Fecha de inicio"><Input type="date"/></Field>
        <Field label="Fecha estimada cosecha"><Input type="date"/></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Cantidad de sustrato (kg)"><Input type="number" placeholder="0"/></Field>
        <Field label="Rendimiento esperado (%)"><Input type="number" placeholder="25"/></Field>
      </div>
      <Field label="Estado"><Select options={ESTADOS_SELECT}/></Field>
      <Field label="Notas (opcional)"><Textarea placeholder="Observaciones del lote..."/></Field>
      <BtnPrimary label="Crear lote de producción" from="#2a8055" to="#1a5030" onClick={onClose}/>
    </Modal>
  );
}

export function ModalRegistrarLote({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Registrar actividad en lote" onClose={onClose}>
      <Field label="Seleccionar lote"><Input placeholder="LOT-2024-058"/></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Tipo de actividad">
          <Select options={['Revisión','Traslado','Cosecha','Inoculación','Ajuste ambiental','Otro']}/>
        </Field>
        <Field label="Fecha y hora"><Input type="datetime-local"/></Field>
      </div>
      <Field label="Responsable"><Input placeholder="Nombre del responsable"/></Field>
      <Field label="Detalle / resultado"><Textarea placeholder="Describe la actividad realizada, resultados, observaciones..."/></Field>
      <BtnPrimary label="Registrar actividad" from="#1a5070" to="#0e3050" onClick={onClose}/>
    </Modal>
  );
}
