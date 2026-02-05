import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import '@/styles/globals.css';
import '@/styles/components.css';

export const metadata: Metadata = {
  title: 'Talka - Text-to-Speech Platform',
  description: 'Self-hosted TTS platform with voice cloning',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
