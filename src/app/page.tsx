import Navbar from '@/components/Navbar'
import CustomCursor from '@/components/CustomCursor'
import BackToTop from '@/components/BackToTop'
import AnimatedBackground from '@/components/AnimatedBackground'

import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Education from '@/sections/Education'
import Skills from '@/sections/Skills'
import Portfolio from '@/sections/Portfolio'
import Books from '@/sections/Books'
import Gallery from '@/sections/Gallery'
import Contact from '@/sections/Contact'
import Footer from '@/sections/Footer'

import connectToDatabase from '@/lib/mongodb'
import { Book } from '@/models/Book'
import { PortfolioItem } from '@/models/PortfolioItem'
import { GalleryItem } from '@/models/GalleryItem'
import Timeline from '@/models/Timeline'
import { decompressDataUri, decompressData } from '@/lib/compression'

export const revalidate = 60 // Revalidate cache every 60 seconds

export default async function Home() {
  await connectToDatabase()

  // Fetch from DB directly (bypassing the internal API to avoid proxy limits)
  const rawBooks = await Book.find({}).sort({ createdAt: -1 }).lean()
  const rawPortfolio = await PortfolioItem.find({}).sort({ createdAt: -1 }).lean()
  const rawGallery = await GalleryItem.find({}).sort({ createdAt: -1 }).lean()
  const rawTimeline = await Timeline.find({}).sort({ createdAt: -1 })

  // Serialize to plain JS objects, decompressing as needed
  const booksData = rawBooks.map((item: any) => ({
    ...item,
    _id: item._id.toString(),
    description: decompressData(item.description),
    base64Image: decompressDataUri(item.base64Image),
    base64Pdf: decompressDataUri(item.base64Pdf),
  }))

  const portfolioData = rawPortfolio.map((item: any) => ({
    ...item,
    _id: item._id.toString(),
    description: decompressData(item.description),
    base64Image: decompressDataUri(item.base64Image),
  }))

  const galleryData = rawGallery.map((item: any) => ({
    ...item,
    _id: item._id.toString(),
    base64Image: decompressDataUri(item.base64Image),
  }))

  const timelineData = rawTimeline.map((item: any) => ({
    ...item.toObject(),
    _id: item._id.toString(),
    // Timeline relies on Mongoose getters which run inside .toObject() so no manual decompress needed
  }))

  return (
    <main className="relative min-h-screen">
      <CustomCursor />
      <AnimatedBackground />
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col gap-16 md:gap-24 lg:gap-32 pb-12">
        <Hero />
        <About />
        <Education initialTimeline={timelineData} />
        <Skills />
        <Portfolio initialItems={portfolioData} />
        <Books initialBooks={booksData} />
        <Gallery initialItems={galleryData} />
        <Contact />
      </div>

      <Footer />
      <BackToTop />
    </main>
  )
}
