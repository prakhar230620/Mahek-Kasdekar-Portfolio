'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ExternalLink, X } from 'lucide-react'
import FlipBookReader from '@/components/FlipBookReader'

export default function Books() {
  const [books, setBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activePdf, setActivePdf] = useState<string | null>(null)
  const [activeTitle, setActiveTitle] = useState<string>('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePdf(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/admin/books')
        if (res.ok) {
          const data = await res.json()
          setBooks(data.items)
        }
      } catch (error) {
        console.error('Failed to fetch books', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

  if (loading) {
    return null // Hide section while loading
  }

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
          {books.length === 0 ? (
            <div className="col-span-full py-12 text-center decoration-dashed text-[#6b6b8a]/60 font-medium">
              Books are currently being written/curated. Check back soon!
            </div>
          ) : (
            <AnimatePresence>
              {books.map((book, i) => (
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
                      transition={{ type: "spring", stiffness: 300 }}
                      style={{ perspective: 1000 }}
                      className="relative z-10 w-2/5 md:w-1/2 aspect-[2/3] rounded-sm shadow-[10px_10px_15px_rgba(0,0,0,0.15),-1px_0px_0px_rgba(255,255,255,0.3)_inset] bg-cover bg-center"
                    >
                      <div className="w-full h-full bg-cover bg-center rounded-sm" style={{ backgroundImage: `url(${book.base64Image})` }} />
                      {/* Spine illusion */}
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
                          onClick={() => {
                            setActivePdf(book.base64Pdf)
                            setActiveTitle(book.title)
                          }} 
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

      {/* PDF Viewer Modal */}
      <AnimatePresence>
        {activePdf && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePdf(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a1a2e]/90 backdrop-blur-xl p-0 md:p-8 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full h-full max-w-7xl bg-transparent flex flex-col pt-16 pb-8 cursor-default"
            >
              {/* Floating Close Button */}
              <button 
                onClick={() => setActivePdf(null)}
                className="absolute top-6 right-6 z-[120] p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/20 backdrop-blur-md shadow-lg"
              >
                <X size={24} />
              </button>

              {/* Title Header */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[110] text-center w-full px-4 hidden md:block">
                <span className="text-white/60 text-xs uppercase tracking-[0.2em] font-semibold mb-1 block">Reading Mode</span>
                <h3 className="font-display italic text-2xl text-white font-bold">{activeTitle}</h3>
              </div>

              {/* 3D FlipBook Component */}
              <div className="flex-grow w-full flex items-center justify-center overflow-hidden">
                <FlipBookReader base64Pdf={activePdf} />
              </div>

              {/* Interaction Hint */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-sm font-medium animate-bounce hidden md:block">
                Click or drag corners to flip pages
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
