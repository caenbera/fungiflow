'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useCurrencyStore } from '@/store/currency';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import type { CategoriaCotizacion } from '@/types';

const CATEGORIAS: { value: CategoriaCotizacion; label: string; icon: string; color: string }[] = [
  { value: 'construccion', label: 'Construcción', icon: '🏗️', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
  { value: 'equipos', label: 'Equipos', icon: '⚙️', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  { value: 'materiaprima', label: 'Materia Prima', icon: '🌾', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  { value: 'consumibles', label: 'Consumibles', icon: '📦', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
  { value: 'manodeobra', label: 'Mano de Obra', icon: '👷', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  { value: 'servicios', label: 'Servicios', icon: '💡', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300' },
];

interface ItemForm {
  descripcion: string;
  cantidad: number;
  unidad: string;
  precioUnitario: number;
}

interface FormData {
  nombre: string;
  notas: string;
  items: ItemForm[];
}

interface Props {
  categoria: CategoriaCotizacion;
  onSave?: (nombre: string, items: ItemForm[], notas: string) => void;
}

export function CotizacionForm({ categoria, onSave }: Props) {
  const { formatAmount, currency } = useCurrencyStore();
  const cat = CATEGORIAS.find((c) => c.value === categoria)!;

  const { register, control, watch, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      nombre: '',
      notas: '',
      items: [{ descripcion: '', cantidad: 1, unidad: 'unidad', precioUnitario: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const items = watch('items');
  const total = items.reduce((acc, item) => acc + (Number(item.cantidad) || 0) * (Number(item.precioUnitario) || 0), 0);

  const onSubmit = (data: FormData) => {
    onSave?.(data.nombre, data.items, data.notas);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{cat.icon}</span>
        <div className="flex-1">
          <Badge className={cat.color}>{cat.label}</Badge>
          <Input
            placeholder={`Nombre de la cotización (ej: Bodega principal)`}
            {...register('nombre')}
            className="mt-2 h-9"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
          <span className="col-span-4">Descripción</span>
          <span className="col-span-2">Cantidad</span>
          <span className="col-span-2">Unidad</span>
          <span className="col-span-3">Precio unit. (COP)</span>
          <span className="col-span-1"></span>
        </div>

        {fields.map((field, index) => {
          const subtotal = (Number(items[index]?.cantidad) || 0) * (Number(items[index]?.precioUnitario) || 0);
          return (
            <div key={field.id} className="space-y-1">
              <div className="grid grid-cols-12 gap-2 items-center">
                <Input className="col-span-4 h-9" placeholder="Descripción del ítem" {...register(`items.${index}.descripcion`)} />
                <Input className="col-span-2 h-9" type="number" min="0" step="0.01" {...register(`items.${index}.cantidad`, { valueAsNumber: true })} />
                <Input className="col-span-2 h-9" placeholder="kg / m² / und" {...register(`items.${index}.unidad`)} />
                <Input className="col-span-3 h-9" type="number" min="0" step="1" {...register(`items.${index}.precioUnitario`, { valueAsNumber: true })} />
                <button type="button" onClick={() => remove(index)} className="col-span-1 text-muted-foreground hover:text-red-500 flex justify-center">
                  <Trash2 size={15} />
                </button>
              </div>
              {subtotal > 0 && (
                <p className="text-xs text-right text-muted-foreground pr-7">
                  Subtotal: <span className="font-semibold text-foreground">{formatAmount(subtotal)} {currency}</span>
                </p>
              )}
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ descripcion: '', cantidad: 1, unidad: 'unidad', precioUnitario: 0 })}
          className="w-full border-dashed"
        >
          <Plus size={15} className="mr-1" /> Agregar ítem
        </Button>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Notas (opcional)</Label>
        <Input placeholder="Observaciones, proveedor, condiciones..." {...register('notas')} className="h-9" />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Total cotización</p>
          <p className="text-2xl font-bold text-green-700">{formatAmount(total)} {currency}</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => reset()}>Limpiar</Button>
          <Button type="submit" className="bg-green-700 hover:bg-green-800">Guardar cotización</Button>
        </div>
      </div>
    </form>
  );
}

export { CATEGORIAS };
