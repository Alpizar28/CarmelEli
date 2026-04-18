import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { stagger, fadeInUp } from '../lib/animations'

export default function Credentials() {
  const { t } = useTranslation()
  const tags = t('credentials.tags', { returnObjects: true }) as string[]
  const lines = t('credentials.lines', { returnObjects: true }) as string[]

  return (
    <section id="credentials" className="bg-white py-24 px-14">
      <div className="max-w-5xl mx-auto">
        <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-[11px] tracking-[4px] uppercase text-secondary mb-4">
          {t('credentials.label')}
        </motion.p>
        <motion.h2 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="font-display font-light text-primary mb-14"
          style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
          {t('credentials.heading')}
        </motion.h2>

        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-16 items-start"
        >
          <motion.div variants={fadeInUp} className="space-y-4 text-[15px] text-ink/65 leading-relaxed">
            {lines.map((line, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: line }} />
            ))}
          </motion.div>

          <motion.div variants={fadeInUp}>
            <p className="text-[11px] tracking-[4px] uppercase text-secondary mb-5">
              {t('credentials.supportedAreas')}
            </p>
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
