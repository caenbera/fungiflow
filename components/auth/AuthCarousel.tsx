'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const SLIDES = Array.from({ length: 14 }, (_, i) => `/carousel/${String(i + 1).padStart(2, '0')}.png`);

const INTERVAL = 2000;

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
        <path d="M14 17h7M17 14v7"/>
      </svg>
    ),
    text: 'Control total de tu producción',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 4-6"/>
      </svg>
    ),
    text: 'Decisiones basadas en datos',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
      </svg>
    ),
    text: 'Mayor rentabilidad y eficiencia',
  },
];

export function AuthCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((index: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(index);
      setFading(false);
    }, 400);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      goTo((current + 1) % SLIDES.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [current, paused, goTo]);

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Image layer */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <Image
          src={SLIDES[current]}
          alt=""
          fill
          className="object-cover"
          priority={current === 0}
        />
      </div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />

      {/* Logo */}
      <div className="absolute top-8 left-0 right-0 flex justify-center z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="FungiFlow" className="w-24 h-24 object-contain drop-shadow-lg" />
      </div>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-10 z-10 text-center">
        <h1
          className="text-white font-extrabold text-4xl leading-tight drop-shadow-lg mb-4"
          style={{ fontFamily: 'var(--font-serif, serif)', textShadow: '0 2px 12px rgba(0,0,0,.55)' }}
        >
          Gestiona el ritmo<br />de tu cultivo
        </h1>
        <p className="text-white/85 text-base max-w-xs leading-relaxed drop-shadow">
          Plataforma integral para el control, seguimiento y crecimiento de tu producción de hongos.
        </p>
      </div>

      {/* Feature badges */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-4 px-6 z-10 flex-wrap">
        {FEATURES.map(({ icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/15"
          >
            <span className="text-lg">{icon}</span>
            <span className="text-white/90 text-xs font-medium leading-tight max-w-[90px]">{text}</span>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? 20 : 6,
              height: 6,
              background: i === current ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.40)',
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Pause indicator */}
      {paused && (
        <div className="absolute top-4 right-4 z-10 bg-black/40 rounded-lg px-2 py-1">
          <span className="text-white/60 text-xs">⏸</span>
        </div>
      )}
    </div>
  );
}
