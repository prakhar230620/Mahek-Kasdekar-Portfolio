import Navbar from '@/components/Navbar'
import CustomCursor from '@/components/CustomCursor'
import BackToTop from '@/components/BackToTop'
import AnimatedBackground from '@/components/AnimatedBackground'

import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Education from '@/sections/Education'
import Skills from '@/sections/Skills'
import Portfolio from '@/sections/Portfolio'
import Gallery from '@/sections/Gallery'
import Contact from '@/sections/Contact'
import Footer from '@/sections/Footer'

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <CustomCursor />
      <AnimatedBackground />
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col gap-16 md:gap-24 lg:gap-32 pb-12">
        <Hero />
        <About />
        <Education />
        <Skills />
        <Portfolio />
        <Gallery />
        <Contact />
      </div>

      <Footer />
      <BackToTop />
    </main>
  )
}
