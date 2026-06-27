'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalcCultivo } from '@/components/calculadoras/CalcCultivo';
import { CalcSustrato } from '@/components/calculadoras/CalcSustrato';

export default function CalculadorasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Calculadoras</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Herramientas de cálculo técnico para tu cultivo de Orellana.
        </p>
      </div>

      <Tabs defaultValue="cultivo">
        <TabsList className="grid grid-cols-2 w-full max-w-sm">
          <TabsTrigger value="cultivo">📊 Cultivo</TabsTrigger>
          <TabsTrigger value="sustrato">🧪 Sustrato</TabsTrigger>
        </TabsList>

        <TabsContent value="cultivo" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Calculadora de Cultivo</CardTitle>
              <CardDescription>
                Dimensiones del lote, cantidad de bolsas, costos por sustrato/micelio/mano de obra y estimación de ganancia.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CalcCultivo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sustrato" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Calculadora de Sustrato</CardTitle>
              <CardDescription>
                Proporciones exactas de aserrín, viruta, salvado de maíz, cal, agua y melaza por número de bloques.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CalcSustrato />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
