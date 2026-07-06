'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckSquare, ArrowRight, Layers, RefreshCw, type LucideIcon } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { STORAGE_KEY_01, SECTIONS_01 } from '@/components/checklists/mock-data-01';
import { STORAGE_KEY_02, SECTIONS_02 } from '@/components/checklists/mock-data-02';

interface ChecklistMeta {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  storageKey: string;
  totalItems: number;
  totalSections: number;
  href: string;
  Icon: LucideIcon;
  from: string;
  to: string;
  tags: string[];
}

const CHECKLISTS: ChecklistMeta[] = [
  {
    id: '01',
    title: 'Cultivo de Orellana',
    subtitle: 'Laboratorio de Campo · Pleurotus ostreatus',
    description: 'Proceso completo de cultivo desde la configuración del laboratorio hasta el registro sanitario INVIMA, incluyendo producción, cosecha, empaque y comercialización.',
    storageKey: STORAGE_KEY_01,
    totalItems: SECTIONS_01.reduce((a, s) => a + s.items.length, 0),
    totalSections: SECTIONS_01.length,
    href: '/checklists/01',
    Icon: CheckSquare,
    from: '#2a8055',
    to: '#1a5030',
    tags: ['Producción', 'Laboratorio', 'Cosecha', 'INVIMA'],
  },
  {
    id: '02',
    title: 'Emprendimiento Orellana',
    subtitle: 'Desde Cero · Dos fases',
    description: 'Guía completa para montar un emprendimiento agrícola de orellana: desde la estrategia y legal, hasta la infraestructura, equipamiento, marketing y gestión continua.',
    storageKey: STORAGE_KEY_02,
    totalItems: SECTIONS_02.reduce((a, s) => a + s.items.length, 0),
    totalSections: SECTIONS_02.length,
    href: '/checklists/02',
    Icon: Layers,
    from: '#1a5070',
    to: '#0e3050',
    tags: ['Estrategia', 'Legal', 'Marketing', 'Gestión'],
  },
];

function useProgress(storageKey: string, totalItems: number) {
  const [completed, setCompleted] = useState(0);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const sections = JSON.parse(saved);
        const count = sections.reduce((a: number, s: { items: { completed: boolean }[] }) =>
          a + s.items.filter(i => i.completed).length, 0);
        setCompleted(count);
      }
    } catch {}
  }, [storageKey]);
  return Math.round((completed / (totalItems || 1)) * 100);
}

function ChecklistCard({ meta }: { meta: ChecklistMeta }) {
  const router = useRouter();
  const pct = useProgress(meta.storageKey, meta.totalItems);

  return (
    <div className="surface-raised rounded-2xl p-5 flex flex-col gap-4 hover:scale-[1.01] transition-transform cursor-pointer"
      onClick={() => router.push(meta.href)}>
      {/* Top */}
      <div className="flex items-start gap-3">
        <IconTile Icon={meta.Icon} from={meta.from} to={meta.to} size={18} tileSize={44} radius="0.75rem"/>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-[#302D28]">{meta.title}</h2>
          <p className="text-[11px] text-[#A08060] mt-0.5">{meta.subtitle}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-[11px] text-[#6B4A2A] leading-relaxed">{meta.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {meta.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-[#6B4A2A]"
            style={{ background:'rgba(128,96,62,0.10)', border:'1px solid rgba(128,96,62,0.10)' }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-[10px] text-[#A08060]">
        <span className="flex items-center gap-1">
          <CheckSquare size={11}/>{meta.totalItems} tareas
        </span>
        <span className="flex items-center gap-1">
          <Layers size={11}/>{meta.totalSections} secciones
        </span>
        {pct > 0 && (
          <span className="flex items-center gap-1 text-[#2a8055] font-semibold">
            <RefreshCw size={10}/>{pct}% completado
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-[#A08060]">Progreso</span>
          <span className="text-[10px] font-bold text-[#302D28]">{pct}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background:'rgba(128,96,62,0.12)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width:`${pct}%`, background:`linear-gradient(90deg,${meta.from},${meta.to})` }}/>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={e => { e.stopPropagation(); router.push(meta.href); }}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.02] active:scale-95"
        style={{ background:`linear-gradient(145deg,${meta.from},${meta.to})`, border:'1px solid rgba(255,255,255,0.18)', boxShadow:'0 1px 0 rgba(255,255,255,0.22) inset, 0 5px 14px rgba(0,0,0,0.18)' }}>
        Abrir checklist <ArrowRight size={13}/>
      </button>
    </div>
  );
}

export default function ChecklistsPage() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="surface-raised rounded-2xl px-5 py-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6D3D]">Recursos</p>
          <h1 className="text-2xl font-bold text-[#302D28]">Listas de Chequeo</h1>
          <p className="text-sm text-[#A08060]">
            Guías paso a paso para el cultivo y emprendimiento de Pleurotus ostreatus. El progreso se guarda automáticamente.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {CHECKLISTS.map(meta => (
          <ChecklistCard key={meta.id} meta={meta}/>
        ))}
      </div>
    </div>
  );
}
