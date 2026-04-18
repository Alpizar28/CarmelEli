import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

type Lang = 'en' | 'es' | 'he'
const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'he', label: 'HE' },
]

interface NavProps {
  soundPlaying: boolean
  onSoundToggle: () => void
}

export default function Nav({ soundPlaying, onSoundToggle }: NavProps) {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function switchLang(lang: Lang) {
    i18n.changeLanguage(lang)
    localStorage.setItem('lang', lang)
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    setOpen(false)
  }

  const links = [
    { label: t('nav.home'), href: '#home' },
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.methods'), href: '#methods' },
    { label: t('nav.services'), href: '#services' },
    { label: t('nav.collaborations'), href: '#collaborations' },
    { label: t('nav.blog'), href: '#blog' },
    { label: t('nav.contact'), href: '#contact' },
  ]

  const currentLang = i18n.language as Lang

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

      {/* Desktop right controls */}
      <div className="hidden md:flex items-center gap-5">
        {/* Lang toggle */}
        <div className="flex gap-2">
          {LANGS.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => switchLang(code)}
              className={`text-[10px] tracking-[2px] uppercase transition-colors bg-transparent border-0 cursor-pointer px-1 py-0.5 ${
                currentLang === code
                  ? 'text-primary border-b border-primary'
                  : 'text-ink/35 hover:text-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sound toggle */}
        <button
          onClick={onSoundToggle}
          aria-label={soundPlaying ? t('sound.off') : t('sound.on')}
          title={soundPlaying ? t('sound.off') : t('sound.on')}
          className="text-ink/35 hover:text-primary transition-colors bg-transparent border-0 cursor-pointer p-1"
        >
          {soundPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>

        {/* Book CTA */}
        <a
          href="#contact"
          className="text-[10px] uppercase tracking-[2px] bg-primary text-white px-5 py-2.5 hover:bg-primary/90 transition-colors no-underline"
        >
          {t('nav.bookSession')}
        </a>
      </div>

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
          <ul className="flex flex-col gap-5 list-none m-0 p-0 mb-6">
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

          <div className="flex items-center gap-4 flex-wrap mb-5">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => switchLang(code)}
                className={`text-[11px] tracking-[2px] uppercase bg-transparent border-0 cursor-pointer ${
                  currentLang === code ? 'text-primary font-medium' : 'text-ink/40'
                }`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => { onSoundToggle(); setOpen(false) }}
              className="text-[11px] tracking-[2px] uppercase text-ink/40 hover:text-primary bg-transparent border-0 cursor-pointer"
            >
              {soundPlaying ? t('sound.off') : t('sound.on')}
            </button>
          </div>

          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="block text-center text-[11px] uppercase tracking-[2px] bg-primary text-white px-5 py-3 hover:bg-primary/90 transition-colors no-underline"
          >
            {t('nav.bookSession')}
          </a>
        </motion.div>
      )}
    </nav>
  )
}
