import MainLayout from '@/components/MainLayout';
import './globals.css';

export const metadata = {
  title: {
    template: '%s | Subnavi - 서브컬쳐 행사 정보',
    default: 'Subnavi - 서브컬쳐 행사 정보',
  },
  description:
    '애니메이션, 게임, 만화, 코스프레 등 서브컬쳐 행사 정보를 한눈에! 콘서트, 전시회, 팬미팅, 굿즈샵 이벤트까지 놓치지 마세요.',
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
  creator: 'Subnavi',
  publisher: 'Subnavi',
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
    title: 'Subnavi - 서브컬쳐 행사 정보',
    description:
      '애니메이션, 게임, 만화, 코스프레 등 서브컬쳐 행사 정보를 한눈에! 콘서트, 전시회, 팬미팅, 굿즈샵 이벤트까지 놓치지 마세요.',
    siteName: 'Subnavi',
    images: [
      {
        url: '/subnavi-og.svg', // 1200x630 크기 권장
        width: 1200,
        height: 630,
        alt: 'Subnavi - 서브컬쳐 행사 정보',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Subnavi - 서브컬쳐 행사 정보',
    description:
      '애니메이션, 게임, 만화, 코스프레 등 서브컬쳐 행사 정보를 한눈에!',
    site: '', // 실제 트위터 계정으로 변경
    creator: '',
    images: ['/subnavi-og.svg'], // 1200x600 크기 권장
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
    google: 'google-site-verification-code', // Google Search Console 인증 코드
    naver: 'naver-site-verification-code', // 네이버 웹마스터 인증 코드
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
