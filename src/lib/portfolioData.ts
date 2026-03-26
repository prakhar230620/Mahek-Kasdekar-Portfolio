export interface PortfolioItem {
  id: string
  title: string
  description: string
  category: 'Writing' | 'Art' | 'Photography' | 'Editing' | 'Certificates'
  aspect: 'square' | 'portrait' | 'landscape'
  tag: string
  tagColor: string
}

export interface SkillItem {
  icon: string
  title: string
  description: string
}

export interface TimelineItem {
  title: string
  institution: string
  period: string
  description: string
  icon: 'graduation' | 'book' | 'school'
}

export interface GalleryItem {
  id: string
  alt: string
  aspect: 'square' | 'portrait' | 'landscape'
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'p1',
    title: 'Her Silence',
    description: 'A short story about quiet resilience and unspoken love.',
    category: 'Writing',
    aspect: 'portrait',
    tag: 'Short Story',
    tagColor: 'bg-[#ffd6e0] text-[#9b4f6a]',
  },
  {
    id: 'p2',
    title: 'Monsoon Verse',
    description: 'A poetry collection — rain, longing, and the smell of earth.',
    category: 'Writing',
    aspect: 'landscape',
    tag: 'Poetry',
    tagColor: 'bg-[#ffd6e0] text-[#9b4f6a]',
  },
  {
    id: 'p3',
    title: 'Bloom Series',
    description: 'Soft watercolour studies of wildflowers in morning light.',
    category: 'Art',
    aspect: 'square',
    tag: 'Watercolour',
    tagColor: 'bg-[#e8d6ff] text-[#6b3fa0]',
  },
  {
    id: 'p4',
    title: 'Untitled No. 3',
    description: 'A charcoal sketch exploring shadow and negative space.',
    category: 'Art',
    aspect: 'portrait',
    tag: 'Sketch',
    tagColor: 'bg-[#e8d6ff] text-[#6b3fa0]',
  },
  {
    id: 'p5',
    title: 'Golden Hour',
    description: 'Portrait series shot during the magical golden hour.',
    category: 'Photography',
    aspect: 'portrait',
    tag: 'Portrait',
    tagColor: 'bg-[#fde8d6] text-[#9b5a2a]',
  },
  {
    id: 'p6',
    title: 'Old Delhi Diaries',
    description: 'Street photography capturing the soul of Old Delhi.',
    category: 'Photography',
    aspect: 'landscape',
    tag: 'Street',
    tagColor: 'bg-[#fde8d6] text-[#9b5a2a]',
  },
  {
    id: 'p7',
    title: 'Reel — Wanderlust Edit',
    description: 'A travel reel with cinematic colour grading and transitions.',
    category: 'Editing',
    aspect: 'portrait',
    tag: 'Reel',
    tagColor: 'bg-[#d6f5ec] text-[#2a7a5c]',
  },
  {
    id: 'p8',
    title: 'Short Film — Echoes',
    description: 'A 3-minute short film about memory and belonging.',
    category: 'Editing',
    aspect: 'landscape',
    tag: 'Film',
    tagColor: 'bg-[#d6f5ec] text-[#2a7a5c]',
  },
  {
    id: 'p9',
    title: 'Literary Fest Participant',
    description: 'Certificate of participation — Delhi LitFest 2024.',
    category: 'Certificates',
    aspect: 'landscape',
    tag: 'Certificate',
    tagColor: 'bg-[#fff0d6] text-[#7a5a2a]',
  },
  {
    id: 'p10',
    title: 'Art Workshop Certificate',
    description: 'Workshop on advanced watercolour techniques.',
    category: 'Certificates',
    aspect: 'landscape',
    tag: 'Certificate',
    tagColor: 'bg-[#fff0d6] text-[#7a5a2a]',
  },
]

export const skillItems: SkillItem[] = [
  {
    icon: '✍️',
    title: 'Writing',
    description: 'Fiction, poetry, journaling, and narrative essays',
  },
  {
    icon: '🎨',
    title: 'Painting & Art',
    description: 'Watercolours, sketching, and mixed media',
  },
  {
    icon: '📸',
    title: 'Photography',
    description: 'Portrait, street, and lifestyle photography',
  },
  {
    icon: '🎬',
    title: 'Photo & Video Editing',
    description: 'Adobe Lightroom, CapCut, Canva',
  },
  {
    icon: '📚',
    title: 'Reading',
    description: 'Historical fiction, classics, contemporary literature',
  },
  {
    icon: '🎪',
    title: 'Event Participation',
    description: 'Debates, cultural fests, literary events',
  },
]

export const softSkills = [
  'Storytelling',
  'Research',
  'Creative Thinking',
  'Communication',
  'Attention to Detail',
  'Time Management',
  'Empathy',
  'Visual Aesthetics',
]

export const timelineItems: TimelineItem[] = [
  {
    title: 'BA History',
    institution: 'Delhi University',
    period: '2023–2025',
    description:
      'Completed undergraduate studies in History, with a focus on modern South Asian history and cultural studies.',
    icon: 'graduation',
  },
  {
    title: 'Senior Secondary (12th)',
    institution: 'CBSE Board',
    period: '2022',
    description:
      'Completed higher secondary education with strong academic standing.',
    icon: 'book',
  },
  {
    title: 'Secondary (10th)',
    institution: 'MP Board',
    period: '2020',
    description:
      'Built a strong academic foundation across sciences, humanities, and arts.',
    icon: 'school',
  },
]

export const galleryItems: GalleryItem[] = [
  { id: 'g1', alt: 'Golden afternoon light through book pages', aspect: 'portrait' },
  { id: 'g2', alt: 'Watercolour palette with blooming flowers', aspect: 'square' },
  { id: 'g3', alt: 'Street scene in Old Delhi', aspect: 'landscape' },
  { id: 'g4', alt: 'Close-up of handwritten journal', aspect: 'square' },
  { id: 'g5', alt: 'Portrait in soft evening light', aspect: 'portrait' },
  { id: 'g6', alt: 'Sketches pinned on cork board', aspect: 'landscape' },
  { id: 'g7', alt: 'Cups of tea and books on rainy day', aspect: 'square' },
  { id: 'g8', alt: 'Festive cultural event moments', aspect: 'landscape' },
  { id: 'g9', alt: 'Abstract painting in progress', aspect: 'portrait' },
  { id: 'g10', alt: 'Camera and film roll on desk', aspect: 'square' },
]

export const personalityTraits = ['Curious', 'Creative', 'Empathetic', 'Ambitious']

export const filterCategories = ['All', 'Writing', 'Art', 'Photography', 'Editing', 'Certificates'] as const
export type FilterCategory = typeof filterCategories[number]
