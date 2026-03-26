'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('#home')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = navLinks.map((l) => l.href.replace('#', ''))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { threshold: 0.4 }
    )
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const handleNav = (href: string) => {
    setOpen(false)
    const el = document.getElementById(href.replace('#', ''))
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="glass flex items-center gap-1 px-6 py-3 transition-all duration-300"
        style={{
          backdropFilter: scrolled ? 'blur(24px) saturate(200%)' : 'blur(16px) saturate(180%)',
          borderRadius: '999px',
          maxWidth: '700px',
          width: '100%',
        }}
      >
        {/* Logo */}
        <span
          className="mr-auto font-display text-xl font-semibold italic text-[#1a1a2e] cursor-pointer"
          onClick={() => handleNav('#home')}
        >
          MK
        </span>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="relative px-4 py-2 text-sm font-body font-medium text-[#6b6b8a] transition-colors hover:text-[#1a1a2e]"
            >
              {link.label}
              {active === link.href && (
                <motion.div
                  layoutId="nav-dot"
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#f4a7b4]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden ml-auto p-2 text-[#6b6b8a]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass absolute top-16 left-4 right-4 p-4 flex flex-col gap-2"
            style={{ borderRadius: '20px' }}
          >
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active === link.href
                    ? 'bg-[rgba(244,167,180,0.2)] text-[#1a1a2e]'
                    : 'text-[#6b6b8a] hover:text-[#1a1a2e] hover:bg-white/30'
                }`}
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
