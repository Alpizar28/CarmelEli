import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { stagger, fadeInUp } from '../lib/animations'
import { collaborators } from '../data/collaborators'

export default function Collaborations() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'en' | 'es' | 'he'

  return (
    <section id="collaborations" className="bg-white py-24 px-14">
      <div className="max-w-5xl mx-auto">
        <motion.p
          variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-[11px] tracking-[4px] uppercase text-secondary mb-4"
        >
          {t('collaborations.label')}
        </motion.p>
        <motion.h2
          variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="font-display font-light text-primary leading-snug mb-6"
          style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}
        >
          {t('collaborations.heading')}
        </motion.h2>
        <motion.p
          variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-[16px] text-ink/60 leading-[1.9] font-light mb-14 max-w-2xl"
        >
          {t('collaborations.intro')}
        </motion.p>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid md:grid-cols-2 gap-8"
        >
          {collaborators.map(c => (
            <motion.div
              key={c.id}
              variants={fadeInUp}
              className="border border-primary/10 p-10 hover:border-secondary transition-colors duration-300 flex flex-col gap-4"
            >
              <div>
                <p className="text-[11px] tracking-[3px] uppercase text-secondary mb-1">
                  {c.specialty}
                </p>
                <h3 className="font-display font-light text-primary" style={{ fontSize: 'clamp(20px, 2.2vw, 26px)' }}>
                  {c.name}
                </h3>
              </div>

              <p className="text-[14px] text-ink/55 leading-[1.8] flex-1">
                {c.bio[lang] ?? c.bio.en}
              </p>

              <p className="text-[12px] text-ink/35 tracking-wide">
                {t('collaborations.locationLabel')}: {c.location}
              </p>

              <div className="flex gap-6 flex-wrap pt-2">
                {c.websiteUrl && (
                  <a
                    href={c.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] tracking-[2px] uppercase text-primary border-b border-accent pb-0.5 hover:text-primary/70 transition-colors no-underline"
                  >
                    {t('collaborations.websiteLabel')}
                  </a>
                )}
                {c.contactUrl && (
                  <a
                    href={c.contactUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] tracking-[2px] uppercase text-secondary hover:text-primary transition-colors no-underline"
                  >
                    {t('collaborations.contactLabel')}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
