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
import { TrendingUp, TrendingDown, RotateCcw } from 'lucide-react';

type Results = ReturnType<typeof calcularCultivo>;

function Field({ label, id, step = '1', reg }: { label: string; id: string; step?: string; reg: ReturnType<typeof useForm<CalcCultivoInputs>>['register'] }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs">{label}</Label>
      <Input id={id} type="number" step={step} min="0" {...reg(id as keyof CalcCultivoInputs, { valueAsNumber: true })} className="h-9" />
    </div>
  );
}

export function CalcCultivo() {
  const { formatAmount, currency } = useCurrencyStore();
  const [results, setResults] = useState<Results | null>(null);
  const { register, handleSubmit, reset } = useForm<CalcCultivoInputs>({ defaultValues: {} });

  const onSubmit = (data: CalcCultivoInputs) => setResults(calcularCultivo(data));

  const fmtKg = (n: number) => `${Math.round(n * 1000).toLocaleString('es-CO')} kg`;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Dimensiones del Lote</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Field label="Ancho del lote (metros)" id="ancho" step="0.1" reg={register} />
              <Field label="Largo del lote (metros)" id="largo" step="0.1" reg={register} />
              <Field label="Distancia entre filas (metros)" id="distanciaFilas" step="0.1" reg={register} />
              <Field label="Distancia entre columnas (metros)" id="distanciaColumnas" step="0.1" reg={register} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                Costos y Precios
                <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded">se ingresan en COP</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Field label="Costo aserrín por kg (COP)" id="costoAserrin" reg={register} />
              <Field label="Costo salvado por kg (COP)" id="costoSalvado" reg={register} />
              <Field label="Costo yeso por kg (COP)" id="costoYeso" reg={register} />
              <Field label="Costo por bolsa (COP)" id="costoBolsa" reg={register} />
              <Field label="Costo micelio por kg (COP)" id="costoMicelio" reg={register} />
              <Field label="Precio venta orellana por kg (COP)" id="precioVentaOrellana" reg={register} />
              <Field label="N° de trabajadores" id="numeroTrabajadores" reg={register} />
              <Field label="Sueldo por trabajador (COP)" id="sueldoTrabajador" reg={register} />
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="bg-green-700 hover:bg-green-800 flex-1">Calcular</Button>
          <Button type="button" variant="outline" onClick={() => { reset(); setResults(null); }}>
            <RotateCcw size={16} />
          </Button>
        </div>
      </form>

      {results && (
        <div className="space-y-4">
          <Separator />
          <h3 className="font-semibold text-lg">Resultados</h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Chorizos', value: results.numeroChorizos.toLocaleString('es-CO') },
              { label: 'Bolsas totales', value: results.numeroBolsas.toLocaleString('es-CO') },
              { label: 'Sustrato total', value: fmtKg(results.pesoTotalSustrato) },
              { label: 'Producción estimada', value: fmtKg(results.pesoTotalOrellana) },
            ].map((item) => (
              <Card key={item.label} className="text-center">
                <CardContent className="pt-4 pb-3">
                  <p className="text-2xl font-bold text-green-700">{item.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Materiales</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {[
                  ['Aserrín', results.pesoAserrin, results.costoTotalAserrin],
                  ['Salvado', results.pesoSalvado, results.costoTotalSalvado],
                  ['Yeso', results.pesoYeso, results.costoTotalYeso],
                  ['Micelio', results.pesoTotalMicelio, results.costoTotalMicelio],
                ].map(([name, kg, cost]) => (
                  <div key={name as string} className="flex justify-between">
                    <span className="text-muted-foreground">{name as string}</span>
                    <span className="font-medium">{fmtKg(kg as number)} — {formatAmount(cost as number)} {currency}</span>
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
                  <div key={name as string} className="flex justify-between">
                    <span className="text-muted-foreground">{name as string}</span>
                    <span className="font-medium">{formatAmount(cost as number)} {currency}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Costo total</span>
                  <span>{formatAmount(results.costoTotal)} {currency}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className={results.gananciaNeta >= 0 ? 'border-green-400 bg-green-50 dark:bg-green-950/20' : 'border-red-400 bg-red-50 dark:bg-red-950/20'}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Ingresos totales</p>
                  <p className="text-xl font-bold">{formatAmount(results.ingresosTotales)} {currency}</p>
                </div>
                <div className="flex items-center gap-2">
                  {results.gananciaNeta >= 0
                    ? <TrendingUp className="text-green-600" size={28} />
                    : <TrendingDown className="text-red-500" size={28} />}
                  <div>
                    <p className="text-sm text-muted-foreground">Ganancia neta</p>
                    <p className={`text-xl font-bold ${results.gananciaNeta >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                      {formatAmount(results.gananciaNeta)} {currency}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Margen neto</p>
                  <p className={`text-xl font-bold ${results.porcentajeNeto >= 0 ? 'text-green-700' : 'text-red-600'}`}>
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
