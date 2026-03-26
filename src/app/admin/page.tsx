'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LogOut, Image as ImageIcon, MessageSquare, Trash2, Plus, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'portfolio' | 'gallery' | 'messages'>('portfolio') // Added gallery
  
  // Data State
  const [portfolio, setPortfolio] = useState<any[]>([])
  const [gallery, setGallery] = useState<any[]>([]) // Added gallery
  const [messages, setMessages] = useState<any[]>([])
  const [stats, setStats] = useState({ portfolio: 0, gallery: 0, messages: 0 })
  const [loading, setLoading] = useState(true)

  // Form State
  const [formOpen, setFormOpen] = useState(false)
  const [galleryFormOpen, setGalleryFormOpen] = useState(false) // Added gallery form state
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Photography', aspect: 'landscape', tag: '', tagColor: 'bg-[#fde8d6] text-[#9b5a2a]'
  })
  const [galleryData, setGalleryData] = useState({ alt: '', aspect: 'square' }) // Added gallery data state
  const [base64Image, setBase64Image] = useState<string>('')
  const [galleryBase64, setGalleryBase64] = useState<string>('') // Added gallery image state
  const [uploading, setUploading] = useState(false)

  // Fetch Data
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const pRes = await fetch('/api/admin/portfolio')
      if (pRes.ok) {
        const pData = await pRes.json()
        setPortfolio(pData.items)
      }
      const gRes = await fetch('/api/admin/gallery') // Added gallery fetch
      if (gRes.ok) {
        const gData = await gRes.json()
        setGallery(gData.items)
      }
      const mRes = await fetch('/api/admin/messages')
      if (mRes.ok) {
        const mData = await mRes.json()
        setMessages(mData.messages)
      }

      const sRes = await fetch('/api/admin/stats')
      if (sRes.ok) {
        const sData = await sRes.json()
        setStats(sData.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Handle File to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'portfolio' | 'gallery') => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      if (type === 'portfolio') setBase64Image(reader.result as string)
      else setGalleryBase64(reader.result as string)
    }
  }

  // Handle Submit New Portfolio Item
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!base64Image) {
      alert('Please select an image')
      return
    }
    setUploading(true)
    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, base64Image })
      })
      if (res.ok) {
        setFormOpen(false)
        setBase64Image('')
        fetchData()
      } else {
        alert('Failed to add item')
      }
    } catch {
      alert('Network error')
    } finally {
      setUploading(false)
    }
  }

  // Handle Submit New Gallery Item
  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!galleryBase64) {
      alert('Please select an image')
      return
    }
    setUploading(true)
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...galleryData, base64Image: galleryBase64 })
      })
      if (res.ok) {
        setGalleryFormOpen(false)
        setGalleryBase64('')
        fetchData()
      } else {
        alert('Failed to add gallery item')
      }
    } catch {
      alert('Network error')
    } finally {
      setUploading(false)
    }
  }

  // Handle Delete Portfolio
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return
    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (res.ok) {
        fetchData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Handle Delete Gallery
  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (res.ok) {
        fetchData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = () => {
    // Clear cookie by setting expiry in past
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    // Clear local storage if any (though we use cookies)
    localStorage.removeItem('admin_token')
    // Redirect to login
    router.replace('/admin/login')
  }

  return (
    <div className="min-h-screen p-6 lg:p-12 font-body text-[#1a1a2e]">
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

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass p-6 flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 text-[#c9b8f5] group-hover:scale-110 transition-transform duration-500">
               <ImageIcon size={100} />
            </div>
            <span className="text-[#6b6b8a] font-semibold text-sm uppercase tracking-wider">Total Portfolio Items</span>
            <span className="font-display text-4xl font-bold bg-gradient-to-r from-[#6b3fa0] to-[#f4a7b4] bg-clip-text text-transparent">{stats.portfolio}</span>
          </div>
          
          <div className="glass p-6 flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 text-[#c9b8f5] group-hover:scale-110 transition-transform duration-500">
               <ImageIcon size={100} />
            </div>
            <span className="text-[#6b6b8a] font-semibold text-sm uppercase tracking-wider">Gallery Images</span>
            <span className="font-display text-4xl font-bold bg-gradient-to-r from-[#6b3fa0] to-[#f4a7b4] bg-clip-text text-transparent">{stats.gallery}</span>
          </div>

          <div className="glass p-6 flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 text-[#c9b8f5] group-hover:scale-110 transition-transform duration-500">
               <MessageSquare size={100} />
            </div>
            <span className="text-[#6b6b8a] font-semibold text-sm uppercase tracking-wider">Contact Logs</span>
            <span className="font-display text-4xl font-bold bg-gradient-to-r from-[#6b3fa0] to-[#f4a7b4] bg-clip-text text-transparent">{stats.messages}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-8 border-b border-[#c9b8f5]/30 pb-4">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors ${activeTab === 'portfolio' ? 'text-[#6b3fa0]' : 'text-[#6b6b8a]'}`}
          >
            <ImageIcon size={18} /> Portfolio
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors ${activeTab === 'gallery' ? 'text-[#6b3fa0]' : 'text-[#6b6b8a]'}`}
          >
            <ImageIcon size={18} /> Gallery
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors ${activeTab === 'messages' ? 'text-[#6b3fa0]' : 'text-[#6b6b8a]'}`}
          >
            <MessageSquare size={18} /> Messages
          </button>
        </div>

        {loading ? (
          <p className="text-[#6b6b8a]">Loading data...</p>
        ) : (
          <div>
            {/* PORTFOLIO TAB */}
            {activeTab === 'portfolio' && (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <h2 className="font-display text-2xl font-semibold">Manage Portfolio</h2>
                  <button onClick={() => setFormOpen(!formOpen)} className="clay flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#1a1a2e] bg-white">
                    <Plus size={16} /> Add New
                  </button>
                </div>

                {/* Add Form */}
                {formOpen && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleAddItem}
                    className="glass p-8 flex flex-col gap-6 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input type="text" placeholder="Title" required className="glass-input p-3" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                      <input type="text" placeholder="Description" required className="glass-input p-3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                      <select className="glass-input p-3" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                        <option value="Writing">Writing</option>
                        <option value="Art">Art</option>
                        <option value="Photography">Photography</option>
                        <option value="Editing">Editing</option>
                        <option value="Certificates">Certificates</option>
                      </select>
                      <select className="glass-input p-3" value={formData.aspect} onChange={e => setFormData({ ...formData, aspect: e.target.value })}>
                        <option value="landscape">Landscape</option>
                        <option value="portrait">Portrait</option>
                        <option value="square">Square</option>
                      </select>
                      <input type="text" placeholder="Tag (e.g., Short Story)" required className="glass-input p-3" value={formData.tag} onChange={e => setFormData({ ...formData, tag: e.target.value })} />
                      
                      {/* Image Upload to Base64 */}
                      <div className="flex items-center gap-4">
                        <label className="clay flex items-center gap-2 px-5 py-3 cursor-pointer text-sm font-semibold bg-white w-max">
                          <Upload size={16} /> Select Image
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'portfolio')} />
                        </label>
                        {base64Image && <span className="text-xs text-green-600 truncate max-w-[150px]">Image Loaded</span>}
                      </div>
                    </div>
                    <button disabled={uploading} type="submit" className="clay mt-2 flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-[#1a1a2e] disabled:opacity-50">
                      {uploading ? 'Saving...' : 'Save Item'}
                    </button>
                  </motion.form>
                )}

                {/* Table */}
                <div className="glass overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#c9b8f5]/30">
                        <th className="p-4 text-sm font-semibold text-[#6b6b8a]">Image</th>
                        <th className="p-4 text-sm font-semibold text-[#6b6b8a]">Title</th>
                        <th className="p-4 text-sm font-semibold text-[#6b6b8a]">Category</th>
                        <th className="p-4 text-sm font-semibold text-[#6b6b8a]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.map((item) => (
                        <tr key={item._id} className="border-b border-[#c9b8f5]/10 hover:bg-white/10 transition-colors">
                          <td className="p-4">
                            <div className="w-12 h-12 rounded-lg bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${item.base64Image})` }} />
                          </td>
                          <td className="p-4 font-medium">{item.title}</td>
                          <td className="p-4"><span className={`px-3 py-1 text-xs rounded-full ${item.tagColor}`}>{item.category}</span></td>
                          <td className="p-4">
                            <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* GALLERY TAB */}
            {activeTab === 'gallery' && (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <h2 className="font-display text-2xl font-semibold">Manage Gallery</h2>
                  <button onClick={() => setGalleryFormOpen(!galleryFormOpen)} className="clay flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#1a1a2e] bg-white">
                    <Plus size={16} /> Add Image
                  </button>
                </div>

                {/* Gallery Add Form */}
                {galleryFormOpen && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleAddGalleryItem}
                    className="glass p-8 flex flex-col gap-6 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input type="text" placeholder="Short Alt Description" required className="glass-input p-3" value={galleryData.alt} onChange={e => setGalleryData({ ...galleryData, alt: e.target.value })} />
                      <select className="glass-input p-3" value={galleryData.aspect} onChange={e => setGalleryData({ ...galleryData, aspect: e.target.value })}>
                        <option value="square">Square Aspect</option>
                        <option value="landscape">Landscape Aspect</option>
                        <option value="portrait">Portrait Aspect</option>
                      </select>
                      
                      <div className="flex items-center gap-4">
                        <label className="clay flex items-center gap-2 px-5 py-3 cursor-pointer text-sm font-semibold bg-white w-max">
                          <Upload size={16} /> Select Gallery Image
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'gallery')} />
                        </label>
                        {galleryBase64 && <span className="text-xs text-green-600 truncate max-w-[150px]">Image Loaded</span>}
                      </div>
                    </div>
                    <button disabled={uploading} type="submit" className="clay mt-2 flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-[#1a1a2e] disabled:opacity-50">
                      {uploading ? 'Processing...' : 'Add to Gallery'}
                    </button>
                  </motion.form>
                )}

                {/* Gallery Items Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {gallery.map((item) => (
                    <div key={item._id} className="glass relative group overflow-hidden" style={{ borderRadius: '15px' }}>
                      <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${item.base64Image})` }} />
                      <button onClick={() => handleDeleteGallery(item._id)} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {gallery.length === 0 && <p className="col-span-4 text-center text-[#6b6b8a] p-8">No images found in gallery.</p>}
                </div>
              </div>
            )}

            {/* MESSAGES TAB */}
            {activeTab === 'messages' && (
              <div className="flex flex-col gap-6">
                <h2 className="font-display text-2xl font-semibold">Contact Messages</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {messages.map((msg) => (
                    <div key={msg._id} className="glass p-6 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg">{msg.name}</h4>
                          <a href={`mailto:${msg.email}`} className="text-sm text-[#c9b8f5] hover:underline">{msg.email}</a>
                        </div>
                        <span className="text-xs text-[#6b6b8a]">{new Date(msg.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h5 className="font-medium text-[#1a1a2e]">Subject: {msg.subject}</h5>
                      <p className="text-[#6b6b8a] text-sm whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <p className="p-8 text-center text-[#6b6b8a] col-span-2">No messages received yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
