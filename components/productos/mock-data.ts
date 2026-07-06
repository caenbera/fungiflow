export type CategoriaProducto = 'Hongos frescos' | 'Productos procesados' | 'Insumos y kits' | 'Equipos y herramientas' | 'Empaques y etiquetas' | 'Otros';
export type EstadoProducto = 'Activo' | 'Inactivo' | 'Borrador';
export type DisponibilidadProducto = 'Stock óptimo' | 'Stock bajo' | 'Crítico' | 'Agotado';

export interface Producto {
  id: string;
  sku: string;
  nombre: string;
  nombreCientifico: string;
  categoria: CategoriaProducto;
  presentacion: string;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  disponibilidad: DisponibilidadProducto;
  estado: EstadoProducto;
  imagen: string;
}

export const KPIS_PROD = [
  { label: 'Productos totales',      value: '128',          change: '+8.4%', up: true,  spark: [100,104,108,110,114,116,120,122,125,128], from: '#2a8055', to: '#1a5030' },
  { label: 'Productos activos',      value: '112',          change: '+6.7%', up: true,  spark: [88,91,94,96,99,101,104,106,109,112],     from: '#1a5070', to: '#0e3050' },
  { label: 'SKU únicos',             value: '146',          change: '+9.3%', up: true,  spark: [112,116,120,124,128,132,136,140,143,146], from: '#5a2a7a', to: '#3a1a50' },
  { label: 'Valor del inventario',   value: '$152.4M',      change: '+12.8%',up: true,  spark: [100,108,112,118,122,128,132,138,145,152], from: '#C59A18', to: '#8A6A08' },
  { label: 'Unidades en stock',      value: '278,450',      change: '+5.6%', up: true,  spark: [240,246,252,256,260,264,268,272,275,278], from: '#b06000', to: '#7a3a00' },
  { label: 'Productos stock bajo',   value: '18',           change: '-2',    up: true,  spark: [26,24,23,22,22,21,20,20,19,18],          from: '#b83020', to: '#7a1a10' },
];

export const PRODUCTOS_TABLA: Producto[] = [
  { id:'P01', sku:'HGF-001', nombre:'Ostra fresca',          nombreCientifico:'Pleurotus ostreatus',  categoria:'Hongos frescos',       presentacion:'Bandeja 250 g', precioVenta:8500,   stock:1250, stockMinimo:200, disponibilidad:'Stock óptimo', estado:'Activo', imagen:'/productos/ostra.png'       },
  { id:'P02', sku:'HGF-002', nombre:'Portobello fresco',     nombreCientifico:'Agaricus bisporus',    categoria:'Hongos frescos',       presentacion:'Bandeja 250 g', precioVenta:9200,   stock:980,  stockMinimo:300, disponibilidad:'Stock bajo',   estado:'Activo', imagen:'/productos/portobello.png'  },
  { id:'P03', sku:'HGF-003', nombre:'Shiitake fresco',       nombreCientifico:'Lentinula edodes',     categoria:'Hongos frescos',       presentacion:'Bandeja 200 g', precioVenta:10500,  stock:760,  stockMinimo:150, disponibilidad:'Stock óptimo', estado:'Activo', imagen:'/productos/shiitake.png'    },
  { id:'P04', sku:'PRC-001', nombre:'Pesto de ostra',        nombreCientifico:'Gourmet',              categoria:'Productos procesados', presentacion:'Frasco 200 g',  precioVenta:18900,  stock:450,  stockMinimo:80,  disponibilidad:'Stock óptimo', estado:'Activo', imagen:'/productos/pesto.png'       },
  { id:'P05', sku:'PRC-002', nombre:'Conserva de hongos',    nombreCientifico:'Mix gourmet',          categoria:'Productos procesados', presentacion:'Frasco 280 g',  precioVenta:16500,  stock:320,  stockMinimo:100, disponibilidad:'Stock bajo',   estado:'Activo', imagen:'/productos/conserva.png'    },
  { id:'P06', sku:'PRC-003', nombre:'Snack de hongos',       nombreCientifico:'Deshidratados',        categoria:'Productos procesados', presentacion:'Bolsa 30 g',    precioVenta:6900,   stock:180,  stockMinimo:200, disponibilidad:'Stock bajo',   estado:'Activo', imagen:'/productos/snack.png'       },
  { id:'P07', sku:'PRC-004', nombre:'Hongos deshidratados',  nombreCientifico:'Mix gourmet',          categoria:'Productos procesados', presentacion:'Bolsa 50 g',    precioVenta:12300,  stock:260,  stockMinimo:100, disponibilidad:'Stock óptimo', estado:'Activo', imagen:'/productos/deshidratado.png'},
  { id:'P08', sku:'INS-001', nombre:'Kit de cultivo (Ostra)',nombreCientifico:'Incluye todo lo necesario',categoria:'Insumos y kits', presentacion:'Caja kit',      precioVenta:24900,  stock:310,  stockMinimo:50,  disponibilidad:'Stock óptimo', estado:'Activo', imagen:'/productos/kit.png'         },
  { id:'P09', sku:'HGF-004', nombre:'Champiñón blanco',      nombreCientifico:'Agaricus bisporus',    categoria:'Hongos frescos',       presentacion:'Bandeja 300 g', precioVenta:7800,   stock:95,   stockMinimo:120, disponibilidad:'Crítico',      estado:'Activo', imagen:'/productos/champinon.png'   },
  { id:'P10', sku:'EQP-001', nombre:'Termómetro digital',    nombreCientifico:'Uso cultivo',          categoria:'Equipos y herramientas',presentacion:'Unidad',       precioVenta:45000,  stock:22,   stockMinimo:10,  disponibilidad:'Stock óptimo', estado:'Activo', imagen:'/productos/termometro.png'  },
  { id:'P11', sku:'EMP-001', nombre:'Bolsa autoclavable',    nombreCientifico:'1.5 kg capacidad',     categoria:'Empaques y etiquetas', presentacion:'Paquete x100', precioVenta:28000,  stock:0,    stockMinimo:50,  disponibilidad:'Agotado',      estado:'Inactivo',imagen:'/productos/bolsa.png'       },
  { id:'P12', sku:'PRC-005', nombre:'Polvo de shiitake',     nombreCientifico:'Premium',              categoria:'Productos procesados', presentacion:'Frasco 100 g',  precioVenta:22000,  stock:140,  stockMinimo:80,  disponibilidad:'Stock óptimo', estado:'Borrador',imagen:'/productos/polvo.png'       },
];

