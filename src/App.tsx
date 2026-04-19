import { useState, useCallback } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Methods from './components/Methods'
import Services from './components/Services'
import Collaborations from './components/Collaborations'
import Credentials from './components/Credentials'
import Blog from './components/Blog'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { useCmsTranslations } from './hooks/useCmsTranslations'

export default function App() {
  useCmsTranslations()

  const [soundPlaying, setSoundPlaying] = useState(false)
  const [soundToggle, setSoundToggle] = useState<() => void>(() => () => {})

  const handleSoundChange = useCallback((playing: boolean, toggle: () => void) => {
    setSoundPlaying(playing)
    setSoundToggle(() => toggle)
  }, [])

  return (
    <>
      <Nav soundPlaying={soundPlaying} onSoundToggle={soundToggle} />
      <main>
        <Hero onSoundChange={handleSoundChange} />
        <About />
        <Methods />
        <Services />
        <Collaborations />
        <Credentials />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
