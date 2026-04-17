import { motion } from 'framer-motion'
import { stagger, fadeInUp } from '../lib/animations'

const tags = [
  'Differentiation', 'Mindfulness', 'Emotion-Focused Therapy',
  'Parent Coaching', 'Couples Therapy', 'Body–Mind Connection', 'Systemic Approach',
]

export default function Credentials() {
  return (
    <section id="credentials" className="bg-white py-24 px-14">
      <div className="max-w-5xl mx-auto">
        <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-[11px] tracking-[4px] uppercase text-secondary mb-4">
          Credentials
        </motion.p>
        <motion.h2 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="font-display font-light text-primary mb-14"
          style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
          Professional background
        </motion.h2>

        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-16 items-start"
        >
          <motion.div variants={fadeInUp} className="space-y-4 text-[15px] text-ink/65 leading-relaxed">
            <p><strong className="text-ink font-medium">10+ years</strong> of clinical experience</p>
            <p><strong className="text-ink font-medium">Master's Degree in Social Work</strong> — Hebrew University (2019–2021)</p>
            <p><strong className="text-ink font-medium">Bachelor's Degree in Social Work</strong> — Tel-Hai College (2011–2014)</p>
            <p><strong className="text-ink font-medium">Advanced training</strong> in differentiation, mindfulness, and emotion-focused approaches</p>
            <p><strong className="text-ink font-medium">Couples &amp; family therapy</strong> — Shinui Institute (2019–2021)</p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <p className="text-[11px] tracking-[4px] uppercase text-secondary mb-5">Supported areas</p>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="text-[12px] text-ink/60 border border-primary/15 rounded-full px-4 py-1.5 hover:border-secondary transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
