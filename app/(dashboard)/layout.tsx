'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { Sidebar } from '@/components/shared/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
      <Sidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />
      <main className="page-surface relative flex-1 overflow-y-auto">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3"
          style={{ background: 'var(--surface-base, #FAF7F2)', borderBottom: '1px solid rgba(128,96,62,0.12)', boxShadow: '0 2px 8px rgba(88,57,31,0.08)' }}>
          <button
            onClick={() => setMobileNavOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-xl transition-all active:scale-95"
            style={{ background: 'linear-gradient(145deg,#FFF9EF,#E6D8C5)', border: '1px solid rgba(255,255,255,0.78)', boxShadow: '0 1px 0 rgba(255,255,255,0.78) inset, 0 2px 5px rgba(88,57,31,0.10)' }}
            aria-label="Abrir menú">
            <Menu size={18} className="text-[#6B4A2A]" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://i.postimg.cc/DzDbvHmK/logo-original.png" alt="FungiFlow" className="w-7 h-7 object-contain" />
          <span className="text-sm font-bold text-[#302D28]" style={{ fontFamily: 'var(--font-serif, serif)' }}>FungiFlow</span>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-7 md:px-8 lg:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}
