import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { ToasterProvider } from '@/components/providers/toaster-provider'
import { ConfettiProvider } from '@/components/providers/confetti-provider'

import {trTR} from "@clerk/localizations";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kardelen Akademi Portal',
  description: 'Eğitim Portalı',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={trTR}>
    <html lang='en'>
      <body className={inter.className}>
        <ConfettiProvider />
        <ToasterProvider />
        {children}
      </body>
    </html>
  </ClerkProvider>
  )
}
