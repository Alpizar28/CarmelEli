import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Methods from './components/Methods'
import Services from './components/Services'
import Credentials from './components/Credentials'
import Blog from './components/Blog'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Methods />
        <Services />
        <Credentials />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
