'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerWithEmail, loginWithGoogle } from '@/lib/auth-actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm'],
});

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await registerWithEmail(data.email, data.password, data.name);
      toast.success('¡Cuenta creada! Bienvenido/a.');
      router.push('/dashboard');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.includes('email-already-in-use')) {
        toast.error('Este email ya está registrado.');
      } else {
        toast.error('Error al crear la cuenta. Intenta de nuevo.');
      }
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch {
      toast.error('Error al registrarse con Google.');
    }
  };

  const inputClass = "h-11 bg-black/25 border-white/30 text-white placeholder:text-white/50 focus:border-green-400 focus:bg-black/30";
  const labelClass = "text-white font-medium text-sm";

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name" className={labelClass}>Nombre</Label>
          <Input id="name" placeholder="Tu nombre" className={inputClass} {...register('name')} />
          {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="email" className={labelClass}>Email</Label>
          <Input id="email" type="email" placeholder="tu@email.com" className={inputClass} {...register('email')} />
          {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="password" className={labelClass}>Contraseña</Label>
          <div className="relative">
            <Input id="password" type={showPass ? 'text' : 'password'} placeholder="••••••••" className={inputClass} {...register('password')} />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="confirm" className={labelClass}>Confirmar contraseña</Label>
          <Input id="confirm" type="password" placeholder="••••••••" className={inputClass} {...register('confirm')} />
          {errors.confirm && <p className="text-xs text-red-400">{errors.confirm.message}</p>}
        </div>

        <Button type="submit" className="w-full bg-green-700 hover:bg-green-600 text-white border-0 h-10 mt-1" disabled={isSubmitting}>
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/25" />
        <span className="text-xs text-white/60">o</span>
        <div className="flex-1 h-px bg-white/25" />
      </div>

      <Button type="button" variant="outline" className="w-full h-11 bg-black/25 border-white/30 text-white hover:bg-black/40 hover:text-white" onClick={handleGoogle}>
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continuar con Google
      </Button>

      <p className="text-center text-xs text-white/60 pt-1">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-green-300 hover:text-green-200 font-medium">Iniciar sesión</Link>
      </p>
    </div>
  );
}
