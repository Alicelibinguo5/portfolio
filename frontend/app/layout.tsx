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
    default: 'Libin Guo — Senior Data Engineer',
    template: '%s | Libin Guo',
  },
  description:
    'Senior Data Engineer building petabyte-scale lakehouses and AI training-data infrastructure with Spark, Ray, Iceberg, and Kubernetes. Previously Reka AI, Apple, and JPMorgan Chase.',
  keywords: [
    'senior data engineer',
    'data platform engineer',
    'AI training data',
    'ML data infrastructure',
    'Apache Spark',
    'Ray',
    'Apache Iceberg',
    'lakehouse',
    'Kubernetes',
    'Airflow',
    'Python',
    'Reka AI',
    'Apple',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Libin Guo',
    title: 'Libin Guo — Senior Data Engineer',
    description:
      'Senior Data Engineer: petabyte-scale lakehouses and AI training-data pipelines. Spark, Ray, Iceberg, Kubernetes. Reka AI, Apple, JPMorgan.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Libin Guo — Senior Data Engineer',
    description:
      'Senior Data Engineer: petabyte-scale lakehouses and AI training-data pipelines. Spark, Ray, Iceberg, Kubernetes. Reka AI, Apple, JPMorgan.',
  },
  metadataBase: new URL(siteUrl),
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Libin Guo',
  jobTitle: 'Senior Data Engineer',
  alumniOf: [
    { '@type': 'Organization', name: 'Reka AI' },
    { '@type': 'Organization', name: 'Apple' },
    { '@type': 'Organization', name: 'JPMorgan Chase' },
    { '@type': 'CollegeOrUniversity', name: 'The University of Texas at Dallas' },
  ],
  knowsAbout: ['Apache Spark', 'Ray', 'Apache Iceberg', 'Kubernetes', 'Airflow', 'AI training data'],
  url: siteUrl,
  sameAs: [
    'https://www.linkedin.com/in/libinguo/',
    'https://github.com/Alicelibinguo5',
  ],
  description:
    'Senior Data Engineer building petabyte-scale lakehouses and AI training-data infrastructure with Spark, Ray, Iceberg, and Kubernetes. Previously Reka AI, Apple, and JPMorgan Chase.',
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
