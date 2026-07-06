import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Te invitaron a FungiFlow',
  description: 'Acepta la invitación y únete al equipo de gestión de cultivos de hongos.',
  openGraph: {
    title: '🍄 Te invitaron a FungiFlow',
    description: 'Únete a nuestra empresa en FungiFlow — la plataforma de gestión integral de cultivos de hongos.',
    images: [
      {
        url: 'https://i.postimg.cc/DzDbvHmK/logo-original.png',
        width: 512,
        height: 512,
        alt: 'FungiFlow',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '🍄 Te invitaron a FungiFlow',
    description: 'Únete a nuestra empresa en FungiFlow — la plataforma de gestión integral de cultivos de hongos.',
    images: ['https://i.postimg.cc/DzDbvHmK/logo-original.png'],
  },
};

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
