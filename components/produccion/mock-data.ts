export type EtapaLote = 'Preparación' | 'Esterilización' | 'Inoculación' | 'Colonización' | 'Fructificación' | 'Cosecha';
export type EstadoLote = 'En curso' | 'Listo' | 'Pausado' | 'Completado';

export interface Lote {
  id: string;
  numero: string;
  producto: string;
  nombreCientifico: string;
  etapa: EtapaLote;
  inicio: string;
  progreso: number;
  ubicacion: string;
  proximaAccion: string;
  estado: EstadoLote;
}

export const KPIS_PROD_PAGE = [
  { label: 'Lotes activos',       value: '24',    change: '+18.2%', up: true,  spark: [15,16,17,18,19,20,21,22,23,24], from: '#2a8055', to: '#1a5030' },
  { label: 'En colonización',     value: '12',    change: '+10.6%', up: true,  spark: [8,8,9,9,10,10,11,11,12,12],     from: '#C59A18', to: '#8A6A08' },
  { label: 'En fructificación',   value: '8',     change: '+12.8%', up: true,  spark: [4,5,5,6,6,7,7,7,8,8],           from: '#5a2a7a', to: '#3a1a50' },
  { label: 'Cosecha lista',       value: '4',     change: '+8.5%',  up: true,  spark: [1,1,2,2,2,3,3,3,4,4],           from: '#1a5070', to: '#0e3050' },
  { label: 'Rendimiento prom.',   value: '24.6%', change: '+5.2%',  up: true,  spark: [18,19,20,21,21,22,23,23,24,24.6],from: '#b06000', to: '#7a3a00' },
];

export const ETAPAS_FLUJO = [
  { nombre: 'Preparación',    lotes: 5,  from: '#2a8055', to: '#1a5030' },
  { nombre: 'Esterilización', lotes: 4,  from: '#1a5070', to: '#0e3050' },
  { nombre: 'Inoculación',    lotes: 6,  from: '#5a2a7a', to: '#3a1a50' },
  { nombre: 'Colonización',   lotes: 12, from: '#C59A18', to: '#8A6A08' },
  { nombre: 'Fructificación', lotes: 8,  from: '#2a8055', to: '#1a5030' },
  { nombre: 'Cosecha',        lotes: 4,  from: '#b06000', to: '#7a3a00' },
];

export const LOTES: Lote[] = [
  { id:'1', numero:'LOT-2024-058', producto:'Ostra',      nombreCientifico:'Pleurotus ostreatus', etapa:'Colonización',   inicio:'08/05/2024', progreso:65,  ubicacion:'Sala de incubación 1', proximaAccion:'Revisar en 2 días',   estado:'En curso'   },
  { id:'2', numero:'LOT-2024-057', producto:'Shiitake',   nombreCientifico:'L. edodes',           etapa:'Fructificación', inicio:'02/05/2024', progreso:40,  ubicacion:'Sala húmeda 2',        proximaAccion:'Control de humedad',  estado:'En curso'   },
  { id:'3', numero:'LOT-2024-056', producto:'Portobello', nombreCientifico:'A. bisporus',         etapa:'Colonización',   inicio:'05/05/2024', progreso:78,  ubicacion:'Incubadora 3',         proximaAccion:'Ventilación',         estado:'En curso'   },
  { id:'4', numero:'LOT-2024-055', producto:'Ostra',      nombreCientifico:'Pleurotus ostreatus', etapa:'Cosecha',        inicio:'28/04/2024', progreso:100, ubicacion:'Sala de cultivo 1',    proximaAccion:'Cosechar',            estado:'Listo'      },
  { id:'5', numero:'LOT-2024-054', producto:'Shiitake',   nombreCientifico:'L. edodes',           etapa:'Inoculación',    inicio:'10/05/2024', progreso:25,  ubicacion:'Área limpia',          proximaAccion:'Incubar',             estado:'En curso'   },
  { id:'6', numero:'LOT-2024-053', producto:'Ostra',      nombreCientifico:'Pleurotus ostreatus', etapa:'Preparación',    inicio:'12/05/2024', progreso:10,  ubicacion:'Bodega de materias',   proximaAccion:'Esterilizar',         estado:'En curso'   },
  { id:'7', numero:'LOT-2024-052', producto:'Portobello', nombreCientifico:'A. bisporus',         etapa:'Fructificación', inicio:'25/04/2024', progreso:88,  ubicacion:'Sala húmeda 1',        proximaAccion:'Humidificar',         estado:'En curso'   },
  { id:'8', numero:'LOT-2024-051', producto:'Ostra',      nombreCientifico:'Pleurotus ostreatus', etapa:'Cosecha',        inicio:'20/04/2024', progreso:100, ubicacion:'Sala de cultivo 2',    proximaAccion:'Cosechar',            estado:'Listo'      },
];

