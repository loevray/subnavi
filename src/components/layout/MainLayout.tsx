import { Geist, Geist_Mono } from 'next/font/google';
import { Suspense } from 'react';
import Header from '../common/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

function HeaderFallback() {
  return (
    <header className="sticky top-0 left-0 right-0 z-40 border-b border-gray-100 bg-white/50 backdrop-blur-sm">
      <div className="h-16 w-full" />
    </header>
  );
}

export default function MainLayout({
  children,
  isStory = false,
}: Readonly<{
  children: React.ReactNode;
}> & { isStory?: boolean }) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50`}
    >
      {!isStory && (
        <Suspense fallback={<HeaderFallback />}>
          <Header />
        </Suspense>
      )}
      {children}
    </div>
  );
}
