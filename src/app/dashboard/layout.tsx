import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - WireGuard',
  description: 'WireGuard VPN Server Management Dashboard',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
    </div>
  )
} 