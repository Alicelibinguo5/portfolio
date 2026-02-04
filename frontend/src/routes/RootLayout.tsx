import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function RootLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Paper grain overlay - botanical soul */}
      <div className="paper-grain" aria-hidden="true" />

      <header className="border-b border-stone/60 bg-alabaster/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container-app flex items-center justify-between h-16 md:h-20">
          <NavLink to="/" className="font-display text-xl md:text-2xl font-semibold text-forest hover:text-terracotta transition-colors duration-300">
            Libin Guo
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'text-forest font-medium' : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile menu button */}
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

        {/* Mobile menu overlay */}
        {mobileOpen && (
          <div
            className="md:hidden fixed inset-0 top-16 bg-alabaster/95 backdrop-blur-md z-30 flex flex-col items-center justify-start pt-12 gap-8"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `font-display text-2xl font-medium ${isActive ? 'text-forest' : 'text-forest/80 hover:text-terracotta'} transition-colors`
                }
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 container-app py-12 md:py-16 lg:py-24">
        <Outlet />
      </main>

      <footer className="border-t border-stone/60 py-8 md:py-12">
        <div className="container-app text-sm text-forest/60 font-medium">
          © {new Date().getFullYear()} Libin Guo
        </div>
      </footer>
    </div>
  )
}
