'use client';

import { useForm } from 'react-hook-form';
import { calcularCultivo } from '@/lib/calc-cultivo';
import { useCurrencyStore } from '@/store/currency';
import type { CalcCultivoInputs } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { TrendingUp, TrendingDown, RotateCcw, Ruler, Coins, PackageCheck } from 'lucide-react';

type Results = ReturnType<typeof calcularCultivo>;

function Field({ label, id, step = '1', reg }: { label: string; id: string; step?: string; reg: ReturnType<typeof useForm<CalcCultivoInputs>>['register'] }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs font-semibold text-[#5A3E2B]">{label}</Label>
      <Input id={id} type="number" step={step} min="0" {...reg(id as keyof CalcCultivoInputs, { valueAsNumber: true })} />
    </div>
  );
}

function ResultMetric({ label, value }: { label: string; value: string }) {
  return (
    <Card size="sm" className="text-center">
      <CardContent className="py-4">
        <p className="text-2xl font-bold text-[#4E652E]">{value}</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

export function CalcCultivo() {
  const { formatAmount, currency } = useCurrencyStore();
  const [results, setResults] = useState<Results | null>(null);
  const { register, handleSubmit, reset } = useForm<CalcCultivoInputs>({ defaultValues: {} });

  const onSubmit = (data: CalcCultivoInputs) => setResults(calcularCultivo(data));

  const fmtKg = (n: number) => Math.round(n * 1000).toLocaleString('es-CO') + ' kg';

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="icon-tile-3d h-9 w-9 rounded-xl"><Ruler size={17} /></span>
                Dimensiones del lote
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Field label="Ancho del lote (metros)" id="ancho" step="0.1" reg={register} />
              <Field label="Largo del lote (metros)" id="largo" step="0.1" reg={register} />
              <Field label="Distancia entre filas (metros)" id="distanciaFilas" step="0.1" reg={register} />
              <Field label="Distancia entre columnas (metros)" id="distanciaColumnas" step="0.1" reg={register} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="icon-tile-3d icon-tile-gold h-9 w-9 rounded-xl"><Coins size={17} /></span>
                Costos y precios
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Field label="Costo aserrín por kg (COP)" id="costoAserrin" reg={register} />
              <Field label="Costo salvado por kg (COP)" id="costoSalvado" reg={register} />
              <Field label="Costo yeso por kg (COP)" id="costoYeso" reg={register} />
              <Field label="Costo por bolsa (COP)" id="costoBolsa" reg={register} />
              <Field label="Costo micelio por kg (COP)" id="costoMicelio" reg={register} />
              <Field label="Precio venta orellana por kg (COP)" id="precioVentaOrellana" reg={register} />
              <Field label="Número de trabajadores" id="numeroTrabajadores" reg={register} />
              <Field label="Sueldo por trabajador (COP)" id="sueldoTrabajador" reg={register} />
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1">Calcular</Button>
          <Button type="button" variant="outline" onClick={() => { reset(); setResults(null); }} title="Reiniciar">
            <RotateCcw size={16} />
          </Button>
        </div>
      </form>

      {results && (
        <div className="space-y-4">
          <Separator />
          <h3 className="flex items-center gap-2 text-lg font-semibold text-[#302D28]">
            <span className="icon-tile-3d h-9 w-9 rounded-xl"><PackageCheck size={17} /></span>
            Resultados
          </h3>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ResultMetric label="Chorizos" value={results.numeroChorizos.toLocaleString('es-CO')} />
            <ResultMetric label="Bolsas totales" value={results.numeroBolsas.toLocaleString('es-CO')} />
            <ResultMetric label="Sustrato total" value={fmtKg(results.pesoTotalSustrato)} />
            <ResultMetric label="Producción estimada" value={fmtKg(results.pesoTotalOrellana)} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Materiales</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {[
                  ['Aserrín', results.pesoAserrin, results.costoTotalAserrin],
                  ['Salvado', results.pesoSalvado, results.costoTotalSalvado],
                  ['Yeso', results.pesoYeso, results.costoTotalYeso],
                  ['Micelio', results.pesoTotalMicelio, results.costoTotalMicelio],
                ].map(([name, kg, cost]) => (
                  <div key={name as string} className="surface-inset flex justify-between rounded-lg px-3 py-2">
                    <span className="text-muted-foreground">{name as string}</span>
                    <span className="font-semibold">{fmtKg(kg as number)} - {formatAmount(cost as number)} {currency}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Costos</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {[
                  ['Sustrato total', results.costoTotalSustrato],
                  ['Bolsas', results.costoTotalBolsas],
                  ['Micelio', results.costoTotalMicelio],
                  ['Mano de obra', results.costoTotalManoDeObra],
                ].map(([name, cost]) => (
                  <div key={name as string} className="surface-inset flex justify-between rounded-lg px-3 py-2">
                    <span className="text-muted-foreground">{name as string}</span>
                    <span className="font-semibold">{formatAmount(cost as number)} {currency}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between rounded-lg bg-[#F4E7C8] px-3 py-2 font-bold text-[#5A3E2B] shadow-[var(--shadow-soft-raised)]">
                  <span>Costo total</span>
                  <span>{formatAmount(results.costoTotal)} {currency}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className={results.gananciaNeta >= 0 ? 'border-[#A9C49A]' : 'border-[#E8766B]'}>
            <CardContent className="py-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Ingresos totales</p>
                  <p className="text-xl font-bold">{formatAmount(results.ingresosTotales)} {currency}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="icon-tile-3d">
                    {results.gananciaNeta >= 0 ? <TrendingUp className="text-[#4E652E]" size={24} /> : <TrendingDown className="text-red-600" size={24} />}
                  </span>
                  <div>
                    <p className="text-sm text-muted-foreground">Ganancia neta</p>
                    <p className={results.gananciaNeta >= 0 ? 'text-xl font-bold text-[#4E652E]' : 'text-xl font-bold text-red-600'}>
                      {formatAmount(results.gananciaNeta)} {currency}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Margen neto</p>
                  <p className={results.porcentajeNeto >= 0 ? 'text-xl font-bold text-[#4E652E]' : 'text-xl font-bold text-red-600'}>
                    {results.porcentajeNeto.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
