'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, User, KeyRound } from 'lucide-react'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) {
        router.push('/admin')
      } else {
        const data = await res.json()
        setError(data.message || 'Invalid credentials')
      }
    } catch {
      setError('An error occurred. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-40 mix-blend-multiply" style={{ background: 'var(--accent-rose)' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-40 mix-blend-multiply" style={{ background: 'var(--accent-lavender)' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass w-full max-w-md p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, rgba(201,184,245,0.4), rgba(244,167,180,0.4))' }}>
            <Lock size={20} className="text-[#1a1a2e]" />
          </div>
          <h1 className="font-display italic text-3xl font-semibold text-[#1a1a2e]">Admin Portal</h1>
          <p className="text-sm text-[#6b6b8a] mt-2">Sign in to manage portfolio content</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium text-center border border-red-100"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#6b6b8a] ml-1 flex items-center gap-2">
              <User size={14} /> Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="glass-input px-4 py-3 text-[#1a1a2e]"
              placeholder="Enter username"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#6b6b8a] ml-1 flex items-center gap-2">
              <KeyRound size={14} /> Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input px-4 py-3 text-[#1a1a2e]"
              placeholder="Enter password"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="clay mt-4 flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-[#6b3fa0] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #f3e8ff, #e8f5ff)' }}
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
