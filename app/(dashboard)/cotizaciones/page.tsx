'use client';

import { useState } from 'react';
import { CotizacionForm, CATEGORIAS } from '@/components/cotizaciones/CotizacionForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useCotizacionesStore } from '@/store/cotizaciones';
import { useCurrencyStore } from '@/store/currency';
import { eliminarCotizacion } from '@/lib/firestore';
import { toast } from 'sonner';
import type { CategoriaCotizacion, Cotizacion } from '@/types';

function CotizacionCard({ cot }: { cot: Cotizacion }) {
  const { formatAmount, currency } = useCurrencyStore();
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar "${cot.nombre}"?`)) return;
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
      <div className="rounded-lg border border-border bg-card p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">{cot.nombre}</p>
            <p className="text-xs text-muted-foreground">{cot.items.length} ítems · {new Date(cot.creadoEn).toLocaleDateString('es-CO')}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-green-700">{formatAmount(cot.total)} {currency}</span>
            <button onClick={() => setExpanded((v) => !v)} className="text-muted-foreground hover:text-foreground">
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <button onClick={handleDelete} disabled={deleting} className="text-muted-foreground hover:text-red-500 disabled:opacity-40">
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {expanded && (
          <div className="pt-1 space-y-1">
            <Separator />
            {cot.items.map((item) => (
              <div key={item.id} className="flex items-center gap-2 py-1">
                {item.imagenUrl && (
                  <button onClick={() => setLightbox(item.imagenUrl!)} type="button">
                    <img
                      src={item.imagenUrl}
                      alt=""
                      className="h-8 w-8 object-cover rounded border border-border hover:opacity-80"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </button>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs truncate">{item.descripcion}</p>
                  <p className="text-xs text-muted-foreground">{item.cantidad} {item.unidad} × {formatAmount(item.precioUnitario)} {currency}</p>
                </div>
                <span className="text-xs font-medium shrink-0">{formatAmount(item.subtotal)} {currency}</span>
              </div>
            ))}
            {cot.notas && <p className="text-xs text-muted-foreground italic pt-1">📝 {cot.notas}</p>}
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="Vista ampliada"
            className="max-h-[85vh] max-w-full rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

export default function CotizacionesPage() {
  const [activeTab, setActiveTab] = useState<CategoriaCotizacion>('construccion');
  const { cotizaciones, loading } = useCotizacionesStore();

  const porCategoria = (cat: CategoriaCotizacion) =>
    cotizaciones.filter((c) => c.categoria === cat);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cotizaciones</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Registra los costos de cada categoría de tu proyecto de cultivo.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as CategoriaCotizacion)}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1">
          {CATEGORIAS.map((cat) => {
            const count = porCategoria(cat.value).length;
            return (
              <TabsTrigger key={cat.value} value={cat.value} className="flex items-center gap-1.5 text-xs">
                <span>{cat.icon}</span>
                <span className="hidden sm:inline">{cat.label}</span>
                {count > 0 && (
                  <span className="ml-1 bg-green-700 text-white rounded-full text-[10px] px-1.5 py-0.5 leading-none">
                    {count}
                  </span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {CATEGORIAS.map((cat) => {
          const lista = porCategoria(cat.value);
          return (
            <TabsContent key={cat.value} value={cat.value} className="mt-4 space-y-4">
              {/* Lista de cotizaciones guardadas */}
              {loading ? (
                <p className="text-sm text-muted-foreground">Cargando...</p>
              ) : lista.length > 0 ? (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Cotizaciones guardadas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {lista.map((cot) => <CotizacionCard key={cot.id} cot={cot} />)}
                  </CardContent>
                </Card>
              ) : null}

              {/* Formulario nueva cotización */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span>{cat.icon}</span> Nueva cotización — {cat.label}
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
