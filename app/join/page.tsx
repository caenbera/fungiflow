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
import { AuthCarousel } from '@/components/auth/AuthCarousel';
import { getInvitacionByToken, aceptarInvitacion } from '@/lib/invitations';
import { setUserProfile } from '@/lib/user-role';
import type { Invitation } from '@/lib/invitations';
import type { UserRole } from '@/lib/user-role';

type InvRole = Exclude<UserRole, 'superadmin'>;

const ROLE_META: Record<InvRole, {
  label: string; Icon: typeof Crown; color: string;
  from: string; to: string; perks: string[];
}> = {
  admin: {
    label: 'Administrador', Icon: Crown, color: '#C59A18',
    from: '#C59A18', to: '#8a6010',
    perks: ['Acceso completo a la operación', 'Invitar y gestionar el equipo', 'Configurar la empresa', 'Ver costos y reportes financieros'],
  },
  operador: {
    label: 'Operador', Icon: Wrench, color: '#2a8055',
    from: '#2a8055', to: '#1a5030',
    perks: ['Registrar cosechas e inventario', 'Gestionar órdenes y ventas', 'Consultar reportes', 'Trabajo diario en la plataforma'],
  },
  lector: {
    label: 'Lector', Icon: Eye, color: '#1a5070',
    from: '#1a5070', to: '#0e3050',
    perks: ['Consultar reportes y datos', 'Ver inventario y producción', 'Sin modificar información', 'Acceso de solo lectura'],
  },
};

type Mode = 'register' | 'login';

/* ── Shared full-screen wrappers ─────────────────────────── */

function FullScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#FAF7F2]">
      {/* Left — carousel, desktop only */}
      <div className="hidden lg:block lg:w-[58%] xl:w-[60%] flex-shrink-0">
        <AuthCarousel />
      </div>
      {/* Right — content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 bg-[#FAF7F2] relative overflow-hidden">
        {/* Watermark */}
        <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath fill='%237a4010' d='M100 10 C60 10 20 50 20 100 C20 150 60 180 100 190 C140 180 180 150 180 100 C180 50 140 10 100 10Z M100 30 C130 30 160 60 160 100 C160 140 130 165 100 175 C70 165 40 140 40 100 C40 60 70 30 100 30Z'/%3E%3C/svg%3E\")", backgroundSize:'contain', backgroundRepeat:'no-repeat' }}/>
        <div className="w-full max-w-sm relative z-10">
          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://i.postimg.cc/DzDbvHmK/logo-original.png" alt="FungiFlow" className="w-20 h-20 object-contain"/>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Inner page (needs useSearchParams) ─────────────────── */

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
      if (code === 'auth/email-already-in-use') setFormError('Ya existe una cuenta con ese correo. Usa "Ya tengo cuenta".');
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
      <FullScreen>
        <div className="text-center space-y-3 py-12">
          <div className="w-10 h-10 rounded-full border-2 border-[#2a8055] border-t-transparent animate-spin mx-auto"/>
          <p className="text-sm text-[#8A6D3D]">Verificando invitación...</p>
        </div>
      </FullScreen>
    );
  }

  // Invalid
  if (invError) {
    return (
      <FullScreen>
        <div className="surface-raised rounded-2xl p-8 text-center space-y-4">
          <XCircle size={40} className="mx-auto text-red-400"/>
          <h1 className="text-xl font-bold text-[#302D28]">Invitación no válida</h1>
          <p className="text-sm text-[#A08060]">{invError}</p>
          <button onClick={() => router.push('/login')}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white"
            style={{ background: 'linear-gradient(145deg,#2a8055,#1a5030)', boxShadow: '0 5px 14px rgba(0,0,0,0.18)' }}>
            Ir al inicio de sesión
          </button>
        </div>
      </FullScreen>
    );
  }

  // Success
  if (done) {
    return (
      <FullScreen>
        <div className="surface-raised rounded-2xl p-8 text-center space-y-4">
          <CheckCircle size={44} className="mx-auto text-[#2a8055]"/>
          <h1 className="text-xl font-bold text-[#302D28]">¡Bienvenido al equipo!</h1>
          <p className="text-sm text-[#A08060]">Tu cuenta quedó vinculada a la empresa. Redirigiendo...</p>
        </div>
      </FullScreen>
    );
  }

  const roleMeta = inv ? (ROLE_META[inv.role as InvRole] ?? ROLE_META.operador) : ROLE_META.operador;

  return (
    <FullScreen>
      <div className="flex flex-col gap-4">

        {/* Greeting */}
        <div>
          <p className="text-sm font-medium text-[#7a4010] mb-1">Fuiste invitado a</p>
          <h1 className="text-4xl font-extrabold text-[#2a1408] leading-tight"
            style={{ fontFamily: 'var(--font-serif, serif)' }}>
            FungiFlow
          </h1>
          <p className="mt-2 text-sm text-[#8a7060]">
            Únete y empieza a colaborar en la gestión del cultivo.
          </p>
        </div>

        {/* Role badge */}
        <div className="surface-raised rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `linear-gradient(145deg,${roleMeta.from},${roleMeta.to})`, boxShadow: '0 3px 8px rgba(0,0,0,0.18)' }}>
              <roleMeta.Icon size={16} className="text-white"/>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#8A6D3D]">Tu rol en la empresa</p>
              <p className="text-base font-extrabold text-[#302D28]">{roleMeta.label}</p>
            </div>
            <div className="ml-auto flex items-center gap-1 text-[10px] text-[#A08060]">
              <Clock size={10}/>
              <span>
                Hasta el {new Date(inv!.expiresAt.toMillis()).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-1">
            {roleMeta.perks.map(perk => (
              <li key={perk} className="flex items-start gap-1.5 text-[10px] text-[#6B4A2A]">
                <span className="mt-0.5 w-3 h-3 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ background: `${roleMeta.from}22` }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: roleMeta.from }}/>
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>

        {/* Mode toggle */}
        <div className="surface-raised rounded-2xl p-1 flex gap-1">
          {(['register', 'login'] as Mode[]).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold transition-all"
              style={mode === m
                ? { background: 'linear-gradient(145deg,#2a8055,#1a5030)', color: 'white', boxShadow: '0 3px 8px rgba(42,128,85,0.25)' }
                : { color: '#8A6D3D' }}>
              {m === 'register'
                ? <><UserPlus size={11}/> Crear cuenta</>
                : <><LogIn size={11}/> Ya tengo cuenta</>}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="surface-raised rounded-2xl p-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === 'register' && (
              <div>
                <label className="text-[10px] font-bold text-[#6B4A2A] uppercase tracking-wide block mb-1.5">Nombre completo</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre"
                  className="w-full surface-inset rounded-xl px-3 py-2.5 text-sm text-[#302D28] outline-none placeholder:text-[#C0A880]"/>
              </div>
            )}
            <div>
              <label className="text-[10px] font-bold text-[#6B4A2A] uppercase tracking-wide block mb-1.5">Correo electrónico</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="correo@ejemplo.com"
                className="w-full surface-inset rounded-xl px-3 py-2.5 text-sm text-[#302D28] outline-none placeholder:text-[#C0A880]"/>
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#6B4A2A] uppercase tracking-wide block mb-1.5">Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full surface-inset rounded-xl px-3 py-2.5 text-sm text-[#302D28] outline-none placeholder:text-[#C0A880]"/>
            </div>
            {formError && <p className="text-[11px] text-red-600 font-medium">{formError}</p>}
            <button type="submit" disabled={submitting}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-60 transition-all hover:scale-[1.02] active:scale-95"
              style={{ background: `linear-gradient(145deg,${roleMeta.from},${roleMeta.to})`, boxShadow: '0 1px 0 rgba(255,255,255,0.22) inset, 0 5px 14px rgba(0,0,0,0.18)' }}>
              {submitting
                ? 'Procesando...'
                : mode === 'register' ? 'Crear cuenta y unirme' : 'Iniciar sesión y unirme'}
            </button>
          </form>
        </div>

      </div>
    </FullScreen>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex bg-[#FAF7F2]">
        <div className="hidden lg:block lg:w-[58%] xl:w-[60%] flex-shrink-0">
          <AuthCarousel />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-[#2a8055] border-t-transparent animate-spin"/>
        </div>
      </div>
    }>
      <JoinPageInner/>
    </Suspense>
  );
}
