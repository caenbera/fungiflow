'use client';

import { useState } from 'react';
import { CotizacionForm, CATEGORIAS } from '@/components/cotizaciones/CotizacionForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, ChevronDown, ChevronUp, FileText, ChartNoAxesCombined } from 'lucide-react';
import { useCotizacionesStore } from '@/store/cotizaciones';
import { useCurrencyStore } from '@/store/currency';
import { eliminarCotizacion } from '@/lib/firestore';
import { CurrencyFlag } from '@/components/shared/CurrencyFlag';
import { ResumenDashboard } from '@/components/dashboard/ResumenDashboard';
import { toast } from 'sonner';
import type { CategoriaCotizacion, Cotizacion } from '@/types';

type ActiveTab = 'resumen' | CategoriaCotizacion;

function CotizacionCard({ cot }: { cot: Cotizacion }) {
  const { formatAmount, currency } = useCurrencyStore();
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm('¿Eliminar "' + cot.nombre + '"?')) return;
    setDeleting(true);
    try {
      await eliminarCotizacion(cot.id);
      toast.success('Cotización eliminada');
    } catch {
      toast.error('Error al eliminar');
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="table-row-3d rounded-xl p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="icon-tile-3d h-10 w-10 rounded-xl">
              <FileText size={18} />
            </span>
            <div>
              <p className="font-semibold text-[#302D28]">{cot.nombre}</p>
              <p className="text-xs text-muted-foreground">{cot.items.length} ítems · {new Date(cot.creadoEn).toLocaleDateString('es-CO')}</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <span className="rounded-full bg-[#EEF5E5] px-3 py-1 text-sm font-bold text-[#4E652E] shadow-[var(--shadow-soft-raised)]">
              {formatAmount(cot.total)} <CurrencyFlag currency={currency} />
            </span>
            <Button type="button" variant="outline" size="icon-sm" onClick={() => setExpanded((v) => !v)} title={expanded ? 'Contraer' : 'Expandir'}>
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
            <Button type="button" variant="destructive" size="icon-sm" onClick={handleDelete} disabled={deleting} title="Eliminar cotización">
              <Trash2 size={15} />
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 space-y-2 pt-1">
            <Separator />
            {cot.items.map((item) => (
              <div key={item.id} className="surface-inset flex items-center gap-2 rounded-lg px-3 py-2">
                {item.imagenUrl && (
                  <button onClick={() => setLightbox(item.imagenUrl!)} type="button">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imagenUrl}
                      alt=""
                      className="h-9 w-9 rounded-lg border border-white/70 object-cover hover:opacity-80"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </button>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-[#302D28]">{item.descripcion}</p>
                  <p className="text-xs text-muted-foreground">{item.cantidad} {item.unidad} x {formatAmount(item.precioUnitario)} <CurrencyFlag currency={currency} /></p>
                </div>
                <span className="shrink-0 text-xs font-bold">{formatAmount(item.subtotal)} <CurrencyFlag currency={currency} /></span>
              </div>
            ))}
            {cot.notas && <p className="pt-1 text-xs italic text-muted-foreground">Notas: {cot.notas}</p>}
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="Vista ampliada"
            className="max-h-[85vh] max-w-full rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

export default function CotizacionesPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('resumen');
  const { cotizaciones, loading } = useCotizacionesStore();
  const { formatAmount, currency } = useCurrencyStore();

  const porCategoria = (cat: CategoriaCotizacion) =>
    cotizaciones.filter((c) => c.categoria === cat);

  return (
    <div className="space-y-7">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6D3D]">Costos del proyecto</p>
        <h1 className="mt-1 text-2xl font-bold text-[#302D28] md:text-3xl">Cotizaciones</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Registra y organiza los costos de cada categoría de tu cultivo.
        </p>
        <div className="accent-rule mt-4" />
      </header>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ActiveTab)}>
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          {/* Pestaña resumen financiero */}
          <TabsTrigger value="resumen" className="flex-none">
            <ChartNoAxesCombined size={15} />
            <span className="hidden sm:inline">Resumen financiero</span>
          </TabsTrigger>

          {CATEGORIAS.map((cat) => {
            const count = porCategoria(cat.value).length;
            const Icon = cat.icon;
            return (
              <TabsTrigger key={cat.value} value={cat.value} className="flex-none">
                <Icon size={15} />
                <span className="hidden sm:inline">{cat.label}</span>
                {count > 0 && (
                  <span className="ml-1 rounded-full bg-[#788D42] px-1.5 py-0.5 text-[10px] leading-none text-white">
                    {count}
                  </span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Contenido pestaña resumen */}
        <TabsContent value="resumen" className="mt-5">
          {loading ? (
            <div className="surface-soft rounded-xl p-4 text-sm text-muted-foreground">Cargando...</div>
          ) : cotizaciones.length === 0 ? (
            <div className="surface-soft rounded-xl p-6 text-sm text-muted-foreground">
              Aún no hay cotizaciones. Crea tu primera en las pestañas de categorías.
            </div>
          ) : (
            <ResumenDashboard
              cotizaciones={cotizaciones.map((c) => ({ categoria: c.categoria, nombre: c.nombre, total: c.total }))}
              proyectoNombre="Cultivo Orellana - Fase 1"
            />
          )}
        </TabsContent>

        {CATEGORIAS.map((cat) => {
          const lista = porCategoria(cat.value);
          const totalCategoria = lista.reduce((acc, c) => acc + (c.total ?? 0), 0);
          const Icon = cat.icon;
          return (
            <TabsContent key={cat.value} value={cat.value} className="mt-5 space-y-5">
              {loading ? (
                <div className="surface-soft rounded-xl p-4 text-sm text-muted-foreground">Cargando...</div>
              ) : lista.length > 0 ? (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <span className="icon-tile-3d h-9 w-9 rounded-xl"><Icon size={17} /></span>
                      Cotizaciones guardadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {lista.map((cot) => <CotizacionCard key={cot.id} cot={cot} />)}
                    <Separator />
                    <div className="flex items-center justify-between px-1 pt-1">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        Total {cat.label}
                      </p>
                      <span className="rounded-full bg-[#4E652E] px-4 py-1.5 text-sm font-bold text-white shadow-[var(--shadow-soft-raised)]">
                        {formatAmount(totalCategoria)} <CurrencyFlag currency={currency} />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span className="icon-tile-3d icon-tile-gold h-9 w-9 rounded-xl"><Icon size={17} /></span>
                    Nueva cotización - {cat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CotizacionForm categoria={cat.value} />
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
