'use client';

import { useState } from 'react';
import { CotizacionForm, CATEGORIAS } from '@/components/cotizaciones/CotizacionForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CategoriaCotizacion } from '@/types';
import { toast } from 'sonner';

export default function CotizacionesPage() {
  const [activeTab, setActiveTab] = useState<CategoriaCotizacion>('construccion');

  const handleSave = (nombre: string, items: unknown[], notas: string) => {
    // TODO: guardar en Firestore cuando el proyecto Firebase esté configurado
    toast.success(`Cotización "${nombre || activeTab}" guardada (${items.length} ítems)`);
  };

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
          {CATEGORIAS.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value} className="flex items-center gap-1.5 text-xs">
              <span>{cat.icon}</span>
              <span className="hidden sm:inline">{cat.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIAS.map((cat) => (
          <TabsContent key={cat.value} value={cat.value} className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <span>{cat.icon}</span> {cat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CotizacionForm categoria={cat.value} onSave={handleSave} />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
