import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from "@/components/providers/ToastProvider";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WireGuard Dashboard',
  description: 'Advanced WireGuard VPN Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-onyx-bg text-text-primary-on-dark min-h-screen`}>
        {children}
        <ToastProvider />
      </body>
    </html>
  )
} 