'use client';

import { Globe } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';

const fCls = "w-full rounded-xl px-3 py-2 text-[11px] text-[#302D28] font-medium outline-none";
const fSt: React.CSSProperties = { background:'rgba(236,228,218,0.58)', border:'1px solid rgba(128,96,62,0.18)', boxShadow:'inset 0 2px 5px rgba(86,55,28,0.08)' };
const lCls = "block text-[10px] font-bold text-[#8A6D3D] uppercase tracking-wide mb-0.5";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className={lCls}>{label}</label>{children}</div>;
}

export function ConfigRegional() {
  return (
    <div className="surface-raised rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <IconTile Icon={Globe} from="#1a5070" to="#0e3050" size={14} tileSize={30} radius="0.5rem"/>
        <h3 className="text-sm font-bold text-[#302D28]">Configuración regional</h3>
      </div>

      <Field label="Zona horaria">
        <select className={fCls} style={fSt}>
          <option>(GMT-5) Bogotá, Lima, Quito</option>
          <option>(GMT-6) Ciudad de México</option>
          <option>(GMT+0) Londres</option>
        </select>
      </Field>
      <Field label="Idioma">
        <select className={fCls} style={fSt}>
          <option>Español</option>
          <option>English</option>
          <option>Português</option>
        </select>
      </Field>
      <Field label="Moneda">
        <select className={fCls} style={fSt}>
          <option>COP - Peso colombiano</option>
          <option>USD - Dólar estadounidense</option>
          <option>EUR - Euro</option>
        </select>
      </Field>
      <Field label="Formato de fecha">
        <select className={fCls} style={fSt}>
          <option>DD/MM/YYYY</option>
          <option>MM/DD/YYYY</option>
          <option>YYYY-MM-DD</option>
        </select>
      </Field>
      <Field label="Formato de hora">
        <select className={fCls} style={fSt}>
          <option>24 horas</option>
          <option>12 horas (AM/PM)</option>
        </select>
      </Field>
      <Field label="Separador decimal">
        <select className={fCls} style={fSt}>
          <option>Coma (1.234,56)</option>
          <option>Punto (1,234.56)</option>
        </select>
      </Field>

      <button className="w-full py-2 rounded-xl text-[11px] font-bold text-white mt-1"
        style={{ background:'linear-gradient(145deg,#2a8055,#1a5030)', border:'1px solid rgba(255,255,255,0.18)', boxShadow:'0 1px 0 rgba(255,255,255,0.22) inset, 0 4px 10px rgba(42,128,85,0.25)' }}>
        Guardar cambios
      </button>
    </div>
  );
}
