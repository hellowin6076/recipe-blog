import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'DevRecipe - 오사카에서의 한국 레시피',
    template: '%s | DevRecipe'
  },
  description: '오사카에서 공유하는 한국 레시피. 집에서 쉽게 따라할 수 있는 한국 요리와 일본에서의 요리 생활을 기록합니다.',
  keywords: ['한국 요리', '레시피', '오사카', '일본 생활', '한식', '집밥', '요리 블로그', 'bufgix'],
  authors: [{ name: 'bufgix' }],
  creator: 'bufgix',
  publisher: 'bufgix',
  metadataBase: new URL('https://recipe-blog-bufgixs-projects.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'DevRecipe - 오사카에서의 한국 레시피',
    description: '오사카에서 공유하는 한국 레시피',
    url: 'https://recipe-blog-bufgixs-projects.vercel.app',
    siteName: 'DevRecipe',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DevRecipe',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevRecipe - 오사카에서의 한국 레시피',
    description: '오사카에서 공유하는 한국 레시피',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
  verification: {
    google: 'Iwb0bx5O6TMuXbAuEcYsFCoCDXEzZqBvxHIMDDcAxws',
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
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID} />
        )}
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