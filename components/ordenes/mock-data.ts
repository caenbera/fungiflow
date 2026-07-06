export type EstadoOrden = 'En proceso' | 'Pendiente' | 'Completada' | 'Cancelada';

export interface OrdenCompra {
  id: string;
  numero: string;
  proveedor: string;
  fecha: string;
  productos: number;
  valorTotal: number;
  estado: EstadoOrden;
  entregaEstimada: string;
  recibidoPct: number;
}

export const KPIS_ORD = [
  { label: 'Órdenes totales',       value: '78',            change: '+18.4%', up: true,  spark: [55,58,60,63,65,68,70,72,75,78],          from: '#2a8055', to: '#1a5030' },
  { label: 'En proceso',            value: '24',            change: '+12.7%', up: true,  spark: [15,16,17,18,19,20,21,22,23,24],          from: '#1a5070', to: '#0e3050' },
  { label: 'Pendientes de recibir', value: '15',            change: '-6.2%',  up: false, spark: [20,19,19,18,18,17,17,16,16,15],          from: '#b06000', to: '#7a3a00' },
  { label: 'Completadas',           value: '39',            change: '+21.3%', up: true,  spark: [22,24,26,28,29,31,33,35,37,39],          from: '#C59A18', to: '#8A6A08' },
  { label: 'Valor total (COP)',     value: '$152.4M',       change: '+15.8%', up: true,  spark: [100,108,112,118,122,128,132,138,145,152], from: '#5a2a7a', to: '#3a1a50' },
  { label: 'Ahorros del mes (COP)', value: '$6.78M',        change: '+11.3%', up: true,  spark: [4.2,4.5,4.8,5.0,5.4,5.7,5.9,6.2,6.5,6.78],from: '#b83020', to: '#7a1a10' },
];

export const ORDENES: OrdenCompra[] = [
  { id:'1', numero:'OC-00078', proveedor:'Aserraderos del Valle S.A.S', fecha:'18/05/2024', productos:4, valorTotal:28450000, estado:'En proceso',  entregaEstimada:'22/05/2024', recibidoPct:60  },
  { id:'2', numero:'OC-00077', proveedor:'Micelio Labs',                 fecha:'17/05/2024', productos:2, valorTotal:15600000, estado:'Pendiente',   entregaEstimada:'21/05/2024', recibidoPct:0   },
  { id:'3', numero:'OC-00076', proveedor:'Empaques Andinos S.A.S',      fecha:'16/05/2024', productos:3, valorTotal:9850000,  estado:'En proceso',  entregaEstimada:'20/05/2024', recibidoPct:40  },
  { id:'4', numero:'OC-00075', proveedor:'Químicos Colombianos',         fecha:'15/05/2024', productos:2, valorTotal:6780000,  estado:'Pendiente',   entregaEstimada:'19/05/2024', recibidoPct:0   },
  { id:'5', numero:'OC-00074', proveedor:'Fungi Equipos S.A.S',         fecha:'13/05/2024', productos:5, valorTotal:32500000, estado:'Completada',  entregaEstimada:'16/05/2024', recibidoPct:100 },
  { id:'6', numero:'OC-00073', proveedor:'BioSustratos S.A.S',          fecha:'12/05/2024', productos:3, valorTotal:11250000, estado:'Completada',  entregaEstimada:'15/05/2024', recibidoPct:100 },
  { id:'7', numero:'OC-00072', proveedor:'Envases del Café S.A.S',      fecha:'10/05/2024', productos:2, valorTotal:4980000,  estado:'Completada',  entregaEstimada:'12/05/2024', recibidoPct:100 },
  { id:'8', numero:'OC-00071', proveedor:'Agroinsumos del Norte',        fecha:'08/05/2024', productos:4, valorTotal:18400000, estado:'Cancelada',   entregaEstimada:'-',          recibidoPct:0   },
  { id:'9', numero:'OC-00070', proveedor:'Micelio Labs',                 fecha:'05/05/2024', productos:2, valorTotal:8200000,  estado:'Completada',  entregaEstimada:'09/05/2024', recibidoPct:100 },
  { id:'10',numero:'OC-00069', proveedor:'Aserraderos del Valle S.A.S', fecha:'03/05/2024', productos:3, valorTotal:22100000, estado:'Completada',  entregaEstimada:'07/05/2024', recibidoPct:100 },
];

