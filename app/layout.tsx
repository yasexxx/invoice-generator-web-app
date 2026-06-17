import type { Metadata } from 'next'
import { Inter, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const hankenGrotesk = Hanken_Grotesk({
  variable: '--font-hanken-grotesk',
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
  weight: ['500'],
})

export const metadata: Metadata = {
  title: 'Lumina Ledger',
  description: 'Professional invoice generator',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const fontVars = [inter.variable, hankenGrotesk.variable, jetbrainsMono.variable].join(' ')

  return (
    <html lang="en" className={fontVars}>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
