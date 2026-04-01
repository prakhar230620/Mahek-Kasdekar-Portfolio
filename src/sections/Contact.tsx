'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MapPin, Mail, Instagram, Linkedin, Globe } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setStatus('idle'), 4000)
      } else {
        setStatus('idle')
        alert('Failed to send message. Please try again later.')
      }
    } catch {
      setStatus('idle')
      alert('Network error. Please try again.')
    }
  }

  return (
    <section id="contact" className="py-24 px-6 lg:px-12 relative overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <h2 className="font-display italic font-semibold text-[#1a1a2e] mb-3" style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>
            Let&apos;s Connect
          </h2>
          <div
            className="mx-auto h-1 w-24 rounded-full mb-6"
            style={{ background: 'linear-gradient(90deg, #f4a7b4, #c9b8f5, #f9cba7)' }}
          />
          <p className="text-[17px] text-[#6b6b8a] max-w-xl mx-auto">
            Whether you want to collaborate, chat about books, or just say hello — my inbox is always open.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Form Side (Left - 3 columns) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="glass p-8 sm:p-10 flex flex-col gap-6 relative overflow-hidden">
              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center"
                    style={{ background: 'rgba(253, 248, 245, 0.95)', backdropFilter: 'blur(10px)' }}
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #d6f5ec, #e8f5ff)' }}>
                      <Send size={24} className="text-[#2a7a5c]" />
                    </div>
                    <h3 className="font-display italic text-2xl font-semibold text-[#1a1a2e] mb-2">Message Sent!</h3>
                    <p className="text-[#6b6b8a]">Thank you for reaching out. I&apos;ll get back to you soon.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-semibold text-[#6b6b8a] ml-1">Name</label>
                  <input
                    type="text" id="name" required
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="glass-input px-4 py-3 text-[#1a1a2e] placeholder-[#6b6b8a]/50"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-semibold text-[#6b6b8a] ml-1">Email</label>
                  <input
                    type="email" id="email" required
                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="glass-input px-4 py-3 text-[#1a1a2e] placeholder-[#6b6b8a]/50"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-sm font-semibold text-[#6b6b8a] ml-1">Subject</label>
                <input
                  type="text" id="subject" required
                  value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="glass-input px-4 py-3 text-[#1a1a2e] placeholder-[#6b6b8a]/50"
                  placeholder="Collaboration Inquiry"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-semibold text-[#6b6b8a] ml-1">Message</label>
                <textarea
                  id="message" rows={5} required
                  value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="glass-input px-4 py-3 text-[#1a1a2e] placeholder-[#6b6b8a]/50 resize-y min-h-[120px]"
                  placeholder="Hello Mahek, I'd love to work with you on..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={status === 'submitting'}
                type="submit"
                className="clay mt-2 flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-[#9b4f6a] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #ffe8ee, #f3e8ff)' }}
              >
                {status === 'submitting' ? (
                  <span className="flex items-center gap-2">Sending... <span className="animate-spin text-lg">🌸</span></span>
                ) : (
                  <>Send Message <Send size={16} /></>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Info Side (Right - 2 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Info Cards */}
            <div className="glass p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(201,184,245,0.2)' }}>
                <Mail size={18} className="text-[#6b3fa0]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#6b6b8a] mb-1">Email</h4>
                <a href="mailto:mahek@example.com" className="text-lg font-display italic text-[#1a1a2e] hover:text-[#9b4f6a] transition-colors">
                  mahekkasdekar@gmail.com
                </a>
              </div>
            </div>

            <div className="glass p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(244,167,180,0.2)' }}>
                <MapPin size={18} className="text-[#9b4f6a]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#6b6b8a] mb-1">Location</h4>
                <p className="text-lg font-display italic text-[#1a1a2e]">Indore, India</p>
              </div>
            </div>

            {/* Socials Box */}
            <div className="glass p-8 mt-auto flex flex-col items-center justify-center text-center">
              <h4 className="font-display italic font-semibold text-xl text-[#1a1a2e] mb-6">Find me elsewhere</h4>
              <div className="flex items-center gap-4">
                {[
                  {
                    icon: Instagram,
                    color: 'text-[#E1306C]',
                    bg: 'hover:bg-[#E1306C]/10',
                    label: 'Instagram',
                    href: 'https://www.instagram.com/mahek__k0911?igsh=MWFkMmplbnYxY2tjeQ=='
                  },
                  {
                    icon: Linkedin,
                    color: 'text-[#0077b5]',
                    bg: 'hover:bg-[#0077b5]/10',
                    label: 'LinkedIn',
                    href: '#'
                  },
                  {
                    icon: Globe,
                    color: 'text-[#1769ff]',
                    bg: 'hover:bg-[#1769ff]/10',
                    label: 'Portfolio',
                    href: '#'
                  },
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.9 }}
                    className={`clay flex w-12 h-12 items-center justify-center rounded-full transition-colors ${social.color} ${social.bg}`}
                    style={{ background: 'white' }}
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
