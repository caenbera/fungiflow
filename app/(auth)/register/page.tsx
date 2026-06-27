import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-[#1a1a0a]">
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
        <div className="w-full flex flex-col justify-end" style={{ minHeight: '820px' }}>
          <div className="px-8 pb-8 pt-0">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
