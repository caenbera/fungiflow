export type EstadoEnvio = 'En tránsito' | 'Entregado' | 'Programado' | 'Pendiente' | 'Incidencia';
export type EstadoVehiculo = 'En ruta' | 'En entrega' | 'Disponible' | 'En mantenimiento';

export interface Envio {
  id: string; guia: string; cliente: string; destino: string;
  fechaEnvio: string; horaEnvio: string; fechaEstimada: string;
  estado: EstadoEnvio; transportista: string; valor: number;
}

export interface Vehiculo {
  id: string; codigo: string; tipo: string; conductor: string;
  estado: EstadoVehiculo; ubicacion: string; bateria: number;
}

export const KPIS_LOG = [
  { label: 'Envíos hoy',             value: '32',        change: '+23.5%', up: true,  spark: [20,22,24,24,26,27,28,29,30,32], from: '#2a8055', to: '#1a5030', vs: 'vs ayer'       },
  { label: 'Entregas completadas',   value: '28',        change: '+18.7%', up: true,  spark: [16,18,20,21,22,23,24,25,27,28], from: '#1a5070', to: '#0e3050', vs: 'vs ayer'       },
  { label: 'En tránsito',            value: '18',        change: '+12.1%', up: true,  spark: [10,11,12,13,14,14,15,16,17,18], from: '#5a2a7a', to: '#3a1a50', vs: 'vs ayer'       },
  { label: 'Programados',            value: '14',        change: '+7.4%',  up: true,  spark: [8,9,9,10,10,11,11,12,13,14],    from: '#C59A18', to: '#8A6A08', vs: 'vs ayer'       },
  { label: 'Incidencias',            value: '3',         change: '-40%',   up: true,  spark: [8,7,6,6,5,5,4,4,4,3],          from: '#b83020', to: '#7a1a10', vs: 'vs ayer'       },
  { label: 'Costo logístico (mes)',  value: '$8.43M',    change: '-6.8%',  up: true,  spark: [9.2,9.0,8.9,8.8,8.7,8.6,8.6,8.5,8.45,8.43], from: '#b06000', to: '#7a3a00', vs: 'vs mes anterior'},
];

export const ESTADO_ENVIOS = [
  { name: 'Entregados',  value: 28, pct: 37.8, color: '#2a8055' },
  { name: 'En tránsito', value: 18, pct: 24.3, color: '#5a2a7a' },
  { name: 'Programados', value: 14, pct: 18.9, color: '#C59A18' },
  { name: 'Pendientes',  value: 11, pct: 14.9, color: '#1a5070' },
  { name: 'Incidencias', value:  3, pct:  4.1, color: '#b83020' },
];

export const PROXIMAS_ENTREGAS = [
  { hora:'09:30', cliente:'Fungi Lovers Store',     lugar:'Medellín, Antioquia',     estado:'En tránsito' as EstadoEnvio, color:'#5a2a7a' },
  { hora:'11:00', cliente:'BioMarket Colombia',     lugar:'Bogotá, Cundinamarca',    estado:'Programado'  as EstadoEnvio, color:'#C59A18' },
  { hora:'13:30', cliente:'Restaurante El Bosque',  lugar:'Pereira, Risaralda',      estado:'Programado'  as EstadoEnvio, color:'#C59A18' },
  { hora:'15:00', cliente:'Green Foods',            lugar:'Cali, Valle del Cauca',   estado:'En tránsito' as EstadoEnvio, color:'#5a2a7a' },
  { hora:'16:30', cliente:'Hotel Boutique Palmas',  lugar:'Armenia, Quindío',        estado:'Programado'  as EstadoEnvio, color:'#C59A18' },
];

export const FLOTA: Vehiculo[] = [
  { id:'1', codigo:'TRK-001', tipo:'Camión',    conductor:'Juan Pérez',    estado:'En ruta',      ubicacion:'La Ceja, Antioquia',     bateria:78 },
  { id:'2', codigo:'TRK-002', tipo:'Camión',    conductor:'María López',   estado:'En ruta',      ubicacion:'Rionegro, Antioquia',     bateria:65 },
  { id:'3', codigo:'VAN-001', tipo:'Furgoneta', conductor:'Carlos Gómez',  estado:'En ruta',      ubicacion:'Guarne, Antioquia',       bateria:82 },
  { id:'4', codigo:'VAN-002', tipo:'Furgoneta', conductor:'Andrés Torres', estado:'En entrega',   ubicacion:'Medellín, Antioquia',     bateria:70 },
  { id:'5', codigo:'MTC-001', tipo:'Motocarga', conductor:'Valentina Ruiz',estado:'Disponible',   ubicacion:'Bodega principal',        bateria:100},
];

export const RESUMEN_FLOTA = [
  { tipo:'Camiones',    count:3, activos:3 },
  { tipo:'Furgonetas',  count:4, activos:4 },
  { tipo:'Motos',       count:2, activos:2 },
  { tipo:'Conductores', count:14,activos:14,label:'Disponibles' },
];

export const DESEMPENO = [
  { label:'OTIF (a tiempo y completo)', value:'92.6%', change:'+6.2%', up:true,  color:'#2a8055' },
  { label:'Tiempo promedio de entrega', value:'2.4 días',change:'-0.3 días',up:true, color:'#1a5070' },
  { label:'Entregas sin novedad',       value:'87.3%', change:'+4.7%', up:true,  color:'#5a2a7a' },
  { label:'Costo por entrega',          value:'$114,050',change:'-8.1%',up:true, color:'#C59A18' },
];

