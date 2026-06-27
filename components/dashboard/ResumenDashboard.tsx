'use client';

import { useCurrencyStore } from '@/store/currency';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Package, Hammer, Wheat, Users, Zap, ShoppingBag } from 'lucide-react';
import type { CategoriaCotizacion } from '@/types';

interface CotResumen {
  categoria: CategoriaCotizacion;
  nombre: string;
  total: number;
}

interface Props {
  cotizaciones: CotResumen[];
  proyectoNombre?: string;
}

const CAT_META: Record<CategoriaCotizacion, { label: string; icon: React.ElementType; color: string }> = {
  construccion: { label: 'Construcción', icon: Hammer, color: '#f97316' },
  equipos: { label: 'Equipos', icon: Package, color: '#3b82f6' },
  materiaprima: { label: 'Materia Prima', icon: Wheat, color: '#eab308' },
  consumibles: { label: 'Consumibles', icon: ShoppingBag, color: '#a855f7' },
  manodeobra: { label: 'Mano de Obra', icon: Users, color: '#22c55e' },
  servicios: { label: 'Servicios', icon: Zap, color: '#06b6d4' },
};

export function ResumenDashboard({ cotizaciones, proyectoNombre }: Props) {
  const { formatAmount, currency } = useCurrencyStore();

  const totalInversion = cotizaciones.reduce((acc, c) => acc + c.total, 0);

  const byCategory = cotizaciones.reduce<Record<string, number>>((acc, c) => {
    acc[c.categoria] = (acc[c.categoria] || 0) + c.total;
    return acc;
  }, {});

  const pieData = Object.entries(byCategory).map(([cat, total]) => ({
    name: CAT_META[cat as CategoriaCotizacion].label,
    value: total,
    color: CAT_META[cat as CategoriaCotizacion].color,
  }));

  return (
    <div className="space-y-6">
      {proyectoNombre && (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://i.postimg.cc/DzDbvHmK/logo-original.png" alt="FungiFlow" className="w-10 h-10 object-contain" />
          <div>
            <h2 className="text-xl font-bold">{proyectoNombre}</h2>
            <p className="text-sm text-muted-foreground">Resumen financiero del proyecto</p>
          </div>
        </div>
      )}

      {/* KPI Principal */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-700 rounded-xl">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inversión total del proyecto</p>
              <p className="text-3xl font-bold text-green-700">{formatAmount(totalInversion)} {currency}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{cotizaciones.length} cotizaciones registradas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tarjetas por categoría */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.entries(byCategory).map(([cat, total]) => {
          const meta = CAT_META[cat as CategoriaCotizacion];
          const Icon = meta.icon;
          const pct = totalInversion > 0 ? (total / totalInversion) * 100 : 0;
          return (
            <Card key={cat}>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: meta.color + '20' }}>
                      <Icon size={16} style={{ color: meta.color }} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{meta.label}</p>
                      <p className="font-bold text-sm">{formatAmount(total)} {currency}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{pct.toFixed(1)}%</span>
                </div>
                <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: meta.color }} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gráfico */}
      {pieData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Distribución de inversión</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatAmount(Number(value)) + ' ' + currency, '']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {cotizaciones.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-medium">Sin cotizaciones aún</p>
          <p className="text-sm mt-1">Ve a la sección <strong>Cotizaciones</strong> para agregar ítems al proyecto.</p>
        </div>
      )}
    </div>
  );
}
