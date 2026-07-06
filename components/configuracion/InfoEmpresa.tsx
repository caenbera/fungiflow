'use client';

import { Building2, Camera } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';

const fCls = "w-full rounded-xl px-3 py-2 text-[11px] text-[#302D28] font-medium outline-none";
const fSt: React.CSSProperties = { background:'rgba(236,228,218,0.58)', border:'1px solid rgba(128,96,62,0.18)', boxShadow:'inset 0 2px 5px rgba(86,55,28,0.08)' };
const lCls = "block text-[10px] font-bold text-[#8A6D3D] uppercase tracking-wide mb-0.5";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className={lCls}>{label}</label>{children}</div>;
}

export function InfoEmpresa() {
  return (
    <div className="surface-raised rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <IconTile Icon={Building2} from="#2a8055" to="#1a5030" size={14} tileSize={30} radius="0.5rem"/>
        <h3 className="text-sm font-bold text-[#302D28]">Información de la empresa</h3>
      </div>

      {/* Avatar */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background:'linear-gradient(145deg,#e8d5b8,#d4c0a0)', border:'2px solid rgba(128,96,62,0.2)' }}>
            🍄
          </div>
          <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background:'linear-gradient(145deg,#2a8055,#1a5030)', border:'1px solid rgba(255,255,255,0.3)' }}>
            <Camera size={10} className="text-white"/>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <Field label="Nombre de la empresa">
          <input className={fCls} style={fSt} defaultValue="Finca Los Robles"/>
        </Field>
        <Field label="Razón social">
          <input className={fCls} style={fSt} defaultValue="Finca Los Robles S.A.S"/>
        </Field>
        <Field label="NIT / Identificación">
          <input className={fCls} style={fSt} defaultValue="901.234.567-8"/>
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="País">
            <select className={fCls} style={fSt}>
              <option>Colombia</option>
            </select>
          </Field>
          <Field label="Teléfono">
            <input className={fCls} style={fSt} defaultValue="+57 300 123 4567"/>
          </Field>
        </div>
        <Field label="Correo electrónico">
          <input className={fCls} style={fSt} defaultValue="contacto@fincalosrobles.com" type="email"/>
        </Field>
        <Field label="Dirección">
          <input className={fCls} style={fSt} defaultValue="Vereda el Roble, Marinilla, Antioquia"/>
        </Field>
      </div>

      <button className="w-full py-2 rounded-xl text-[11px] font-bold text-[#6B4A2A] mt-1"
        style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.10)' }}>
        Editar información
      </button>
    </div>
  );
}
