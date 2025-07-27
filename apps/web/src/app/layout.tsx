import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '../components/providers/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'le feu - 요식업 전용 플랫폼',
  description: '셰프와 외식업 종사자를 위한 콘텐츠 큐레이션, 커뮤니티, 채용 정보',
  manifest: '/manifest.json',
  themeColor: '#ef4444',
  appleWebApp: {
    capable: false, // deprecated 경고 해결
    statusBarStyle: 'default',
    title: 'le feu',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/logo_lefeu_0-removebg-preview.png',
    apple: '/logo_lefeu_0-removebg-preview.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        {/* Next.js metadata API를 사용하므로 수동 메타 태그 제거 */}
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 