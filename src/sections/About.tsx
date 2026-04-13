'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { personalityTraits } from '@/lib/portfolioData'
import { profileImage as defaultProfileImage } from '@/lib/profileImage'

const traitColors = [
  'linear-gradient(135deg, #ffe8ee, #f3e8ff)',
  'linear-gradient(135deg, #f3e8ff, #e8f5ff)',
  'linear-gradient(135deg, #e8f5ff, #d6f5ec)',
  'linear-gradient(135deg, #fff7e8, #ffe8ee)',
]

export default function About({ profileImage = defaultProfileImage }: { profileImage?: string }) {
  return (
    <section id="about" className="py-24 px-6 lg:px-12">
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
            About Me
          </h2>
          <div
            className="mx-auto h-1 w-24 rounded-full"
            style={{ background: 'linear-gradient(90deg, #f4a7b4, #c9b8f5, #f9cba7)' }}
          />
        </motion.div>

        {/* Two-column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Photo card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="glass relative aspect-[3/4] w-full max-w-sm mx-auto overflow-hidden rounded-3xl group">
              {/* Profile Image */}
              <Image
                src={profileImage}
                alt="Mahek Kasdekar"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                unoptimized
              />
              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              
              <div className="absolute bottom-8 left-8 right-8 z-10">
                <p className="text-center font-display italic text-2xl text-white/90 drop-shadow-md">Mahek</p>
              </div>
            </div>
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="clay absolute -bottom-4 -right-4 lg:right-0 px-4 py-2 text-xs font-semibold text-[#6b3fa0]"
              style={{ background: 'linear-gradient(135deg, #f3e8ff, #ffe8ee)' }}
            >
              Delhi University · History · 2023–25
            </motion.div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-5 pt-4"
          >
            <p className="text-[17px] text-[#1a1a2e] leading-[1.8]">
              I&apos;m Mahek — a storyteller at heart and a dreamer by nature. Having completed my BA in History from Delhi University, I find meaning in the overlap between the past and the present, in art that speaks without words, and in stories that last a lifetime.
            </p>
            <p className="text-[17px] text-[#6b6b8a] leading-[1.8]">
              When I&apos;m not buried in books or scribbling poetry, you&apos;ll find me behind a camera, mixing colours on a canvas, or editing memories into moments worth keeping.
            </p>
            <p className="text-[17px] text-[#6b6b8a] leading-[1.8]">
              I believe in living beautifully, creating intentionally, and growing every single day.
            </p>

            {/* Personality pills */}
            <div className="flex flex-wrap gap-3 mt-4">
              {personalityTraits.map((trait, i) => (
                <motion.span
                  key={trait}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="clay px-5 py-2 text-sm font-medium text-[#6b3fa0] cursor-default"
                  style={{ background: traitColors[i] }}
                >
                  {trait}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
