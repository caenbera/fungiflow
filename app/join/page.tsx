import type { Metadata } from 'next';
import { JoinClient } from './JoinClient';

const OG_IMAGE = 'https://i.postimg.cc/QxYCFWvC/logo.png';
const TITLE    = '🍄 Te invitaron a FungiFlow';
const DESC     = 'Únete al equipo y empieza a colaborar en la gestión integral del cultivo de hongos.';

export const metadata: Metadata = {
  metadataBase: new URL('https://fungiflow.vercel.app'),
  title: 'Te invitaron a FungiFlow',
  description: DESC,
  openGraph: {
    url: 'https://fungiflow.vercel.app/join',
    title: TITLE,
    description: DESC,
    images: [{ url: OG_IMAGE, width: 1254, height: 1254, alt: 'FungiFlow — Invitación al equipo' }],
    type: 'website',
    siteName: 'FungiFlow',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESC,
    images: [OG_IMAGE],
  },
};

export default function JoinPage() {
  return <JoinClient />;
}
