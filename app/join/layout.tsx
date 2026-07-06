import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Te invitaron a FungiFlow',
  description: 'Únete al equipo y empieza a colaborar en la gestión integral del cultivo de hongos.',
  openGraph: {
    title: '🍄 Te invitaron a FungiFlow',
    description: 'Únete al equipo y empieza a colaborar en la gestión integral del cultivo de hongos.',
    images: [
      {
        url: 'https://i.postimg.cc/QxYCFWvC/logo.png',
        width: 1254,
        height: 1254,
        alt: 'FungiFlow — Invitación al equipo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '🍄 Te invitaron a FungiFlow',
    description: 'Únete al equipo y empieza a colaborar en la gestión integral del cultivo de hongos.',
    images: ['https://i.postimg.cc/QxYCFWvC/logo.png'],
  },
};

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
