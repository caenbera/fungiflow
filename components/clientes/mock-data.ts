export type Segmento = 'VIP' | 'Regular' | 'Ocasional' | 'Nuevo' | 'En riesgo';
export type EstadoCliente = 'Activo' | 'Inactivo' | 'En riesgo';

export interface Cliente {
  id: string;
  nombre: string;
  empresa: string;
  segmento: Segmento;
  estado: EstadoCliente;
  ubicacion: string;
  ventas: number;
  ultimaCompra: string;
  frecuencia: number;
  ticket: number;
  telefono: string;
  email: string;
}

export const KPIS_CLI = [
  { label: 'Clientes totales',   value: '248',     change: '+12',  up: true,  spark: [180,190,198,205,215,220,230,236,242,248], from: '#5a2a7a', to: '#3a1a50' },
  { label: 'Clientes activos',   value: '186',      change: '+8',   up: true,  spark: [150,155,160,162,168,172,178,180,183,186], from: '#1a5070', to: '#0e3050' },
  { label: 'Ventas del mes',     value: '$152M',    change: '+18%', up: true,  spark: [80,95,88,102,115,108,124,130,142,152],   from: '#2a8055', to: '#1a5030' },
  { label: 'Ticket promedio',    value: '$243K',    change: '-3%',  up: false, spark: [260,258,255,252,248,250,246,244,241,243], from: '#b06000', to: '#7a3a00' },
  { label: 'Tasa de retención',  value: '87.6%',    change: '+1.2%',up: true,  spark: [82,83,84,84,85,85,86,86,87,87.6],       from: '#C59A18', to: '#8A6A08' },
  { label: 'Clientes en riesgo', value: '12',       change: '-4',   up: true,  spark: [20,19,18,17,16,17,15,14,13,12],         from: '#b83020', to: '#7a1a10' },
];

export const SEGMENTOS_DONUT = [
  { name: 'VIP',       value: 32,  color: '#7c3aed' },
  { name: 'Regular',   value: 98,  color: '#2563eb' },
  { name: 'Ocasional', value: 74,  color: '#0891b2' },
  { name: 'Nuevo',     value: 32,  color: '#16a34a' },
  { name: 'En riesgo', value: 12,  color: '#dc2626' },
];

export const TOP_CLIENTES = [
  { nombre: 'Restaurante La Foresta',  ventas: 28_400_000, segmento: 'VIP'      as Segmento, cambio: +12 },
  { nombre: 'Hotel Castellana',         ventas: 21_800_000, segmento: 'VIP'      as Segmento, cambio: +8  },
  { nombre: 'Bistró Natura',            ventas: 18_200_000, segmento: 'VIP'      as Segmento, cambio: -3  },
  { nombre: 'Mercado Gourmet',          ventas: 14_600_000, segmento: 'Regular'  as Segmento, cambio: +5  },
  { nombre: 'Catering El Prado',        ventas: 11_900_000, segmento: 'Regular'  as Segmento, cambio: -1  },
];

