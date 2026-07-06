export const KPIS_REP = [
  { label:'Ingresos totales',     value:'$152.4M', change:'+18.4%', up:true,  spark:[82,88,90,95,98,105,112,120,135,152], from:'#2a8055', to:'#1a5030', icon:'💰' },
  { label:'Producción total (kg)',value:'12,450 kg',change:'+14.7%', up:true,  spark:[8.2,8.8,9.2,9.8,10.2,10.8,11.2,11.8,12.1,12.45], from:'#5a2a7a', to:'#3a1a50', icon:'🍄' },
  { label:'Ventas totales (kg)',  value:'11,230 kg',change:'+16.3%', up:true,  spark:[7.1,7.6,8.0,8.5,8.9,9.4,9.8,10.3,10.8,11.23], from:'#1a5070', to:'#0e3050', icon:'🛒' },
  { label:'Costo de producción',  value:'$68.4M',  change:'+9.2%',  up:false, spark:[58,60,61,62,63,63,64,65,67,68.4], from:'#b83020', to:'#7a1a10', icon:'⚙️' },
  { label:'Margen bruto',         value:'55.1%',   change:'+3.6pp', up:true,  spark:[48,49,50,51,51,52,52,53,54,55.1], from:'#b06000', to:'#7a3a00', icon:'📊' },
  { label:'Órdenes completadas',  value:'28',      change:'+21.7%', up:true,  spark:[16,17,18,19,20,21,22,23,25,28],   from:'#C59A18', to:'#8A6A08', icon:'✅' },
];

export const RENDIMIENTO_BARS = [
  { fecha:'1 May',  actual:28,  anterior:22, objetivo:30 },
  { fecha:'6 May',  actual:45,  anterior:35, objetivo:40 },
  { fecha:'11 May', actual:62,  anterior:50, objetivo:55 },
  { fecha:'16 May', actual:55,  anterior:48, objetivo:58 },
  { fecha:'21 May', actual:72,  anterior:58, objetivo:65 },
  { fecha:'26 May', actual:88,  anterior:70, objetivo:80 },
  { fecha:'31 May', actual:95,  anterior:78, objetivo:90 },
];

export const DISTRIBUCION_INGRESOS = [
  { name:'Hongos frescos',      value:64560, pct:42.3, color:'#2a8055' },
  { name:'Hongos deshidratados',value:33020, pct:21.7, color:'#1a5070' },
  { name:'Productos procesados',value:28820, pct:18.9, color:'#5a2a7a' },
  { name:'Insumos y kits',      value:16110, pct:10.6, color:'#C59A18' },
  { name:'Otros',               value: 9920, pct: 6.3, color:'#b06000' },
];

export const PLANTILLAS = [
  { icon:'📋', label:'Reporte de producción',  sub:'Análisis detallado por lotes, especies y etapas.',       color:'#2a8055' },
  { icon:'📈', label:'Reporte de ventas',       sub:'Desempeño de ventas por producto, cliente y canal.',    color:'#1a5070' },
  { icon:'💵', label:'Reporte financiero',      sub:'Estado de resultados, flujo de caja y márgenes.',       color:'#b06000' },
  { icon:'📦', label:'Reporte de inventario',   sub:'Movimientos, valuación y rotación de inventario.',     color:'#5a2a7a' },
  { icon:'🚚', label:'Reporte de logística',    sub:'Envíos, entregas, costos y desempeño de transporte.',  color:'#C59A18' },
];

export const PRODUCCION_ESPECIE = [
  { name:'Ostra (P. ostreatus)',       kg:4250, color:'#2a8055' },
  { name:'Shiitake (L. edodes)',       kg:2980, color:'#1a5070' },
  { name:'Portobello (A. bisporus)',   kg:2100, color:'#5a2a7a' },
  { name:'Hongo Melena (H. erinaceus)',kg:1250, color:'#C59A18' },
  { name:'Otras especies',            kg:1870, color:'#b06000' },
];

