import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'COPY Art — nezvanični demo koncept',
  description: 'Nezvanični koncept za Kopirnicu COPY Art u Privrednom gradu Skenderija. Fotokopiranje, printanje dokumenata i uvezivanje.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="bs"><body>{children}</body></html>;
}
