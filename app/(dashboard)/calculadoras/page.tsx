'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalcCultivo } from '@/components/calculadoras/CalcCultivo';
import { CalcSustrato } from '@/components/calculadoras/CalcSustrato';
import { BarChart3, FlaskConical } from 'lucide-react';

export default function CalculadorasPage() {
  return (
    <div className="space-y-7">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6D3D]">Herramientas técnicas</p>
        <h1 className="mt-1 text-2xl font-bold text-[#302D28] md:text-3xl">Calculadoras</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Calcula producción, sustrato, costos y estimaciones para tu cultivo de Orellana.
        </p>
        <div className="accent-rule mt-4" />
      </header>

      <Tabs defaultValue="cultivo">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="cultivo"><BarChart3 size={16} /> Cultivo</TabsTrigger>
          <TabsTrigger value="sustrato"><FlaskConical size={16} /> Sustrato</TabsTrigger>
        </TabsList>

        <TabsContent value="cultivo" className="mt-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Calculadora de cultivo</CardTitle>
              <CardDescription>
                Dimensiones del lote, cantidad de bolsas, costos por sustrato, micelio, mano de obra y estimación de ganancia.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CalcCultivo />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sustrato" className="mt-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Calculadora de sustrato</CardTitle>
              <CardDescription>
                Proporciones de aserrín, viruta, salvado de maíz, cal, agua y melaza por número de bloques.
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
