import { motion } from 'framer-motion'
import { stagger, fadeInUp } from '../lib/animations'

export default function Hero() {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">

      {/* Video background — Pixabay river loop */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="https://cdn.pixabay.com/video/2023/04/21/158877-819998163_large.mp4" type="video/mp4" />
      </video>

      {/* Light overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-bg/30 to-bg/60" />

      {/* Japanese ink brush SVG decoration */}
      <svg
        className="absolute inset-0 w-full h-full z-10 opacity-[0.06] pointer-events-none"
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {/* Bamboo strokes — left */}
        <path d="M80,0 Q85,200 78,400 Q82,600 75,900" stroke="#2F5D50" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M95,100 Q90,300 93,500" stroke="#2F5D50" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Water strokes — right */}
        <path d="M1200,300 Q1250,320 1300,310 Q1360,330 1400,315" stroke="#2F5D50" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M1180,360 Q1240,375 1320,365 Q1370,380 1400,370" stroke="#2F5D50" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M1220,420 Q1270,435 1340,425" stroke="#2F5D50" strokeWidth="1" fill="none" strokeLinecap="round" />
        {/* Enso circle hint */}
        <circle cx="700" cy="450" r="280" stroke="#8FAEA3" strokeWidth="0.5" fill="none" strokeDasharray="4 8" opacity="0.4" />
        {/* Botanical dots — left */}
        <circle cx="150" cy="600" r="2" fill="#8FAEA3" />
        <circle cx="160" cy="620" r="1.5" fill="#8FAEA3" />
        <circle cx="140" cy="615" r="1" fill="#F6D982" />
        {/* Botanical dots — right */}
        <circle cx="1280" cy="200" r="2" fill="#8FAEA3" />
        <circle cx="1295" cy="218" r="1.5" fill="#8FAEA3" />
        <circle cx="1270" cy="212" r="1" fill="#F6D982" />
      </svg>

      {/* Hero content */}
      <motion.div
        className="relative z-20 text-center max-w-2xl px-8"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.p variants={fadeInUp} className="text-[11px] tracking-[4px] uppercase text-secondary mb-6">
          Emotional Therapy · Online Worldwide
        </motion.p>

        <motion.h1
          variants={fadeInUp}
          className="font-display font-light tracking-[4px] text-primary leading-none mb-2"
          style={{ fontSize: 'clamp(52px, 7vw, 80px)' }}
        >
          Carmel Eli
        </motion.h1>

        <motion.p variants={fadeInUp} className="text-[13px] tracking-[3px] uppercase text-secondary mb-8">
          MSW · Clinical Social Worker
        </motion.p>

        {/* Gold brush divider */}
        <motion.div
          variants={fadeInUp}
          className="w-20 h-px mx-auto mb-7"
          style={{ background: 'linear-gradient(90deg, transparent, #F6D982 30%, #F6D982 70%, transparent)' }}
        />

        <motion.p
          variants={fadeInUp}
          className="font-display italic font-light text-ink/60 mb-10 leading-relaxed"
          style={{ fontSize: 'clamp(16px, 2vw, 20px)' }}
        >
          A calm space for presence, responsibility,<br />and meaningful inner movement
        </motion.p>

        <motion.div variants={fadeInUp} className="flex gap-4 justify-center flex-wrap">
          <a
            href="#contact"
            className="bg-primary text-white text-[11px] uppercase tracking-[2px] px-8 py-3.5 hover:bg-primary/90 transition-colors no-underline"
          >
            Begin the Journey
          </a>
          <a
            href="#about"
            className="border border-primary text-primary text-[11px] uppercase tracking-[2px] px-8 py-3.5 hover:bg-primary/5 transition-colors no-underline"
          >
            Learn More
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2.5 text-ink/30">
        <span className="text-[9px] tracking-[3px] uppercase">Scroll</span>
        <div
          className="w-px h-12"
          style={{ background: 'linear-gradient(180deg, #8FAEA3, transparent)', animation: 'pulse 2s ease-in-out infinite' }}
        />
      </div>
    </section>
  )
}
