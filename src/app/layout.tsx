import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import '../globals.css'
import { Analytics } from '@vercel/analytics/react'
import JsonLd from '@/components/JsonLd'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
  preload: true,
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
  preload: true,
})

const BASE_URL = 'https://mahek-kasdekar.vercel.app'

export const metadata: Metadata = {
  // ── Core ──────────────────────────────────────────────────────────────────────
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Mahek Kasdekar — Writer, Artist & Photographer | Portfolio',
    template: '%s | Mahek Kasdekar',
  },
  description:
    'Mahek Kasdekar is a creative writer, watercolour artist, and photographer from Indore, India. BA History graduate of Delhi University. Explore her poetry, fiction, art, photography, and authored books.',
  keywords: [
    'Mahek Kasdekar',
    'Mahek Kasdekar portfolio',
    'Mahek Kasdekar writer',
    'Mahek Kasdekar artist',
    'Mahek Kasdekar photographer',
    'creative writer India',
    'watercolour artist India',
    'poet Indore',
    'writer Delhi University',
    'history graduate writer',
    'South Asian writer',
    'Indian female artist',
    'poetry writer India',
    'short story writer India',
    'photography portfolio India',
    'visual artist India',
    'Indian creative portfolio',
    'Mahek K',
    'mahek kasdekar instagram',
    'Delhi University history',
  ],
  authors: [{ name: 'Mahek Kasdekar', url: BASE_URL }],
  creator: 'Mahek Kasdekar',
  publisher: 'Mahek Kasdekar',

  // ── Alternates / Canonical ────────────────────────────────────────────────────
  alternates: {
    canonical: BASE_URL,
    languages: {
      'en-IN': BASE_URL,
      'en': BASE_URL,
    },
  },

  // ── Robots ────────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ── Open Graph ────────────────────────────────────────────────────────────────
  openGraph: {
    type: 'profile',
    url: BASE_URL,
    title: 'Mahek Kasdekar — Writer, Artist & Photographer',
    description:
      'Explore the creative portfolio of Mahek Kasdekar — poetry, short fiction, watercolour art, photography, and original books. BA History, Delhi University.',
    siteName: 'Mahek Kasdekar Portfolio',
    locale: 'en_IN',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Mahek Kasdekar — Creative Writer, Artist and Photographer Portfolio',
        type: 'image/png',
      },
    ],
    firstName: 'Mahek',
    lastName: 'Kasdekar',
    username: 'mahek__k0911',
    gender: 'female',
  },

  // ── Twitter / X Card ─────────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: 'Mahek Kasdekar — Writer, Artist & Photographer',
    description:
      'Creative portfolio of Mahek Kasdekar — poetry, fiction, watercolour art, photography & books. Delhi University History graduate.',
    images: [`${BASE_URL}/og-image.png`],
    creator: '@mahek__k0911',
  },

  // ── App / Icons ───────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },

  // ── Manifest ──────────────────────────────────────────────────────────────────
  manifest: '/manifest.webmanifest',

  // ── Categorization ────────────────────────────────────────────────────────────
  category: 'portfolio',

  // ── Classification ────────────────────────────────────────────────────────────
  classification: 'Creative Arts, Writing, Photography, Portfolio',

  // ── Other ─────────────────────────────────────────────────────────────────────
  referrer: 'origin-when-cross-origin',
  applicationName: 'Mahek Kasdekar Portfolio',
  generator: 'Next.js',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  other: {
    // Geo tags for local search
    'geo.region': 'IN-MP',
    'geo.placename': 'Indore, Madhya Pradesh, India',
    'geo.position': '22.7196;75.8577',
    'ICBM': '22.7196, 75.8577',
    // Language
    'content-language': 'en-IN',
    // Dublin Core
    'DC.title': 'Mahek Kasdekar Portfolio',
    'DC.creator': 'Mahek Kasdekar',
    'DC.subject': 'Creative Writing, Visual Art, Photography, Portfolio',
    'DC.description':
      'Official portfolio of Mahek Kasdekar — writer, artist, photographer, and history graduate from Delhi University.',
    'DC.publisher': 'Mahek Kasdekar',
    'DC.language': 'en-IN',
    'DC.type': 'Text',
    'DC.format': 'text/html',
  },
}

// ── Viewport ─────────────────────────────────────────────────────────────────────
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4a7b4' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en-IN"
      className={`${cormorant.variable} ${dmSans.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Preconnect to external origins for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://www.instagram.com" />
        <link rel="dns-prefetch" href="https://www.linkedin.com" />
      </head>
      <body className="font-body antialiased">
        {/* JSON-LD Structured Data */}
        <JsonLd />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
