'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const roles = ['Writer', 'Artist', 'Storyteller', 'Photographer', 'Creator']

function TypewriterText() {
  const [index, setIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = roles[index]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 90)
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 50)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setIndex((i) => (i + 1) % roles.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, index])

  return (
    <span className="text-[#f4a7b4]">
      {displayed}
      <span className="inline-block w-0.5 h-8 bg-[#f4a7b4] ml-0.5 animate-pulse align-middle" />
    </span>
  )
}

// Floating orb blob illustration (CSS only)
function FloatingOrb() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      {/* Outer glow ring */}
      <div
        className="absolute rounded-full animate-spin-slow"
        style={{
          width: '340px', height: '340px',
          background: 'radial-gradient(circle, transparent 55%, rgba(201,184,245,0.18) 80%, transparent 100%)',
          border: '1.5px dashed rgba(201,184,245,0.35)',
        }}
      />
      {/* Main large blob */}
      <div
        className="absolute animate-float"
        style={{
          width: '260px', height: '260px',
          borderRadius: '62% 38% 55% 45% / 50% 58% 42% 50%',
          background: 'linear-gradient(135deg, rgba(249,203,167,0.7) 0%, rgba(244,167,180,0.6) 50%, rgba(201,184,245,0.5) 100%)',
          boxShadow: '0 30px 80px rgba(244,167,180,0.35), 0 -10px 40px rgba(201,184,245,0.2)',
          filter: 'blur(1px)',
        }}
      />
      {/* Mid blob */}
      <div
        className="absolute animate-float-reverse"
        style={{
          width: '180px', height: '180px',
          borderRadius: '45% 55% 38% 62% / 58% 42% 58% 42%',
          background: 'linear-gradient(135deg, rgba(181,232,216,0.65) 0%, rgba(201,184,245,0.5) 100%)',
          boxShadow: '0 20px 50px rgba(181,232,216,0.35)',
          filter: 'blur(0.5px)',
          top: '30px', left: '20px',
        }}
      />
      {/* Small accent circles */}
      <div
        className="absolute animate-float"
        style={{
          width: '60px', height: '60px',
          borderRadius: '50%',
          background: 'rgba(244,167,180,0.7)',
          boxShadow: '0 8px 24px rgba(244,167,180,0.4)',
          top: '-20px', right: '40px',
          animationDelay: '1s',
        }}
      />
      <div
        className="absolute animate-float-reverse"
        style={{
          width: '40px', height: '40px',
          borderRadius: '50%',
          background: 'rgba(201,184,245,0.8)',
          boxShadow: '0 6px 20px rgba(201,184,245,0.4)',
          bottom: '10px', right: '20px',
          animationDelay: '0.5s',
        }}
      />
      <div
        className="absolute animate-float"
        style={{
          width: '28px', height: '28px',
          borderRadius: '50%',
          background: 'rgba(181,232,216,0.9)',
          boxShadow: '0 4px 16px rgba(181,232,216,0.5)',
          bottom: '-10px', left: '30px',
          animationDelay: '2s',
        }}
      />
    </div>
  )
}

export default function Hero() {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-12"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left: Text */}
          <motion.div
            className="flex-1 flex flex-col gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Pill tag */}
            <motion.div variants={itemVariants}>
              <span
                className="clay inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#9b4f6a]"
                style={{ background: 'linear-gradient(135deg, #ffe8ee, #f3e8ff)', fontSize: '13px' }}
              >
                ✦ Portfolio 2026
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              variants={itemVariants}
              className="font-display font-semibold italic text-[#1a1a2e] leading-[1.05] tracking-tight"
              style={{ fontSize: 'clamp(52px, 8vw, 100px)', letterSpacing: '-1px' }}
            >
              Mahek<br />Kasdekar
            </motion.h1>

            {/* Typewriter subtitle */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 text-2xl font-display italic text-[#6b6b8a]">
              <TypewriterText />
            </motion.div>

            {/* Intro */}
            <motion.p
              variants={itemVariants}
              className="max-w-lg text-[17px] text-[#6b6b8a] leading-[1.75]"
            >
              A 20-year-old history graduated from Delhi University with a love for words, colour, and the quiet beauty of everyday moments.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mt-2">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                className="clay px-7 py-3.5 text-sm font-semibold text-white transition-shadow"
                style={{ background: 'linear-gradient(135deg, #f4a7b4, #c9b8f5)', boxShadow: '8px 8px 0px rgba(200,160,180,0.25), inset 0 1px 0 rgba(255,255,255,0.4)' }}
              >
                Explore My Work
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="clay px-7 py-3.5 text-sm font-semibold text-[#9b4f6a] transition-shadow"
                style={{ background: 'linear-gradient(135deg, #ffe8ee, #f3e8ff)' }}
              >
                Get In Touch
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right: Orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            className="flex-shrink-0 w-full lg:w-[40%] h-[340px] lg:h-[420px]"
          >
            <FloatingOrb />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-[#6b6b8a] font-body tracking-widest uppercase">Scroll</span>
        <ChevronDown className="animate-bounce-slow text-[#f4a7b4]" size={20} />
      </div>
    </section>
  )
}
