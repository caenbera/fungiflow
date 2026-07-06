'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  UserPlus, Copy, Check, Trash2, Clock, Users,
  Crown, Wrench, Eye, RefreshCw, Mail,
} from 'lucide-react';
import { IconTile } from '@/components/dashboard-v2/IconTile';
import { useAuthStore } from '@/store/auth';
import {
  crearInvitacion, listarInvitaciones, revocarInvitacion,
  type Invitation,
} from '@/lib/invitations';
import type { UserRole } from '@/lib/user-role';

type InvRole = Exclude<UserRole, 'superadmin'>;

const ROLE_META: Record<InvRole, { label: string; desc: string; from: string; to: string; Icon: typeof Crown }> = {
  admin:    { label: 'Admin',    desc: 'Acceso total a la plataforma', from: '#C59A18', to: '#8a6010', Icon: Crown   },
  operador: { label: 'Operador', desc: 'Puede editar datos y registros', from: '#2a8055', to: '#1a5030', Icon: Wrench },
  lector:   { label: 'Lector',   desc: 'Solo puede consultar información', from: '#1a5070', to: '#0e3050', Icon: Eye  },
};

function statusColor(status: Invitation['status']) {
  if (status === 'accepted') return { text: '#1a6040', bg: 'rgba(26,96,64,0.10)', dot: '#22c55e', label: 'Aceptada' };
  if (status === 'expired')  return { text: '#b83020', bg: 'rgba(184,48,32,0.10)', dot: '#ef4444', label: 'Expirada' };
  return                            { text: '#b06000', bg: 'rgba(176,96,0,0.10)',  dot: '#f97316', label: 'Pendiente' };
}

function daysLeft(expiresAt: Invitation['expiresAt']): string {
  const ms = expiresAt.toMillis() - Date.now();
  if (ms <= 0) return 'Expirada';
  const days = Math.ceil(ms / 86400000);
  return `${days}d restantes`;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all hover:scale-[1.03] active:scale-95"
      style={{ background: copied ? 'rgba(26,96,64,0.12)' : 'rgba(128,96,62,0.10)', color: copied ? '#1a6040' : '#6B4A2A', border: '1px solid rgba(128,96,62,0.15)' }}>
      {copied ? <Check size={11}/> : <Copy size={11}/>}
      {copied ? 'Copiado' : 'Copiar enlace'}
    </button>
  );
}

