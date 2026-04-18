import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { stagger, fadeInUp, slideInLeft } from '../lib/animations'

export default function About() {
  const { t } = useTranslation()
  const timeline = t('about.timeline', { returnObjects: true }) as { year: string; role: string; desc: string }[]

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
          <motion.p variants={fadeInUp} className="text-[11px] tracking-[4px] uppercase text-secondary mb-4">
            {t('about.label')}
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="font-display font-light text-primary leading-snug mb-6"
            style={{ fontSize: 'clamp(32px, 4vw, 48px)', whiteSpace: 'pre-line' }}
          >
            {t('about.heading')}
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-[17px] leading-[1.9] text-ink/70 font-light mb-5">
            {t('about.p1')}
          </motion.p>
          <motion.p variants={fadeInUp} className="text-[17px] leading-[1.9] text-ink/70 font-light mb-5">
            {t('about.p2')}
          </motion.p>
          <motion.p variants={fadeInUp} className="text-[15px] leading-[1.8] text-ink/50 font-light mb-8">
            {t('about.p3')}
          </motion.p>
          <motion.blockquote
            variants={fadeInUp}
            className="border-l-2 border-accent pl-7 font-display italic font-light text-primary leading-relaxed m-0"
            style={{ fontSize: 'clamp(17px, 2vw, 20px)' }}
          >
            {t('about.quote')}
          </motion.blockquote>
        </motion.div>

        {/* Right: timeline */}
        <div>
          <p className="text-[11px] tracking-[4px] uppercase text-secondary mb-5">{t('about.experience')}</p>
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