export const CLIENTES_TABLA: Cliente[] = [
  { id: 'CLI-001', nombre: 'Ana Martínez',     empresa: 'Restaurante La Foresta', segmento: 'VIP',      estado: 'Activo',   ubicacion: 'Bogotá',   ventas: 28_400_000, ultimaCompra: 'Hace 2 días',  frecuencia: 12, ticket: 2_366_667, telefono: '+57 310 234 5678', email: 'ana@laforesta.co'    },
  { id: 'CLI-002', nombre: 'Carlos Jiménez',   empresa: 'Hotel Castellana',       segmento: 'VIP',      estado: 'Activo',   ubicacion: 'Medellín', ventas: 21_800_000, ultimaCompra: 'Hace 5 días',  frecuencia: 10, ticket: 2_180_000, telefono: '+57 315 876 5432', email: 'carlos@castellana.co'},
  { id: 'CLI-003', nombre: 'Laura Gómez',      empresa: 'Bistró Natura',          segmento: 'VIP',      estado: 'Activo',   ubicacion: 'Cali',     ventas: 18_200_000, ultimaCompra: 'Hace 1 semana',frecuencia: 9,  ticket: 2_022_222, telefono: '+57 316 543 2109', email: 'laura@bistronatura.co'},
  { id: 'CLI-004', nombre: 'Pedro Rodríguez',  empresa: 'Mercado Gourmet',        segmento: 'Regular',  estado: 'Activo',   ubicacion: 'Bogotá',   ventas: 14_600_000, ultimaCompra: 'Hace 3 días',  frecuencia: 7,  ticket: 2_085_714, telefono: '+57 312 321 0987', email: 'pedro@mercadogourmet.co'},
  { id: 'CLI-005', nombre: 'Sofía Vargas',     empresa: 'Catering El Prado',      segmento: 'Regular',  estado: 'Activo',   ubicacion: 'Barranquilla', ventas: 11_900_000, ultimaCompra: 'Hace 4 días', frecuencia: 6, ticket: 1_983_333, telefono: '+57 318 012 3456', email: 'sofia@elprado.co'},
  { id: 'CLI-006', nombre: 'Miguel Torres',    empresa: 'Tienda Orgánica Verde',  segmento: 'Regular',  estado: 'Activo',   ubicacion: 'Bogotá',   ventas: 9_400_000,  ultimaCompra: 'Hace 1 semana',frecuencia: 5,  ticket: 1_880_000, telefono: '+57 311 234 5670', email: 'miguel@tiendaverde.co'},
  { id: 'CLI-007', nombre: 'Isabella Mora',    empresa: 'Deli Premium',           segmento: 'Ocasional',estado: 'Activo',   ubicacion: 'Medellín', ventas: 6_200_000,  ultimaCompra: 'Hace 2 semanas',frecuencia: 3, ticket: 2_066_667, telefono: '+57 317 890 1234', email: 'isabella@delipremium.co'},
  { id: 'CLI-008', nombre: 'Andrés Castro',    empresa: 'Setas y Sabor',          segmento: 'Nuevo',    estado: 'Activo',   ubicacion: 'Cali',     ventas: 1_800_000,  ultimaCompra: 'Hace 3 días',  frecuencia: 2,  ticket: 900_000,   telefono: '+57 314 567 8901', email: 'andres@setasysabor.co'},
  { id: 'CLI-009', nombre: 'Valentina Ruiz',   empresa: 'Chef en Casa',           segmento: 'En riesgo',estado: 'En riesgo',ubicacion: 'Bogotá',   ventas: 3_100_000,  ultimaCompra: 'Hace 45 días', frecuencia: 1,  ticket: 3_100_000, telefono: '+57 313 456 7890', email: 'valentina@chefencasa.co'},
  { id: 'CLI-010', nombre: 'Diego Herrera',    empresa: 'Cocina Fusión',          segmento: 'Ocasional',estado: 'Inactivo', ubicacion: 'Manizales',ventas: 4_500_000,  ultimaCompra: 'Hace 60 días', frecuencia: 2,  ticket: 2_250_000, telefono: '+57 319 678 9012', email: 'diego@cocinafusion.co'},
  { id: 'CLI-011', nombre: 'Camila Ospina',    empresa: 'Mesa & Campo',           segmento: 'Regular',  estado: 'Activo',   ubicacion: 'Bogotá',   ventas: 7_800_000,  ultimaCompra: 'Hace 6 días',  frecuencia: 5,  ticket: 1_560_000, telefono: '+57 320 789 0123', email: 'camila@mesaycampo.co'},
  { id: 'CLI-012', nombre: 'Julián Peñaloza',  empresa: 'Hongo Feliz',            segmento: 'Nuevo',    estado: 'Activo',   ubicacion: 'Bucaramanga',ventas: 950_000, ultimaCompra: 'Hace 1 semana',frecuencia: 1,  ticket: 950_000,   telefono: '+57 321 890 1234', email: 'julian@hongofeliz.co'},
];

export const VENTAS_POR_CLIENTE = [
  { nombre: 'La Foresta',  ventas: 28.4 },
  { nombre: 'Castellana',  ventas: 21.8 },
  { nombre: 'Bistró N.',   ventas: 18.2 },
  { nombre: 'M. Gourmet',  ventas: 14.6 },
  { nombre: 'El Prado',    ventas: 11.9 },
  { nombre: 'T. Orgánica', ventas: 9.4  },
  { nombre: 'Deli P.',     ventas: 6.2  },
  { nombre: 'Mesa & C.',   ventas: 7.8  },
];

export const NUEVOS_CLIENTES = [
  { mes: 'Ene', nuevos: 8  },
  { mes: 'Feb', nuevos: 12 },
  { mes: 'Mar', nuevos: 10 },
  { mes: 'Abr', nuevos: 15 },
  { mes: 'May', nuevos: 9  },
  { mes: 'Jun', nuevos: 18 },
  { mes: 'Jul', nuevos: 14 },
];

export const COMPORTAMIENTO = [
  { label: 'Compra recurrente',  pct: 68, color: '#7c3aed' },
  { label: 'Compra estacional',  pct: 22, color: '#2563eb' },
  { label: 'Compra única',       pct: 10, color: '#94a3b8' },
];

export const ANTIGUEDAD_DONUT = [
  { name: '< 3 meses',   value: 32, color: '#16a34a' },
  { name: '3–12 meses',  value: 58, color: '#2563eb' },
  { name: '1–3 años',    value: 104, color: '#7c3aed' },
  { name: '> 3 años',    value: 54, color: '#C59A18' },
];

export const SEGMENTOS_SELECT = ['VIP', 'Regular', 'Ocasional', 'Nuevo', 'En riesgo'];
export const ESTADOS_SELECT   = ['Activo', 'Inactivo', 'En riesgo'];
export const UBICACIONES_SELECT = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 'Manizales'];
