'use client';

import { useState } from 'react';
import { X, Truck } from 'lucide-react';
import { CATEGORIAS_PROV, type CategoriaProveedor, type EstadoProveedor } from './mock-data';

interface Props {
  onClose: () => void;
}

export function ModalNuevoProveedor({ onClose }: Props) {
  const [form, setForm] = useState({
    nombre: '', nit: '', categoria: '' as CategoriaProveedor | '',
    productos: '', email: '', telefono: '',
    estado: 'Activo' as EstadoProveedor, notas: '', estrategico: false,
  });
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.categoria) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    onClose();
  };

  const inputCls = 'w-full surface-inset rounded-xl px-3 py-2.5 text-sm text-[#302D28] outline-none placeholder:text-[#C0A880]';
  const labelCls = 'text-[10px] font-bold text-[#6B4A2A] uppercase tracking-wide block mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="surface-raised rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[rgba(128,96,62,0.12)]">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(145deg,#9a5020,#6a3010)', boxShadow: '0 3px 8px rgba(0,0,0,0.18)' }}>
            <Truck size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#302D28]">Nuevo proveedor</h2>
            <p className="text-[11px] text-[#A08060]">Registra un nuevo proveedor en el sistema</p>
          </div>
          <button onClick={onClose} className="ml-auto w-8 h-8 rounded-xl flex items-center justify-center text-[#A08060] hover:text-[#302D28] hover:bg-[rgba(128,96,62,0.08)] transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={labelCls}>Nombre / Razón social *</label>
              <input value={form.nombre} onChange={set('nombre')} placeholder="Ej: Aserraderos del Valle S.A.S" required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>NIT</label>
              <input value={form.nit} onChange={set('nit')} placeholder="900.123.456-7" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Categoría *</label>
              <select value={form.categoria} onChange={set('categoria')} required className={inputCls + ' appearance-none cursor-pointer'}>
                <option value="">Seleccionar...</option>
                {CATEGORIAS_PROV.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Productos principales</label>
              <input value={form.productos} onChange={set('productos')} placeholder="Ej: Aserrín, Viruta, Paja" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Correo electrónico</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="contacto@proveedor.com" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Teléfono</label>
              <input value={form.telefono} onChange={set('telefono')} placeholder="+57 300 000 0000" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Estado</label>
              <select value={form.estado} onChange={set('estado')} className={inputCls + ' appearance-none cursor-pointer'}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="En evaluación">En evaluación</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-5">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={form.estrategico} onChange={e => setForm(f => ({ ...f, estrategico: e.target.checked }))} className="sr-only peer" />
                <div className="w-9 h-5 rounded-full transition-all peer-checked:bg-[#2a8055] bg-[#C0A880]
                  after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-4" />
              </label>
              <span className="text-[11px] font-semibold text-[#6B4A2A]">Marcar como estratégico</span>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Notas</label>
              <textarea value={form.notas} onChange={set('notas')} placeholder="Condiciones, observaciones, historial..." rows={3}
                className={inputCls + ' resize-none'} />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-[#6B4A2A] surface-inset hover:bg-[rgba(128,96,62,0.08)] transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white disabled:opacity-60 transition-all hover:scale-[1.02] active:scale-95"
              style={{ background: 'linear-gradient(145deg,#9a5020,#6a3010)', boxShadow: '0 1px 0 rgba(255,255,255,0.22) inset, 0 5px 14px rgba(0,0,0,0.18)' }}>
              {saving ? 'Guardando...' : 'Guardar proveedor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
