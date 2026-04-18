import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { stagger, fadeInUp } from '../lib/animations'

export default function Services() {
  const { t } = useTranslation()
  const services = t('services.items', { returnObjects: true }) as { title: string; desc: string; price: string }[]

  return (
    <section id="services" className="bg-bg py-24 px-14">
      <div className="max-w-5xl mx-auto">
        <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-[11px] tracking-[4px] uppercase text-secondary mb-4">
          {t('services.label')}
        </motion.p>
        <motion.h2 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="font-display font-light text-primary leading-snug mb-14"
          style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
          {t('services.heading')}
        </motion.h2>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid md:grid-cols-2 gap-px bg-primary/8"
        >
          {services.map(s => (
            <motion.div
              key={s.title}
              variants={fadeInUp}
              whileHover={{ y: -3 }}
              className="bg-white p-12 border border-primary/8 hover:border-secondary transition-colors duration-300 flex flex-col"
            >
              <h3 className="font-display font-light text-primary mb-3" style={{ fontSize: 'clamp(22px, 2.5vw, 30px)' }}>
                {s.title}
              </h3>
              <p className="text-[15px] text-ink/55 leading-[1.8] mb-6 flex-1">{s.desc}</p>
              <p className="text-[12px] tracking-[2px] uppercase text-secondary mb-6">{s.price}</p>
              <a
                href="#booking"
                className="text-[12px] tracking-[2px] uppercase text-primary border-b border-accent pb-0.5 self-start hover:text-primary/70 transition-colors no-underline"
              >
                {t('services.cta')}
              </a>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-[13px] text-ink/40 text-center mt-10 tracking-wide"
        >
          {t('services.disclaimer')}
        </motion.p>
      </div>
    </section>
  )
}
