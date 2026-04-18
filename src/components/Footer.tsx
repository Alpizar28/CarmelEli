import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="bg-primary py-7 px-14 text-center space-y-2">
      <p className="text-[11px] uppercase tracking-[1.5px] text-white/35">
        {t('footer.copy')}
      </p>
      <p className="text-[11px] tracking-[1px] text-white/25">
        Hecho por{' '}
        <a
          href="https://jokem.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium"
          style={{ background: 'linear-gradient(90deg, #60a5fa, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
        >
          jokem.tech
        </a>
      </p>
    </footer>
  )
}
