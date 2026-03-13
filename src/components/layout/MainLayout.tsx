import { Geist, Geist_Mono } from 'next/font/google';
import Header from '../common/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function MainLayout({
  children,
  isStory = false,
}: Readonly<{
  children: React.ReactNode;
}> & { isStory?: boolean }) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased w-full min-h-screen bg-background text-foreground`}
    >
      {!isStory && <Header />}
      {children}
    </div>
  );
}
