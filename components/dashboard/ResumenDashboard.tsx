'use client';

import type { ElementType } from 'react';
import { useCurrencyStore } from '@/store/currency';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Package, Hammer, Wheat, Users, Zap, ShoppingBag, Layers3, ChartPie } from 'lucide-react';
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

const CAT_META: Record<CategoriaCotizacion, { label: string; icon: ElementType; color: string; soft: string }> = {
  construccion: { label: 'Construcción', icon: Hammer, color: '#B86A4E', soft: '#F2DED3' },
  equipos: { label: 'Equipos', icon: Package, color: '#5A3E2B', soft: '#E8D8C8' },
  materiaprima: { label: 'Materia prima', icon: Wheat, color: '#C59D5F', soft: '#F4E7C8' },
  consumibles: { label: 'Consumibles', icon: ShoppingBag, color: '#788D42', soft: '#E5EDD7' },
  manodeobra: { label: 'Mano de obra', icon: Users, color: '#A9C49A', soft: '#EEF5E8' },
  servicios: { label: 'Servicios', icon: Zap, color: '#8B6A4A', soft: '#EADCCC' },
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
          <span className="icon-tile-3d icon-tile-gold">
            <Layers3 size={22} />
          </span>
          <div>
            <h2 className="text-xl font-bold text-[#302D28]">{proyectoNombre}</h2>
            <p className="text-sm text-muted-foreground">Resumen financiero del proyecto</p>
          </div>
        </div>
      )}

      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute right-[-5rem] top-[-6rem] h-48 w-48 rounded-full bg-[#C59D5F]/18 blur-3xl" />
        <CardContent className="relative py-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <span className="icon-tile-3d icon-tile-gold h-14 w-14 rounded-2xl">
                <TrendingUp size={28} />
              </span>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Inversión total del proyecto</p>
                <p className="mt-1 text-3xl font-bold text-[#4E652E] md:text-4xl">
                  {formatAmount(totalInversion)} {currency}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{cotizaciones.length} cotizaciones registradas</p>
              </div>
            </div>
            <div className="surface-inset rounded-xl px-4 py-3 text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categorías activas</p>
              <p className="text-2xl font-bold text-[#5A3E2B]">{pieData.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(byCategory).map(([cat, total]) => {
          const meta = CAT_META[cat as CategoriaCotizacion];
          const Icon = meta.icon;
          const pct = totalInversion > 0 ? (total / totalInversion) * 100 : 0;
          return (
            <Card key={cat} size="sm">
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="icon-tile-3d" style={{ color: meta.color, background: 'linear-gradient(145deg, #FFF9EF 0%, ' + meta.soft + ' 100%)' }}>
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{meta.label}</p>
                      <p className="mt-1 font-bold text-[#302D28]">{formatAmount(total)} {currency}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#FFF9F1]/80 px-2 py-1 text-xs font-bold text-[#6A4A2F] shadow-[var(--shadow-soft-raised)]">
                    {pct.toFixed(1)}%
                  </span>
                </div>
                <div className="surface-inset mt-4 h-2 overflow-hidden rounded-full">
                  <div className="h-full rounded-full" style={{ width: pct + '%', background: 'linear-gradient(90deg, ' + meta.color + ', #C59D5F)' }} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {pieData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <span className="icon-tile-3d h-9 w-9 rounded-xl"><ChartPie size={18} /></span>
              <CardTitle className="text-base">Distribución de inversión</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={72} outerRadius={112} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="#FFF9EF" strokeWidth={3} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatAmount(Number(value)) + ' ' + currency, '']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
