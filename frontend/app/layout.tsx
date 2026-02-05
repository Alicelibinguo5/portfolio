import type { Metadata } from 'next'
import { Playfair_Display, Source_Sans_3 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import { LayoutClient } from './LayoutClient'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://libinguo.com'

export const metadata: Metadata = {
  title: {
    default: 'Libin Guo — Full-Stack Data Engineer',
    template: '%s | Libin Guo',
  },
  description:
    'Full-stack data engineer building production-grade data platforms, pipelines, and AI/agent-driven systems. Apple, JPMorgan, healthcare. Data infrastructure, analytics, and intelligent decision-making.',
  keywords: [
    'data engineer',
    'data platforms',
    'data pipelines',
    'AI agents',
    'Apple',
    'JPMorgan',
    'Python',
    'FastAPI',
    'Kafka',
    'Flink',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Libin Guo',
    title: 'Libin Guo — Full-Stack Data Engineer',
    description:
      'Full-stack data engineer building production-grade data platforms, pipelines, and AI/agent-driven systems. Apple, JPMorgan, healthcare.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Libin Guo — Full-Stack Data Engineer',
    description:
      'Full-stack data engineer building data platforms, pipelines, and AI/agent systems. Apple, JPMorgan, healthcare.',
  },
  metadataBase: new URL(siteUrl),
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Libin Guo',
  jobTitle: 'Full-Stack Data Engineer',
  worksFor: { '@type': 'Organization', name: 'Apple' },
  url: siteUrl,
  sameAs: [
    'https://www.linkedin.com/in/libinguo/',
    'https://github.com/Alicelibinguo5',
  ],
  description:
    'Full-stack data engineer focused on data platforms, pipelines, and AI/agent-driven systems. Previously at JPMorgan and a healthcare startup.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <LayoutClient>{children}</LayoutClient>
        <Analytics />
      </body>
    </html>
  )
}
