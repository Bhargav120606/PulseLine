import type { Metadata } from 'next';
import './globals.css';
import AntdProvider from '@/components/AntdProvider';

export const metadata: Metadata = {
  title: 'Pulseline – Digital Queue Management for Clinics',
  description: 'Manage patient appointments and reduce waiting time with a smart digital queue system.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdProvider>{children}</AntdProvider>
      </body>
    </html>
  );
}
