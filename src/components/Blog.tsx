import { motion } from 'framer-motion'
import { stagger, fadeInUp } from '../lib/animations'

const posts = [
  {
    title: "The River Doesn't Force",
    excerpt: "Why resistance might be the most important information you're ignoring — and how to work with it instead of against it.",
  },
  {
    title: 'Differentiation Is Not Distance',
    excerpt: 'Understanding the difference between creating healthy boundaries and disconnecting from the people who matter.',
  },
  {
    title: 'Your Body Knows First',
    excerpt: 'Learning to listen to somatic wisdom and what your nervous system is trying to tell you about your life.',
  },
]

export default function Blog() {
  return (
    <section id="blog" className="bg-bg py-24 px-14">
      <div className="max-w-5xl mx-auto">
        <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-[11px] tracking-[4px] uppercase text-secondary mb-4">
          Blog
        </motion.p>
        <motion.h2 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="font-display font-light text-primary mb-4"
          style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
          Reflections and insights
        </motion.h2>
        <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-[16px] text-ink/50 max-w-lg mb-14 leading-relaxed">
          A reflective space for exploring relationships, emotional awareness, and personal growth.
        </motion.p>

        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {posts.map(post => (
            <motion.article
              key={post.title}
              variants={fadeInUp}
              whileHover={{ y: -3 }}
              className="bg-white border border-primary/8 hover:border-secondary transition-colors duration-300 overflow-hidden"
            >
              {/* Placeholder image */}
              <div
                className="h-44 w-full"
                style={{ background: 'linear-gradient(135deg, #dde8e3 0%, #c9d8d2 100%)' }}
              />
              <div className="p-7">
                <h3 className="font-display font-light text-primary text-xl mb-3 leading-snug">{post.title}</h3>
                <p className="text-[13px] text-ink/50 leading-relaxed mb-5">{post.excerpt}</p>
                <a href="#" className="text-[11px] tracking-[2px] uppercase text-secondary border-b border-accent pb-0.5 hover:text-primary transition-colors no-underline">
                  Read More →
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
