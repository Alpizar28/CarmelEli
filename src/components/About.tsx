import { motion } from 'framer-motion'
import { stagger, fadeInUp, slideInLeft } from '../lib/animations'

const timeline = [
  { year: '2019–2020', role: 'Social Worker — Psifas Center', desc: 'Occupational club supporting individuals with mental health challenges through daily structure and community belonging.' },
  { year: '2018–2019', role: 'Social Worker — Shalom', desc: 'Coordinating care for deaf-blind individuals in residential and independent community settings.' },
  { year: '2017–2018', role: 'Family Social Worker', desc: 'Social Services Department, Ramat Gan.' },
  { year: 'Year C', role: 'Social Worker — Enosh Association', desc: 'Individual and couples work. Community theater project "Rising to the Stage" for people with and without disabilities.' },
  { year: 'Year B', role: 'Social Worker — Welfare Services', desc: 'Golan Heights, including co-leading a psychodrama group for children.' },
]

export default function About() {
  return (
    <section id="about" className="bg-bg py-24 px-14">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-20 items-start">

        {/* Left: intro + quote */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.p variants={fadeInUp} className="text-[11px] tracking-[4px] uppercase text-secondary mb-4">About</motion.p>
          <motion.h2
            variants={fadeInUp}
            className="font-display font-light text-primary leading-snug mb-6"
            style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}
          >
            Clinical Social Worker,<br />10+ years of experience
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-[17px] leading-[1.9] text-ink/70 font-light mb-5">
            I approach therapy as a living, ongoing practice. My work is centered on supporting people in developing awareness, emotional responsibility, and a deeper relationship with themselves and others.
          </motion.p>
          <motion.p variants={fadeInUp} className="text-[17px] leading-[1.9] text-ink/70 font-light mb-5">
            Through presence, reflection, and conscious choice, meaningful change becomes possible — not by force, but through steady inner movement.
          </motion.p>
          <motion.p variants={fadeInUp} className="text-[15px] leading-[1.8] text-ink/50 font-light mb-8">
            I believe that growth happens when we slow down enough to listen inward. In therapy, I accompany you in exploring patterns, building emotional clarity, and creating differentiation — allowing change to emerge naturally, at its own rhythm.
          </motion.p>
          <motion.blockquote
            variants={fadeInUp}
            className="border-l-2 border-accent pl-7 font-display italic font-light text-primary leading-relaxed m-0"
            style={{ fontSize: 'clamp(17px, 2vw, 20px)' }}
          >
            "I bring the same therapeutic values into my personal life — practicing conscious choice, emotional presence, and balance within family and relationships."
          </motion.blockquote>
        </motion.div>

        {/* Right: timeline */}
        <div>
          <p className="text-[11px] tracking-[4px] uppercase text-secondary mb-5">Experience</p>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {timeline.map(item => (
              <motion.div
                key={item.year}
                variants={slideInLeft}
                className="py-5 border-b border-primary/10 last:border-0"
                style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '20px' }}
              >
                <span className="text-[12px] text-accent tracking-wide font-medium pt-0.5">{item.year}</span>
                <div>
                  <p className="text-[15px] font-medium text-ink mb-1">{item.role}</p>
                  <p className="text-[13px] text-ink/50 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
