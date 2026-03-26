'use client'
import { motion } from 'framer-motion'
import { skillItems, softSkills } from '@/lib/portfolioData'

const cardGradients = [
  'linear-gradient(135deg, #ffe8ee, #f3e8ff)',
  'linear-gradient(135deg, #f3e8ff, #e8f5ff)',
  'linear-gradient(135deg, #d6f5ec, #e8f5ff)',
  'linear-gradient(135deg, #fff7e8, #ffe8ee)',
  'linear-gradient(135deg, #e8f5ff, #d6f5ec)',
  'linear-gradient(135deg, #f3e8ff, #ffe8ee)',
]

const softSkillColors = [
  { bg: 'rgba(244,167,180,0.2)', text: '#9b4f6a' },
  { bg: 'rgba(201,184,245,0.2)', text: '#6b3fa0' },
  { bg: 'rgba(249,203,167,0.2)', text: '#9b5a2a' },
  { bg: 'rgba(181,232,216,0.2)', text: '#2a7a5c' },
  { bg: 'rgba(244,167,180,0.2)', text: '#9b4f6a' },
  { bg: 'rgba(201,184,245,0.2)', text: '#6b3fa0' },
  { bg: 'rgba(249,203,167,0.2)', text: '#9b5a2a' },
  { bg: 'rgba(181,232,216,0.2)', text: '#2a7a5c' },
]

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 lg:px-12">
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
            Skills &amp; Interests
          </h2>
          <div
            className="mx-auto h-1 w-24 rounded-full"
            style={{ background: 'linear-gradient(90deg, #f4a7b4, #c9b8f5, #f9cba7)' }}
          />
        </motion.div>

        {/* Creative Skills grid */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-semibold tracking-widest uppercase text-[#c9b8f5] mb-8"
        >
          Creative Skills
        </motion.p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-16">
          {skillItems.map((skill, i) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ scale: 1.04, y: -4 }}
              className="clay p-6 flex flex-col gap-3 cursor-default"
              style={{ background: cardGradients[i] }}
            >
              <span className="text-3xl">{skill.icon}</span>
              <h3 className="font-display italic font-semibold text-[#1a1a2e] text-lg">{skill.title}</h3>
              <p className="text-sm text-[#6b6b8a] leading-[1.6]">{skill.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Soft Skills */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-semibold tracking-widest uppercase text-[#c9b8f5] mb-8"
        >
          Soft Skills
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {softSkills.map((skill, i) => (
            <motion.span
              key={skill}
              whileHover={{ scale: 1.08 }}
              className="px-5 py-2.5 rounded-full text-sm font-medium cursor-default border border-white/60"
              style={{
                background: softSkillColors[i].bg,
                color: softSkillColors[i].text,
                backdropFilter: 'blur(8px)',
              }}
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
