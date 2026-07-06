export function PlanoFinca() {
  const galones = [
    { label: 'Galpón 1', estado: 'Óptimo',   color: '#1a6040', dot: '#22c55e', x: '10%', y: '16%' },
    { label: 'Galpón 2', estado: 'Óptimo',   color: '#1a6040', dot: '#22c55e', x: '48%', y: '10%' },
    { label: 'Galpón 3', estado: 'Atención', color: '#b05000', dot: '#f97316', x: '78%', y: '18%' },
  ];

  const zonas = [
    { label: 'Laboratorio', sub: 'Óptimo',     color: '#1a6040', x: '10%', y: '65%' },
    { label: 'Incubación',  sub: 'En proceso', color: '#b05000', x: '48%', y: '72%' },
    { label: 'Empaque',     sub: 'Óptimo',     color: '#1a6040', x: '82%', y: '65%' },
  ];

  return (
    <div className="surface-raised rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#302D28]">Plano de la finca</h3>
        <button className="text-xs text-[#7a4010] font-bold hover:underline">Ver mapa →</button>
      </div>

      {/* Contenedor con imagen de fondo */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{ height: 210, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.18)' }}
      >
        {/* Imagen de fondo */}
        <img
          src="https://i.postimg.cc/tCGKsZ7y/14.png"
          alt="Finca"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay oscuro degradado para contraste */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />

        {/* Galpones — tarjetas glass flotando */}
        {galones.map(({ label, estado, color, dot, x, y }) => (
          <div
            key={label}
            className="absolute"
            style={{ left: x, top: y, transform: 'translateX(-50%)' }}
          >
            <div
              className="px-2.5 py-1.5 rounded-xl text-center whitespace-nowrap"
              style={{
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.35)',
                boxShadow: '0 1px 0 rgba(255,255,255,0.3) inset, 0 4px 12px rgba(0,0,0,0.25)',
              }}
            >
              <div className="flex items-center gap-1.5 justify-center">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dot, boxShadow: `0 0 4px ${dot}` }} />
                <p className="text-[10px] font-bold text-white">{label}</p>
              </div>
              <p className="text-[9px] font-semibold mt-0.5" style={{ color: color === '#1a6040' ? '#86efac' : '#fdba74' }}>
                {estado}
              </p>
            </div>
          </div>
        ))}

        {/* Zonas — pills glass en la parte baja */}
        {zonas.map(({ label, sub, color, x, y }) => (
          <div
            key={label}
            className="absolute"
            style={{ left: x, top: y, transform: 'translateX(-50%)' }}
          >
            <div
              className="px-2 py-1 rounded-lg text-center whitespace-nowrap"
              style={{
                background: 'rgba(0,0,0,0.35)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              <p className="text-[10px] font-bold text-white/90">{label}</p>
              <p className="text-[9px] font-semibold" style={{ color: color === '#1a6040' ? '#86efac' : '#fdba74' }}>
                {sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
