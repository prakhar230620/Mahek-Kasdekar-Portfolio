'use client'
import React, { useState, useEffect } from 'react'
import HTMLFlipBook from 'react-pageflip'

interface FlipBookReaderProps {
  base64Pdf: string
}

const Page = React.forwardRef<HTMLDivElement, { children: React.ReactNode; number: number }>(
  (props, ref) => {
    return (
      <div className="demo-page bg-white shadow-xl flex items-center justify-center p-0" ref={ref}>
        <div className="page-content w-full h-full">
          {props.children}
        </div>
      </div>
    )
  }
)

Page.displayName = 'Page'

export default function FlipBookReader({ base64Pdf }: FlipBookReaderProps) {
  const [pages, setPages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    let isCancelled = false
    const renderPdf = async () => {
      try {
        setLoading(true)
        setPages([]) // Clear previous pages
        setProgress(5)
        
        // Dynamically import pdfjs only on the client
        const pdfjs = await import('pdfjs-dist')
        const worker = await import('pdfjs-dist/build/pdf.worker.entry')
        pdfjs.GlobalWorkerOptions.workerSrc = worker

        const pdfData = atob(base64Pdf.split(',')[1])
        const loadingTask = pdfjs.getDocument({ data: pdfData })
        const pdf = await loadingTask.promise
        const numPages = pdf.numPages
        const renderedPages: string[] = []

        const scale = 2.0 // Higher resolution

        for (let i = 1; i <= numPages; i++) {
          if (isCancelled) return
          
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale })
          
          if (i === 1) {
             setDimensions({ width: viewport.width / scale, height: viewport.height / scale })
          }

          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          canvas.height = viewport.height
          canvas.width = viewport.width

          if (context) {
            await page.render({ canvasContext: context, viewport }).promise
            renderedPages.push(canvas.toDataURL('image/webp', 0.8))
          }
          setProgress(Math.round((i / numPages) * 100))
        }

        if (!isCancelled) {
          setPages(renderedPages)
          setLoading(false)
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Error rendering PDF:', error)
          setLoading(false)
        }
      }
    }

    renderPdf()
    return () => { isCancelled = true }
  }, [base64Pdf])

  // 1. All hooks at the top
  const [bookSize, setBookSize] = useState({ width: 0, height: 0 })

  // Calculate Responsive Sizes to fit strictly within the viewport
  useEffect(() => {
    const updateSize = () => {
      if (dimensions.width === 0) return
      
      const vW = window.innerWidth
      const vH = window.innerHeight * 0.75
      const isMob = vW < 768
      
      const aspectRatio = dimensions.width / dimensions.height
      let finalHeight = vH
      let finalWidth = finalHeight * aspectRatio
      const totalWidth = isMob ? finalWidth : finalWidth * 2
      
      if (totalWidth > vW * 0.9) {
          const reduction = (vW * 0.85) / totalWidth
          finalWidth *= reduction
          finalHeight *= reduction
      }
      
      setBookSize({ width: Math.floor(finalWidth), height: Math.floor(finalHeight) })
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [dimensions])

  // Scroll lock implementation
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // 2. Early return AFTER hooks
  if (loading || pages.length === 0 || bookSize.width === 0) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="relative w-24 h-24">
           <div className="absolute inset-0 border-4 border-[#c9b8f5]/20 rounded-full animate-spin border-t-[#6b3fa0]" />
           <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-[#6b3fa0]">
             {progress}%
           </div>
        </div>
        <p className="text-[#6b6b8a] font-medium animate-pulse">
          {loading ? 'Rendering 3D Pages...' : 'Preparing UI...'}
        </p>
      </div>
    )
  }

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="3d-book-container relative">
        {/* @ts-ignore */}
        <HTMLFlipBook
          key={base64Pdf} // Force re-mount on book change
          width={bookSize.width}
          height={bookSize.height}
          size="fixed"
          minWidth={200}
          maxWidth={1000}
          minHeight={300}
          maxHeight={1500}
          drawShadow={true}
          flippingTime={1000}
          usePortrait={isMobile}
          startZIndex={0}
          autoSize={true}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          className="book-element drop-shadow-2xl"
          style={{ background: 'transparent' }}
        >
          {pages.map((image, index) => (
            <Page key={index} number={index + 1}>
              <div 
                className="w-full h-full bg-cover bg-center" 
                style={{ backgroundImage: `url(${image})` }}
              />
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />
            </Page>
          ))}
        </HTMLFlipBook>
      </div>
    </div>
  )
}
