'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, ChevronRight, Target, RotateCcw, RefreshCw } from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { SECTIONS_02, STORAGE_KEY_02 } from './mock-data-02';
import type { ChecklistSection } from './types';

function loadFromStorage(): ChecklistSection[] {
  if (typeof window === 'undefined') return JSON.parse(JSON.stringify(SECTIONS_02));
  try {
    const saved = localStorage.getItem(STORAGE_KEY_02);
    if (saved) return JSON.parse(saved);
  } catch {}
  return JSON.parse(JSON.stringify(SECTIONS_02));
}

function saveToStorage(sections: ChecklistSection[]) {
  try { localStorage.setItem(STORAGE_KEY_02, JSON.stringify(sections)); } catch {}
}

export function ChecklistViewer02() {
  const router = useRouter();
  const [sections, setSections] = useState<ChecklistSection[]>(() => JSON.parse(JSON.stringify(SECTIONS_02)));
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSections(loadFromStorage());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveToStorage(sections);
  }, [sections, loaded]);

  const totalItems = sections.reduce((a, s) => a + s.items.length, 0);
  const completedItems = sections.reduce((a, s) => a + s.items.filter(i => i.completed).length, 0);
  const pct = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  const inicialSections = sections.filter(s => s.phase === 'inicial');
  const continuaSections = sections.filter(s => s.phase === 'continua');
  const inicialCompleted = inicialSections.reduce((a, s) => a + s.items.filter(i => i.completed).length, 0);
  const inicialTotal = inicialSections.reduce((a, s) => a + s.items.length, 0);
  const continuaCompleted = continuaSections.reduce((a, s) => a + s.items.filter(i => i.completed).length, 0);
  const continuaTotal = continuaSections.reduce((a, s) => a + s.items.length, 0);

  function toggleSection(id: number) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleItemExpand(id: number) {
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleItem(sectionId: number, itemId: number) {
    setSections(prev => prev.map(s =>
      s.id !== sectionId ? s : {
        ...s,
        items: s.items.map(i => i.id !== itemId ? i : { ...i, completed: !i.completed }),
      }
    ));
  }

  function handleReset() {
    if (!confirm('¿Restaurar el checklist? Se perderá el progreso actual.')) return;
    const fresh = JSON.parse(JSON.stringify(SECTIONS_02));
    setSections(fresh);
    saveToStorage(fresh);
  }

  function renderSections(list: ChecklistSection[]) {
    let globalNum = 0;
    // compute offset for continua sections (start after all inicial items)
    const inicialItemCount = inicialSections.reduce((a, s) => a + s.items.length, 0);
    const isInicial = list[0]?.phase === 'inicial';
    return list.map((section, sIdx) => {
      const sCompleted = section.items.filter(i => i.completed).length;
      const isOpen = expanded.has(section.id);
      return (
        <div key={section.id} className="surface-raised rounded-2xl overflow-hidden">
          <button onClick={() => toggleSection(section.id)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[rgba(128,96,62,0.04)] transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: isInicial
                  ? 'linear-gradient(145deg,#5d4037,#3e2723)'
                  : 'linear-gradient(145deg,#558b2f,#33691e)' }}>
                {sIdx + 1}
              </span>
              <div>
                <p className="text-sm font-bold text-[#302D28] text-left">{section.title}</p>
                <p className="text-[10px] text-[#A08060]">{sCompleted}/{section.items.length} completadas</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {sCompleted > 0 && (
                <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(128,96,62,0.12)' }}>
                  <div className="h-full rounded-full" style={{
                    width:`${(sCompleted/section.items.length)*100}%`,
                    background: isInicial ? 'linear-gradient(90deg,#7cb342,#558b2f)' : 'linear-gradient(90deg,#2a8055,#1a5030)',
                  }}/>
                </div>
              )}
              {isOpen ? <ChevronDown size={15} className="text-[#A08060]"/> : <ChevronRight size={15} className="text-[#A08060]"/>}
            </div>
          </button>

          {isOpen && (
            <div className="px-4 pb-3 space-y-2">
              {section.items.map((item, iIdx) => {
                const num = (isInicial ? 0 : inicialItemCount) + list.slice(0, sIdx).reduce((a, s) => a + s.items.length, 0) + iIdx + 1;
                const isItemExpanded = expandedItems.has(item.id);
                return (
                  <div key={item.id} className="rounded-xl px-3 py-2.5 transition-all"
                    style={{
                      background: item.completed ? 'rgba(92,180,60,0.06)' : 'rgba(236,228,218,0.38)',
                      border: `1px solid ${item.completed ? 'rgba(92,180,60,0.20)' : 'rgba(128,96,62,0.08)'}`,
                    }}>
                    <div className="flex items-start gap-2.5">
                      <input type="checkbox" checked={item.completed}
                        onChange={() => toggleItem(section.id, item.id)}
                        className="mt-0.5 flex-shrink-0 w-4 h-4 cursor-pointer"
                        style={{ accentColor:'#558b2f' }}/>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className={`text-[11px] font-semibold leading-snug ${item.completed ? 'line-through text-[#A08060]' : 'text-[#302D28]'}`}>
                              <span className="text-[#A08060] mr-1">{String(num).padStart(3,'0')}.</span>
                              {item.title}
                            </p>
                            {item.recurrence && (
                              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold"
                                style={{ background:'rgba(42,128,85,0.10)', color:'#2a8055' }}>
                                <RefreshCw size={9}/>{item.recurrence}
                              </span>
                            )}
                          </div>
                          {(item.objective || item.description) && (
                            <button onClick={() => toggleItemExpand(item.id)} className="flex-shrink-0 ml-1"
                              title={isItemExpanded ? 'Ocultar' : 'Ver detalle'}>
                              {isItemExpanded
                                ? <ChevronDown size={13} className="text-[#A08060]"/>
                                : <ChevronRight size={13} className="text-[#A08060]"/>}
                            </button>
                          )}
                        </div>
                        {isItemExpanded && (
                          <div className="mt-2 space-y-1.5">
                            {item.objective && (
                              <div className="flex items-start gap-1.5 rounded-lg px-2 py-1.5"
                                style={{ background:'rgba(42,128,85,0.07)', border:'1px solid rgba(42,128,85,0.12)' }}>
                                <IconTile Icon={Target} from="#2a8055" to="#1a5030" size={10} tileSize={20} radius="0.3rem"/>
                                <p className="text-[10px] text-[#2a8055] font-medium leading-snug">{item.objective}</p>
                              </div>
                            )}
                            {item.description && (
                              <p className="text-[10px] text-[#6B4A2A] leading-relaxed pl-1">{item.description}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    });
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="surface-raised rounded-2xl px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/checklists')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#6B4A2A] hover:scale-[1.03] active:scale-95 transition-all flex-shrink-0"
              style={{ background:'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border:'1px solid rgba(255,255,255,0.78)', boxShadow:'0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.10)' }}>
              <ArrowLeft size={13}/> Volver
            </button>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6D3D]">Listas de chequeo</p>
              <h1 className="mt-0.5 text-xl font-bold text-[#302D28]">Checklist Emprendimiento Orellana</h1>
              <p className="mt-0.5 text-xs text-[#A08060]">Desde Cero · Configuración inicial y gestión continua</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 lg:w-52">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-[#6B4A2A]">{completedItems} / {totalItems} tareas</span>
                <span className="text-[11px] font-bold text-[#2a8055]">{pct}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background:'rgba(128,96,62,0.12)' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width:`${pct}%`, background:'linear-gradient(90deg,#7cb342,#558b2f)' }}/>
              </div>
            </div>
            <button onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white flex-shrink-0"
              style={{ background:'linear-gradient(145deg,#b83020,#7a1a10)', border:'1px solid rgba(255,255,255,0.12)', boxShadow:'0 4px 10px rgba(184,48,32,0.25)' }}>
              <RotateCcw size={11}/> Reiniciar
            </button>
          </div>
        </div>
      </div>

      {/* Phase mini-stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="surface-raised rounded-2xl px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
              style={{ background:'linear-gradient(145deg,#5d4037,#3e2723)' }}>Fase 1</span>
            <span className="text-[11px] font-semibold text-[#302D28]">Configuración Inicial</span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-[#A08060]">{inicialCompleted}/{inicialTotal} tareas</span>
            <span className="text-[10px] font-bold text-[#5d4037]">{inicialTotal === 0 ? 0 : Math.round((inicialCompleted/inicialTotal)*100)}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(128,96,62,0.12)' }}>
            <div className="h-full rounded-full" style={{ width:`${inicialTotal === 0 ? 0 : (inicialCompleted/inicialTotal)*100}%`, background:'linear-gradient(90deg,#7cb342,#558b2f)' }}/>
          </div>
        </div>
        <div className="surface-raised rounded-2xl px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
              style={{ background:'linear-gradient(145deg,#558b2f,#33691e)' }}>Fase 2</span>
            <span className="text-[11px] font-semibold text-[#302D28]">Gestión Continua</span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-[#A08060]">{continuaCompleted}/{continuaTotal} tareas</span>
            <span className="text-[10px] font-bold text-[#2a8055]">{continuaTotal === 0 ? 0 : Math.round((continuaCompleted/continuaTotal)*100)}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(128,96,62,0.12)' }}>
            <div className="h-full rounded-full" style={{ width:`${continuaTotal === 0 ? 0 : (continuaCompleted/continuaTotal)*100}%`, background:'linear-gradient(90deg,#2a8055,#1a5030)' }}/>
          </div>
        </div>
      </div>

      {/* Phase 1 */}
      <div className="rounded-xl px-4 py-2.5"
        style={{ background:'linear-gradient(90deg,#efebe9,#fafaf7)', border:'1px solid rgba(93,64,55,0.15)' }}>
        <p className="text-xs font-bold text-[#3e2723] uppercase tracking-wider">
          Fase 1: Configuración Inicial
          <span className="ml-2 text-[10px] font-normal text-[#8d6e63] normal-case tracking-normal">
            — Tareas que se realizan una sola vez al iniciar el emprendimiento
          </span>
        </p>
      </div>
      <div className="space-y-2">{renderSections(inicialSections)}</div>

      {/* Phase 2 */}
      <div className="rounded-xl px-4 py-2.5"
        style={{ background:'linear-gradient(90deg,#e8f5e9,#f1f8f1)', border:'1px solid rgba(85,139,47,0.20)' }}>
        <p className="text-xs font-bold text-[#33691e] uppercase tracking-wider">
          Fase 2: Gestión Continua
          <span className="ml-2 text-[10px] font-normal text-[#558b2f] normal-case tracking-normal">
            — Tareas recurrentes: diarias, semanales, mensuales, trimestrales
          </span>
        </p>
      </div>
      <div className="space-y-2">{renderSections(continuaSections)}</div>
    </div>
  );
}
