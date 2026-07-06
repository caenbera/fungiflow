'use client';

import { Monitor, Shield, Zap, CreditCard, ChevronRight } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { SISTEMA_STATUS, RESPALDO, ACCIONES_RAPIDAS, LICENCIA } from './mock-data';

export function SidebarConfig() {
  return (
    <div className="flex flex-col gap-3">

      {/* Estado del sistema */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <IconTile Icon={Monitor} from="#2a8055" to="#1a5030" size={13} tileSize={28} radius="0.45rem"/>
          <h3 className="text-sm font-bold text-[#302D28]">Estado del sistema</h3>
        </div>
        <div className="space-y-2">
          {SISTEMA_STATUS.map((s) => (
            <div key={s.label} className="flex items-center justify-between gap-2">
              <span className="text-[10px] text-[#6B4A2A] flex-1 min-w-0">{s.label}</span>
              {s.bar !== undefined ? (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div className="w-16 h-1.5 rounded-full bg-[rgba(128,96,62,0.12)]">
                    <div className="h-full rounded-full" style={{ width:`${s.bar}%`, background: s.bar>80?'#b83020':s.bar>50?'#C59A18':'#2a8055' }}/>
                  </div>
                  <span className="text-[10px] font-bold text-[#302D28]">{s.value}</span>
                </div>
              ) : (
                <span className="text-[10px] font-bold flex-shrink-0" style={{ color: s.color ?? '#302D28' }}>{s.value}</span>
              )}
            </div>
          ))}
        </div>
        <button className="mt-3 w-full py-1.5 rounded-xl text-[11px] font-bold text-[#6B4A2A]"
          style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.10)' }}>
          Ver estado detallado
        </button>
      </div>

      {/* Respaldo y seguridad */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <IconTile Icon={Shield} from="#1a5070" to="#0e3050" size={13} tileSize={28} radius="0.45rem"/>
          <h3 className="text-sm font-bold text-[#302D28]">Respaldo y seguridad</h3>
        </div>
        <div className="space-y-2">
          {RESPALDO.map((r) => (
            <div key={r.label} className="flex items-center justify-between">
              <span className="text-[10px] text-[#6B4A2A]">{r.label}</span>
              <span className="text-[10px] font-bold text-[#302D28]">{r.value}</span>
            </div>
          ))}
        </div>
        <button className="mt-3 w-full py-1.5 rounded-xl text-[11px] font-bold text-[#6B4A2A]"
          style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.10)' }}>
          Gestionar respaldos
        </button>
      </div>

      {/* Acciones rápidas */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <IconTile Icon={Zap} from="#C59A18" to="#8A6A08" size={13} tileSize={28} radius="0.45rem"/>
          <h3 className="text-sm font-bold text-[#302D28]">Acciones rápidas</h3>
        </div>
        <div className="space-y-1">
          {ACCIONES_RAPIDAS.map((a) => (
            <button key={a.label} className="flex items-center justify-between w-full px-2.5 py-2 rounded-xl hover:bg-[rgba(128,96,62,0.06)] transition-colors">
              <span className="text-[11px] font-medium" style={{ color: a.danger ? '#b83020' : '#302D28' }}>{a.label}</span>
              <ChevronRight size={12} className="text-[#A08060]"/>
            </button>
          ))}
        </div>
      </div>

      {/* Información de la licencia */}
      <div className="surface-raised rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <IconTile Icon={CreditCard} from="#b06000" to="#7a3a00" size={13} tileSize={28} radius="0.45rem"/>
          <h3 className="text-sm font-bold text-[#302D28]">Información de la licencia</h3>
        </div>
        <div className="space-y-2">
          {LICENCIA.map((l) => (
            <div key={l.label} className="flex items-center justify-between">
              <span className="text-[10px] text-[#6B4A2A]">{l.label}</span>
              <span className="text-[10px] font-bold text-[#302D28]">{l.value}</span>
            </div>
          ))}
        </div>
        <button className="mt-3 w-full py-1.5 rounded-xl text-[11px] font-bold text-white"
          style={{ background:'linear-gradient(145deg,#b06000,#7a3a00)', border:'1px solid rgba(255,255,255,0.15)', boxShadow:'0 1px 0 rgba(255,255,255,0.15) inset, 0 4px 10px rgba(176,96,0,0.25)' }}>
          Gestionar plan
        </button>
      </div>

    </div>
  );
}
