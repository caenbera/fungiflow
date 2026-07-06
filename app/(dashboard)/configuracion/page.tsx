'use client';

import { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { InfoEmpresa }          from '@/components/configuracion/InfoEmpresa';
import { ConfigRegional }       from '@/components/configuracion/ConfigRegional';
import { Apariencia }           from '@/components/configuracion/Apariencia';
import { ConfigGranja, UsuariosPermisos, IntegracionesActivas } from '@/components/configuracion/PanelesCentro';
import { ModulosActivados }     from '@/components/configuracion/ModulosActivados';
import { SidebarConfig }        from '@/components/configuracion/SidebarConfig';
import { Equipo }               from '@/components/configuracion/Equipo';

const TABS = ['General','Equipo','Granja','Usuarios y permisos','Módulos','Integraciones','Notificaciones','Seguridad','Facturación'] as const;
type Tab = typeof TABS[number];

export default function ConfiguracionPage() {
  const [tab, setTab] = useState<Tab>('General');

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="surface-raised rounded-2xl px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6D3D]">Administración</p>
            <h1 className="mt-0.5 text-2xl font-bold text-[#302D28]">Configuración</h1>
            <p className="mt-1 text-sm text-[#A08060]">
              Personaliza y administra todos los aspectos de tu plataforma.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.03] active:scale-95"
              style={{ background:'linear-gradient(145deg,#2a8055,#1a5030)', border:'1px solid rgba(255,255,255,0.18)', boxShadow:'0 1px 0 rgba(255,255,255,0.22) inset, 0 5px 14px rgba(0,0,0,0.18)' }}>
              <Save size={13}/>Guardar cambios
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#6B4A2A] transition-all hover:scale-[1.03] active:scale-95"
              style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.10)' }}>
              <RotateCcw size={13}/>Restablecer cambios
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="surface-raised rounded-2xl px-4 py-2">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="px-3 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all flex-shrink-0"
              style={t === tab
                ? { background:'linear-gradient(145deg,#2a8055,#1a5030)', color:'white', border:'1px solid rgba(255,255,255,0.18)', boxShadow:'0 3px 8px rgba(42,128,85,0.25)' }
                : { background:'transparent', color:'#8A6D3D' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Equipo tab — full width */}
      {tab === 'Equipo' && <Equipo/>}

      {/* Main grid */}
      {tab !== 'Equipo' && <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

        {/* Left content: 3-col inner grid */}
        <div className="lg:col-span-9 flex flex-col gap-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            <InfoEmpresa/>
            <ConfigRegional/>
            <Apariencia/>
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            <ConfigGranja/>
            <UsuariosPermisos/>
            <IntegracionesActivas/>
          </div>
          {/* Row 3: full-width modules */}
          <ModulosActivados/>
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-3">
          <SidebarConfig/>
        </div>
      </div>}

    </div>
  );
}
