import type { Metadata } from 'next';
import { JoinClient } from './JoinClient';

const OG_IMAGE = 'https://i.postimg.cc/QxYCFWvC/logo.png';
const TITLE    = '🍄 Te invitaron a FungiFlow';
const DESC     = 'Únete al equipo y empieza a colaborar en la gestión integral del cultivo de hongos.';

export const metadata: Metadata = {
  title: 'Te invitaron a FungiFlow',
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'FungiFlow — Invitación al equipo' }],
    type: 'website',
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
