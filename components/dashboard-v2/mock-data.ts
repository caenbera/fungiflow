export const CULTIVO = {
  nombre: 'Cultivo Orellana',
  fase: 'Fase 1 - Producción',
  descripcion: 'Hoy tienes 5 cosechas programadas y una producción estimada de 182 kg.',
};

export const CONDICIONES = [
  { label: 'Temperatura', value: '19.6°C', icon: '🌡️', estado: 'ok' },
  { label: 'Humedad',     value: '88 %',   icon: '💧', estado: 'ok' },
  { label: 'CO₂',        value: '850 ppm', icon: '☁️', estado: 'ok' },
  { label: 'Luz',        value: '320 lux', icon: '☀️', estado: 'ok' },
  { label: 'Lluvia',     value: '0 %',     icon: '🌧️', estado: 'ok' },
];

export const KPIS = [
  { label: 'Producción estimada hoy', value: '215 kg',      delta: '+12.5% vs ayer',     up: true },
  { label: 'Bolsas activas',          value: '18,750',      delta: '+8.3% vs ayer',      up: true },
  { label: 'Bolsas en incubación',    value: '12,340',      delta: '+6.7% vs ayer',      up: true },
  { label: 'Cosechas programadas',    value: '5',           delta: 'Entre hoy y 5 días', up: null },
  { label: 'Inventario disponible',   value: '2,850 kg',    delta: 'Suficiente',         up: null },
  { label: 'Ventas del mes',          value: '$28,450,000', delta: '+15.7% vs mes ant.', up: true },
];

export const GALPON_DATA = [
  { name: 'Galpón 1', kg: 420 },
  { name: 'Galpón 2', kg: 360 },
  { name: 'Galpón 3', kg: 280 },
  { name: 'Galpón 4', kg: 190 },
];

export const COSECHAS = [
  { lote: 'FRU-2025-124', kg: 120, dias: 2, pct: 95, img: '/carousel/03.png' },
  { lote: 'FRU-2025-125', kg: 95,  dias: 3, pct: 88, img: '/carousel/05.png' },
  { lote: 'FRU-2025-126', kg: 85,  dias: 4, pct: 75, img: '/carousel/07.png' },
];

export const ALERTAS_IA = [
  { tipo: 'warning', titulo: 'Humedad alta en Galpón 2',    desc: 'La humedad aumentó 8% en las últimas 6 horas.',         tiempo: 'Hace 15 min' },
  { tipo: 'success', titulo: 'Cosecha recomendada',          desc: 'El lote FRU-2025-014 estará en su punto ideal mañana.',  tiempo: 'Hace 45 min' },
  { tipo: 'info',    titulo: 'Crecimiento superior',         desc: 'El lote INC-2025-014 presenta un crecimiento del 18% sobre el promedio.', tiempo: 'Hace 1 hora' },
  { tipo: 'warning', titulo: 'Inventario de micelio',        desc: 'Hay suficiente inventario para preparar 480 nuevas bolsas.', tiempo: 'Hace 2 horas' },
];

export const CICLO = [
  { label: 'Micelio',    pct: 100, done: true },
  { label: 'Sustrato',   pct: 80,  done: false },
  { label: 'Incubación', pct: 60,  done: false },
  { label: 'Producción', pct: 40,  done: false },
  { label: 'Empaque',    pct: 20,  done: false },
  { label: 'Despacho',   pct: 10,  done: false },
];

export const AGENDA = [
  { hora: '08:00', tarea: 'Preparar sustrato',              lugar: 'Galpón 1' },
  { hora: '09:30', tarea: 'Inocular lote INC-2025-056',     lugar: 'Laboratorio' },
  { hora: '11:00', tarea: 'Revisar incubación',             lugar: 'Incubación' },
  { hora: '14:00', tarea: 'Empaque de lote FRU-2025-124',   lugar: 'Empaque' },
  { hora: '16:00', tarea: 'Despacho programado',            lugar: 'Bodega' },
];

export const ACTIVIDADES = [
  { icon: '🍄', texto: 'Cosecha registrada — Lote FRU-2025-124 · 85 kg',          tiempo: 'Hace 30 min' },
  { icon: '🧪', texto: 'Nuevo lote de incubación — INC-2025-056 · 2,000 bolsas',  tiempo: 'Hace 1 hora' },
  { icon: '📦', texto: 'Entrada de materia prima — Viruta de roble · 500 kg',      tiempo: 'Hace 3 horas' },
  { icon: '💰', texto: 'Venta realizada — Factura #FV-2025-458',                   tiempo: 'Hace 3 horas' },
  { icon: '✅', texto: 'Análisis de calidad aprobado — Lote CAL-2025-089',         tiempo: 'Hace 5 horas' },
];

export const ACCIONES = [
  { label: 'Nuevo lote',             icon: '🧫', color: '#1a6040' },
  { label: 'Registrar cosecha',      icon: '🍄', color: '#7a4010' },
  { label: 'Registrar contaminación',icon: '⚠️', color: '#b05000' },
  { label: 'Crear cotización',       icon: '📋', color: '#1a4060' },
  { label: 'Comprar materia prima',  icon: '🛒', color: '#4a1a6a' },
  { label: 'Ver reportes',           icon: '📊', color: '#1a5a4a' },
  { label: 'Abrir asistente IA',     icon: '✨', color: '#2a4a7a' },
];
