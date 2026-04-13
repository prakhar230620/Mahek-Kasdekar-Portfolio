'use client'
import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye } from 'lucide-react'
import { portfolioItems, filterCategories, FilterCategory } from '@/lib/portfolioData'

const placeholderGradients: Record<string, string> = {
  Writing: 'linear-gradient(135deg, rgba(255,216,224,0.8), rgba(255,232,238,0.6))',
  Art: 'linear-gradient(135deg, rgba(227,214,255,0.8), rgba(243,232,255,0.6))',
  Photography: 'linear-gradient(135deg, rgba(253,224,197,0.8), rgba(255,240,220,0.6))',
  Editing: 'linear-gradient(135deg, rgba(181,232,216,0.8), rgba(214,245,236,0.6))',
  Certificates: 'linear-gradient(135deg, rgba(255,240,210,0.8), rgba(255,250,220,0.6))',
}

export default function Portfolio({ initialItems = [] }: { initialItems?: any[] }) {
  const [active, setActive] = useState<FilterCategory>('All')

  const filtered = useMemo(
    () => (active === 'All' ? initialItems : initialItems.filter((p) => p.category === active)),
    [active, initialItems]
  )

  const aspectRatio: Record<string, string> = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
  }

  return (
    <section id="portfolio" className="py-24 px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <h2 className="font-display italic font-semibold text-[#1a1a2e] mb-3" style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>
            My Work
          </h2>
          <div
            className="mx-auto h-1 w-24 rounded-full"
            style={{ background: 'linear-gradient(90deg, #f4a7b4, #c9b8f5, #f9cba7)' }}
          />
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {filterCategories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActive(cat)}
              className="px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 border"
              style={
                active === cat
                  ? {
                      background: 'linear-gradient(135deg, #f4a7b4, #c9b8f5)',
                      color: 'white',
                      border: 'none',
                      boxShadow: '4px 4px 0px rgba(200,160,180,0.3)',
                    }
                  : {
                      background: 'rgba(255,255,255,0.5)',
                      color: '#6b6b8a',
                      borderColor: 'rgba(255,255,255,0.7)',
                      backdropFilter: 'blur(8px)',
                    }
              }
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Masonry grid */}
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item._id || item.id || i}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="break-inside-avoid mb-5"
              >
                <motion.div
                  whileHover="hover"
                  className="glass group relative overflow-hidden cursor-pointer"
                  style={{ borderRadius: '20px' }}
                >
                  {/* Image placeholder or Base64 Image */}
                  <div
                    className={`w-full ${aspectRatio[item.aspect]} relative bg-cover bg-center`}
                    style={item.base64Image ? { backgroundImage: `url(${item.base64Image})` } : { background: placeholderGradients[item.category] }}
                  >
                    {!item.base64Image && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <div className="w-16 h-16 rounded-full bg-white/50" />
                      </div>
                    )}

                    {/* Hover overlay */}
                    <motion.div
                      variants={{ hover: { opacity: 1 }, initial: { opacity: 0 } }}
                      initial="initial"
                      className="absolute inset-0 bg-[rgba(26,26,46,0.55)] backdrop-blur-[2px] flex items-center justify-center"
                    >
                      <motion.div
                        variants={{ hover: { scale: 1, opacity: 1 }, initial: { scale: 0.8, opacity: 0 } }}
                        className="clay flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white"
                        style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}
                      >
                        <Eye size={16} /> View
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Card info */}
                  <div className="p-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium mb-2 ${item.tagColor}`}>
                      {item.tag}
                    </span>
                    <h3 className="font-display italic font-semibold text-[#1a1a2e] text-lg leading-tight mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#6b6b8a] truncate">{item.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
