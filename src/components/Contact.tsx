import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { stagger, fadeInUp } from '../lib/animations'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle')

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
      <motion.div
        className="max-w-lg mx-auto"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.p variants={fadeInUp} className="text-[11px] tracking-[4px] uppercase text-secondary mb-4 text-center">
          Contact
        </motion.p>
        <motion.h2
          variants={fadeInUp}
          className="font-display font-light text-primary text-center mb-4"
          style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}
        >
          A gentle first step
        </motion.h2>
        <motion.p variants={fadeInUp} className="text-[16px] text-ink/50 text-center leading-relaxed mb-10">
          If you feel resonance with this approach, you are welcome to reach out. The first contact is an opportunity to sense whether this space feels right for you.
        </motion.p>

        <motion.form variants={fadeInUp} onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] tracking-[2px] uppercase text-ink/40 mb-2">Full Name</label>
            <input
              name="name" type="text" required
              className="w-full border-0 border-b border-primary/20 bg-transparent py-2.5 text-[16px] text-ink focus:outline-none focus:border-primary transition-colors"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-[11px] tracking-[2px] uppercase text-ink/40 mb-2">Email</label>
            <input
              name="email" type="email" required
              className="w-full border-0 border-b border-primary/20 bg-transparent py-2.5 text-[16px] text-ink focus:outline-none focus:border-primary transition-colors"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-[11px] tracking-[2px] uppercase text-ink/40 mb-2">Message</label>
            <textarea
              name="message" required rows={4}
              className="w-full border-0 border-b border-primary/20 bg-transparent py-2.5 text-[16px] text-ink focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Tell me what brings you here..."
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full bg-primary text-white text-[12px] uppercase tracking-[3px] py-4 hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {status === 'loading' ? 'Sending...' : status === 'success' ? 'Message Sent' : 'Send Message'}
          </button>

          {status === 'error' && (
            <p className="text-sm text-red-500 text-center">Something went wrong. Please try again.</p>
          )}
        </motion.form>

        <motion.p variants={fadeInUp} className="text-[12px] text-ink/30 text-center leading-relaxed mt-8">
          Sessions offered worldwide (excluding United States and Canada)<br />
          Special focus on Israelis in Costa Rica and Central America
        </motion.p>
      </motion.div>
    </section>
  )
}