export const COSTOS_TREND = [
  { fecha:'1 May', valor:9.2 },{ fecha:'8 May', valor:8.9 },{ fecha:'15 May', valor:8.6 },
  { fecha:'22 May', valor:8.5 },{ fecha:'29 May', valor:8.43 },
];

export const ALERTAS_LOG = [
  { tipo:'Retraso',    label:'Retraso en entrega a Green Foods',       sub:'Nueva hora estimada: 16:45', color:'#b83020', bg:'rgba(184,48,32,0.10)' },
  { tipo:'Incidencia', label:'Incidencia en ruta hacia Pereira',       sub:'Accidente en vía. Ruta alterna activada', color:'#b06000', bg:'rgba(176,96,0,0.10)' },
  { tipo:'Pendiente',  label:'Guía OC-00076 pendiente de confirmar',   sub:'Proveedor: Empaques Andinos', color:'#C59A18', bg:'rgba(197,154,24,0.10)' },
  { tipo:'Informativo',label:'Capacidad de almacenamiento al 92%',     sub:'En bodega principal', color:'#1a5070', bg:'rgba(26,80,112,0.10)' },
  { tipo:'Retraso',    label:'TRK-002 lleva 45 min sin actualizar',    sub:'Última ubicación: Rionegro, Antioquia', color:'#b83020', bg:'rgba(184,48,32,0.10)' },
  { tipo:'Pendiente',  label:'3 guías sin asignar transportista',      sub:'Envíos programados para mañana', color:'#C59A18', bg:'rgba(197,154,24,0.10)' },
  { tipo:'Informativo',label:'Nuevo contrato con Coordinadora activo', sub:'Tarifas actualizadas desde hoy', color:'#1a5070', bg:'rgba(26,80,112,0.10)' },
];

export const DOCS_PENDIENTES = [
  { label:'Guías por firmar',          count:7,  color:'#1a5070' },
  { label:'Pruebas de entrega por cargar', count:12, color:'#b06000' },
  { label:'Facturas por validar',      count:5,  color:'#C59A18' },
  { label:'Devoluciones por procesar', count:3,  color:'#b83020' },
];

export const ENVIOS: Envio[] = [
  { id:'1', guia:'GUIA-00078', cliente:'Fungi Lovers Store',    destino:'Medellín, Antioquia',    fechaEnvio:'18/05/2024',horaEnvio:'08:15',fechaEstimada:'18/05/2024', estado:'En tránsito',transportista:'Transportes ANDES', valor:245000 },
  { id:'2', guia:'GUIA-00077', cliente:'BioMarket Colombia',    destino:'Bogotá, Cundinamarca',   fechaEnvio:'17/05/2024',horaEnvio:'11:30',fechaEstimada:'19/05/2024', estado:'Programado',  transportista:'Coordinadora',      valor:380000 },
  { id:'3', guia:'GUIA-00076', cliente:'Restaurante El Bosque', destino:'Pereira, Risaralda',    fechaEnvio:'16/05/2024',horaEnvio:'09:45',fechaEstimada:'17/05/2024', estado:'Entregado',   transportista:'Servientrega',      valor:210000 },
  { id:'4', guia:'GUIA-00075', cliente:'Green Foods',           destino:'Cali, Valle del Cauca', fechaEnvio:'16/05/2024',horaEnvio:'07:20',fechaEstimada:'18/05/2024', estado:'En tránsito',transportista:'Transportes ANDES', valor:265000 },
  { id:'5', guia:'GUIA-00074', cliente:'Hotel Boutique Palmas', destino:'Armenia, Quindío',      fechaEnvio:'15/05/2024',horaEnvio:'14:10',fechaEstimada:'16/05/2024', estado:'Entregado',   transportista:'Servientrega',      valor:195000 },
  { id:'6', guia:'GUIA-00073', cliente:'Mercado Natural Cali',  destino:'Cali, Valle del Cauca', fechaEnvio:'15/05/2024',horaEnvio:'09:00',fechaEstimada:'17/05/2024', estado:'Pendiente',   transportista:'TCC',               valor:142000 },
  { id:'7', guia:'GUIA-00072', cliente:'Setas Gourmet',         destino:'Bogotá, Cundinamarca',  fechaEnvio:'14/05/2024',horaEnvio:'13:40',fechaEstimada:'16/05/2024', estado:'Entregado',   transportista:'Coordinadora',      valor:318000 },
  { id:'8', guia:'GUIA-00071', cliente:'La Casa del Chef',      destino:'Manizales, Caldas',     fechaEnvio:'14/05/2024',horaEnvio:'08:50',fechaEstimada:'15/05/2024', estado:'Incidencia',  transportista:'Transportes ANDES', valor:175000 },
];

export const ESTADOS_SELECT: EstadoEnvio[] = ['En tránsito','Entregado','Programado','Pendiente','Incidencia'];
export const FECHA_SELECT = ['Hoy','Últimos 7 días','Últimos 30 días','Este mes','Personalizado'];
export const TRANSPORTISTAS_SELECT = ['Transportes ANDES','Coordinadora','Servientrega','TCC'];
