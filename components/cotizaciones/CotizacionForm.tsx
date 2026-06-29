'use client';

import type { ElementType } from 'react';
import { useState } from 'react';
import { useForm, useFieldArray, useWatch, type FieldPath } from 'react-hook-form';
import { useCurrencyStore } from '@/store/currency';
import { useAuthStore } from '@/store/auth';
import { guardarCotizacion } from '@/lib/firestore';
import { CurrencyFlag } from '@/components/shared/CurrencyFlag';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, ImageIcon, X, Hammer, Package, Wheat, ShoppingBag, Users, Zap } from 'lucide-react';
import { toast } from 'sonner';
import type { CategoriaCotizacion } from '@/types';

const CATEGORIAS: { value: CategoriaCotizacion; label: string; icon: ElementType; badge: string }[] = [
  { value: 'construccion', label: 'Construcción', icon: Hammer, badge: 'badge-wood' },
  { value: 'equipos', label: 'Equipos', icon: Package, badge: 'badge-wood' },
  { value: 'materiaprima', label: 'Materia prima', icon: Wheat, badge: 'badge-gold' },
  { value: 'consumibles', label: 'Consumibles', icon: ShoppingBag, badge: 'badge-moss' },
  { value: 'manodeobra', label: 'Mano de obra', icon: Users, badge: 'badge-moss' },
  { value: 'servicios', label: 'Servicios', icon: Zap, badge: 'badge-gold' },
];

interface ItemForm {
  descripcion: string;
  cantidad: number;
  unidad: string;
  precioUnitario: number;
  imagenUrl?: string;
}

interface FormData {
  nombre: string;
  notas: string;
  items: ItemForm[];
}

interface Props {
  categoria: CategoriaCotizacion;
}

export function CotizacionForm({ categoria }: Props) {
  const { formatAmount, currency } = useCurrencyStore();
  const { user } = useAuthStore();
  const cat = CATEGORIAS.find((c) => c.value === categoria)!;
  const Icon = cat.icon;
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      nombre: '',
      notas: '',
      items: [{ descripcion: '', cantidad: 1, unidad: 'unidad', precioUnitario: 0, imagenUrl: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const items = useWatch({ control, name: 'items' });
  const total = items.reduce((acc, item) => acc + (Number(item.cantidad) || 0) * (Number(item.precioUnitario) || 0), 0);

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    setSaving(true);
    try {
      await guardarCotizacion(user.uid, categoria, data.nombre, data.items, data.notas);
      toast.success('Cotización guardada (' + data.items.length + ' ítems)');
      reset({
        nombre: '',
        notas: '',
        items: [{ descripcion: '', cantidad: 1, unidad: 'unidad', precioUnitario: 0, imagenUrl: '' }],
      });
    } catch {
      toast.error('Error al guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="surface-soft rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <span className="icon-tile-3d icon-tile-gold">
              <Icon size={19} />
            </span>
            <div className="flex-1 space-y-2">
              <Badge className={cat.badge}>{cat.label}</Badge>
              <Input
                placeholder="Nombre de la cotización, por ejemplo: Bodega principal"
                {...register('nombre')}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="hidden grid-cols-12 gap-2 px-1 text-xs font-bold uppercase tracking-wide text-muted-foreground md:grid">
            <span className="col-span-3">Descripción</span>
            <span className="col-span-1">Cant.</span>
            <span className="col-span-2">Unidad</span>
            <span className="col-span-2">Precio</span>
            <span className="col-span-3">Imagen</span>
            <span className="col-span-1" />
          </div>

          {fields.map((field, index) => {
            const subtotal = (Number(items[index]?.cantidad) || 0) * (Number(items[index]?.precioUnitario) || 0);
            const imgUrl = items[index]?.imagenUrl?.trim();
            return (
              <div key={field.id} className="table-row-3d rounded-xl p-3">
                <div className="grid gap-2 md:grid-cols-12 md:items-center">
                  <Input className="md:col-span-3" placeholder="Descripción" {...register(('items.' + index + '.descripcion') as FieldPath<FormData>)} />
                  <Input className="md:col-span-1" type="number" min="0" step="0.01" {...register(('items.' + index + '.cantidad') as FieldPath<FormData>, { valueAsNumber: true })} />
                  <Input className="md:col-span-2" placeholder="kg / m2" {...register(('items.' + index + '.unidad') as FieldPath<FormData>)} />
                  <Input className="md:col-span-2" type="number" min="0" step="1" {...register(('items.' + index + '.precioUnitario') as FieldPath<FormData>, { valueAsNumber: true })} />
                  <div className="flex items-center gap-1 md:col-span-3">
                    <Input className="flex-1" placeholder="https://..." {...register(('items.' + index + '.imagenUrl') as FieldPath<FormData>)} />
                    {imgUrl ? (
                      <button type="button" onClick={() => setLightboxUrl(imgUrl)} className="shrink-0" title="Ver imagen">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgUrl}
                          alt=""
                          className="h-9 w-9 rounded-lg border border-white/70 object-cover shadow-[var(--shadow-soft-raised)] transition-opacity hover:opacity-80"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </button>
                    ) : (
                      <div className="surface-inset flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground">
                        <ImageIcon size={14} />
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={() => remove(index)} className="flex justify-center text-muted-foreground transition hover:text-red-600 md:col-span-1" title="Eliminar ítem">
                    <Trash2 size={16} />
                  </button>
                </div>
                {subtotal > 0 && (
                  <p className="pt-2 text-right text-xs text-muted-foreground">
                    Subtotal: <span className="font-bold text-[#302D28]">{formatAmount(subtotal)} <CurrencyFlag currency={currency} /></span>
                  </p>
                )}
              </div>
            );
          })}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ descripcion: '', cantidad: 1, unidad: 'unidad', precioUnitario: 0, imagenUrl: '' })}
            className="w-full border-dashed"
          >
            <Plus size={15} /> Agregar ítem
          </Button>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold text-[#5A3E2B]">Notas (opcional)</Label>
          <Input placeholder="Observaciones, proveedor, condiciones..." {...register('notas')} />
        </div>

        <Separator />

        <div className="surface-soft flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total cotización</p>
            <p className="mt-1 text-2xl font-bold text-[#4E652E]">{formatAmount(total)} <CurrencyFlag currency={currency} /></p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => reset()}>Limpiar</Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cotización'}
            </Button>
          </div>
        </div>
      </form>

      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            className="absolute right-4 top-4 text-white hover:text-gray-300"
            onClick={() => setLightboxUrl(null)}
          >
            <X size={28} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxUrl}
            alt="Vista ampliada"
            className="max-h-[85vh] max-w-full rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

export { CATEGORIAS };
