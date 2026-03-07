import type { Metadata } from 'next';
import './globals.css';
import AntdProvider from '@/components/AntdProvider';

export const metadata: Metadata = {
  title: 'PulseLine – Modern Healthcare Solutions',
  description: 'Experience seamless clinic management with live tracking, instant tokens, and effortless booking.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="text-slate-900" style={{ fontFamily: "'Inter', sans-serif" }}>
        <AntdProvider>{children}</AntdProvider>
      </body>
    </html>
  );
}
