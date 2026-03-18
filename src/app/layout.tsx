import type { Metadata } from 'next';

import MainLayout from '@/components/layout/MainLayout';
import { getMetadataBase, getOptionalEnvValue } from '@/utils/siteConfig';
import './globals.css';

const SITE_NAME = 'Subnavi';
const SITE_TITLE = 'Subnavi - 서브컬쳐 행사 정보';
const SITE_DESCRIPTION =
  '애니메이션, 게임, 만화, 코스프레 등 서브컬쳐 행사 정보를 한눈에! 콘서트, 전시회, 팬미팅, 굿즈샵 이벤트까지 놓치지 마세요.';
const SITE_OG_IMAGE = '/subnavi-og.svg';
const TWITTER_HANDLE = getOptionalEnvValue(process.env.TWITTER_HANDLE);
const GOOGLE_SITE_VERIFICATION = getOptionalEnvValue(process.env.GOOGLE_SITE_VERIFICATION);
const NAVER_SITE_VERIFICATION = getOptionalEnvValue(process.env.NAVER_SITE_VERIFICATION);

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    template: '%s | Subnavi',
    default: SITE_TITLE,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    '서브컬쳐',
    '애니메이션',
    '게임',
    '만화',
    '코스프레',
    '콘서트',
    '전시회',
    '팬미팅',
    '굿즈',
    '이벤트',
    '오타쿠',
    '덕후',
    '행사정보',
    '일정',
    'subnavi',
  ],
  authors: [{ name: 'Subnavi Team' }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/subnavi-favicon.svg',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
    ...(TWITTER_HANDLE ? { site: TWITTER_HANDLE, creator: TWITTER_HANDLE } : {}),
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    ...(GOOGLE_SITE_VERIFICATION ? { google: GOOGLE_SITE_VERIFICATION } : {}),
  },
  ...(NAVER_SITE_VERIFICATION
    ? {
        other: {
          'naver-site-verification': NAVER_SITE_VERIFICATION,
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}