export const VENTAS_CANAL = [
  { name:'Retail',       value:4325, pct:38.5, color:'#2a8055' },
  { name:'Mayoristas',   value:3180, pct:28.3, color:'#1a5070' },
  { name:'Distribuidores',value:1932,pct:17.2, color:'#5a2a7a' },
  { name:'E-commerce',   value:1212, pct:10.8, color:'#C59A18' },
  { name:'Otros',        value: 581, pct: 5.2, color:'#b06000' },
];

export const TOP_CLIENTES = [
  { rank:1, nombre:'BioMarket Colombia',    kg:1850, color:'#2a8055' },
  { rank:2, nombre:'Gourmet Verde S.A.S',   kg:1420, color:'#1a5070' },
  { rank:3, nombre:'Green Foods',           kg:1250, color:'#5a2a7a' },
  { rank:4, nombre:'Restaurante El Bosque', kg: 980, color:'#C59A18' },
  { rank:5, nombre:'Fungi Lovers Store',    kg: 760, color:'#b06000' },
];

export const HISTORIAL = [
  { nombre:'Reporte de producción mensual',     modulo:'Producción', fecha:'31/05/2024 08:35', rango:'01/05 - 31/05/2024', generado:'Administrador', formato:'PDF'   },
  { nombre:'Reporte financiero mensual',        modulo:'Finanzas',   fecha:'31/05/2024 08:31', rango:'01/05 - 31/05/2024', generado:'Administrador', formato:'Excel' },
  { nombre:'Reporte de ventas por clientes',    modulo:'Comercial',  fecha:'30/05/2024 17:45', rango:'01/05 - 31/05/2024', generado:'Administrador', formato:'PDF'   },
  { nombre:'Reporte de inventario y movimientos',modulo:'Inventario',fecha:'30/05/2024 10:20', rango:'01/05 - 31/05/2024', generado:'Administrador', formato:'Excel' },
  { nombre:'Reporte de logística y envíos',     modulo:'Logística',  fecha:'29/05/2024 16:15', rango:'01/05 - 31/05/2024', generado:'Administrador', formato:'PDF'   },
  { nombre:'Reporte semanal de producción',     modulo:'Producción', fecha:'27/05/2024 08:00', rango:'20/05 - 27/05/2024', generado:'Administrador', formato:'PDF'   },
  { nombre:'Reporte de clientes activos',       modulo:'Comercial',  fecha:'26/05/2024 14:30', rango:'01/05 - 26/05/2024', generado:'Administrador', formato:'Excel' },
  { nombre:'Reporte de margen por producto',    modulo:'Finanzas',   fecha:'25/05/2024 09:10', rango:'01/05 - 25/05/2024', generado:'Administrador', formato:'PDF'   },
];

export const PROGRAMADOS = [
  { label:'Reporte semanal de producción', sub:'Cada lunes a las 08:00',        color:'#2a8055' },
  { label:'Reporte mensual financiero',    sub:'Día 1 de cada mes a las 09:00', color:'#1a5070' },
  { label:'Reporte de inventario crítico', sub:'Cada miércoles a las 10:00',    color:'#b83020' },
  { label:'Reporte de ventas por clientes',sub:'Día 5 de cada mes a las 08:30', color:'#5a2a7a' },
];

export const INDICADORES = [
  { label:'Rotación de inventario',  value:'4.2 veces', change:'+12.5%', up:true,  color:'#2a8055' },
  { label:'Días de inventario',      value:'32 días',   change:'-4.3%',  up:true,  color:'#1a5070' },
  { label:'Cumplimiento de entregas',value:'96.3%',     change:'+3.8%',  up:true,  color:'#5a2a7a' },
  { label:'Devoluciones',            value:'1.2%',      change:'-0.6%',  up:true,  color:'#b83020' },
  { label:'OTIF (a tiempo)',         value:'92.6%',     change:'+6.2%',  up:true,  color:'#C59A18' },
  { label:'Margen neto',             value:'38.4%',     change:'+2.1pp', up:true,  color:'#b06000' },
];
