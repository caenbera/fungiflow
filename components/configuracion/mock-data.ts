export const CONFIG_GRANJA = [
  { label:'Nombre de la granja',    sub:'Finca Los Robles',          icon:'🌿' },
  { label:'Unidades de medida',     sub:'Sistema métrico (kg, g, L, m²)', icon:'📏' },
  { label:'Zonas y ubicaciones',    sub:'12 zonas configuradas',      icon:'📍' },
  { label:'Turnos de trabajo',      sub:'3 turnos configurados',      icon:'🕐' },
  { label:'Parámetros de cultivo',  sub:'5 parámetros configurados',  icon:'🍄' },
];

export const USUARIOS_PERMISOS = [
  { label:'Usuarios',            sub:'24 usuarios registrados',   icon:'👥' },
  { label:'Roles y permisos',    sub:'6 roles configurados',       icon:'🔑' },
  { label:'Invitaciones pendientes', sub:'2 invitaciones',          icon:'📧' },
  { label:'Actividad de usuarios', sub:'Ver registros de actividad', icon:'📋' },
];

export const MODULOS = [
  { label:'Producción',           icon:'🌱', activo:true  },
  { label:'Inventario',           icon:'📦', activo:true  },
  { label:'Comercial',            icon:'🛒', activo:true  },
  { label:'Logística',            icon:'🚚', activo:true  },
  { label:'Finanzas',             icon:'💰', activo:true  },
  { label:'Analítica',            icon:'📊', activo:true  },
  { label:'Inteligencia Artificial', icon:'🤖', activo:true  },
  { label:'Documentos',           icon:'📄', activo:true  },
  { label:'Academia',             icon:'🎓', activo:true  },
];

export const INTEGRACIONES = [
  { label:'Contabilidad (Siigo)',   estado:'Sincronizado', color:'#2a8055', icon:'📊' },
  { label:'Pasarelas de pago (Wompi)', estado:'Sincronizado', color:'#2a8055', icon:'💳' },
  { label:'WhatsApp Business',      estado:'Conectado',    color:'#2a8055', icon:'💬' },
  { label:'Google Workspace',       estado:'Conectado',    color:'#2a8055', icon:'🔷' },
  { label:'API FungiFlow',          estado:'Activa',       color:'#2a8055', icon:'🔗' },
];

export const SISTEMA_STATUS = [
  { label:'Versión de la plataforma', value:'v2.4.1'      },
  { label:'Última actualización',     value:'15/05/2024 08:30' },
  { label:'Estado del sistema',       value:'Operativo',  color:'#2a8055' },
  { label:'Tiempo de actividad',      value:'99.9%'       },
  { label:'Almacenamiento usado',     value:'68%',        bar:68  },
  { label:'Usuarios activos',         value:'24'          },
];

export const RESPALDO = [
  { label:'Último respaldo',    value:'15/05/2024 02:00' },
  { label:'Próximo respaldo',   value:'16/05/2024 02:00' },
  { label:'Frecuencia',         value:'Diario'           },
  { label:'Retención',          value:'30 días'          },
];

export const ACCIONES_RAPIDAS = [
  { label:'Importar datos iniciales',          color:'#1a5070' },
  { label:'Exportar configuración',            color:'#1a5070' },
  { label:'Clonar configuración de otra granja', color:'#1a5070' },
  { label:'Restablecer configuración',         color:'#b83020', danger:true },
];

export const LICENCIA = [
  { label:'Plan actual',       value:'Profesional'  },
  { label:'Usuarios incluidos',value:'25'           },
  { label:'Módulos activos',   value:'12 / 12'      },
  { label:'Vencimiento',       value:'15/05/2025'   },
];

export const COLORES_TEMA = ['#2a8055','#1a5070','#8B4513','#1a3a7a','#5a2a7a','#C59A18','#b83020'];
