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
import { FlaskConical, RotateCcw, Droplets, Wheat, PackageCheck } from 'lucide-react';

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
      <Label htmlFor={id} className="text-xs font-semibold text-[#5A3E2B]">{label}</Label>
      {hint && <p className="text-xs italic text-muted-foreground">{hint}</p>}
      <Input id={id} type="number" step={step} min="0" {...reg(id as keyof CalcSustratoInputs, { valueAsNumber: true })} />
    </div>
  );
}

function ResultRow({ label, value, unit = 'g', color }: { label: string; value: number; unit?: string; color?: string }) {
  return (
    <div className="surface-inset flex items-center justify-between rounded-lg px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className={'font-semibold tabular-nums ' + (color || '')}>
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
        <div className="grid gap-5 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="icon-tile-3d h-9 w-9 rounded-xl"><PackageCheck size={17} /></span>
                Bloques
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Field label="Número de bloques" id="numBloques" step="1" reg={register} />
              <Field label="Peso de cada bloque (kg)" id="pesoBloques" reg={register} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="icon-tile-3d icon-tile-gold h-9 w-9 rounded-xl"><Wheat size={17} /></span>
                Material seco
                <Badge className="badge-gold text-xs font-normal">62.5% del total</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Field label="% de materia seca" id="porcentajeMateriaSeca" reg={register} />
              <Separator />
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Carbono - 88%</p>
              <Field label="% de aserrín en materia seca" id="porcentajeAserrin" hint="70% de 88 = 61.6%" reg={register} />
              <Field label="% de viruta en materia seca" id="porcentajeViruta" hint="30% de 88 = 26.4%" reg={register} />
              <Separator />
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Nitrógeno - 10%</p>
              <Field label="% de salvado de maíz" id="porcentajeSalvado" reg={register} />
              <Separator />
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Cal - 2%</p>
              <Field label="% de cal en materia seca" id="porcentajeCal" reg={register} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="icon-tile-3d h-9 w-9 rounded-xl"><Droplets size={17} /></span>
                Material líquido
                <Badge className="badge-moss text-xs font-normal">37.5% del total</Badge>
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
          <Button type="submit" className="flex-1">Calcular</Button>
          <Button type="button" variant="outline" onClick={() => { reset(DEFAULT_VALUES); setResults(null); }} title="Reiniciar">
            <RotateCcw size={16} />
          </Button>
        </div>
      </form>

      {results && (
        <div className="space-y-4">
          <Separator />
          <h3 className="flex items-center gap-2 text-lg font-semibold text-[#302D28]">
            <span className="icon-tile-3d h-9 w-9 rounded-xl"><FlaskConical size={17} /></span>
            Resultados por bloque
          </h3>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Peso total del lote: {(results.pesoTotal / 1000).toLocaleString('es-CO', { minimumFractionDigits: 2 })} kg</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Material seco</p>
                <ResultRow label="Aserrín" value={results.pesoAserrin} color="text-[#9A7010]" />
                <ResultRow label="Viruta" value={results.pesoViruta} color="text-[#8B6A4A]" />
                <ResultRow label="Salvado de maíz" value={results.pesoSalvado} color="text-[#C59D5F]" />
                <ResultRow label="Cal" value={results.pesoCal} color="text-stone-600" />
              </div>
              <div className="space-y-2 pt-1">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Material líquido</p>
                <ResultRow label="Agua" value={results.pesoAgua} color="text-[#4E652E]" />
                <ResultRow label="Melaza" value={results.pesoMelaza} color="text-[#B86A4E]" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
