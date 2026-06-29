'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { Sidebar } from '@/components/shared/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="app-shell-3d min-h-screen flex items-center justify-center">
        <div className="surface-raised rounded-2xl px-8 py-7 text-center space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://i.postimg.cc/DzDbvHmK/logo-original.png"
            alt="FungiFlow"
            width={52}
            height={52}
            className="mx-auto animate-pulse object-contain"
          />
          <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
            Cargando tu cultivo...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="app-shell-3d flex h-screen overflow-hidden">
      <Sidebar />
      <main className="page-surface relative flex-1 overflow-y-auto">
        {/* Moss — bottom-left corner of the content area (relative to main) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/musgo-inferior-izquierda.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 z-0 w-64 select-none opacity-95"
          style={{ filter: 'drop-shadow(0 -8px 24px rgba(0,0,0,0.18))' }}
        />
        {/* Mushroom — fixed to viewport right edge, above cards */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hongo-inferior-derecho.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none fixed bottom-0 right-0 z-30 w-72 select-none opacity-95"
          style={{ filter: 'drop-shadow(0 -8px 24px rgba(0,0,0,0.18))' }}
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-7 md:px-8 lg:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}
