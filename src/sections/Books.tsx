'use client'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ExternalLink, X } from 'lucide-react'
import FlipBookReader from '@/components/FlipBookReader'

export default function Books({ initialBooks = [] }: { initialBooks?: any[] }) {
  const [activePdf, setActivePdf] = useState<string | null>(null)
  const [activeTitle, setActiveTitle] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  // Needed for createPortal (SSR guard)
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePdf(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // The reader modal — rendered via portal directly into document.body
  // This escapes ALL parent stacking contexts (framer-motion transforms, z-index, overflow-hidden…)
  const readerModal = mounted && activePdf ? createPortal(
    <AnimatePresence>
      {activePdf && (
        <motion.div
          key="reader-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActivePdf(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(26,26,46,0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          {/* ── Back Button — absolutely guaranteed top-left, always visible ── */}
          <button
            onClick={(e) => { e.stopPropagation(); setActivePdf(null) }}
            style={{
              position: 'fixed',
              top: '16px',
              left: '16px',
              zIndex: 100000,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '999px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <X size={18} /> Back
          </button>

          {/* ── Mobile title — centered at top ── */}
          <div style={{
            position: 'fixed',
            top: '22px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100000,
            color: '#fff',
            fontWeight: '700',
            fontSize: '14px',
            fontStyle: 'italic',
            maxWidth: '50vw',
            textAlign: 'center',
            pointerEvents: 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          className="md:hidden"
          >
            {activeTitle}
          </div>

          {/* ── Inner content ── */}
          <motion.div
            key="reader-content"
            initial={{ scale: 0.92, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 40, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'default',
              paddingTop: '56px',
            }}
            className="md:pt-16"
          >
            {/* Desktop centred title */}
            <div className="hidden md:block" style={{
              position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)',
              textAlign: 'center', width: '100%', pointerEvents: 'none',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: '2px' }}>Reading Mode</span>
              <h3 style={{ color: '#fff', fontWeight: '700', fontSize: '22px', fontStyle: 'italic' }}>{activeTitle}</h3>
            </div>

            {/* FlipBook */}
            <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <FlipBookReader base64Pdf={activePdf} />
            </div>

            {/* Hint */}
            <div className="hidden md:block" style={{
              position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
              color: 'rgba(255,255,255,0.35)', fontSize: '13px', fontWeight: '500',
            }}>
              Click or drag corners to flip pages
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  ) : null

  return (
    <section id="books" className="py-24 px-6 lg:px-12 relative overflow-hidden">
      <div className="mx-auto max-w-7xl relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-3">
            <BookOpen size={40} className="text-[#6b3fa0]" />
            <h2 className="font-display italic font-semibold text-[#1a1a2e]" style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>
              My Books
            </h2>
          </div>
          <div
            className="mx-auto h-1 w-24 rounded-full"
            style={{ background: 'linear-gradient(90deg, #f4a7b4, #c9b8f5, #f9cba7)' }}
          />
        </motion.div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialBooks.length === 0 ? (
            <div className="col-span-full py-12 text-center decoration-dashed text-[#6b6b8a]/60 font-medium">
              Books are currently being written/curated. Check back soon!
            </div>
          ) : (
            <AnimatePresence>
              {initialBooks.map((book, i) => (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass group relative overflow-hidden flex flex-col h-full"
                  style={{ borderRadius: '24px' }}
                >
                  {/* Book Cover */}
                  <div className="relative w-full aspect-[4/3] bg-[#f8e7f1] overflow-hidden flex items-center justify-center p-6">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                    <motion.div
                      whileHover={{ scale: 1.05, rotateY: -10 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      style={{ perspective: 1000 }}
                      className="relative z-10 w-2/5 md:w-1/2 aspect-[2/3] rounded-sm shadow-[10px_10px_15px_rgba(0,0,0,0.15),-1px_0px_0px_rgba(255,255,255,0.3)_inset] bg-cover bg-center"
                    >
                      <div className="w-full h-full bg-cover bg-center rounded-sm" style={{ backgroundImage: `url(${book.base64Image})` }} />
                      <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-r from-black/20 to-transparent" />
                    </motion.div>
                  </div>

                  {/* Details */}
                  <div className="p-6 md:p-8 flex flex-col flex-grow bg-white/40">
                    <h3 className="font-display italic font-bold text-xl md:text-2xl text-[#1a1a2e] mb-3 leading-tight group-hover:text-[#6b3fa0] transition-colors">{book.title}</h3>
                    <p className="text-[#6b6b8a] line-clamp-4 leading-relaxed text-sm md:text-base mb-6 flex-grow">{book.description}</p>

                    <div className="flex flex-wrap gap-3 mt-auto">
                      {book.base64Pdf && (
                        <button
                          onClick={() => { setActivePdf(book.base64Pdf); setActiveTitle(book.title) }}
                          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#6b3fa0] to-[#f4a7b4] text-white text-sm font-semibold rounded-full hover:shadow-[0_8px_20px_rgba(107,63,160,0.3)] transition-all hover:-translate-y-1"
                        >
                          Read Now <BookOpen size={14} />
                        </button>
                      )}
                      {book.readLink && (
                        <a
                          href={book.readLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-2.5 border border-[#6b3fa0]/30 text-[#6b3fa0] text-sm font-semibold rounded-full hover:bg-white/50 transition-all"
                        >
                          Open Link <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Portal-rendered reader modal — injected directly into document.body */}
      {readerModal}
    </section>
  )
}

