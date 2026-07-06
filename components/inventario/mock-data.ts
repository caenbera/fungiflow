export const KPIS_INV = [
  { label: 'Materias primas',      value: '28,450 kg',       delta: '+12.5% vs ayer', up: true  },
  { label: 'Productos terminados', value: '8,650 uds',       delta: '+8.3% vs ayer',  up: true  },
  { label: 'Valor del inventario', value: '$152,430,000',    delta: '+9.7% vs ayer',  up: true  },
  { label: 'Entradas hoy',         value: '1,250 kg',        delta: '+15.2% vs ayer', up: true  },
  { label: 'Salidas hoy',          value: '980 kg',          delta: '-6.1% vs ayer',  up: false },
  { label: 'Alertas de stock',     value: '7 críticas',      delta: '+2 vs ayer',     up: false },
];

export const CATEGORIAS_INV = [
  { id: 'micelio',     label: 'Zona Micelio',           items: 12,  stock: '1,250 frascos', capacidad: 80,  estado: 'Óptimo',  from: '#2a8055', to: '#1a5030' },
  { id: 'materiaprima',label: 'Materias Primas',        items: 24,  stock: '28,450 kg',     capacidad: 65,  estado: 'Óptimo',  from: '#9a5020', to: '#6a3010' },
  { id: 'bolsas',      label: 'Bolsas e Insumos',       items: 15,  stock: '45,000 uds',    capacidad: 70,  estado: 'Óptimo',  from: '#1a5070', to: '#0e3050' },
  { id: 'empaques',    label: 'Empaques',               items: 18,  stock: '15,200 uds',    capacidad: 68,  estado: 'Óptimo',  from: '#5a2a7a', to: '#3a1a50' },
  { id: 'terminados',  label: 'Productos Terminados',   items: 30,  stock: '8,650 uds',     capacidad: 75,  estado: 'Óptimo',  from: '#1a6040', to: '#0e4028' },
  { id: 'equipos',     label: 'Equipos y Herramientas', items: 22,  stock: '320 uds',       capacidad: 60,  estado: 'Óptimo',  from: '#C59A18', to: '#8A6A08' },
  { id: 'ubicaciones', label: 'Ubicaciones',            items: 6,   stock: '1,850 m²',      capacidad: 72,  estado: 'Óptimo',  from: '#1a6878', to: '#0e4050' },
  { id: 'lotes',       label: 'Lotes y Trazabilidad',   items: 128, stock: '24 activos',    capacidad: 55,  estado: 'Atención',from: '#b06000', to: '#7a3a00' },
];

export const IA_RECOMENDACIONES = [
  { texto: 'Comprar 320 kg de aserrín.',                desc: 'Para mantener el nivel óptimo de producción.'      },
  { texto: 'El stock de bolsas alcanzará para 12 días.',desc: 'Considera planificar una nueva compra.'             },
  { texto: 'Existe exceso de salvado.',                 desc: 'Se recomienda reducir compras próximas.'            },
  { texto: 'Hay suficiente micelio para producir 520 nuevas bolsas.', desc: ''                                     },
  { texto: 'Optimizar el inventario del Galpón 2.',     desc: 'La ocupación está al 92%.'                         },
];

export const ALERTAS_INV = [
  { label: 'Productos críticos',   count: 3,  color: '#b83020' },
  { label: 'Próximos vencimientos',count: 4,  color: '#b06000' },
  { label: 'Movimientos recientes',count: 8,  color: '#1a5070' },
  { label: 'Pedidos pendientes',   count: 5,  color: '#5a2a7a' },
];

export type TipoMovimiento = 'Entrada' | 'Salida' | 'Transferencia' | 'Ajuste';

