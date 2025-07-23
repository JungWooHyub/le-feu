import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'le feu - 셰프와 외식업 종사자를 위한 플랫폼',
  description: '요식업 업계 종사자들을 위한 셰프 중심의 콘텐츠 큐레이션 + 업계 전용 커뮤니티 + 직무 맞춤 채용보드 플랫폼',
  keywords: ['셰프', '요식업', '커뮤니티', '채용', '큐레이션'],
  authors: [{ name: 'le feu Team' }],
  openGraph: {
    title: 'le feu',
    description: '셰프와 외식업 종사자를 위한 플랫폼',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
} 