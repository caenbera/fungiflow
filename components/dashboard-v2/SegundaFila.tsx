import {
  Sprout, FlaskConical, Package, DollarSign, CheckCircle,
  Clock, MapPin, Activity, CalendarCheck, BarChart3,
} from 'lucide-react';
import { CICLO, AGENDA, ACTIVIDADES } from './mock-data';
import { IconTile } from './IconTile';

const ACTIVIDAD_CONFIG = [
  { Icon: Sprout,       from: '#2a8055', to: '#1a5030' },
  { Icon: FlaskConical, from: '#1a6878', to: '#0e4050' },
  { Icon: Package,      from: '#9a5020', to: '#6a3010' },
  { Icon: DollarSign,   from: '#C59A18', to: '#8A6A08' },
  { Icon: CheckCircle,  from: '#2a8055', to: '#1a5030' },
];

export function CicloProductivo() {
  return (
    <div className="surface-raised rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <IconTile Icon={BarChart3} from="#5a2a7a" to="#3a1a50" size={14} tileSize={30} radius="0.55rem" />
        <h3 className="text-sm font-bold text-[#302D28]">Ciclo productivo</h3>
      </div>
      <div className="space-y-2.5">
        {CICLO.map(({ label, pct, done }) => (
          <div key={label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-[#6B4A2A]">{label}</span>
              <span className={`text-[11px] font-bold ${done ? 'text-[#1a6040]' : 'text-[#7a4010]'}`}>{pct}%</span>
            </div>
            <div
              className="w-full rounded-full overflow-hidden"
              style={{
                height: 7,
                background: 'rgba(236,228,218,0.58)',
                border: '1px solid rgba(128,96,62,0.12)',
                boxShadow: 'inset 0 2px 4px rgba(86,55,28,0.14)',
              }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: done ? 'linear-gradient(90deg,#2a8055,#1a5030)' : 'linear-gradient(90deg,#9a5020,#6a3010)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.35) inset',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AgendaDelDia() {
  return (
    <div className="surface-raised rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <IconTile Icon={Clock} from="#1a5070" to="#0e3050" size={14} tileSize={30} radius="0.55rem" />
          <h3 className="text-sm font-bold text-[#302D28]">Agenda del día</h3>
        </div>
        <button className="text-xs text-[#7a4010] font-bold hover:underline">Ver completa →</button>
      </div>
      <div className="space-y-2">
        {AGENDA.map(({ hora, tarea, lugar }) => (
          <div key={hora} className="flex items-start gap-3">
            <span
              className="text-[11px] font-bold text-[#7a4010] flex-shrink-0 mt-0.5 px-2 py-0.5 rounded-lg"
              style={{
                background: 'rgba(236,228,218,0.58)',
                border: '1px solid rgba(128,96,62,0.12)',
                boxShadow: 'inset 0 2px 4px rgba(86,55,28,0.10)',
                minWidth: '3rem',
                textAlign: 'center',
              }}
            >
              {hora}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#302D28] leading-tight">{tarea}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={9} className="text-[#A08060]" />
                <p className="text-[10px] text-[#A08060]">{lugar}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActividadesRecientes() {
  return (
    <div className="surface-raised rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <IconTile Icon={Activity} from="#b06000" to="#7a3a00" size={14} tileSize={30} radius="0.55rem" />
          <h3 className="text-sm font-bold text-[#302D28]">Actividades recientes</h3>
        </div>
        <button className="text-xs text-[#7a4010] font-bold hover:underline">Ver todas</button>
      </div>
      <div className="space-y-3">
        {ACTIVIDADES.map(({ texto, tiempo }, i) => {
          const cfg = ACTIVIDAD_CONFIG[i % ACTIVIDAD_CONFIG.length];
          return (
            <div key={texto} className="flex items-start gap-3">
              <IconTile Icon={cfg.Icon} from={cfg.from} to={cfg.to} size={13} tileSize={28} radius="0.5rem" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[#3d2010] leading-snug">{texto}</p>
                <p className="text-[10px] text-[#A08060] mt-0.5">{tiempo}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CalendarioCosechas() {
  const days = ['L','M','M','J','V','S','D'];
  const weeks = [
    [null,null,null,1,2,3,4],
    [5,6,7,8,9,10,11],
    [12,13,14,15,16,17,18],
    [19,20,21,22,23,24,25],
    [26,27,28,29,30,31,null],
  ];
  const harvests = new Set([25,27,29,31]);
  const today = 27;

  return (
    <div className="surface-raised rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <IconTile Icon={CalendarCheck} from="#2a8055" to="#1a5030" size={14} tileSize={30} radius="0.55rem" />
          <h3 className="text-sm font-bold text-[#302D28]">Calendario</h3>
        </div>
        <button className="text-xs text-[#7a4010] font-bold hover:underline">Ver completo</button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {days.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-bold text-[#A08060] py-1">{d}</div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 gap-0.5">
          {week.map((day, di) => {
            const isToday   = day === today;
            const isHarvest = day !== null && harvests.has(day!) && !isToday;
            return (
              <div
                key={di}
                className="text-center text-[11px] py-1 rounded-lg font-medium"
                style={
                  isToday ? {
                    background: 'linear-gradient(145deg,#9a5020,#6a3010)',
                    color: '#fff',
                    fontWeight: 700,
                    boxShadow: '0 1px 0 rgba(255,255,255,0.25) inset, 0 3px 8px rgba(122,64,16,0.35)',
                  } : isHarvest ? {
                    background: 'linear-gradient(145deg,#2a8055,#1a5030)',
                    color: '#fff',
                    fontWeight: 700,
                    boxShadow: '0 1px 0 rgba(255,255,255,0.25) inset, 0 3px 8px rgba(26,96,64,0.35)',
                  } : {}
                }
              >
                {day ?? ''}
              </div>
            );
          })}
        </div>
      ))}
      <p className="text-[10px] text-[#A08060] mt-2 text-center">Mayo 2025</p>
    </div>
  );
}

export function SegundaFila() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
      <CicloProductivo />
      <AgendaDelDia />
      <ActividadesRecientes />
      <CalendarioCosechas />
    </div>
  );
}
