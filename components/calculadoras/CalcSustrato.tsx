'use client';

import { useForm } from 'react-hook-form';
import { calcularSustrato } from '@/lib/calc-sustrato';
import type { CalcSustratoInputs } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

type Results = ReturnType<typeof calcularSustrato>;

const DEFAULT_VALUES: CalcSustratoInputs = {
  numBloques: 0,
  pesoBloques: 2.5,
  porcentajeMateriaSeca: 62.5,
  porcentajeAserrin: 61.6,
  porcentajeViruta: 26.4,
  porcentajeSalvado: 10,
  porcentajeCal: 2,
  porcentajeLiquidos: 37.5,
  porcentajeAgua: 99,
  porcentajeMelaza: 1,
};

function Field({ label, id, step = '0.01', hint, reg }: {
  label: string; id: string; step?: string; hint?: string;
  reg: ReturnType<typeof useForm<CalcSustratoInputs>>['register'];
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs">{label}</Label>
      {hint && <p className="text-xs text-muted-foreground italic">{hint}</p>}
      <Input id={id} type="number" step={step} min="0" {...reg(id as keyof CalcSustratoInputs, { valueAsNumber: true })} className="h-9" />
    </div>
  );
}

function ResultRow({ label, value, unit = 'g', color }: { label: string; value: number; unit?: string; color?: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`font-semibold tabular-nums ${color || ''}`}>
          {value.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <Badge variant="secondary" className="text-xs">{unit}</Badge>
      </div>
    </div>
  );
}

export function CalcSustrato() {
  const [results, setResults] = useState<Results | null>(null);
  const { register, handleSubmit, reset } = useForm<CalcSustratoInputs>({ defaultValues: DEFAULT_VALUES });

  const onSubmit = (data: CalcSustratoInputs) => setResults(calcularSustrato(data));

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Bloques</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Field label="Número de bloques" id="numBloques" step="1" reg={register} />
              <Field label="Peso de cada bloque (kg)" id="pesoBloques" reg={register} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                Material Seco
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-xs font-normal">62.5% del total</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Field label="% de materia seca" id="porcentajeMateriaSeca" reg={register} />
              <Separator />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Carbono — 88%</p>
              <Field label="% de aserrín en materia seca" id="porcentajeAserrin" hint="70% de 88 = 61.6%" reg={register} />
              <Field label="% de viruta en materia seca" id="porcentajeViruta" hint="30% de 88 = 26.4%" reg={register} />
              <Separator />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Nitrógeno — 10%</p>
              <Field label="% de salvado de maíz" id="porcentajeSalvado" reg={register} />
              <Separator />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Cal — 2%</p>
              <Field label="% de cal en materia seca" id="porcentajeCal" reg={register} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                Material Líquido
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-normal">37.5% del total</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">Corresponde al 60% del material seco</p>
              <Field label="% total de líquidos" id="porcentajeLiquidos" reg={register} />
              <Field label="% de agua en líquidos" id="porcentajeAgua" reg={register} />
              <Field label="% de melaza en líquidos" id="porcentajeMelaza" reg={register} />
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="bg-green-700 hover:bg-green-800 flex-1">Calcular</Button>
          <Button type="button" variant="outline" onClick={() => { reset(DEFAULT_VALUES); setResults(null); }}>
            <RotateCcw size={16} />
          </Button>
        </div>
      </form>

      {results && (
        <div className="space-y-4">
          <Separator />
          <h3 className="font-semibold text-lg">Resultados por bloque</h3>
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Peso total del lote: {(results.pesoTotal / 1000).toLocaleString('es-CO', { minimumFractionDigits: 2 })} kg</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <div className="pb-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide py-1">Material seco</p>
                <ResultRow label="Aserrín" value={results.pesoAserrin} color="text-amber-700 dark:text-amber-400" />
                <ResultRow label="Viruta" value={results.pesoViruta} color="text-amber-600 dark:text-amber-300" />
                <ResultRow label="Salvado de maíz" value={results.pesoSalvado} color="text-yellow-700 dark:text-yellow-400" />
                <ResultRow label="Cal" value={results.pesoCal} color="text-stone-600 dark:text-stone-400" />
              </div>
              <div className="pt-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide py-1">Material líquido</p>
                <ResultRow label="Agua" value={results.pesoAgua} color="text-blue-600 dark:text-blue-400" />
                <ResultRow label="Melaza" value={results.pesoMelaza} color="text-orange-700 dark:text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
