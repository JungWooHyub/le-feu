import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'le feu - 요식업 전용 플랫폼',
  description: '셰프와 외식업 종사자를 위한 콘텐츠 큐레이션, 커뮤니티, 채용 정보',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  )
} 