export function Equipo() {
  const { user, orgId } = useAuthStore();
  const [invitations, setInvitations] = useState<(Invitation & { token: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<InvRole>('operador');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [newToken, setNewToken] = useState<string | null>(null);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const load = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const list = await listarInvitaciones(orgId);
      list.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      setInvitations(list);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !orgId) return;
    if (!email.trim()) { setError('Ingresa un correo'); return; }
    setSending(true);
    setError('');
    setNewToken(null);
    try {
      const token = await crearInvitacion(orgId, user.uid, email.trim(), role);
      setNewToken(token);
      setEmail('');
      await load();
    } catch (err) {
      setError('Error al crear la invitación. Intenta de nuevo.');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleRevoke = async (invId: string) => {
    if (!confirm('¿Eliminar esta invitación?')) return;
    await revocarInvitacion(invId);
    await load();
  };

  const pending = invitations.filter(i => i.status === 'pending');
  const rest    = invitations.filter(i => i.status !== 'pending');

  return (
    <div className="flex flex-col gap-4">

      {/* Create invitation */}
      <div className="surface-raised rounded-2xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <IconTile Icon={UserPlus} from="#2a8055" to="#1a5030" size={18} tileSize={40} radius="0.75rem"/>
          <div>
            <h2 className="text-sm font-bold text-[#302D28]">Invitar colaborador</h2>
            <p className="text-[11px] text-[#A08060] mt-0.5">Genera un enlace y compártelo por WhatsApp o correo.</p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="flex flex-col gap-3">
          {/* Email */}
          <div>
            <label className="text-[10px] font-bold text-[#6B4A2A] uppercase tracking-wide block mb-1">Correo del invitado</label>
            <div className="flex items-center gap-2 surface-inset rounded-xl px-3 py-2">
              <Mail size={13} className="text-[#A08060] flex-shrink-0"/>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="colaborador@ejemplo.com"
                className="flex-1 bg-transparent text-xs text-[#302D28] outline-none placeholder:text-[#C0A880]"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="text-[10px] font-bold text-[#6B4A2A] uppercase tracking-wide block mb-2">Rol</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(ROLE_META) as [InvRole, typeof ROLE_META[InvRole]][]).map(([key, meta]) => (
                <button
                  key={key} type="button"
                  onClick={() => setRole(key)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-all"
                  style={role === key
                    ? { background: `linear-gradient(145deg,${meta.from},${meta.to})`, border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 3px 10px rgba(0,0,0,0.18)' }
                    : { background: 'rgba(128,96,62,0.07)', border: '1px solid rgba(128,96,62,0.12)' }}>
                  <meta.Icon size={14} style={{ color: role === key ? 'white' : meta.from }}/>
                  <span className="text-[10px] font-bold" style={{ color: role === key ? 'white' : '#302D28' }}>{meta.label}</span>
                  <span className="text-[9px] leading-tight" style={{ color: role === key ? 'rgba(255,255,255,0.75)' : '#A08060' }}>{meta.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-[11px] text-red-600 font-medium">{error}</p>}

          <button type="submit" disabled={sending}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60"
            style={{ background: 'linear-gradient(145deg,#2a8055,#1a5030)', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 1px 0 rgba(255,255,255,0.22) inset, 0 5px 14px rgba(0,0,0,0.18)' }}>
            {sending ? <RefreshCw size={13} className="animate-spin"/> : <UserPlus size={13}/>}
            {sending ? 'Generando...' : 'Generar invitación'}
          </button>
        </form>

        {/* New link banner */}
        {newToken && (
          <div className="mt-4 rounded-xl p-3 flex flex-col gap-2"
            style={{ background: 'rgba(26,96,64,0.08)', border: '1.5px solid rgba(26,96,64,0.25)' }}>
            <div className="flex items-center gap-2">
              <Check size={13} className="text-[#1a6040]"/>
              <span className="text-[11px] font-bold text-[#1a6040]">Invitación creada — comparte este enlace:</span>
            </div>
            <div className="surface-inset rounded-lg px-3 py-2 flex items-center justify-between gap-2">
              <span className="text-[10px] text-[#6B4A2A] truncate font-mono">{`${origin}/join?token=${newToken}`}</span>
              <CopyButton text={`${origin}/join?token=${newToken}`}/>
            </div>
            <p className="text-[10px] text-[#A08060]">Válido por 7 días. Quien abra el enlace podrá unirse a tu empresa.</p>
          </div>
        )}
      </div>

      {/* Pending invitations */}
      {pending.length > 0 && (
        <div className="surface-raised rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} className="text-[#C59A18]"/>
            <h3 className="text-sm font-bold text-[#302D28]">Pendientes ({pending.length})</h3>
            <button onClick={load} className="ml-auto text-[#A08060] hover:text-[#6B4A2A]"><RefreshCw size={12}/></button>
          </div>
          <div className="flex flex-col gap-2">
            {pending.map(inv => {
              const rm = ROLE_META[inv.role as InvRole] ?? ROLE_META.operador;
              return (
                <div key={inv.id} className="surface-inset rounded-xl px-3 py-2.5 flex items-center gap-3">
                  <IconTile Icon={rm.Icon} from={rm.from} to={rm.to} size={13} tileSize={30} radius="0.5rem"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-[#302D28] truncate">{inv.email}</p>
                    <p className="text-[10px] text-[#A08060]">{rm.label} · {daysLeft(inv.expiresAt)}</p>
                  </div>
                  <CopyButton text={`${origin}/join?token=${inv.token}`}/>
                  <button onClick={() => handleRevoke(inv.id)}
                    className="p-1.5 rounded-lg hover:bg-red-100 text-[#A08060] hover:text-red-600 transition-colors">
                    <Trash2 size={12}/>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History */}
      {rest.length > 0 && (
        <div className="surface-raised rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users size={14} className="text-[#8A6D3D]"/>
            <h3 className="text-sm font-bold text-[#302D28]">Historial</h3>
          </div>
          <div className="flex flex-col gap-2">
            {rest.map(inv => {
              const st = statusColor(inv.status);
              const rm = ROLE_META[inv.role as InvRole] ?? ROLE_META.operador;
              return (
                <div key={inv.id} className="surface-inset rounded-xl px-3 py-2.5 flex items-center gap-3">
                  <IconTile Icon={rm.Icon} from={rm.from} to={rm.to} size={13} tileSize={30} radius="0.5rem"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-[#302D28] truncate">{inv.email}</p>
                    <p className="text-[10px] text-[#A08060]">{rm.label}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ background: st.bg }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }}/>
                    <span className="text-[10px] font-bold" style={{ color: st.text }}>{st.label}</span>
                  </div>
                  <button onClick={() => handleRevoke(inv.id)}
                    className="p-1.5 rounded-lg hover:bg-red-100 text-[#A08060] hover:text-red-600 transition-colors">
                    <Trash2 size={12}/>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-8 text-[#A08060] text-xs">Cargando invitaciones...</div>
      )}
      {!loading && invitations.length === 0 && !newToken && (
        <div className="surface-raised rounded-2xl p-8 text-center">
          <Users size={28} className="mx-auto text-[#C0A880] mb-2"/>
          <p className="text-sm font-bold text-[#6B4A2A]">Aún no hay invitaciones</p>
          <p className="text-[11px] text-[#A08060] mt-1">Genera tu primera invitación arriba para sumar a alguien a tu empresa.</p>
        </div>
      )}
    </div>
  );
}
