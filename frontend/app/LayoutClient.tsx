'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="paper-grain" aria-hidden="true" />

      <header className="border-b border-stone/60 bg-alabaster/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container-app flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="font-display text-xl md:text-2xl font-semibold text-forest hover:text-terracotta transition-colors duration-300">
            Libin Guo
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`nav-link ${isActive ? 'text-forest font-medium' : ''}`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          <button
            type="button"
            className="md:hidden p-2 -mr-2 text-forest hover:text-terracotta transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X strokeWidth={1.5} size={24} /> : <Menu strokeWidth={1.5} size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <div
            className="md:hidden fixed inset-0 top-16 bg-alabaster/95 backdrop-blur-md z-30 flex flex-col items-center justify-start pt-12 gap-8"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            {navLinks.map(({ href, label }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`font-display text-2xl font-medium ${isActive ? 'text-forest' : 'text-forest/80 hover:text-terracotta'} transition-colors`}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              )
            })}
          </div>
        )}
      </header>

      <main className="flex-1 container-app py-16 md:py-24 lg:py-32">
        {children}
      </main>

      <footer className="border-t border-stone/60 py-8 md:py-12">
        <div className="container-app text-sm text-forest/60 font-medium">
          © {new Date().getFullYear()} Libin Guo
        </div>
      </footer>
    </div>
  )
}
