import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/shared/AuthProvider';
import { Toaster } from '@/components/ui/sonner';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FungiFlow — Gestiona el ritmo de tu cultivo',
  description: 'Formulación y análisis financiero de proyectos de cultivo de hongos orellana',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geist.variable} font-sans bg-background text-foreground min-h-screen antialiased`}>
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
