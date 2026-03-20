import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'DCIM Pro - Server Management',
  description: 'Premium server and hardware management MVP',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="app-layout">
        
        <aside className="app-sidebar glass-panel">
          <div className="sidebar-brand">
            DCIM<span style={{color: '#fff'}}>PRO</span>
          </div>
          <nav className="sidebar-nav">
            <Link href="/" className="nav-link">Dashboard</Link>
            <Link href="/servers" className="nav-link">Server Inventory</Link>
            <Link href="/locations" className="nav-link">Location Configurator</Link>
            <Link href="/attributes" className="nav-link">Base Dictionaries</Link>
            <Link href="/catalogs" className="nav-link">Hardware Catalogs</Link>
            <Link href="/network" className="nav-link">Network Inventory</Link>
          </nav>
        </aside>

        <main className="app-main">
          <header className="app-topbar glass-panel">
            <div className="topbar-status">● System Operational</div>
            <div className="topbar-user">
              AD
            </div>
          </header>

          <div className="app-content animate-fade-in">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
