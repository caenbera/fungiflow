import { AuthCarousel } from '@/components/auth/AuthCarousel';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-[#FAF7F2] dark:bg-[#120a04]">

      {/* ── LEFT — Carousel ── */}
      <div className="hidden lg:block lg:w-[58%] xl:w-[60%] flex-shrink-0">
        <AuthCarousel />
      </div>

      {/* ── RIGHT — Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 bg-[#FAF7F2] dark:bg-[#120a04] relative overflow-hidden">
        {/* Subtle leaf watermark */}
        <div
          className="absolute top-0 right-0 w-48 h-48 opacity-[0.06] dark:opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath fill='%237a4010' d='M100 10 C60 10 20 50 20 100 C20 150 60 180 100 190 C140 180 180 150 180 100 C180 50 140 10 100 10Z M100 30 C130 30 160 60 160 100 C160 140 130 165 100 175 C70 165 40 140 40 100 C40 60 70 30 100 30Z'/%3E%3C/svg%3E\")",
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        />

        <div className="w-full max-w-sm relative z-10">
          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="FungiFlow" className="w-24 h-24 object-contain" />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <p className="text-sm font-medium text-[#7a4010] dark:text-[#c07040] mb-1">Bienvenido a</p>
            <h1
              className="text-4xl font-extrabold text-[#2a1408] dark:text-[#f0dfc0] leading-tight"
              style={{ fontFamily: 'var(--font-serif, serif)' }}
            >
              FungiFlow
            </h1>
            <p className="mt-2 text-sm text-[#8a7060] dark:text-[#9a7a5a]">
              Inicia sesión para continuar
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