export const MOVIMIENTOS = [
  { fecha: '19/05/2024 09:15', tipo: 'Entrada'      as TipoMovimiento, producto: 'Aserrín',        cantidad: '1,200 kg',   origen: 'Proveedor: Maderas del Valle', usuario: 'Juan Pérez'    },
  { fecha: '19/05/2024 08:45', tipo: 'Salida'       as TipoMovimiento, producto: 'Bolsas 18x35',   cantidad: '2,000 uds',  origen: 'Producción - Lote PRD-1254',   usuario: 'María López'   },
  { fecha: '19/05/2024 07:30', tipo: 'Transferencia'as TipoMovimiento, producto: 'Micelio Oyster', cantidad: '500 frascos',origen: 'Bodega 1 → Bodega 2',          usuario: 'Carlos Gómez'  },
  { fecha: '18/05/2024 16:40', tipo: 'Ajuste'       as TipoMovimiento, producto: 'Salvado de trigo',cantidad: '150 kg',    origen: 'Ajuste de inventario',         usuario: 'Sistema'       },
];

export const PEDIDOS = [
  { proveedor: 'Insumos del Campo', producto: 'Aserrín',       cantidad: '500 kg',     entrega: '22/05/2024' },
  { proveedor: 'Empaques Andinos',  producto: 'Bolsas 18x35',  cantidad: '10,000 uds', entrega: '24/05/2024' },
  { proveedor: 'Biofungi Labs',     producto: 'Micelio Oyster',cantidad: '1,000 frascos',entrega: '25/05/2024'},
];

export const PRODUCTOS_TABLA = [
  { codigo: 'MP-001', nombre: 'Aserrín',          categoria: 'Materia prima',      ubicacion: 'Bodega 1 - Pasillo A - Estante 1', stock: 5200,  minimo: 1000, unidad: 'kg',       movimiento: '19/05/2024 09:15', estado: 'Óptimo'   },
  { codigo: 'MP-002', nombre: 'Salvado de trigo', categoria: 'Materia prima',      ubicacion: 'Bodega 1 - Pasillo B - Estante 2', stock: 3450,  minimo: 1500, unidad: 'kg',       movimiento: '19/05/2024 08:45', estado: 'Óptimo'   },
  { codigo: 'IN-001', nombre: 'Bolsas 18x35',     categoria: 'Insumo',             ubicacion: 'Bodega 2 - Pasillo A - Estante 1', stock: 15000, minimo: 5000, unidad: 'unidades', movimiento: '19/05/2024 10:30', estado: 'Óptimo'   },
  { codigo: 'IN-002', nombre: 'Ostra fresca',     categoria: 'Producto terminado', ubicacion: 'Cámara fría 1 - Estante 3',        stock: 2450,  minimo: 500,  unidad: 'kg',       movimiento: '19/05/2024 11:20', estado: 'Óptimo'   },
  { codigo: 'EQ-001', nombre: 'Balanza digital',  categoria: 'Equipo',             ubicacion: 'Área de equipos - Estante 1',      stock: 12,    minimo: 2,    unidad: 'unidades', movimiento: '18/05/2024 16:40', estado: 'Exceso'   },
  { codigo: 'MP-003', nombre: 'Cal agrícola',     categoria: 'Materia prima',      ubicacion: 'Bodega 1 - Pasillo C - Estante 1', stock: 280,   minimo: 300,  unidad: 'kg',       movimiento: '17/05/2024 14:20', estado: 'Bajo'     },
  { codigo: 'IN-003', nombre: 'Filtros poliprop.', categoria: 'Insumo',            ubicacion: 'Bodega 2 - Pasillo B - Estante 3', stock: 4200,  minimo: 2000, unidad: 'unidades', movimiento: '16/05/2024 09:00', estado: 'Óptimo'   },
];

export const CATEGORIAS_SELECT = ['Materia prima','Insumo','Producto terminado','Equipo','Empaque'];
export const UNIDADES_SELECT   = ['kg','gramos','litros','unidades','frascos','bolsas','metros'];
export const BODEGAS_SELECT    = ['Bodega 1','Bodega 2','Cámara fría 1','Área de equipos','Laboratorio'];
export const PRODUCTOS_SELECT  = PRODUCTOS_TABLA.map(p => p.nombre);
export const MOTIVOS_AJUSTE    = ['Conteo físico','Merma','Vencimiento','Error de registro','Donación'];
