export type Currency = 'COP' | 'USD' | 'EUR' | 'GBP';

export interface ExchangeRates {
  COP: number;
  USD: number;
  EUR: number;
  GBP: number;
  updatedAt: number;
}

export interface CotizacionItem {
  id: string;
  descripcion: string;
  cantidad: number;
  unidad: string;
  precioUnitario: number; // siempre en COP
  subtotal: number;
  imagenUrl?: string;
}

export type CategoriaCotizacion =
  | 'construccion'
  | 'equipos'
  | 'materiaprima'
  | 'consumibles'
  | 'manodeobra'
  | 'servicios';

export interface Cotizacion {
  id: string;
  categoria: CategoriaCotizacion;
  nombre: string;
  items: CotizacionItem[];
  total: number; // en COP
  notas?: string;
  creadoEn: number;
  actualizadoEn: number;
}

export interface Proyecto {
  id: string;
  nombre: string;
  descripcion?: string;
  cotizaciones: Cotizacion[];
  creadoEn: number;
  actualizadoEn: number;
  userId: string;
}

export interface CalcCultivoInputs {
  ancho: number;
  largo: number;
  distanciaFilas: number;
  distanciaColumnas: number;
  costoAserrin: number;
  costoSalvado: number;
  costoYeso: number;
  costoBolsa: number;
  costoMicelio: number;
  precioVentaOrellana: number;
  numeroTrabajadores: number;
  sueldoTrabajador: number;
}

export interface CalcSustratoInputs {
  numBloques: number;
  pesoBloques: number;
  porcentajeMateriaSeca: number;
  porcentajeAserrin: number;
  porcentajeViruta: number;
  porcentajeSalvado: number;
  porcentajeCal: number;
  porcentajeLiquidos: number;
  porcentajeAgua: number;
  porcentajeMelaza: number;
}

export * from './blueprints';