export const CONDICIONES = [
  { label: 'Temperatura', value: '22.4', unit: '°C', estado: 'Óptimo', spark: [21.8,22,22.1,22.3,22.2,22.4,22.5,22.3,22.4,22.4], color: '#b83020', from: '#b83020', to: '#7a1a10' },
  { label: 'Humedad',     value: '86',   unit: '%',  estado: 'Óptimo', spark: [84,85,85,86,85,86,87,86,86,86],                    color: '#1a5070', from: '#1a5070', to: '#0e3050' },
  { label: 'CO₂',         value: '620',  unit: 'ppm',estado: 'Óptimo', spark: [640,632,628,620,618,622,620,619,621,620],           color: '#2a8055', from: '#2a8055', to: '#1a5030' },
  { label: 'Luz',         value: '320',  unit: 'lux',estado: 'Óptimo', spark: [300,308,312,318,320,315,322,318,320,320],           color: '#C59A18', from: '#C59A18', to: '#8A6A08' },
];

export const ALERTAS_PROD = [
  { label: 'Lotes próximos a cosecha',    count: 4, color: '#2a8055', bg: 'rgba(42,128,85,0.10)'   },
  { label: 'Humedad fuera de rango',      count: 2, color: '#b83020', bg: 'rgba(184,48,32,0.10)'   },
  { label: 'Revisiones pendientes',       count: 6, color: '#b06000', bg: 'rgba(176,96,0,0.10)'    },
  { label: 'Insumos por debajo del mínimo',count:3, color: '#b83020', bg: 'rgba(184,48,32,0.10)'   },
];

export const PRODUCCION_ESPECIE = [
  { name: 'Ostra',      value: 525, pct: 42, color: '#2a8055' },
  { name: 'Shiitake',   value: 350, pct: 28, color: '#5a2a7a' },
  { name: 'Portobello', value: 225, pct: 18, color: '#C59A18' },
  { name: 'Otros',      value: 150, pct: 12, color: '#94a3b8' },
];

export const RENDIMIENTO_LOTE = [
  { lote: 'LOT-058', pct: 35 },
  { lote: 'LOT-057', pct: 26 },
  { lote: 'LOT-056', pct: 22 },
  { lote: 'LOT-055', pct: 31 },
  { lote: 'LOT-054', pct: 18 },
];

export const HISTORIAL = [
  { accion: 'Cosecha completada',    lote: 'LOT-2024-055', fecha: '18/05/2024', hora: '09:30', detalle: '220 kg',      color: '#2a8055', bg: 'rgba(42,128,85,0.10)'  },
  { accion: 'Inoculación realizada', lote: 'LOT-2024-058', fecha: '17/05/2024', hora: '14:10', detalle: '120 bolsas',  color: '#5a2a7a', bg: 'rgba(90,42,122,0.10)' },
  { accion: 'Traslado de lote',      lote: 'LOT-2024-057', fecha: '16/05/2024', hora: '11:45', detalle: 'Sala húmeda 2',color:'#1a5070', bg: 'rgba(26,80,112,0.10)' },
  { accion: 'Preparación de sustrato',lote:'LOTE-059',      fecha: '15/05/2024', hora: '08:20', detalle: '200 kg',      color: '#C59A18', bg: 'rgba(197,154,24,0.10)' },
];

export const ETAPA_COLORES: Record<EtapaLote, { color: string; bg: string }> = {
  'Preparación':    { color: '#1a5030', bg: 'rgba(42,128,85,0.12)'   },
  'Esterilización': { color: '#1a4070', bg: 'rgba(26,80,112,0.12)'   },
  'Inoculación':    { color: '#3a1a50', bg: 'rgba(90,42,122,0.12)'   },
  'Colonización':   { color: '#8A6A08', bg: 'rgba(197,154,24,0.14)'  },
  'Fructificación': { color: '#1a5030', bg: 'rgba(42,128,85,0.12)'   },
  'Cosecha':        { color: '#7a3a00', bg: 'rgba(176,96,0,0.12)'    },
};

export const PRODUCTOS_SELECT = ['Ostra (Pleurotus ostreatus)','Shiitake (L. edodes)','Portobello (A. bisporus)','Otros'];
export const ESTADOS_SELECT: EstadoLote[] = ['En curso','Listo','Pausado','Completado'];
export const ETAPAS_SELECT: EtapaLote[] = ['Preparación','Esterilización','Inoculación','Colonización','Fructificación','Cosecha'];
export const UBICACIONES_SELECT = ['Sala de incubación 1','Sala de incubación 2','Sala húmeda 1','Sala húmeda 2','Incubadora 3','Sala de cultivo 1','Sala de cultivo 2','Área limpia'];
