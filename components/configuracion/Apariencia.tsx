'use client';

import { useState } from 'react';
import { Palette } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { COLORES_TEMA } from './mock-data';

type Tema = 'Claro' | 'Oscuro' | 'Sistema';

export function Apariencia() {
  const [tema, setTema] = useState<Tema>('Claro');
  const [compacto, setCompacto] = useState(false);
  const [ayuda, setAyuda] = useState(true);
  const [colorActivo, setColorActivo] = useState(COLORES_TEMA[0]);

  return (
    <div className="surface-raised rounded-2xl p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <IconTile Icon={Palette} from="#5a2a7a" to="#3a1a50" size={14} tileSize={30} radius="0.5rem"/>
        <h3 className="text-sm font-bold text-[#302D28]">Apariencia y experiencia</h3>
      </div>

      {/* Tema */}
      <div>
        <p className="text-[10px] font-bold text-[#8A6D3D] uppercase tracking-wide mb-2">Tema de la aplicación</p>
        <div className="grid grid-cols-3 gap-2">
          {(['Claro','Oscuro','Sistema'] as Tema[]).map((t) => (
            <button key={t} onClick={() => setTema(t)}
              className="relative rounded-xl overflow-hidden border-2 transition-all"
              style={{ borderColor: tema === t ? '#2a8055' : 'transparent' }}>
              <div className="h-12 rounded-lg flex items-center justify-center text-[10px] font-bold"
                style={{ background: t==='Claro' ? '#F5EFE6' : t==='Oscuro' ? '#1a1a2e' : 'linear-gradient(135deg,#F5EFE6 50%,#1a1a2e 50%)' }}>
                {tema === t && (
                  <span className="w-4 h-4 rounded-full bg-[#2a8055] flex items-center justify-center text-white text-[9px]">✓</span>
                )}
              </div>
              <p className="text-[10px] font-semibold text-[#6B4A2A] text-center py-1">{t}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Modo compacto */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold text-[#302D28]">Modo compacto</p>
          <p className="text-[10px] text-[#A08060]">Reduce el espacio entre elementos</p>
        </div>
        <button onClick={() => setCompacto(v => !v)}
          className="w-10 h-5 rounded-full transition-colors relative flex-shrink-0"
          style={{ background: compacto ? '#2a8055' : 'rgba(128,96,62,0.2)' }}>
          <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
            style={{ left: compacto ? '1.25rem' : '0.125rem' }}/>
        </button>
      </div>

      {/* Color principal */}
      <div>
        <p className="text-[10px] font-bold text-[#8A6D3D] uppercase tracking-wide mb-2">Color principal</p>
        <div className="flex gap-2 flex-wrap">
          {COLORES_TEMA.map((c) => (
            <button key={c} onClick={() => setColorActivo(c)}
              className="w-7 h-7 rounded-full transition-all hover:scale-110"
              style={{ background: c, border: colorActivo === c ? '3px solid rgba(48,45,40,0.5)' : '2px solid transparent', boxShadow: colorActivo === c ? `0 0 0 2px ${c}55` : undefined }}/>
          ))}
        </div>
      </div>

      {/* Mostrar ayuda */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold text-[#302D28]">Mostrar ayuda contextual</p>
          <p className="text-[10px] text-[#A08060]">Muestra consejos y guías en la plataforma</p>
        </div>
        <button onClick={() => setAyuda(v => !v)}
          className="w-10 h-5 rounded-full transition-colors relative flex-shrink-0"
          style={{ background: ayuda ? '#2a8055' : 'rgba(128,96,62,0.2)' }}>
          <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
            style={{ left: ayuda ? '1.25rem' : '0.125rem' }}/>
        </button>
      </div>
    </div>
  );
}
