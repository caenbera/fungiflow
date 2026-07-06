'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Users, CheckCircle, XCircle, Clock, LogIn, UserPlus, Eye, Wrench, Crown } from 'lucide-react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getInvitacionByToken, aceptarInvitacion } from '@/lib/invitations';
import { setUserProfile } from '@/lib/user-role';
import type { Invitation } from '@/lib/invitations';
import type { UserRole } from '@/lib/user-role';

type InvRole = Exclude<UserRole, 'superadmin'>;

const ROLE_META: Record<InvRole, { label: string; Icon: typeof Crown; color: string }> = {
  admin:    { label: 'Administrador', Icon: Crown,  color: '#C59A18' },
  operador: { label: 'Operador',      Icon: Wrench, color: '#2a8055' },
  lector:   { label: 'Lector',        Icon: Eye,    color: '#1a5070' },
};

type Mode = 'register' | 'login';

function JoinPageInner() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token') ?? '';

  const [inv, setInv] = useState<(Invitation & { token: string }) | null>(null);
  const [loadingInv, setLoadingInv] = useState(true);
  const [invError, setInvError] = useState('');

  const [mode, setMode] = useState<Mode>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) { setInvError('Enlace inválido o sin token.'); setLoadingInv(false); return; }
    getInvitacionByToken(token)
      .then((data) => {
        if (!data) { setInvError('La invitación no existe.'); return; }
        if (data.status === 'accepted') { setInvError('Esta invitación ya fue usada.'); return; }
        if (data.status === 'expired' || data.expiresAt.toMillis() < Date.now()) {
          setInvError('Esta invitación ha expirado.'); return;
        }
        setInv(data);
        setEmail(data.email);
      })
      .catch(() => setInvError('Error al cargar la invitación.'))
      .finally(() => setLoadingInv(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inv) return;
    setFormError('');
    setSubmitting(true);
    try {
      let uid: string;
      if (mode === 'register') {
        if (!name.trim()) { setFormError('Ingresa tu nombre'); setSubmitting(false); return; }
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name.trim() });
        uid = cred.user.uid;
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        uid = cred.user.uid;
      }
      await aceptarInvitacion(token, uid);
      await setUserProfile(uid, { role: inv.role as InvRole, orgId: inv.orgId });
      setDone(true);
      setTimeout(() => router.push('/dashboard'), 2500);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/email-already-in-use') setFormError('Ya existe una cuenta con ese correo. Usa "Iniciar sesión".');
      else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') setFormError('Contraseña incorrecta.');
      else if (code === 'auth/weak-password') setFormError('La contraseña debe tener al menos 6 caracteres.');
      else setFormError('Ocurrió un error. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading
  if (loadingInv) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#2a8055] border-t-transparent animate-spin mx-auto"/>
          <p className="text-sm text-[#8A6D3D]">Verificando invitación...</p>
        </div>
      </div>
    );
  }

  // Invalid invitation
  if (invError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4">
        <div className="surface-raised rounded-2xl p-8 max-w-sm w-full text-center space-y-4">
          <XCircle size={40} className="mx-auto text-red-400"/>
          <h1 className="text-lg font-bold text-[#302D28]">Invitación no válida</h1>
          <p className="text-sm text-[#A08060]">{invError}</p>
          <button onClick={() => router.push('/login')}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white"
            style={{ background: 'linear-gradient(145deg,#2a8055,#1a5030)' }}>
            Ir al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  // Success
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4">
        <div className="surface-raised rounded-2xl p-8 max-w-sm w-full text-center space-y-4">
          <CheckCircle size={40} className="mx-auto text-[#2a8055]"/>
          <h1 className="text-lg font-bold text-[#302D28]">¡Bienvenido al equipo!</h1>
          <p className="text-sm text-[#A08060]">Tu cuenta quedó vinculada a la empresa. Redirigiendo...</p>
        </div>
      </div>
    );
  }

  const roleMeta = inv ? (ROLE_META[inv.role as InvRole] ?? ROLE_META.operador) : ROLE_META.operador;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4 py-12">
      <div className="w-full max-w-sm flex flex-col gap-4">

        {/* Logo */}
        <div className="flex justify-center">
          <img src="https://i.postimg.cc/DzDbvHmK/logo-original.png" alt="FungiFlow" className="w-16 h-16 object-contain"/>
        </div>

        {/* Invitation card */}
        <div className="surface-raised rounded-2xl p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Users size={14} className="text-[#8A6D3D]"/>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#8A6D3D]">Invitación a FungiFlow</p>
          </div>
          <h1 className="text-xl font-bold text-[#302D28] mt-2">Te han invitado</h1>
          <p className="text-xs text-[#A08060] mt-1">
            Únete a la empresa y empieza a colaborar en la plataforma.
          </p>
          <div className="flex items-center justify-center gap-2 mt-3 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(128,96,62,0.08)', border: '1px solid rgba(128,96,62,0.15)' }}>
            <roleMeta.Icon size={13} style={{ color: roleMeta.color }}/>
            <span className="text-[11px] font-bold" style={{ color: roleMeta.color }}>Rol: {roleMeta.label}</span>
          </div>
          <div className="flex items-center justify-center gap-1 mt-2">
            <Clock size={10} className="text-[#A08060]"/>
            <span className="text-[10px] text-[#A08060]">
              Expira el {new Date(inv!.expiresAt.toMillis()).toLocaleDateString('es-CO', { day: 'numeric', month: 'long' })}
            </span>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="surface-raised rounded-2xl p-1 flex gap-1">
          {(['register', 'login'] as Mode[]).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold transition-all"
              style={mode === m
                ? { background: 'linear-gradient(145deg,#2a8055,#1a5030)', color: 'white', boxShadow: '0 3px 8px rgba(42,128,85,0.25)' }
                : { color: '#8A6D3D' }}>
              {m === 'register' ? <><UserPlus size={11}/> Crear cuenta</> : <><LogIn size={11}/> Ya tengo cuenta</>}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="surface-raised rounded-2xl p-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === 'register' && (
              <div>
                <label className="text-[10px] font-bold text-[#6B4A2A] uppercase tracking-wide block mb-1">Nombre completo</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre"
                  className="w-full surface-inset rounded-xl px-3 py-2 text-xs text-[#302D28] outline-none placeholder:text-[#C0A880]"/>
              </div>
            )}
            <div>
              <label className="text-[10px] font-bold text-[#6B4A2A] uppercase tracking-wide block mb-1">Correo</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="correo@ejemplo.com"
                className="w-full surface-inset rounded-xl px-3 py-2 text-xs text-[#302D28] outline-none placeholder:text-[#C0A880]"/>
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#6B4A2A] uppercase tracking-wide block mb-1">Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full surface-inset rounded-xl px-3 py-2 text-xs text-[#302D28] outline-none placeholder:text-[#C0A880]"/>
            </div>
            {formError && <p className="text-[11px] text-red-600 font-medium">{formError}</p>}
            <button type="submit" disabled={submitting}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white disabled:opacity-60 transition-all hover:scale-[1.02] active:scale-95"
              style={{ background: 'linear-gradient(145deg,#2a8055,#1a5030)', boxShadow: '0 1px 0 rgba(255,255,255,0.22) inset, 0 5px 14px rgba(0,0,0,0.18)' }}>
              {submitting
                ? 'Procesando...'
                : mode === 'register' ? 'Crear cuenta y unirme' : 'Iniciar sesión y unirme'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="w-10 h-10 rounded-full border-2 border-[#2a8055] border-t-transparent animate-spin"/>
      </div>
    }>
      <JoinPageInner/>
    </Suspense>
  );
}
