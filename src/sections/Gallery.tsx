'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { galleryItems } from '@/lib/portfolioData'

const gradients = [
  'linear-gradient(135deg, rgba(244,167,180,0.5), rgba(249,203,167,0.4))',
  'linear-gradient(135deg, rgba(201,184,245,0.5), rgba(244,167,180,0.4))',
  'linear-gradient(135deg, rgba(181,232,216,0.5), rgba(201,184,245,0.4))',
  'linear-gradient(135deg, rgba(249,203,167,0.5), rgba(181,232,216,0.4))',
  'linear-gradient(135deg, rgba(244,167,180,0.4), rgba(201,184,245,0.5))',
  'linear-gradient(135deg, rgba(181,232,216,0.4), rgba(249,203,167,0.5))',
  'linear-gradient(135deg, rgba(201,184,245,0.45), rgba(181,232,216,0.4))',
  'linear-gradient(135deg, rgba(249,203,167,0.5), rgba(244,167,180,0.4))',
  'linear-gradient(135deg, rgba(244,167,180,0.5), rgba(181,232,216,0.4))',
  'linear-gradient(135deg, rgba(201,184,245,0.5), rgba(249,203,167,0.4))',
]

const aspectH: Record<string, string> = {
  square: 'h-40',
  portrait: 'h-52',
  landscape: 'h-32',
}

export default function Gallery() {
  const carouselRef = useRef<HTMLDivElement>(null)

  // Duplicate items for infinite loop
  const carouselItems = [...galleryItems, ...galleryItems]

  return (
    <section id="gallery" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <h2 className="font-display italic font-semibold text-[#1a1a2e] mb-3" style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>
            Gallery
          </h2>
          <div
            className="mx-auto h-1 w-24 rounded-full"
            style={{ background: 'linear-gradient(90deg, #f4a7b4, #c9b8f5, #f9cba7)' }}
          />
        </motion.div>
      </div>

      {/* Infinite carousel */}
      <div
        className="overflow-hidden mb-16 group"
        ref={carouselRef}
      >
        <div className="flex gap-4 animate-marquee group-hover:animate-marquee-paused w-max">
          {carouselItems.map((item, i) => (
            <motion.div
              key={`${item.id}-${i}`}
              whileHover={{ scale: 1.04 }}
              className="glass flex-shrink-0 w-52 overflow-hidden cursor-pointer"
              style={{ borderRadius: '20px', height: '220px' }}
            >
              <div
                className="w-full h-full flex items-end p-3"
                style={{ background: gradients[i % gradients.length] }}
              >
                <p className="text-xs text-[#6b6b8a] font-medium leading-tight opacity-70">{item.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bento grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {/* Large cell 1 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass col-span-1 lg:col-span-2 overflow-hidden row-span-2 cursor-pointer"
            style={{ borderRadius: '20px', minHeight: '320px' }}
          >
            <div
              className="w-full h-full min-h-[320px] flex items-end p-5"
              style={{ background: gradients[0] }}
            >
              <p className="font-display italic text-lg text-[#6b6b8a] opacity-70">Golden Hour</p>
            </div>
          </motion.div>

          {/* Small cells */}
          {[1, 2, 3, 4].map((idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              className="glass overflow-hidden cursor-pointer"
              style={{ borderRadius: '20px', minHeight: '150px' }}
            >
              <div
                className="w-full h-full min-h-[150px] flex items-end p-4"
                style={{ background: gradients[idx] }}
              >
                <p className="text-xs text-[#6b6b8a] font-medium opacity-70">{galleryItems[idx]?.alt}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
