import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: "bufgix 레시피 블로그",
  description: "개발자 bufgix의 레시피 아카이빙",
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="light">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        {/* Disqus 댓글 수 카운트 스크립트 */}
        <script id="dsq-count-scr" src="//bufgix-recipe.disqus.com/count.js" async></script>
      </body>
    </html>
  )
}

// Disqus 타입 선언
declare global {
  interface Window {
    DISQUSWIDGETS?: {
      getCount: (options: { reset: boolean }) => void
    }
  }
}