export const COMPRAS_TREND = [
  { mes:'Ene', valor:80 },{ mes:'Feb', valor:95 },{ mes:'Mar', valor:88 },
  { mes:'Abr', valor:112 },{ mes:'May', valor:152 },
];

export const COMPRAS_CATEGORIA = [
  { nombre:'Materias primas',      valor:68430000, pct:44.9, color:'#2a8055' },
  { nombre:'Insumos y químicos',   valor:32180000, pct:21.1, color:'#1a5070' },
  { nombre:'Empaques y etiquetas', valor:18730000, pct:12.3, color:'#C59A18' },
  { nombre:'Equipos y herramientas',valor:22560000,pct:14.8, color:'#5a2a7a' },
  { nombre:'Otros',                valor:10530000, pct: 6.9, color:'#94a3b8' },
];

export const PROVEEDORES_RANK = [
  { rank:1, nombre:'Aserraderos del Valle S.A.S', valor:28450000, pct:100 },
  { rank:2, nombre:'Fungi Equipos S.A.S',         valor:32500000, pct:100 },
  { rank:3, nombre:'Micelio Labs',                valor:15600000, pct:48  },
  { rank:4, nombre:'Empaques Andinos S.A.S',      valor:9850000,  pct:30  },
  { rank:5, nombre:'Químicos Colombianos',         valor:6780000,  pct:21  },
];

export const ESTADO_DONUT = [
  { name:'En proceso',  value:24, pct:30.8, color:'#C59A18' },
  { name:'Pendientes',  value:15, pct:19.2, color:'#1a5070' },
  { name:'Completadas', value:39, pct:50.0, color:'#2a8055' },
  { name:'Canceladas',  value: 0, pct: 0.0, color:'#b83020' },
];

export const TIEMPO_ENTREGA = [
  { mes:'Ene', dias:8.2 },{ mes:'Feb', dias:7.5 },{ mes:'Mar', dias:7.0 },
  { mes:'Abr', dias:6.8 },{ mes:'May', dias:5.6 },
];

export const AHORROS_TREND = [
  { mes:'Ene', valor:3.2 },{ mes:'Feb', valor:3.8 },{ mes:'Mar', valor:4.5 },
  { mes:'Abr', valor:5.2 },{ mes:'May', valor:6.78 },
];

export const ALERTAS = [
  { label:'Órdenes pendientes de aprobación', count:5,  color:'#C59A18', bg:'rgba(197,154,24,0.12)'  },
  { label:'Órdenes por vencer (próx. 3 días)',count:7,  color:'#b83020', bg:'rgba(184,48,32,0.12)'  },
  { label:'Recepciones atrasadas',            count:3,  color:'#b83020', bg:'rgba(184,48,32,0.12)'  },
  { label:'Productos con retraso del proveedor',count:4,color:'#b06000', bg:'rgba(176,96,0,0.12)'   },
];

export const PROVEEDORES_SELECT = [
  'Aserraderos del Valle S.A.S','Micelio Labs','Empaques Andinos S.A.S',
  'Químicos Colombianos','Fungi Equipos S.A.S','BioSustratos S.A.S',
  'Envases del Café S.A.S','Agroinsumos del Norte',
];
export const ESTADOS_SELECT: EstadoOrden[] = ['En proceso','Pendiente','Completada','Cancelada'];
export const FECHA_SELECT = ['Últimos 7 días','Últimos 30 días','Últimos 3 meses','Este año','Personalizado'];
export const PRODUCTOS_MOCK_SELECT = ['Aserrín de roble','Semillas shiitake','Bolsas autoclavables','Termómetro digital','Sustrato enriquecido','Empaques gourmet'];
