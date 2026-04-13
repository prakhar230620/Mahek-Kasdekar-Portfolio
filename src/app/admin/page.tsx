'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogOut, Image as ImageIcon, MessageSquare, Trash2, Plus, Upload,
  BookOpen, Trophy, Edit2, X, Check, ChevronUp, ChevronDown, CheckSquare, Square,
  User
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false })

// ─── Types ──────────────────────────────────────────────────────────────────
type Tab = 'portfolio' | 'gallery' | 'books' | 'timeline' | 'messages' | 'about'

const emptyPortfolioForm = { title: '', description: '', category: 'Photography', aspect: 'landscape', tag: '', tagColor: 'bg-[#fde8d6] text-[#9b5a2a]' }
const emptyGalleryForm = { alt: '', aspect: 'square' }
const emptyBookForm = { title: '', description: '', readLink: '' }
const emptyTimelineForm = { title: '', institution: '', period: '', description: '', icon: '🎓' }

// ─── Client-Side Image Compression ──────────────────────────────────────────
// Vercel Serverless Functions have a hard 4.5MB request body limit.
// Raw base64 images easily exceed this, so we compress/resize them in the
// browser BEFORE the fetch call so the payload is always well under the limit.
const MAX_IMAGE_SIDE = 1200   // max px on longest side
const MAX_PDF_MB     = 3.5    // hard gate: PDFs can't be canvas-compressed

