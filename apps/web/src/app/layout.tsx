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
    capable: true,
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#ef4444" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="le feu" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo_lefeu_0-removebg-preview.png" />
        <link rel="apple-touch-icon" href="/logo_lefeu_0-removebg-preview.png" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 