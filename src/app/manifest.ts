import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mahek Kasdekar — Portfolio',
    short_name: 'Mahek K.',
    description:
      'Personal portfolio of Mahek Kasdekar — writer, artist, photographer, and history graduate from Delhi University.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fdf8f5',
    theme_color: '#f4a7b4',
    orientation: 'portrait-primary',
    categories: ['portfolio', 'art', 'writing', 'photography'],
    lang: 'en-IN',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: '/og-image.png',
        sizes: '1200x630',
        type: 'image/png',
      },
    ],
  }
}
