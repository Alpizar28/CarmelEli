import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { stagger, fadeInUp } from '../lib/animations'

// Replace CAL_USERNAME with Carmel's actual Cal.com username after account setup.
// Cal.com handles timezone detection (IANA), DST, and double-booking automatically.
// The professional sets her availability in Cal.com dashboard; switching timezone
// (CR ↔ NL) is done there — no code change needed.
const CAL_USERNAME = 'carmel-eli'
const CAL_EVENT = '60min'

export default function Booking() {
  const { t, i18n } = useTranslation()

  const calUrl = `https://cal.com/${CAL_USERNAME}/${CAL_EVENT}?embed=true&layout=month_view&locale=${i18n.language}`

  return (
    <section id="booking" className="bg-bg py-24 px-14">
      <div className="max-w-5xl mx-auto">
        <motion.p
          variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-[11px] tracking-[4px] uppercase text-secondary mb-4"
        >
          {t('booking.label')}
        </motion.p>
        <motion.h2
          variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="font-display font-light text-primary leading-snug mb-4"
          style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}
        >
          {t('booking.heading')}
        </motion.h2>
        <motion.p
          variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-[16px] text-ink/50 leading-relaxed mb-10"
        >
          {t('booking.intro')}
        </motion.p>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.div
            variants={fadeInUp}
            className="w-full overflow-hidden border border-primary/10"
            style={{ minHeight: '660px' }}
          >
            <iframe
              src={calUrl}
              width="100%"
              height="660"
              frameBorder="0"
              title={t('booking.heading')}
              allow="payment"
              style={{ border: 'none', display: 'block' }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
