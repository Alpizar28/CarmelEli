import { motion } from 'framer-motion'
import { stagger, fadeInUp } from '../lib/animations'

const services = [
  {
    title: 'Individual Therapy',
    desc: 'A space for self-reflection, emotional awareness, and personal growth. Focused on identifying patterns, strengthening inner stability, and supporting conscious life choices.',
    price: '₡55,000 CRC / hour',
  },
  {
    title: 'Couples Therapy',
    desc: 'Supporting couples in improving communication, emotional connection, and differentiation. Creating healthier, more stable relational dynamics through presence and responsibility.',
    price: '₡70,000 CRC / hour',
  },
  {
    title: 'Parental Guidance',
    desc: 'Practical and emotional support for conscious parenting. Strengthening connection with children while maintaining clear and healthy boundaries.',
    price: '₡70,000 CRC / hour',
  },
  {
    title: 'Collaborative Care',
    desc: 'Coordination with other professionals when the therapeutic process benefits from an integrated, multidisciplinary approach to support the client.',
    price: 'By arrangement',
  },
]

export default function Services() {
  return (
    <section id="services" className="bg-bg py-24 px-14">
      <div className="max-w-5xl mx-auto">
        <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-[11px] tracking-[4px] uppercase text-secondary mb-4">
          Services
        </motion.p>
        <motion.h2 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="font-display font-light text-primary leading-snug mb-14"
          style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
          Personalized therapeutic paths
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
                href="#contact"
                className="text-[12px] tracking-[2px] uppercase text-primary border-b border-accent pb-0.5 self-start hover:text-primary/70 transition-colors no-underline"
              >
                Begin the Journey
              </a>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-[13px] text-ink/40 text-center mt-10 tracking-wide"
        >
          This practice does not offer discounts. The focus is on meaningful commitment and real therapeutic work.
        </motion.p>
      </div>
    </section>
  )
}
