import React from "react"
import type { Metadata } from 'next'
import { Inter, Playfair_Display, Space_Mono, PT_Serif } from 'next/font/google'
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

const _ptSerif = PT_Serif({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-pt-serif'
});

export const metadata: Metadata = {
  title: 'LA GALERIA / CALI | Colectivo de Rap & Freestyle',
  description: 'Espacio dedicado a la elevación de la cultura hip-hop de Cali como arte de museo. Arte urbano, música del Pacífico colombiano.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/android-chrome-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/android-chrome-512x512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${_inter.variable} ${_playfair.variable} ${_spaceMono.variable} ${_bebasNeue.variable} ${_ptSerif.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
