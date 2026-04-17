import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const links = [
  { label: 'Home',        href: '#home' },
  { label: 'About',       href: '#about' },
  { label: 'Methods',     href: '#methods' },
  { label: 'Services',    href: '#services' },
  { label: 'Blog',        href: '#blog' },
  { label: 'Contact',     href: '#contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-14 py-5 transition-all duration-300 ${
        scrolled
          ? 'bg-bg/90 backdrop-blur-xl border-b border-primary/10 shadow-sm'
          : 'bg-bg/70 backdrop-blur-md border-b border-primary/5'
      }`}
    >
      <a href="#home" className="text-primary uppercase tracking-[3px] text-sm font-medium">
        Carmel Eli
      </a>

      {/* Desktop links */}
      <ul className="hidden md:flex gap-9 list-none m-0 p-0">
        {links.map(l => (
          <li key={l.href}>
            <a
              href={l.href}
              className="text-[11px] uppercase tracking-[2px] text-ink/50 hover:text-primary transition-colors duration-200 no-underline"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 cursor-pointer bg-transparent border-0 p-0"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
      >
        <span className={`block w-5 h-px bg-primary transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block w-5 h-px bg-primary transition-opacity ${open ? 'opacity-0' : ''}`} />
        <span className={`block w-5 h-px bg-primary transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobile drawer */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-bg/95 backdrop-blur-xl border-b border-primary/10 py-6 px-14 md:hidden"
        >
          <ul className="flex flex-col gap-5 list-none m-0 p-0">
            {links.map(l => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-sm uppercase tracking-[2px] text-ink/60 hover:text-primary transition-colors no-underline"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </nav>
  )
}
