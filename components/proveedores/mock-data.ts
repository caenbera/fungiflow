export type CategoriaProveedor = 'Materias primas' | 'Insumos' | 'Empaques' | 'Equipos' | 'Logística' | 'Micelio';
export type EstadoProveedor   = 'Activo' | 'Inactivo' | 'En evaluación';
export type EvalProveedor     = 'Excelente' | 'Bueno' | 'Regular' | 'Deficiente';

export interface Proveedor {
  id: string;
  nombre: string;
  nit: string;
  categoria: CategoriaProveedor;
  productos: string;          // ej: "Aserrín, Viruta"
  ultimaCompra: string;       // fecha formateada
  compras12m: number;         // COP
  ordenes12m: number;
  evaluacion: number;         // 1-5
  estado: EstadoProveedor;
  estrategico: boolean;
  descripcionEstrategico?: string;
  email?: string;
  telefono?: string;
  notas?: string;
}

export const PROVEEDORES: Proveedor[] = [
  { id: 'PRV-001', nombre: 'Aserraderos del Valle S.A.S',    nit: '900.123.456-7', categoria: 'Materias primas', productos: 'Aserrín, Viruta',             ultimaCompra: '15/05/2024', compras12m: 28_450_000, ordenes12m: 8,  evaluacion: 4.6, estado: 'Activo',        estrategico: true,  descripcionEstrategico: 'Materias primas críticas' },
  { id: 'PRV-002', nombre: 'Insumos Agroindustriales S.A.S', nit: '900.223.334-1', categoria: 'Insumos',         productos: 'Salvado, Cal, Yeso',          ultimaCompra: '14/05/2024', compras12m: 19_780_000, ordenes12m: 6,  evaluacion: 4.4, estado: 'Activo',        estrategico: false },
  { id: 'PRV-003', nombre: 'Empaques Andinos S.A.S',         nit: '900.333.221-5', categoria: 'Empaques',        productos: 'Bolsas, Filtros, Tapones',    ultimaCompra: '13/05/2024', compras12m: 32_560_000, ordenes12m: 10, evaluacion: 4.8, estado: 'Activo',        estrategico: true,  descripcionEstrategico: 'Alto impacto en producción' },
  { id: 'PRV-004', nombre: 'Micelio Labs',                   nit: '900.444.997-2', categoria: 'Micelio',         productos: 'Micelio, Cepas',              ultimaCompra: '12/05/2024', compras12m: 15_600_000, ordenes12m: 5,  evaluacion: 4.7, estado: 'Activo',        estrategico: true,  descripcionEstrategico: 'Proveedor exclusivo' },
  { id: 'PRV-005', nombre: 'Químicos Colombianos',           nit: '900.555.112-3', categoria: 'Insumos',         productos: 'Alcohol, Hipoclorito',        ultimaCompra: '10/05/2024', compras12m:  6_780_000, ordenes12m: 4,  evaluacion: 4.3, estado: 'Activo',        estrategico: false },
  { id: 'PRV-006', nombre: 'Fungi Equipos S.A.S',            nit: '900.666.778-1', categoria: 'Equipos',         productos: 'Esterilizadores, Autoclaves', ultimaCompra: '08/05/2024', compras12m: 45_250_000, ordenes12m: 3,  evaluacion: 4.9, estado: 'Activo',        estrategico: false },
  { id: 'PRV-007', nombre: 'Transportes Rápidos S.A.C',      nit: '900.777.889-2', categoria: 'Logística',       productos: 'Transporte terrestre',        ultimaCompra: '07/05/2024', compras12m:  8_920_000, ordenes12m: 7,  evaluacion: 4.2, estado: 'Activo',        estrategico: false },
  { id: 'PRV-008', nombre: 'Envases y Etiquetas del Norte',  nit: '900.888.221-9', categoria: 'Empaques',        productos: 'Cajas, Etiquetas',            ultimaCompra: '05/05/2024', compras12m:  7_230_000, ordenes12m: 3,  evaluacion: 4.1, estado: 'En evaluación', estrategico: false },
  { id: 'PRV-009', nombre: 'AgroSustratos Ltda',             nit: '900.999.001-4', categoria: 'Materias primas', productos: 'Paja, Cáscaras de café',      ultimaCompra: '01/05/2024', compras12m: 11_200_000, ordenes12m: 5,  evaluacion: 3.8, estado: 'Activo',        estrategico: false },
  { id: 'PRV-010', nombre: 'BioInsumos S.A.S',               nit: '901.001.111-2', categoria: 'Insumos',         productos: 'Nutrientes orgánicos',        ultimaCompra: '28/04/2024', compras12m:  4_500_000, ordenes12m: 2,  evaluacion: 3.2, estado: 'En evaluación', estrategico: false },
  { id: 'PRV-011', nombre: 'Plásticos Industriales S.A',     nit: '901.111.222-8', categoria: 'Empaques',        productos: 'Bolsas polipropileno',        ultimaCompra: '20/04/2024', compras12m:  3_100_000, ordenes12m: 2,  evaluacion: 2.8, estado: 'Inactivo',      estrategico: false },
  { id: 'PRV-012', nombre: 'Coltransporte Express',          nit: '901.222.333-5', categoria: 'Logística',       productos: 'Mensajería, Fletes',          ultimaCompra: '15/04/2024', compras12m:  2_400_000, ordenes12m: 4,  evaluacion: 1.9, estado: 'Inactivo',      estrategico: false },
];

export const KPIS_PROV = [
  { label: 'Proveedores totales',    value: '12',    change: '+2',   up: true,  spark: [6,7,8,8,9,10,10,11,11,12],         from: '#5a2a7a', to: '#3a1a50' },
  { label: 'Proveedores activos',    value: '9',     change: '+1',   up: true,  spark: [5,6,6,7,7,7,8,8,8,9],             from: '#2a8055', to: '#1a5030' },
  { label: 'Órdenes de compra',      value: '59',    change: '+22%', up: true,  spark: [30,35,38,40,44,46,50,52,56,59],   from: '#b06000', to: '#7a3a00' },
  { label: 'Compras del mes (COP)',   value: '$182M', change: '+18%', up: true,  spark: [80,95,110,115,125,140,155,162,174,182], from: '#C59A18', to: '#8A6A08' },
];

export const EVAL_DONUT = [
  { name: 'Excelente (4.5-5)', value: 5, color: '#2a8055' },
  { name: 'Bueno (3.5-4.4)',   value: 4, color: '#C59A18' },
  { name: 'Regular (2.5-3.4)', value: 2, color: '#b06000' },
  { name: 'Deficiente (1-2.4)',value: 1, color: '#b83020' },
];

export const CATEGORIAS_PROV: CategoriaProveedor[] = [
  'Materias primas', 'Insumos', 'Empaques', 'Equipos', 'Logística', 'Micelio',
];
