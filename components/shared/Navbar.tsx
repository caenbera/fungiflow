'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/auth-actions';
import { useAuthStore } from '@/store/auth';
import { CurrencyToggle } from './CurrencyToggle';
import { LogOut, LayoutDashboard, FileText, Calculator, Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/cotizaciones', label: 'Cotizaciones', icon: FileText },
  { href: '/calculadoras', label: 'Calculadoras', icon: Calculator },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 navbar-glass">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://i.postimg.cc/DzDbvHmK/logo-original.png" alt="FungiFlow" width={36} height={36} className="object-contain" />
          <span className="font-bold text-lg text-green-700 dark:text-green-400">FungiFlow</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith(href)
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <CurrencyToggle />
          {user && (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-muted-foreground truncate max-w-[140px]">
                {user.displayName || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500 transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border px-4 py-3 flex flex-col gap-1 bg-background">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                pathname.startsWith(href)
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : 'text-muted-foreground'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-500"
            >
              <LogOut size={16} /> Cerrar sesión
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
