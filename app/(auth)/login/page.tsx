import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-[#1a1a0a]">
      {/* Fondo con transparencia y escala reducida */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('https://i.postimg.cc/gkbDvSmb/fondo-03.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
        }}
      />

      {/* Card contenedor */}
      <div
        className="relative z-10 w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          backgroundImage: "url('https://i.postimg.cc/g0dNmwXG/registro-login-01.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="w-full flex flex-col justify-end" style={{ minHeight: '620px' }}>
          <div className="px-14 pb-8 pt-0">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
