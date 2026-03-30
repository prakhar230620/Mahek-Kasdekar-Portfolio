'use client'
import { motion } from 'framer-motion'
import { GraduationCap, BookOpen, School } from 'lucide-react'
import { useState, useEffect } from 'react'

const iconMap = {
  graduation: '🎓',
  book: '📖',
  school: '🏫',
}

const cardGradients = [
  'linear-gradient(135deg, #ffe8ee 0%, #f3e8ff 100%)',
  'linear-gradient(135deg, #f3e8ff 0%, #e8f5ff 100%)',
  'linear-gradient(135deg, #d6f5ec 0%, #e8f5ff 100%)',
]

export default function Education() {
  const [timelineItems, setTimelineItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await fetch('/api/admin/timeline')
        if (res.ok) {
          const data = await res.json()
          setTimelineItems(data.items)
        }
      } catch (err) {
        console.error('Failed to fetch timeline:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTimeline()
  }, [])

  return (
    <section id="education" className="py-24 px-6 lg:px-12">
      <div className="mx-auto max-w-4xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <h2 className="font-display italic font-semibold text-[#1a1a2e] mb-3" style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>
            Education & Achievements
          </h2>
          <div
            className="mx-auto h-1 w-32 rounded-full"
            style={{ background: 'linear-gradient(90deg, #f4a7b4, #c9b8f5, #f9cba7)' }}
          />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-6 top-0 bottom-0 w-px hidden sm:block"
            style={{ background: 'linear-gradient(180deg, rgba(244,167,180,0.6), rgba(201,184,245,0.4), rgba(181,232,216,0.4))' }}
          />

          <div className="flex flex-col gap-8">
            {loading ? (
              <p className="text-center text-[#6b6b8a] animate-pulse">Loading timeline...</p>
            ) : timelineItems.length > 0 ? (
              timelineItems.map((item, i) => {
                const icon = item.icon || '🎓'
                return (
                  <motion.div
                    key={item._id || i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: i * 0.15 }}
                    className="relative flex gap-6"
                  >
                    {/* Timeline dot + emoji */}
                    <div className="relative z-10 flex-shrink-0 hidden sm:flex flex-col items-center">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-xl"
                        style={{ background: cardGradients[i % cardGradients.length], boxShadow: '0 0 0 4px rgba(255,255,255,0.8), 0 0 16px rgba(244,167,180,0.4)' }}
                      >
                        {icon}
                      </div>
                    </div>

                    {/* Card */}
                    <motion.div
                      whileHover={{ scale: 1.02, boxShadow: '0 16px 48px rgba(180,120,140,0.18)' }}
                      className="glass flex-1 p-6"
                      style={{ borderRadius: '20px' }}
                    >
                      <div className="flex sm:hidden items-center gap-3 mb-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                          style={{ background: cardGradients[i % cardGradients.length] }}
                        >
                          {icon}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <h3 className="font-display italic font-semibold text-[#1a1a2e] text-xl">{item.title}</h3>
                        <span
                          className="clay px-3 py-1 text-xs font-medium text-[#9b4f6a] whitespace-nowrap"
                          style={{ background: cardGradients[i % cardGradients.length] }}
                        >
                          {item.period}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#c9b8f5] mb-2">{item.institution}</p>
                      <p className="text-[15px] text-[#6b6b8a] leading-[1.7]">{item.description}</p>
                    </motion.div>
                  </motion.div>
                )
              })
            ) : (
              <p className="text-center text-[#6b6b8a]">No timeline data found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
