import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// This explicitly controls the Browser Tab, Favicon, and global SEO
export const metadata: Metadata = {
  title: 'WebAgen Studio | Best AI-Powered Web Development Agency in India',
  description: 'Stop paying for slow, outdated WordPress sites. WebAgen Studio builds high-performance Next.js websites with custom AI agents and smart analytics in 7 days.',
  keywords: 'best AI web development agency in India, custom Next.js websites, affordable SaaS developers, AI chatbot integration, web design Punjab, automated web apps, WebAgen Studio',
  icons: {
    icon: '/icon.png', // Points to your newly added icon.png
  },
  openGraph: {
    title: 'WebAgen Studio | AI-Powered Web Development India',
    description: 'High-performance Next.js websites powered by custom AI agents and smart analytics. We build digital engines that convert in 7 days.',
    url: 'https://webagen.dev',
    siteName: 'WebAgen Studio',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="no-transitions" data-theme="dark" style={{ backgroundColor: "rgb(5, 5, 5)" }}>
      <body className={`${inter.className} min-h-full flex flex-col no-transitions`}>{children}</body>
    </html>
  )
}