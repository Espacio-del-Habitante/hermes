import React from "react"
import type { Metadata } from 'next'
import { Inter, Playfair_Display, Space_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Bebas_Neue } from 'next/font/google'

const _inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

const _playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair'
});

const _spaceMono = Space_Mono({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono'
});

const _bebasNeue = Bebas_Neue({ 
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas-neue'
});

export const metadata: Metadata = {
  title: 'LA GALERIA / CALI | Colectivo de Rap & Freestyle',
  description: 'Espacio dedicado a la elevación de la cultura hip-hop de Cali como arte de museo. Arte urbano, música del Pacífico colombiano.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${_inter.variable} ${_playfair.variable} ${_spaceMono.variable} ${_bebasNeue.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