export const CATEGORIAS_SIDEBAR = [
  { nombre: 'Hongos frescos',         count: 24, from: '#2a8055', to: '#1a5030' },
  { nombre: 'Productos procesados',   count: 36, from: '#b06000', to: '#7a3a00' },
  { nombre: 'Insumos y kits',         count: 18, from: '#5a2a7a', to: '#3a1a50' },
  { nombre: 'Equipos y herramientas', count: 22, from: '#1a5070', to: '#0e3050' },
  { nombre: 'Empaques y etiquetas',   count: 14, from: '#C59A18', to: '#8A6A08' },
  { nombre: 'Otros',                  count: 14, from: '#6B4A2A', to: '#4a2a10' },
];

export const DESTACADOS = [
  { rank: 1, nombre: 'Ostra fresca',          tag: 'Más vendido',   valor: '1,250 uds',  imagen: '/productos/ostra.png'       },
  { rank: 2, nombre: 'Pesto de ostra',        tag: 'Mayor margen',  valor: '$18,900',    imagen: '/productos/pesto.png'       },
  { rank: 3, nombre: 'Kit de cultivo (Ostra)',tag: 'Más nuevos',    valor: '310 uds',    imagen: '/productos/kit.png'         },
];

export const STOCK_ESTADO = [
  { name: 'Óptimo',  value: 173900, pct: 62.5, color: '#16a34a' },
  { name: 'Bajo',    value:  59300, pct: 21.3, color: '#C59A18' },
  { name: 'Crítico', value:  22800, pct:  8.2, color: '#ef4444' },
  { name: 'Agotado', value:  22450, pct:  8.0, color: '#94a3b8' },
];

export const NUEVOS_PRODUCTOS = [
  { nombre: 'Kit de cultivo (Shiitake)', fecha: '10/05/2024', ventas: 120, ingresos: 2988000, imagen: '/productos/kit.png' },
];

export const VALOR_POR_CATEGORIA = [
  { nombre: 'Hongos frescos',         valor: 58.4, pct: 38.3 },
  { nombre: 'Productos procesados',   valor: 46.7, pct: 30.6 },
  { nombre: 'Insumos y kits',         valor: 28.9, pct: 18.9 },
  { nombre: 'Equipos y herramientas', valor: 12.1, pct:  7.9 },
  { nombre: 'Empaques y etiquetas',   valor:  6.3, pct:  4.3 },
];

export const ROTACION_DATA = [
  { mes: 'Ene', valor: 3.2 },
  { mes: 'Feb', valor: 3.6 },
  { mes: 'Mar', valor: 3.4 },
  { mes: 'Abr', valor: 3.9 },
  { mes: 'May', valor: 4.0 },
  { mes: 'Jun', valor: 4.2 },
];

export const PROXIMOS_VENCER = [
  { nombre: 'Pesto de ostra',      dias: 18, stock: 24, imagen: '/productos/pesto.png'    },
  { nombre: 'Conserva de hongos',  dias: 25, stock: 18, imagen: '/productos/conserva.png' },
  { nombre: 'Snack de hongos',     dias: 32, stock: 30, imagen: '/productos/snack.png'    },
];

export const CATEGORIAS_SELECT: CategoriaProducto[] = ['Hongos frescos','Productos procesados','Insumos y kits','Equipos y herramientas','Empaques y etiquetas','Otros'];
export const ESTADOS_SELECT:    EstadoProducto[]     = ['Activo','Inactivo','Borrador'];
export const DISP_SELECT:       DisponibilidadProducto[] = ['Stock óptimo','Stock bajo','Crítico','Agotado'];
export const PRESENTACIONES_SELECT = ['Bandeja 250 g','Bandeja 200 g','Bandeja 300 g','Frasco 200 g','Frasco 280 g','Bolsa 30 g','Bolsa 50 g','Caja kit','Unidad','Paquete x100'];
export const UNIDADES_SELECT = ['Unidades','Kg','Gramos','Cajas','Frascos','Bolsas'];
