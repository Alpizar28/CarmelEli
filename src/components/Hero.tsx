import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { stagger, fadeInUp } from '../lib/animations'
import { useAmbientSound } from '../hooks/useAmbientSound'

interface HeroProps {
  onSoundChange: (playing: boolean, toggle: () => void) => void
}

export default function Hero({ onSoundChange }: HeroProps) {
  const { t } = useTranslation()
  const baseUrl = import.meta.env.BASE_URL
  const { playing, toggle } = useAmbientSound(`${baseUrl}river-ambient.mp3`)
  const sectionRef = useRef<HTMLElement>(null)

  // Expose playing state + toggle to parent (App → Nav)
  useEffect(() => {
    onSoundChange(playing, toggle)
  }, [playing, toggle, onSoundChange])

  // Auto-pause when hero scrolls out of view
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (!entry.isIntersecting && playing) toggle() },
      { threshold: 0.1 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [playing, toggle])

  return (
    <section ref={sectionRef} id="home" className="relative h-screen flex items-end overflow-hidden">

      {/* Video background — full bleed, unobstructed */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source media="(max-width: 768px)" src={`${baseUrl}river-mobile.mp4`} type="video/mp4" />
        <source src={`${baseUrl}river.mp4`} type="video/mp4" />
      </video>

      {/* Vignette — stronger on mobile for legibility */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(20,40,34,0.92) 0%, rgba(20,40,34,0.55) 40%, rgba(20,40,34,0.15) 65%, transparent 80%)',
        }}
      />

      {/* Japanese ink brush SVG decoration */}
      <svg
        className="absolute inset-0 w-full h-full z-10 opacity-[0.05] pointer-events-none"
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path d="M80,0 Q85,200 78,400 Q82,600 75,900" stroke="#2F5D50" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M95,100 Q90,300 93,500" stroke="#2F5D50" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M1200,300 Q1250,320 1300,310 Q1360,330 1400,315" stroke="#2F5D50" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M1180,360 Q1240,375 1320,365 Q1370,380 1400,370" stroke="#2F5D50" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="700" cy="450" r="280" stroke="#8FAEA3" strokeWidth="0.5" fill="none" strokeDasharray="4 8" opacity="0.3" />
      </svg>

      {/* Hero content */}
      <motion.div
        className="relative z-20 w-full px-6 md:px-14 pb-16 md:pb-24 max-w-3xl text-center md:text-left mx-auto md:mx-0"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={fadeInUp}
          className="font-display font-light tracking-[3px] md:tracking-[4px] text-white leading-none mb-2"
          style={{ fontSize: 'clamp(42px, 10vw, 88px)' }}
        >
          {t('hero.title')}
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-[11px] md:text-[13px] tracking-[3px] uppercase text-white/60 mb-6"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Gold brush divider */}
        <motion.div
          variants={fadeInUp}
          className="w-12 md:w-16 h-px mb-6 mx-auto md:mx-0"
          style={{ background: 'linear-gradient(90deg, #F6D982 0%, #F6D982 60%, transparent)' }}
        />

        <motion.p
          variants={fadeInUp}
          className="font-display italic font-light text-white/80 mb-8 leading-relaxed"
          style={{ fontSize: 'clamp(14px, 4vw, 19px)', whiteSpace: 'pre-line' }}
        >
          {t('hero.quote')}
        </motion.p>

        <motion.div variants={fadeInUp} className="flex gap-3 flex-wrap justify-center md:justify-start">
          <a
            href="#contact"
            className="bg-white/10 border border-white/30 text-white text-[10px] md:text-[11px] uppercase tracking-[2px] px-6 md:px-8 py-3 md:py-3.5 hover:bg-white/20 transition-colors no-underline backdrop-blur-sm"
          >
            {t('hero.cta')}
          </a>
          <a
            href="#about"
            className="text-white/70 text-[10px] md:text-[11px] uppercase tracking-[2px] px-6 md:px-8 py-3 md:py-3.5 hover:text-white transition-colors no-underline border border-white/15 hover:border-white/30"
          >
            {t('hero.ctaLearn')}
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll hint — hidden on mobile */}
      <div className="hidden md:flex absolute bottom-10 right-14 z-20 flex-col items-center gap-2.5 text-white/35">
        <div
          className="w-px h-12"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.4))', animation: 'pulse 2s ease-in-out infinite' }}
        />
        <span className="text-[9px] tracking-[3px] uppercase">{t('hero.scroll')}</span>
      </div>
    </section>
  )
}