function compressImageClientSide(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.onload = () => {
      const img = new Image()
      img.src = reader.result as string
      img.onerror = () => reject(new Error('Failed to load image'))
      img.onload = () => {
        let { width, height } = img
        // Downscale if needed
        if (width > MAX_IMAGE_SIDE || height > MAX_IMAGE_SIDE) {
          if (width >= height) { height = Math.round(height * MAX_IMAGE_SIDE / width); width = MAX_IMAGE_SIDE }
          else                 { width  = Math.round(width  * MAX_IMAGE_SIDE / height); height = MAX_IMAGE_SIDE }
        }
        const canvas = document.createElement('canvas')
        canvas.width  = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) { reject(new Error('Canvas not supported')); return }
        ctx.drawImage(img, 0, 0, width, height)

        // Encode as JPEG at 85% quality (~5-10× smaller than raw base64)
        let result = canvas.toDataURL('image/jpeg', 0.85)
        // Still too large? Drop quality further
        if (result.length > 2 * 1024 * 1024)
          result = canvas.toDataURL('image/jpeg', 0.70)
        // Last resort: also halve the dimensions
        if (result.length > 2 * 1024 * 1024) {
          const c2 = document.createElement('canvas')
          c2.width  = Math.round(width  * 0.65)
          c2.height = Math.round(height * 0.65)
          const ctx2 = c2.getContext('2d')!
          ctx2.drawImage(img, 0, 0, c2.width, c2.height)
          result = c2.toDataURL('image/jpeg', 0.70)
        }
        resolve(result)
      }
    }
  })
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('portfolio')

  // ── Data State ─────────────────────────────────────────────────────────────
  const [portfolio, setPortfolio] = useState<any[]>([])
  const [gallery, setGallery] = useState<any[]>([])
  const [books, setBooks] = useState<any[]>([])
  const [timeline, setTimeline] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [stats, setStats] = useState({ portfolio: 0, gallery: 0, messages: 0, books: 0, timeline: 0 })
  const [aboutImage, setAboutImage] = useState<string>('')
  const [loading, setLoading] = useState(true)

  // ── Add / Edit Form State ──────────────────────────────────────────────────
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add')
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [galleryFormOpen, setGalleryFormOpen] = useState(false)
  const [bookFormOpen, setBookFormOpen] = useState(false)
  const [timelineFormOpen, setTimelineFormOpen] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const [formData, setFormData] = useState({ ...emptyPortfolioForm })
  const [galleryData, setGalleryData] = useState({ ...emptyGalleryForm })
  const [bookData, setBookData] = useState({ ...emptyBookForm })
  const [timelineData, setTimelineData] = useState({ ...emptyTimelineForm })

  const [base64Image, setBase64Image] = useState<string>('')
  const [galleryBase64, setGalleryBase64] = useState<string>('')
  const [bookBase64, setBookBase64] = useState<string>('')
  const [bookPdfBase64, setBookPdfBase64] = useState<string>('')
  const [aboutBase64, setAboutBase64] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [compressing, setCompressing] = useState(false)

  // ── Bulk Selection (plain arrays — simpler React re-render tracking) ─────────
  const [selectedPortfolio, setSelectedPortfolio] = useState<string[]>([])
  const [selectedGallery, setSelectedGallery] = useState<string[]>([])
  const [selectedBooks, setSelectedBooks] = useState<string[]>([])
  const [selectedTimeline, setSelectedTimeline] = useState<string[]>([])
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])

  // ─── Fetch Data ─────────────────────────────────────────────────────────────
  const fetchData = useCallback(async (background = false) => {
    if (!background) setLoading(true)
    try {
      const [pRes, gRes, bRes, tRes, mRes, sRes, setRes] = await Promise.all([
        fetch('/api/admin/portfolio'),
        fetch('/api/admin/gallery'),
        fetch('/api/admin/books'),
        fetch('/api/admin/timeline'),
        fetch('/api/admin/messages'),
        fetch('/api/admin/stats'),
        fetch('/api/admin/settings?key=aboutProfileImage'),
      ])
      if (pRes.ok) setPortfolio((await pRes.json()).items)
      if (gRes.ok) setGallery((await gRes.json()).items)
      if (bRes.ok) setBooks((await bRes.json()).items)
      if (tRes.ok) setTimeline((await tRes.json()).items)
      if (mRes.ok) setMessages((await mRes.json()).messages)
      if (sRes.ok) setStats((await sRes.json()).data)
      if (setRes.ok) setAboutImage((await setRes.json()).value)
    } catch (err) { console.error(err) }
    finally { if (!background) setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // ─── File → Base64 (images compressed client-side before upload) ─────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'portfolio' | 'gallery' | 'book' | 'bookPdf' | 'about') => {
    const file = e.target.files?.[0]
    if (!file) return

    // ── PDF: validate size only (can't canvas-compress) ──
    if (type === 'bookPdf') {
      const sizeMB = file.size / (1024 * 1024)
      if (sizeMB > MAX_PDF_MB) {
        alert(`PDF is too large (${sizeMB.toFixed(1)} MB).\nMaximum allowed is ${MAX_PDF_MB} MB.\nPlease compress the PDF before uploading.`)
        e.target.value = ''
        return
      }
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => setBookPdfBase64(reader.result as string)
      return
    }

    // ── Image: compress client-side to stay under Vercel's 4.5 MB body limit ──
    setCompressing(true)
    try {
      const compressed = await compressImageClientSide(file)
      if (type === 'portfolio')  setBase64Image(compressed)
      else if (type === 'gallery') setGalleryBase64(compressed)
      else if (type === 'book')    setBookBase64(compressed)
      else if (type === 'about')   setAboutBase64(compressed)
    } catch {
      alert('Failed to process image. Please try a different file.')
    } finally {
      setCompressing(false)
    }
  }

  // ─── Open Edit Forms ────────────────────────────────────────────────────────
  const openEditPortfolio = (item: any) => {
    setFormMode('edit'); setEditingId(item._id)
    setFormData({ title: item.title, description: item.description, category: item.category, aspect: item.aspect, tag: item.tag, tagColor: item.tagColor })
    setBase64Image('')
    setFormOpen(true)
  }
  const openEditGallery = (item: any) => {
    setFormMode('edit'); setEditingId(item._id)
    setGalleryData({ alt: item.alt, aspect: item.aspect })
    setGalleryBase64('')
    setGalleryFormOpen(true)
  }
  const openEditBook = (item: any) => {
    setFormMode('edit'); setEditingId(item._id)
    setBookData({ title: item.title, description: item.description, readLink: item.readLink || '' })
    setBookBase64(''); setBookPdfBase64('')
    setBookFormOpen(true)
  }
  const openEditTimeline = (item: any) => {
    setFormMode('edit'); setEditingId(item._id)
    setTimelineData({ title: item.title, institution: item.institution, period: item.period, description: item.description, icon: item.icon })
    setTimelineFormOpen(true)
  }

  const closeAllForms = () => {
    setFormOpen(false); setGalleryFormOpen(false); setBookFormOpen(false); setTimelineFormOpen(false)
    setFormMode('add'); setEditingId(null)
    setFormData({ ...emptyPortfolioForm }); setGalleryData({ ...emptyGalleryForm })
    setBookData({ ...emptyBookForm }); setTimelineData({ ...emptyTimelineForm })
    setBase64Image(''); setGalleryBase64(''); setBookBase64(''); setBookPdfBase64('')
  }

  // ─── Portfolio CRUD ────────────────────────────────────────────────────────
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formMode === 'add' && !base64Image) { alert('Please select an image'); return }
    setUploading(true)
    try {
      const method = formMode === 'add' ? 'POST' : 'PUT'
      const body = formMode === 'add' ? { ...formData, base64Image } : { id: editingId, ...formData, ...(base64Image ? { base64Image } : {}) }
      const res = await fetch('/api/admin/portfolio', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) { 
        const { item } = await res.json()
        if (formMode === 'add') {
          setPortfolio(prev => [{ ...item, ...formData, base64Image }, ...prev])
        } else {
          setPortfolio(prev => prev.map(p => p._id === item._id ? { ...p, ...item, ...formData, base64Image: base64Image || p.base64Image } : p))
        }
        closeAllForms()
      }
      else {
        const err = await res.json().catch(() => ({}))
        if (res.status === 413) alert('Upload failed: image is still too large even after compression. Try a smaller/simpler image.')
        else alert(`Failed to save item: ${err.message || res.statusText}`)
      }
    } catch { alert('Network error. Check your connection and try again.') } finally { setUploading(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this portfolio item?')) return
    const res = await fetch('/api/admin/portfolio', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    if (res.ok) setPortfolio(prev => prev.filter(p => p._id !== id))
  }

  const handleBulkDeletePortfolio = async () => {
    if (selectedPortfolio.length === 0) return
    if (!confirm(`Delete ${selectedPortfolio.length} selected item(s)?`)) return
    const res = await fetch('/api/admin/portfolio', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: selectedPortfolio }) })
    if (res.ok) {
      setPortfolio(prev => prev.filter(p => !selectedPortfolio.includes(p._id)))
      setSelectedPortfolio([])
    }
  }

  const toggleSelectPortfolio = (id: string) => {
    setSelectedPortfolio(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  // ─── Gallery CRUD ──────────────────────────────────────────────────────────
  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formMode === 'add' && !galleryBase64) { alert('Please select an image'); return }
    setUploading(true)
    try {
      const method = formMode === 'add' ? 'POST' : 'PUT'
      const body = formMode === 'add' ? { ...galleryData, base64Image: galleryBase64 } : { id: editingId, ...galleryData, ...(galleryBase64 ? { base64Image: galleryBase64 } : {}) }
      const res = await fetch('/api/admin/gallery', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) { 
        const { item } = await res.json()
        if (formMode === 'add') {
          setGallery(prev => [{ ...item, ...galleryData, base64Image: galleryBase64 }, ...prev])
        } else {
          setGallery(prev => prev.map(g => g._id === item._id ? { ...g, ...item, ...galleryData, base64Image: galleryBase64 || g.base64Image } : g))
        }
        closeAllForms() 
      }
      else {
        const err = await res.json().catch(() => ({}))
        if (res.status === 413) alert('Upload failed: image is still too large even after compression. Try a smaller/simpler image.')
        else alert(`Failed to save gallery item: ${err.message || res.statusText}`)
      }
    } catch { alert('Network error. Check your connection and try again.') } finally { setUploading(false) }
  }

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Delete this gallery image?')) return
    const res = await fetch('/api/admin/gallery', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    if (res.ok) setGallery(prev => prev.filter(g => g._id !== id))
  }

  const handleBulkDeleteGallery = async () => {
    if (selectedGallery.length === 0) return
    if (!confirm(`Delete ${selectedGallery.length} selected image(s)?`)) return
    const res = await fetch('/api/admin/gallery', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: selectedGallery }) })
    if (res.ok) {
      setGallery(prev => prev.filter(g => !selectedGallery.includes(g._id)))
      setSelectedGallery([])
    }
  }

  const toggleSelectGallery = (id: string) => {
    setSelectedGallery(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  // ─── Books CRUD ────────────────────────────────────────────────────────────
  const handleAddBookItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formMode === 'add' && !bookBase64) { alert('Please select a cover image'); return }
    setUploading(true)
    try {
      const method = formMode === 'add' ? 'POST' : 'PUT'
      const body = formMode === 'add'
        ? { ...bookData, base64Image: bookBase64, base64Pdf: bookPdfBase64 }
        : { id: editingId, ...bookData, ...(bookBase64 ? { base64Image: bookBase64 } : {}), ...(bookPdfBase64 ? { base64Pdf: bookPdfBase64 } : {}) }
      const res = await fetch('/api/admin/books', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) { 
        const { item } = await res.json()
        if (formMode === 'add') {
          setBooks(prev => [{ ...item, ...bookData, base64Image: bookBase64, base64Pdf: bookPdfBase64 }, ...prev])
        } else {
          setBooks(prev => prev.map(b => b._id === item._id ? { ...b, ...item, ...bookData, base64Image: bookBase64 || b.base64Image, base64Pdf: bookPdfBase64 || b.base64Pdf } : b))
        }
        closeAllForms() 
      }
      else {
        const err = await res.json().catch(() => ({}))
        if (res.status === 413) alert(`Upload failed: total payload too large.\nTip: Cover image is auto-compressed, but PDF must be under ${MAX_PDF_MB} MB.`)
        else alert(`Failed to save book: ${err.message || res.statusText}`)
      }
    } catch { alert('Network error. Check your connection and try again.') } finally { setUploading(false) }
  }

  const handleDeleteBook = async (id: string) => {
    if (!confirm('Delete this book?')) return
    const res = await fetch('/api/admin/books', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    if (res.ok) setBooks(prev => prev.filter(b => b._id !== id))
  }

  const handleBulkDeleteBooks = async () => {
    if (selectedBooks.length === 0) return
    if (!confirm(`Delete ${selectedBooks.length} selected book(s)?`)) return
    const res = await fetch('/api/admin/books', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: selectedBooks }) })
    if (res.ok) {
      setBooks(prev => prev.filter(b => !selectedBooks.includes(b._id)))
      setSelectedBooks([])
    }
  }

  const toggleSelectBook = (id: string) => {
    setSelectedBooks(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  // ─── Timeline CRUD + Reorder ────────────────────────────────────────────────
  const handleAddTimelineItem = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    try {
      const method = formMode === 'add' ? 'POST' : 'PUT'
      const body = formMode === 'add' ? timelineData : { id: editingId, ...timelineData }
      const res = await fetch('/api/admin/timeline', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) { 
        const { item } = await res.json()
        if (formMode === 'add') {
          setTimeline(prev => [...prev, { ...item, ...timelineData }]) // Appending at the end to match order? Or sort later?
        } else {
          setTimeline(prev => prev.map(t => t._id === item._id ? { ...t, ...item, ...timelineData } : t))
        }
        closeAllForms() 
      }
      else {
        const err = await res.json().catch(() => ({}))
        alert(`Failed to save entry: ${err.message || res.statusText}`)
      }
    } catch { alert('Network error. Check your connection and try again.') } finally { setUploading(false) }
  }

  const handleDeleteTimeline = async (id: string) => {
    if (!confirm('Delete this achievement entry?')) return
    const res = await fetch('/api/admin/timeline', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    if (res.ok) setTimeline(prev => prev.filter(t => t._id !== id))
  }

  const handleBulkDeleteTimeline = async () => {
    if (selectedTimeline.length === 0) return
    if (!confirm(`Delete ${selectedTimeline.length} selected entry(s)?`)) return
    const res = await fetch('/api/admin/timeline', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: selectedTimeline }) })
    if (res.ok) {
      setTimeline(prev => prev.filter(t => !selectedTimeline.includes(t._id)))
      setSelectedTimeline([])
    }
  }

  const toggleSelectTimeline = (id: string) => {
    setSelectedTimeline(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleMoveTimeline = async (index: number, direction: 'up' | 'down') => {
    const newArr = [...timeline]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= newArr.length) return
    ;[newArr[index], newArr[swapIndex]] = [newArr[swapIndex], newArr[index]]
    const reordered = newArr.map((item, i) => ({ id: item._id, order: i }))
    setTimeline(newArr) // optimistic update
    await fetch('/api/admin/timeline', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reordered)
    })
  }

  // ─── Messages ──────────────────────────────────────────────────────────────
  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return
    const res = await fetch('/api/admin/messages', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    if (res.ok) setMessages(prev => prev.filter(m => m._id !== id))
  }

  const handleBulkDeleteMessages = async () => {
    if (selectedMessages.length === 0) return
    if (!confirm(`Delete ${selectedMessages.length} selected message(s)?`)) return
    await Promise.all(selectedMessages.map(id =>
      fetch('/api/admin/messages', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    ))
    setMessages(prev => prev.filter(m => !selectedMessages.includes(m._id)))
    setSelectedMessages([])
  }

  const toggleSelectMessage = (id: string) => {
    setSelectedMessages(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  // ─── Settings / About ──────────────────────────────────────────────────────
  const handleSaveAboutImage = async () => {
    if (!aboutBase64) return alert('Please select an image first')
    setUploading(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'aboutProfileImage', value: aboutBase64 })
      })
      if (res.ok) {
        setAboutImage(aboutBase64)
        setAboutBase64('')
        alert('About image updated successfully!')
      } else {
        const err = await res.json().catch(() => ({}))
        alert(`Failed to save image: ${err.message || res.statusText}`)
      }
    } catch { alert('Network error.') } finally { setUploading(false) }
  }

  const handleLogout = async () => {
    try { await fetch('/api/admin/logout', { method: 'POST' }) } catch (e) { console.error(e) }
    finally { localStorage.removeItem('admin_token'); router.replace('/admin/login') }
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-12 font-body text-[#1a1a2e]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="font-display italic text-4xl font-semibold">Dashboard</h1>
            <p className="text-[#6b6b8a]">Manage your portfolio content and messages</p>
          </div>
          <button onClick={handleLogout} className="clay flex items-center gap-2 px-6 py-3 text-sm font-semibold text-red-500 bg-white">
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-12">
          {[
            { label: 'Portfolio', value: stats.portfolio, icon: <ImageIcon size={100} /> },
            { label: 'Gallery', value: stats.gallery, icon: <ImageIcon size={100} /> },
            { label: 'Books', value: stats.books, icon: <BookOpen size={100} /> },
            { label: 'Achievements', value: stats.timeline, icon: <Trophy size={100} /> },
            { label: 'Messages', value: stats.messages, icon: <MessageSquare size={100} />, wide: true },
          ].map(s => (
            <div key={s.label} className={`glass p-6 flex flex-col gap-2 relative overflow-hidden group ${s.wide ? 'col-span-2 lg:col-span-1' : ''}`}>
              <div className="absolute -right-4 -bottom-4 opacity-5 text-[#c9b8f5] group-hover:scale-110 transition-transform duration-500">{s.icon}</div>
              <span className="text-[#6b6b8a] font-semibold text-sm uppercase tracking-wider">{s.label}</span>
              <span className="font-display text-2xl font-bold bg-gradient-to-r from-[#6b3fa0] to-[#f4a7b4] bg-clip-text text-transparent">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-8 border-b border-[#c9b8f5]/30 pb-4">
          {([
            { id: 'portfolio', label: 'Portfolio', icon: <ImageIcon size={18} /> },
            { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={18} /> },
            { id: 'books', label: 'Books', icon: <BookOpen size={18} /> },
            { id: 'timeline', label: 'Education & Achievements', icon: <Trophy size={18} /> },
            { id: 'messages', label: 'Messages', icon: <MessageSquare size={18} /> },
            { id: 'about', label: 'About', icon: <User size={18} /> },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 font-semibold transition-colors text-sm md:text-base ${activeTab === tab.id ? 'text-[#6b3fa0] border-b-2 border-[#6b3fa0]' : 'text-[#6b6b8a]'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-[#6b6b8a]">Loading data...</p>
        ) : (
          <div>

            {/* ══ PORTFOLIO TAB ══════════════════════════════════════════════ */}
            {activeTab === 'portfolio' && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <h2 className="font-display text-2xl font-semibold">Manage Portfolio</h2>
                  <div className="flex gap-2 flex-wrap">
                    {selectedPortfolio.length > 0 && (
                      <button onClick={handleBulkDeletePortfolio} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors">
                        <Trash2 size={15} /> Delete ({selectedPortfolio.length})
                      </button>
                    )}
                    <button onClick={() => { setFormMode('add'); setFormOpen(!formOpen) }} className="clay flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#1a1a2e] bg-white">
                      <Plus size={16} /> Add New
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {formOpen && (
                    <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddItem} className="glass p-6 md:p-8 flex flex-col gap-6 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">{formMode === 'add' ? 'Add New Item' : 'Edit Item'}</h3>
                        <button type="button" onClick={closeAllForms} className="p-2 rounded-full hover:bg-black/10"><X size={18} /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="text" placeholder="Title" required className="glass-input p-3" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        <input type="text" placeholder="Description" required className="glass-input p-3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        <select className="glass-input p-3" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                          <option value="Writing">Writing</option><option value="Art">Art</option>
                          <option value="Photography">Photography</option><option value="Editing">Editing</option>
                          <option value="Certificates">Certificates</option>
                        </select>
                        <select className="glass-input p-3" value={formData.aspect} onChange={e => setFormData({ ...formData, aspect: e.target.value })}>
                          <option value="landscape">Landscape</option><option value="portrait">Portrait</option><option value="square">Square</option>
                        </select>
                        <input type="text" placeholder="Tag (e.g., Short Story)" required className="glass-input p-3" value={formData.tag} onChange={e => setFormData({ ...formData, tag: e.target.value })} />
                        <div className="flex items-center gap-4">
                          <label className="clay flex items-center gap-2 px-5 py-3 cursor-pointer text-sm font-semibold bg-white w-max">
                            <Upload size={16} /> {formMode === 'edit' ? 'Change Image (Optional)' : 'Select Image'}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'portfolio')} />
                          </label>
                          {base64Image && <span className="text-xs text-green-600">Image Loaded ✓</span>}
                        </div>
                      </div>
                      <button disabled={uploading || compressing} type="submit" className="clay mt-2 flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-[#1a1a2e] disabled:opacity-50">
                        <Check size={16} /> {compressing ? 'Compressing image…' : uploading ? 'Saving...' : formMode === 'add' ? 'Save Item' : 'Update Item'}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="glass overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-[#c9b8f5]/30">
                        <th className="p-4">
                          <button onClick={() => setSelectedPortfolio(selectedPortfolio.length === portfolio.length ? [] : portfolio.map((i: any) => String(i._id)))}
                            className="text-[#6b6b8a] hover:text-[#6b3fa0]">
                            {selectedPortfolio.length === portfolio.length && portfolio.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
                          </button>
                        </th>
                        <th className="p-4 text-sm font-semibold text-[#6b6b8a]">Image</th>
                        <th className="p-4 text-sm font-semibold text-[#6b6b8a]">Title</th>
                        <th className="p-4 text-sm font-semibold text-[#6b6b8a] hidden md:table-cell">Category</th>
                        <th className="p-4 text-sm font-semibold text-[#6b6b8a]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.map((item) => (
                        <tr key={item._id} className={`border-b border-[#c9b8f5]/10 hover:bg-white/10 transition-colors ${selectedPortfolio.includes(String(item._id)) ? 'bg-[#6b3fa0]/5' : ''}`}>
                          <td className="p-4">
                            <button onClick={() => toggleSelectPortfolio(String(item._id))} className="text-[#6b6b8a] hover:text-[#6b3fa0]">
                              {selectedPortfolio.includes(String(item._id)) ? <CheckSquare size={18} className="text-[#6b3fa0]" /> : <Square size={18} />}
                            </button>
                          </td>
                          <td className="p-4">
                            <div className="w-12 h-12 rounded-lg bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${item.base64Image})` }} />
                          </td>
                          <td className="p-4 font-medium text-sm">{item.title}</td>
                          <td className="p-4 hidden md:table-cell"><span className={`px-3 py-1 text-xs rounded-full ${item.tagColor}`}>{item.category}</span></td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => openEditPortfolio(item)} className="p-2 bg-[#6b3fa0]/10 text-[#6b3fa0] hover:bg-[#6b3fa0]/20 rounded-lg transition-colors" title="Edit"><Edit2 size={16} /></button>
                              <button onClick={() => handleDelete(item._id)} className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {portfolio.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-[#6b6b8a]">No portfolio items yet.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══ GALLERY TAB ══════════════════════════════════════════════ */}
            {activeTab === 'gallery' && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <h2 className="font-display text-2xl font-semibold">Manage Gallery</h2>
                  <div className="flex gap-2 flex-wrap">
                    {selectedGallery.length > 0 && (
                      <button onClick={handleBulkDeleteGallery} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors">
                        <Trash2 size={15} /> Delete ({selectedGallery.length})
                      </button>
                    )}
                    <button onClick={() => { setFormMode('add'); setGalleryFormOpen(!galleryFormOpen) }} className="clay flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#1a1a2e] bg-white">
                      <Plus size={16} /> Add Image
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {galleryFormOpen && (
                    <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddGalleryItem} className="glass p-6 md:p-8 flex flex-col gap-6 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">{formMode === 'add' ? 'Add Gallery Image' : 'Edit Gallery Image'}</h3>
                        <button type="button" onClick={closeAllForms} className="p-2 rounded-full hover:bg-black/10"><X size={18} /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="text" placeholder="Short Alt Description" required className="glass-input p-3" value={galleryData.alt} onChange={e => setGalleryData({ ...galleryData, alt: e.target.value })} />
                        <select className="glass-input p-3" value={galleryData.aspect} onChange={e => setGalleryData({ ...galleryData, aspect: e.target.value })}>
                          <option value="square">Square Aspect</option><option value="landscape">Landscape Aspect</option><option value="portrait">Portrait Aspect</option>
                        </select>
                        <div className="flex items-center gap-4">
                          <label className="clay flex items-center gap-2 px-5 py-3 cursor-pointer text-sm font-semibold bg-white w-max">
                            <Upload size={16} /> {formMode === 'edit' ? 'Change Image (Optional)' : 'Select Image'}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'gallery')} />
                          </label>
                          {galleryBase64 && <span className="text-xs text-green-600">Image Loaded ✓</span>}
                        </div>
                      </div>
                      <button disabled={uploading || compressing} type="submit" className="clay mt-2 flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-[#1a1a2e] disabled:opacity-50">
                        <Check size={16} /> {compressing ? 'Compressing image…' : uploading ? 'Processing...' : formMode === 'add' ? 'Add to Gallery' : 'Update Image'}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Select All for gallery */}
                {gallery.length > 0 && (
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedGallery(selectedGallery.length === gallery.length ? [] : gallery.map((i: any) => String(i._id)))}
                      className="flex items-center gap-2 text-sm text-[#6b6b8a] hover:text-[#6b3fa0] font-medium">
                      {selectedGallery.length === gallery.length ? <CheckSquare size={18} className="text-[#6b3fa0]" /> : <Square size={18} />}
                      Select All
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {gallery.map((item) => (
                    <div key={item._id} className={`glass relative overflow-hidden group cursor-pointer ${selectedGallery.includes(String(item._id)) ? 'ring-2 ring-[#6b3fa0]' : ''}`} style={{ borderRadius: '15px' }}>
                      <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${item.base64Image})` }} />
                      {/* Always-visible controls on mobile, hover on desktop */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200" />
                      <div className="absolute top-2 left-2">
                        <button onClick={() => toggleSelectGallery(String(item._id))} className="p-1.5 bg-white/90 rounded-full shadow text-[#6b3fa0]">
                          {selectedGallery.includes(String(item._id)) ? <CheckSquare size={16} /> : <Square size={16} />}
                        </button>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1.5">
                        <button onClick={() => openEditGallery(item)} className="p-1.5 bg-white/90 rounded-full shadow text-[#6b3fa0] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDeleteGallery(item._id)} className="p-1.5 bg-red-500 rounded-full shadow text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {item.alt && <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">{item.alt}</div>}
                    </div>
                  ))}
                  {gallery.length === 0 && <p className="col-span-4 text-center text-[#6b6b8a] p-8">No images found in gallery.</p>}
                </div>
              </div>
            )}

            {/* ══ BOOKS TAB ════════════════════════════════════════════════ */}
            {activeTab === 'books' && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <h2 className="font-display text-2xl font-semibold">Manage Books</h2>
                  <div className="flex gap-2 flex-wrap">
                    {selectedBooks.length > 0 && (
                      <button onClick={handleBulkDeleteBooks} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors">
                        <Trash2 size={15} /> Delete ({selectedBooks.length})
                      </button>
                    )}
                    <button onClick={() => { setFormMode('add'); setBookFormOpen(!bookFormOpen) }} className="clay flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#1a1a2e] bg-white">
                      <Plus size={16} /> Add Book
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {bookFormOpen && (
                    <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddBookItem} className="glass p-6 md:p-8 flex flex-col gap-6 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">{formMode === 'add' ? 'Add New Book' : 'Edit Book'}</h3>
                        <button type="button" onClick={closeAllForms} className="p-2 rounded-full hover:bg-black/10"><X size={18} /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="text" placeholder="Book Title" required className="glass-input p-3" value={bookData.title} onChange={e => setBookData({ ...bookData, title: e.target.value })} />
                        <input type="text" placeholder="Short Synopsis / Description" required className="glass-input p-3" value={bookData.description} onChange={e => setBookData({ ...bookData, description: e.target.value })} />
                        <input type="url" placeholder="Read Link / Buy Link (Optional)" className="glass-input p-3" value={bookData.readLink} onChange={e => setBookData({ ...bookData, readLink: e.target.value })} />
                        <div className="flex flex-wrap items-center gap-4">
                          <label className="clay flex items-center gap-2 px-4 py-3 cursor-pointer text-sm font-semibold bg-white w-max">
                            <Upload size={16} /> {formMode === 'edit' ? 'Change Cover' : 'Select Cover'}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'book')} />
                          </label>
                          {bookBase64 && <span className="text-xs text-green-600">Cover ✓</span>}
                          <label className="clay flex items-center gap-2 px-4 py-3 cursor-pointer text-sm font-semibold bg-white w-max">
                            <Upload size={16} /> {formMode === 'edit' ? 'Change PDF' : 'Upload PDF'}
                            <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileChange(e, 'bookPdf')} />
                          </label>
                          {bookPdfBase64 && <span className="text-xs text-green-600">PDF ✓</span>}
                        </div>
                      </div>
                      <button disabled={uploading || compressing} type="submit" className="clay mt-2 flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-[#1a1a2e] disabled:opacity-50">
                        <Check size={16} /> {compressing ? 'Compressing cover…' : uploading ? 'Processing...' : formMode === 'add' ? 'Add Book' : 'Update Book'}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Select All for books */}
                {books.length > 0 && (
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedBooks(selectedBooks.length === books.length ? [] : books.map((i: any) => String(i._id)))}
                      className="flex items-center gap-2 text-sm text-[#6b6b8a] hover:text-[#6b3fa0] font-medium">
                      {selectedBooks.length === books.length ? <CheckSquare size={18} className="text-[#6b3fa0]" /> : <Square size={18} />}
                      Select All
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {books.map((item) => (
                    <div key={item._id} className={`glass p-5 flex gap-4 relative ${selectedBooks.includes(String(item._id)) ? 'ring-2 ring-[#6b3fa0]' : ''}`} style={{ borderRadius: '15px' }}>
                      <button onClick={() => toggleSelectBook(String(item._id))} className="absolute top-3 left-3 p-1 bg-white/80 rounded z-10 text-[#6b3fa0]">
                        {selectedBooks.includes(String(item._id)) ? <CheckSquare size={16} /> : <Square size={16} />}
                      </button>
                      <div className="w-20 h-28 bg-cover bg-center rounded drop-shadow flex-shrink-0 ml-5" style={{ backgroundImage: `url(${item.base64Image})` }} />
                      <div className="flex flex-col flex-grow min-w-0">
                        <h4 className="font-semibold text-base text-[#1a1a2e] leading-tight mb-1 truncate">{item.title}</h4>
                        <p className="text-sm text-[#6b6b8a] line-clamp-2 mb-2">{item.description}</p>
                        {item.readLink && <a href={item.readLink} target="_blank" rel="noreferrer" className="text-xs text-[#6b3fa0] hover:underline font-semibold">Read Book →</a>}
                      </div>
                      {/* Always visible edit/delete buttons */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button onClick={() => openEditBook(item)} className="p-2 bg-[#6b3fa0]/10 text-[#6b3fa0] hover:bg-[#6b3fa0]/20 rounded-lg transition-colors" title="Edit"><Edit2 size={16} /></button>
                        <button onClick={() => handleDeleteBook(item._id)} className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                  {books.length === 0 && <p className="col-span-3 text-center text-[#6b6b8a] p-8">No books uploaded yet.</p>}
                </div>
              </div>
            )}

            {/* ══ TIMELINE TAB ═════════════════════════════════════════════ */}
            {activeTab === 'timeline' && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <h2 className="font-display text-2xl font-semibold">Manage Education & Achievements</h2>
                  <div className="flex gap-2 flex-wrap">
                    {selectedTimeline.length > 0 && (
                      <button onClick={handleBulkDeleteTimeline} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors">
                        <Trash2 size={15} /> Delete ({selectedTimeline.length})
                      </button>
                    )}
                    <button onClick={() => { setFormMode('add'); setTimelineFormOpen(!timelineFormOpen) }} className="clay flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#1a1a2e] bg-white">
                      <Plus size={16} /> Add New Entry
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {timelineFormOpen && (
                    <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddTimelineItem} className="glass p-6 md:p-8 flex flex-col gap-6 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">{formMode === 'add' ? 'Add New Entry' : 'Edit Entry'}</h3>
                        <button type="button" onClick={closeAllForms} className="p-2 rounded-full hover:bg-black/10"><X size={18} /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="text" placeholder="Title / Achievement Name" required className="glass-input p-3" value={timelineData.title} onChange={e => setTimelineData({ ...timelineData, title: e.target.value })} />
                        <input type="text" placeholder="Organization / Institution" required className="glass-input p-3" value={timelineData.institution} onChange={e => setTimelineData({ ...timelineData, institution: e.target.value })} />
                        <input type="text" placeholder="Date / Period" required className="glass-input p-3" value={timelineData.period} onChange={e => setTimelineData({ ...timelineData, period: e.target.value })} />
                        <div className="relative">
                          <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="glass-input p-3 w-full text-left flex justify-between items-center">
                            <span>{timelineData.icon || 'Select Emoji'}</span>
                            <span className="text-xs text-[#6b3fa0]">Open Palette</span>
                          </button>
                          {showEmojiPicker && (
                            <div className="absolute top-full left-0 z-[100] mt-2 shadow-2xl">
                              {/* @ts-ignore */}
                              <EmojiPicker onEmojiClick={(emojiData) => { setTimelineData({ ...timelineData, icon: emojiData.emoji }); setShowEmojiPicker(false) }} />
                              <div className="fixed inset-0 z-[-1]" onClick={() => setShowEmojiPicker(false)} />
                            </div>
                          )}
                        </div>
                        <textarea placeholder="Description" required className="glass-input p-3 md:col-span-2 min-h-[100px]" value={timelineData.description} onChange={e => setTimelineData({ ...timelineData, description: e.target.value })} />
                      </div>
                      <button disabled={uploading} type="submit" className="clay mt-2 flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-[#1a1a2e] disabled:opacity-50">
                        <Check size={16} /> {uploading ? 'Processing...' : formMode === 'add' ? 'Add Entry' : 'Update Entry'}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Select All for timeline */}
                {timeline.length > 0 && (
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedTimeline(selectedTimeline.length === timeline.length ? [] : timeline.map((i: any) => String(i._id)))}
                      className="flex items-center gap-2 text-sm text-[#6b6b8a] hover:text-[#6b3fa0] font-medium">
                      {selectedTimeline.length === timeline.length ? <CheckSquare size={18} className="text-[#6b3fa0]" /> : <Square size={18} />}
                      Select All
                    </button>
                    <span className="text-xs text-[#6b6b8a]">• Use ↑↓ arrows to reorder the timeline sequence</span>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  {timeline.map((item, index) => (
                    <div key={item._id} className={`glass p-4 md:p-6 flex gap-3 md:gap-4 items-start ${selectedTimeline.includes(String(item._id)) ? 'ring-2 ring-[#6b3fa0]' : ''}`} style={{ borderRadius: '15px' }}>
                      {/* Checkbox */}
                      <button onClick={() => toggleSelectTimeline(String(item._id))} className="mt-1 flex-shrink-0 text-[#6b6b8a] hover:text-[#6b3fa0]">
                        {selectedTimeline.includes(String(item._id)) ? <CheckSquare size={18} className="text-[#6b3fa0]" /> : <Square size={18} />}
                      </button>

                      {/* Emoji + Order Arrows */}
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <span className="text-2xl">{item.icon}</span>
                        <button onClick={() => handleMoveTimeline(index, 'up')} disabled={index === 0} className="p-1 rounded hover:bg-[#6b3fa0]/10 disabled:opacity-30 text-[#6b3fa0]"><ChevronUp size={14} /></button>
                        <button onClick={() => handleMoveTimeline(index, 'down')} disabled={index === timeline.length - 1} className="p-1 rounded hover:bg-[#6b3fa0]/10 disabled:opacity-30 text-[#6b3fa0]"><ChevronDown size={14} /></button>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col gap-1 flex-grow min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold text-base md:text-lg text-[#1a1a2e]">{item.title}</h4>
                          <span className="text-xs px-2 py-1 bg-[#c9b8f5]/20 text-[#6b3fa0] rounded font-medium">{item.period}</span>
                        </div>
                        <p className="text-sm font-semibold text-[#6b3fa0]/70">{item.institution}</p>
                        <p className="text-sm text-[#6b6b8a] mt-1">{item.description}</p>
                      </div>

                      {/* Actions - always visible */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button onClick={() => openEditTimeline(item)} className="p-2 bg-[#6b3fa0]/10 text-[#6b3fa0] hover:bg-[#6b3fa0]/20 rounded-lg transition-colors" title="Edit"><Edit2 size={16} /></button>
                        <button onClick={() => handleDeleteTimeline(item._id)} className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                  {timeline.length === 0 && <p className="text-center text-[#6b6b8a] p-12 glass">Your timeline is empty. Add your education history.</p>}
                </div>
              </div>
            )}

            {/* ══ MESSAGES TAB ═════════════════════════════════════════════ */}
            {activeTab === 'messages' && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <h2 className="font-display text-2xl font-semibold">Contact Messages</h2>
                  {selectedMessages.length > 0 && (
                    <button onClick={handleBulkDeleteMessages} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors">
                      <Trash2 size={15} /> Delete ({selectedMessages.length})
                    </button>
                  )}
                </div>

                {/* Select All for messages */}
                {messages.length > 0 && (
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedMessages(selectedMessages.length === messages.length ? [] : messages.map((i: any) => String(i._id)))}
                      className="flex items-center gap-2 text-sm text-[#6b6b8a] hover:text-[#6b3fa0] font-medium">
                      {selectedMessages.length === messages.length ? <CheckSquare size={18} className="text-[#6b3fa0]" /> : <Square size={18} />}
                      Select All
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {messages.map((msg) => (
                    <div key={msg._id} className={`glass p-6 flex flex-col gap-3 ${selectedMessages.includes(String(msg._id)) ? 'ring-2 ring-[#6b3fa0]' : ''}`}>
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-start gap-2 overflow-hidden">
                          <button onClick={() => toggleSelectMessage(String(msg._id))} className="mt-1 flex-shrink-0 text-[#6b6b8a] hover:text-[#6b3fa0]">
                            {selectedMessages.includes(String(msg._id)) ? <CheckSquare size={18} className="text-[#6b3fa0]" /> : <Square size={18} />}
                          </button>
                          <div className="overflow-hidden">
                            <h4 className="font-semibold text-lg">{msg.name}</h4>
                            <a href={`mailto:${msg.email}`} className="text-sm text-[#c9b8f5] hover:underline truncate block">{msg.email}</a>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-[#6b6b8a]">{new Date(msg.createdAt).toLocaleDateString()}</span>
                          <button onClick={() => handleDeleteMessage(msg._id)} className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Delete Message">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <h5 className="font-medium text-[#1a1a2e]">Subject: {msg.subject}</h5>
                      <p className="text-[#6b6b8a] text-sm whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  ))}
                  {messages.length === 0 && <p className="p-8 text-center text-[#6b6b8a] col-span-2">No messages received yet.</p>}
                </div>
              </div>
            )}

            {/* ══ ABOUT TAB ════════════════════════════════════════════════ */}
            {activeTab === 'about' && (
              <div className="flex flex-col gap-6 max-w-2xl">
                <h2 className="font-display text-2xl font-semibold">About Section Image</h2>
                <div className="glass p-6 flex flex-col gap-6">
                  <p className="text-[#6b6b8a] text-sm">
                    Upload a high-quality image to display in the About section of your portfolio.
                  </p>
                  
                  {aboutImage && !aboutBase64 && (
                    <div className="relative aspect-square w-48 rounded-xl overflow-hidden bg-white/50 border-2 border-white/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={aboutImage} alt="Current About" className="object-cover w-full h-full" />
                    </div>
                  )}

                  {aboutBase64 && (
                    <div className="relative aspect-square w-48 rounded-xl overflow-hidden bg-green-50/50 border-2 border-green-500/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={aboutBase64} alt="New About" className="object-cover w-full h-full" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/50 py-1 text-center text-white text-xs font-medium">New Image</div>
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    <label className="flex flex-col items-center justify-center h-32 px-4 transition bg-white/40 border-2 border-[#c9b8f5]/30 border-dashed rounded-xl appearance-none cursor-pointer hover:border-[#6b3fa0] focus:outline-none">
                      <span className="flex items-center space-x-2 text-[#6b3fa0]">
                        <Upload size={20} />
                        <span className="font-medium">
                          {aboutBase64 ? 'Select a different image' : (aboutImage ? 'Change Image' : 'Select an image')}
                        </span>
                      </span>
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => handleFileChange(e, 'about')} />
                    </label>

                    <button
                      onClick={handleSaveAboutImage}
                      disabled={!aboutBase64 || uploading}
                      className="px-6 py-3 font-semibold text-white bg-[#6b3fa0] rounded-xl hover:bg-[#854ac4] disabled:opacity-50 transition-colors"
                    >
                      {uploading ? 'Saving...' : 'Save Image'}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}
