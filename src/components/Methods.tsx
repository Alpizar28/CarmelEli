import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { stagger, fadeInUp, drawPath } from '../lib/animations'

const petalCenters = [
  { cx: 60,  cy: 0   },
  { cx: 30,  cy: -52 },
  { cx: -30, cy: -52 },
  { cx: -60, cy: 0   },
  { cx: -30, cy: 52  },
  { cx: 30,  cy: 52  },
]

const IDLE_INTERVAL = 600
const IDLE_DELAY = 3000

export default function Methods() {
  const { t } = useTranslation()
  const [active, setActive] = useState<number | null>(null)
  const [idlePetal, setIdlePetal] = useState<number | null>(null)
  const pillars = t('methods.pillars', { returnObjects: true }) as { title: string; desc: string }[]

  function toggle(id: number) {
    setActive(prev => (prev === id ? null : id))
  }

  useEffect(() => {
    if (active !== null) { setIdlePetal(null); return }
    let idx = 0
    const start = setTimeout(() => {
      setIdlePetal(idx + 1)
      const iv = setInterval(() => {
        idx = (idx + 1) % petalCenters.length
        setIdlePetal(idx + 1)
      }, IDLE_INTERVAL)
      return () => clearInterval(iv)
    }, IDLE_DELAY)
    return () => clearTimeout(start)
  }, [active])

  const glowPetal = active ?? idlePetal

  return (
    <section id="methods" className="bg-primary py-24 px-14 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.p
          variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-[11px] tracking-[4px] uppercase text-secondary mb-4"
        >
          {t('methods.label')}
        </motion.p>
        <motion.h2
          variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="font-display font-light text-white leading-snug mb-4"
          style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}
        >
          {t('methods.heading')}
        </motion.h2>
        <motion.p
          variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-[16px] text-white/50 leading-relaxed max-w-lg mb-14"
        >
          {t('methods.intro')}
        </motion.p>

        <div className="flex flex-col lg:flex-row gap-16 items-center justify-start">

          {/* Flower of Life SVG */}
          <motion.svg
            width="400" height="400" viewBox="-160 -160 320 320"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex-shrink-0"
          >
            <motion.circle variants={drawPath} cx="0" cy="0" r="60"
              fill="none" stroke="rgba(246,217,130,0.7)" strokeWidth="2" />
            {petalCenters.map((p, i) => (
              <motion.circle
                key={i} variants={drawPath} cx={p.cx} cy={p.cy} r="60"
                fill="none"
                animate={{
                  stroke: glowPetal === i + 1
                    ? 'rgba(246,217,130,0.95)'
                    : 'rgba(246,217,130,0.25)',
                  strokeWidth: glowPetal === i + 1 ? 2.5 : 1.5,
                }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                style={{ cursor: 'pointer' }}
                onClick={() => toggle(i + 1)}
              />
            ))}
          </motion.svg>

          {/* Pillar labels */}
          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex flex-col gap-2 max-w-xs w-full"
          >
            {pillars.map((p, i) => (
              <motion.div
                key={i} variants={fadeInUp}
                onClick={() => toggle(i + 1)}
                className={`flex items-start gap-4 cursor-pointer px-4 py-3.5 rounded-sm transition-colors ${active === i + 1 ? 'bg-white/10' : 'hover:bg-white/5'}`}
              >
                <span className={`w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1.5 transition-opacity ${active === i + 1 ? 'opacity-100' : 'opacity-60'}`} />
                <div>
                  <h4 className="text-[15px] text-white font-medium mb-1">{p.title}</h4>
                  <p className="text-[13px] text-white/45 leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
