import { useState } from 'react'
import { motion } from 'framer-motion'
import { stagger, fadeInUp, drawPath } from '../lib/animations'

const pillars = [
  { id: 1, title: 'Processing Past & Present', desc: 'Working through what was and what is, with awareness and compassion.' },
  { id: 2, title: 'Solution-Focused Therapy', desc: 'Change-oriented work grounded in real movement, not endless analysis.' },
  { id: 3, title: 'Body–Mind Connection', desc: 'Listening to somatic wisdom as part of emotional awareness.' },
  { id: 4, title: 'Systemic Approach', desc: 'Understanding the self within the context of relationships and systems.' },
  { id: 5, title: 'Differentiation', desc: 'Staying connected while maintaining emotional autonomy and responsibility.' },
  { id: 6, title: 'Self-Love as a Key', desc: 'A healthy relationship with oneself as the foundation for all growth.' },
]

// 6 petal centers at 60° intervals, r=60 from origin
const petalCenters = [
  { cx: 60,  cy: 0   },
  { cx: 30,  cy: -52 },
  { cx: -30, cy: -52 },
  { cx: -60, cy: 0   },
  { cx: -30, cy: 52  },
  { cx: 30,  cy: 52  },
]

const petalDots = [
  { cx: 90, cy: 0 }, { cx: 45, cy: -78 }, { cx: -45, cy: -78 },
  { cx: -90, cy: 0 }, { cx: -45, cy: 78 }, { cx: 45, cy: 78 },
]

export default function Methods() {
  const [active, setActive] = useState<number | null>(null)

  function toggle(id: number) {
    setActive(prev => (prev === id ? null : id))
  }

  return (
    <section id="methods" className="bg-primary py-24 px-14 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.p
          variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-[11px] tracking-[4px] uppercase text-secondary mb-4"
        >
          Therapeutic Approach
        </motion.p>
        <motion.h2
          variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="font-display font-light text-white leading-snug mb-4"
          style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}
        >
          The Flower of Life
        </motion.h2>
        <motion.p
          variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-[16px] text-white/50 leading-relaxed max-w-lg mb-14"
        >
          Six interconnected dimensions of the therapeutic work — each circle flows into the others, forming a whole.
        </motion.p>

        <div className="flex flex-col lg:flex-row gap-16 items-center justify-center">

          {/* Flower of Life SVG */}
          <motion.svg
            width="320" height="320" viewBox="-160 -160 320 320"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex-shrink-0"
          >
            {/* Center circle */}
            <motion.circle
              variants={drawPath}
              cx="0" cy="0" r="60"
              fill="none" stroke="rgba(246,217,130,0.7)" strokeWidth="2"
            />
            {/* 6 petal circles */}
            {petalCenters.map((p, i) => (
              <motion.circle
                key={i}
                variants={drawPath}
                cx={p.cx} cy={p.cy} r="60"
                fill="none"
                stroke={active === i + 1 ? 'rgba(246,217,130,0.9)' : 'rgba(246,217,130,0.35)'}
                strokeWidth="1.5"
                style={{ cursor: 'pointer', transition: 'stroke 0.3s' }}
                onClick={() => toggle(i + 1)}
              />
            ))}
            {/* Outer boundary */}
            <circle cx="0" cy="0" r="120" fill="none" stroke="rgba(143,174,163,0.2)" strokeWidth="1" strokeDasharray="3 6" />
            {/* Center dot */}
            <circle cx="0" cy="0" r="4" fill="#F6D982" opacity="0.8" />
            {/* Petal dots */}
            {petalDots.map((d, i) => (
              <circle
                key={i} cx={d.cx} cy={d.cy} r="5" fill="#F6D982"
                opacity={active === i + 1 ? 1 : 0.5}
                style={{ transition: 'opacity 0.3s' }}
              />
            ))}
          </motion.svg>

          {/* Pillar labels */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-2 max-w-xs w-full"
          >
            {pillars.map(p => (
              <motion.div
                key={p.id}
                variants={fadeInUp}
                onClick={() => toggle(p.id)}
                className={`flex items-start gap-4 cursor-pointer px-4 py-3.5 rounded-sm transition-colors ${active === p.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
              >
                <span className={`w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1.5 transition-opacity ${active === p.id ? 'opacity-100' : 'opacity-60'}`} />
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
