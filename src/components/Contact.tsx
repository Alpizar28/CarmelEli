import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { stagger, fadeInUp } from '../lib/animations'

// Cal.com: replace CAL_USERNAME after account setup.
// Timezone detection, DST, and double-booking are handled by Cal.com.
const CAL_USERNAME = 'carmel-eli'
const CAL_EVENT = '60min'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function Contact() {
  const { t, i18n } = useTranslation()
  const [status, setStatus] = useState<Status>('idle')

  const calUrl = `https://cal.com/${CAL_USERNAME}/${CAL_EVENT}?embed=true&layout=month_view&locale=${i18n.language}`

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const form = e.currentTarget
    try {
      const res = await fetch('https://formspree.io/f/FORM_ID_AQUI', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="bg-white py-24 px-14">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="mb-14"
        >
          <motion.p variants={fadeInUp} className="text-[11px] tracking-[4px] uppercase text-secondary mb-4">
            {t('contact.label')}
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="font-display font-light text-primary leading-snug"
            style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}
          >
            {t('contact.heading')}
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-[16px] text-ink/50 leading-relaxed mt-4 max-w-xl">
            {t('contact.intro')}
          </motion.p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left — Cal.com booking */}
          <motion.div
            variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            <p className="text-[11px] tracking-[4px] uppercase text-secondary mb-6">
              {t('booking.label')}
            </p>
            <p className="text-[14px] text-ink/45 leading-relaxed mb-6">
              {t('booking.intro')}
            </p>
            <div className="overflow-hidden border border-primary/10" style={{ minHeight: '620px' }}>
              <iframe
                src={calUrl}
                width="100%"
                height="620"
                frameBorder="0"
                title={t('booking.heading')}
                allow="payment"
                style={{ border: 'none', display: 'block' }}
              />
            </div>
          </motion.div>

          {/* Right — contact form */}
          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            <motion.p variants={fadeInUp} className="text-[11px] tracking-[4px] uppercase text-secondary mb-6">
              {t('contact.label')}
            </motion.p>

            <motion.form variants={fadeInUp} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[11px] tracking-[2px] uppercase text-ink/40 mb-2">{t('contact.name')}</label>
                <input
                  name="name" type="text" required
                  className="w-full border-0 border-b border-primary/20 bg-transparent py-2.5 text-[16px] text-ink focus:outline-none focus:border-primary transition-colors"
                  placeholder={t('contact.namePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-[11px] tracking-[2px] uppercase text-ink/40 mb-2">{t('contact.email')}</label>
                <input
                  name="email" type="email" required
                  className="w-full border-0 border-b border-primary/20 bg-transparent py-2.5 text-[16px] text-ink focus:outline-none focus:border-primary transition-colors"
                  placeholder={t('contact.emailPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-[11px] tracking-[2px] uppercase text-ink/40 mb-2">{t('contact.message')}</label>
                <textarea
                  name="message" required rows={5}
                  className="w-full border-0 border-b border-primary/20 bg-transparent py-2.5 text-[16px] text-ink focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder={t('contact.messagePlaceholder')}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="w-full bg-primary text-white text-[12px] uppercase tracking-[3px] py-4 hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {status === 'loading' ? t('contact.sending') : status === 'success' ? t('contact.sent') : t('contact.send')}
              </button>

              {status === 'error' && (
                <p className="text-sm text-red-500 text-center">{t('contact.error')}</p>
              )}
            </motion.form>

            <motion.p
              variants={fadeInUp}
              className="text-[12px] text-ink/30 leading-relaxed mt-8"
              style={{ whiteSpace: 'pre-line' }}
            >
              {t('contact.note')}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
