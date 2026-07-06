'use client';

import { ChevronRight, Users, Puzzle, MapPin, Ruler, Clock, Sprout, Mail, Activity, Key, Settings2, Link2 } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { INTEGRACIONES } from './mock-data';

const CONFIG_GRANJA = [
  { label:'Nombre de la granja',    sub:'Finca Los Robles',              Icon:Sprout,   from:'#2a8055', to:'#1a5030' },
  { label:'Unidades de medida',     sub:'Sistema métrico (kg, g, L, m²)', Icon:Ruler,   from:'#1a5070', to:'#0e3050' },
  { label:'Zonas y ubicaciones',    sub:'12 zonas configuradas',          Icon:MapPin,  from:'#5a2a7a', to:'#3a1a50' },
  { label:'Turnos de trabajo',      sub:'3 turnos configurados',          Icon:Clock,   from:'#b06000', to:'#7a3a00' },
  { label:'Parámetros de cultivo',  sub:'5 parámetros configurados',      Icon:Settings2,from:'#C59A18',to:'#8A6A08' },
];

const USUARIOS_PERMISOS = [
  { label:'Usuarios',                sub:'24 usuarios registrados',    Icon:Users,  from:'#2a8055', to:'#1a5030' },
  { label:'Roles y permisos',        sub:'6 roles configurados',       Icon:Key,    from:'#1a5070', to:'#0e3050' },
  { label:'Invitaciones pendientes', sub:'2 invitaciones',             Icon:Mail,   from:'#C59A18', to:'#8A6A08' },
  { label:'Actividad de usuarios',   sub:'Ver registros de actividad', Icon:Activity,from:'#5a2a7a',to:'#3a1a50' },
];

/* ── Configuración de la granja ── */
export function ConfigGranja() {
  return (
    <div className="surface-raised rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <IconTile Icon={Sprout} from="#C59A18" to="#8A6A08" size={14} tileSize={30} radius="0.5rem"/>
        <h3 className="text-sm font-bold text-[#302D28]">Configuración de la granja</h3>
      </div>
      {CONFIG_GRANJA.map((item) => (
        <button key={item.label} className="flex items-center gap-2.5 p-2.5 rounded-xl w-full text-left hover:bg-[rgba(128,96,62,0.06)] transition-colors"
          style={{ border:'1px solid rgba(128,96,62,0.08)' }}>
          <IconTile Icon={item.Icon} from={item.from} to={item.to} size={12} tileSize={26} radius="0.4rem"/>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-[#302D28]">{item.label}</p>
            <p className="text-[10px] text-[#A08060]">{item.sub}</p>
          </div>
          <ChevronRight size={13} className="text-[#A08060] flex-shrink-0"/>
        </button>
      ))}
    </div>
  );
}

/* ── Usuarios y permisos ── */
export function UsuariosPermisos() {
  return (
    <div className="surface-raised rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <IconTile Icon={Users} from="#1a5070" to="#0e3050" size={14} tileSize={30} radius="0.5rem"/>
        <h3 className="text-sm font-bold text-[#302D28]">Usuarios y permisos</h3>
      </div>
      {USUARIOS_PERMISOS.map((item) => (
        <button key={item.label} className="flex items-center gap-2.5 p-2.5 rounded-xl w-full text-left hover:bg-[rgba(128,96,62,0.06)] transition-colors"
          style={{ border:'1px solid rgba(128,96,62,0.08)' }}>
          <IconTile Icon={item.Icon} from={item.from} to={item.to} size={12} tileSize={26} radius="0.4rem"/>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-[#302D28]">{item.label}</p>
            <p className="text-[10px] text-[#A08060]">{item.sub}</p>
          </div>
          <ChevronRight size={13} className="text-[#A08060] flex-shrink-0"/>
        </button>
      ))}
      <button className="w-full py-2 rounded-xl text-[11px] font-bold text-[#6B4A2A] mt-1"
        style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.10)' }}>
        Gestionar usuarios y permisos
      </button>
    </div>
  );
}

/* ── Integraciones activas ── */
export function IntegracionesActivas() {
  return (
    <div className="surface-raised rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <IconTile Icon={Link2} from="#b06000" to="#7a3a00" size={14} tileSize={30} radius="0.5rem"/>
        <h3 className="text-sm font-bold text-[#302D28]">Integraciones activas</h3>
      </div>
      {INTEGRACIONES.map((item) => (
        <div key={item.label} className="flex items-center gap-2.5 p-2.5 rounded-xl"
          style={{ background:'rgba(236,228,218,0.38)', border:'1px solid rgba(128,96,62,0.08)' }}>
          <IconTile Icon={Puzzle} from={item.color} to={item.color + 'aa'} size={12} tileSize={26} radius="0.4rem"/>
          <span className="flex-1 text-[11px] font-semibold text-[#302D28] min-w-0 truncate">{item.label}</span>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="w-2 h-2 rounded-full" style={{ background: item.color }}/>
            <span className="text-[10px] font-semibold" style={{ color: item.color }}>{item.estado}</span>
          </div>
        </div>
      ))}
      <button className="w-full py-2 rounded-xl text-[11px] font-bold text-[#6B4A2A] mt-1"
        style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.10)' }}>
        Gestionar integraciones
      </button>
    </div>
  );
}
