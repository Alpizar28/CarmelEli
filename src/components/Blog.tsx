import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { stagger, fadeInUp } from '../lib/animations'
import { getPosts } from '../lib/cms'
import type { BlogPost } from '../types/cms'

export default function Blog() {
  const { t } = useTranslation()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPosts(true)
      .then(data => setPosts(data.slice(0, 3)))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  const staticPosts = t('blog.posts', { returnObjects: true }) as { title: string; excerpt: string }[]
  const displayPosts = !loading && posts.length > 0 ? posts : null

  return (
    <section id="blog" className="bg-bg py-24 px-14">
      <div className="max-w-5xl mx-auto">
        <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-[11px] tracking-[4px] uppercase text-secondary mb-4">
          {t('blog.label')}
        </motion.p>
        <motion.h2 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="font-display font-light text-primary mb-4"
          style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
          {t('blog.heading')}
        </motion.h2>
        <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-[16px] text-ink/50 max-w-lg mb-14 leading-relaxed">
          {t('blog.intro')}
        </motion.p>

        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {displayPosts
            ? displayPosts.map(post => (
                <motion.article
                  key={post.id}
                  variants={fadeInUp}
                  whileHover={{ y: -3 }}
                  className="bg-white border border-primary/8 hover:border-secondary transition-colors duration-300 overflow-hidden"
                >
                  <div
                    className="h-44 w-full bg-cover bg-center"
                    style={
                      post.imageUrl
                        ? { backgroundImage: `url(${post.imageUrl})` }
                        : { background: 'linear-gradient(135deg, #dde8e3 0%, #c9d8d2 100%)' }
                    }
                  />
                  <div className="p-7">
                    <h3 className="font-display font-light text-primary text-xl mb-3 leading-snug">{post.title}</h3>
                    <p className="text-[13px] text-ink/50 leading-relaxed mb-5">{post.excerpt}</p>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-[11px] tracking-[2px] uppercase text-secondary border-b border-accent pb-0.5 hover:text-primary transition-colors no-underline"
                    >
                      {t('blog.readMore')} →
                    </Link>
                  </div>
                </motion.article>
              ))
            : staticPosts.map(post => (
                <motion.article
                  key={post.title}
                  variants={fadeInUp}
                  whileHover={{ y: -3 }}
                  className="bg-white border border-primary/8 hover:border-secondary transition-colors duration-300 overflow-hidden"
                >
                  <div
                    className="h-44 w-full"
                    style={{ background: 'linear-gradient(135deg, #dde8e3 0%, #c9d8d2 100%)' }}
                  />
                  <div className="p-7">
                    <h3 className="font-display font-light text-primary text-xl mb-3 leading-snug">{post.title}</h3>
                    <p className="text-[13px] text-ink/50 leading-relaxed mb-5">{post.excerpt}</p>
                    <span className="text-[11px] tracking-[2px] uppercase text-secondary border-b border-accent pb-0.5">
                      {t('blog.readMore')} →
                    </span>
                  </div>
                </motion.article>
              ))
          }
        </motion.div>
      </div>
    </section>
  )
}
