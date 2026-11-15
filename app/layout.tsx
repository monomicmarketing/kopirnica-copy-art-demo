import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'COPY Art — nezvanični demo koncept',
  description: 'Nezvanični koncept za Kopirnicu COPY Art u Privrednom gradu Skenderija. Fotokopiranje, printanje dokumenata i uvezivanje.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="bs"><head><link rel="preload" href="/fonts/archivo-black-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/><link rel="preload" href="/fonts/outfit-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body>{children}</body></html>;
}
