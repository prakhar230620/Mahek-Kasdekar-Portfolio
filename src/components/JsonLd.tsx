/**
 * JsonLd.tsx — Server Component
 * Injects comprehensive JSON-LD structured data for maximum SEO visibility.
 * Schemas: Person, WebSite, ProfilePage, ItemList (portfolio), Book (creative works),
 *          BreadcrumbList, FAQPage, CreativeWork
 */

const BASE_URL = 'https://mahek-kasdekar.vercel.app'

// ── Person Schema ──────────────────────────────────────────────────────────────
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${BASE_URL}/#person`,
  name: 'Mahek Kasdekar',
  alternateName: ['Mahek K.', 'Mahek'],
  url: BASE_URL,
  image: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/og-image.png`,
    width: 1200,
    height: 630,
    caption: 'Mahek Kasdekar — Writer, Artist, Photographer from Delhi University',
  },
  description:
    'Mahek Kasdekar is a creative writer, visual artist, photographer, and BA History graduate from Delhi University. Based in Indore, India, she creates poetry, short fiction, watercolour art, and documentary-style photography.',
  jobTitle: 'Creative Writer & Visual Artist',
  gender: 'Female',
  nationality: {
    '@type': 'Country',
    name: 'India',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Indore',
    addressRegion: 'Madhya Pradesh',
    addressCountry: 'IN',
  },
  birthPlace: {
    '@type': 'Place',
    name: 'India',
  },
  alumniOf: [
    {
      '@type': 'CollegeOrUniversity',
      name: 'Delhi University',
      sameAs: 'https://www.du.ac.in',
    },
  ],
  knowsAbout: [
    'Creative Writing',
    'Poetry',
    'Short Fiction',
    'Watercolour Painting',
    'Sketching',
    'Photography',
    'Portrait Photography',
    'Street Photography',
    'Video Editing',
    'South Asian History',
    'Cultural Studies',
    'Literature',
  ],
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Creative Writer and Visual Artist',
    occupationLocation: {
      '@type': 'Country',
      name: 'India',
    },
    skills: 'Writing, Painting, Photography, Video Editing, Research, Storytelling',
  },
  sameAs: [
    'https://www.instagram.com/mahek__k0911',
  ],
  email: 'mahekkasdekar@gmail.com',
}

// ── WebSite Schema ──────────────────────────────────────────────────────────────
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  name: 'Mahek Kasdekar — Portfolio',
  url: BASE_URL,
  description:
    'Official portfolio website of Mahek Kasdekar — featuring creative writing, visual art, photography, and authored books.',
  publisher: {
    '@id': `${BASE_URL}/#person`,
  },
  author: {
    '@id': `${BASE_URL}/#person`,
  },
  inLanguage: 'en-IN',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

// ── ProfilePage Schema ──────────────────────────────────────────────────────────
const profilePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${BASE_URL}/#profilepage`,
  name: 'Mahek Kasdekar Portfolio',
  url: BASE_URL,
  dateCreated: '2024-01-01',
  dateModified: new Date().toISOString().split('T')[0],
  mainEntity: {
    '@id': `${BASE_URL}/#person`,
  },
  description:
    'Portfolio page of Mahek Kasdekar — creative writer, watercolour artist, photographer, and history graduate from Delhi University, India.',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
    ],
  },
}

// ── CreativeWork ItemList (Portfolio) ──────────────────────────────────────────
const portfolioListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${BASE_URL}/#portfolio-list`,
  name: "Mahek Kasdekar's Portfolio Works",
  description:
    'A curated collection of creative works by Mahek Kasdekar including writing, art, photography, and video editing.',
  url: `${BASE_URL}/#portfolio`,
  author: {
    '@id': `${BASE_URL}/#person`,
  },
  numberOfItems: 10,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'CreativeWork',
        name: 'Her Silence',
        description: 'A short story about quiet resilience and unspoken love.',
        genre: 'Short Story',
        author: { '@id': `${BASE_URL}/#person` },
        inLanguage: 'en',
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'CreativeWork',
        name: 'Monsoon Verse',
        description: 'A poetry collection — rain, longing, and the smell of earth.',
        genre: 'Poetry',
        author: { '@id': `${BASE_URL}/#person` },
        inLanguage: 'en',
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'VisualArtwork',
        name: 'Bloom Series',
        description: 'Soft watercolour studies of wildflowers in morning light.',
        artMedium: 'Watercolour',
        creator: { '@id': `${BASE_URL}/#person` },
      },
    },
    {
      '@type': 'ListItem',
      position: 4,
      item: {
        '@type': 'VisualArtwork',
        name: 'Untitled No. 3',
        description: 'A charcoal sketch exploring shadow and negative space.',
        artMedium: 'Charcoal',
        creator: { '@id': `${BASE_URL}/#person` },
      },
    },
    {
      '@type': 'ListItem',
      position: 5,
      item: {
        '@type': 'Photograph',
        name: 'Golden Hour',
        description: 'Portrait series shot during the magical golden hour.',
        creator: { '@id': `${BASE_URL}/#person` },
      },
    },
    {
      '@type': 'ListItem',
      position: 6,
      item: {
        '@type': 'Photograph',
        name: 'Old Delhi Diaries',
        description: 'Street photography capturing the soul of Old Delhi.',
        creator: { '@id': `${BASE_URL}/#person` },
        locationCreated: {
          '@type': 'Place',
          name: 'Old Delhi, India',
        },
      },
    },
  ],
}

// ── FAQ Schema ──────────────────────────────────────────────────────────────────
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is Mahek Kasdekar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mahek Kasdekar is a creative writer, visual artist, and photographer based in Indore, India. She holds a BA in History from Delhi University (2023–2025) and creates poetry, short fiction, watercolour paintings, and documentary photography.',
      },
    },
    {
      '@type': 'Question',
      name: 'What kind of work does Mahek Kasdekar create?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mahek creates a wide range of creative works including poetry, short stories, watercolour art, charcoal sketches, portrait and street photography, and cinematic video reels. She has also authored original books.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where did Mahek Kasdekar study?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mahek completed her BA in History from Delhi University (2023–2025), focusing on modern South Asian history and cultural studies. She completed her Senior Secondary from CBSE Board in 2022 and Secondary from MP Board in 2020.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I contact Mahek Kasdekar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can reach Mahek via email at mahekkasdekar@gmail.com or through the contact form on her portfolio website. She is also active on Instagram @mahek__k0911.',
      },
    },
    {
      '@type': 'Question',
      name: 'Has Mahek Kasdekar written any books?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Mahek has authored original books which are available to read directly on her portfolio website. The books section showcases her literary works with a built-in interactive reader.',
      },
    },
  ],
}

// ── BreadcrumbList ──────────────────────────────────────────────────────────────
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': `${BASE_URL}/#breadcrumb`,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'About', item: `${BASE_URL}/#about` },
    { '@type': 'ListItem', position: 3, name: 'Portfolio', item: `${BASE_URL}/#portfolio` },
    { '@type': 'ListItem', position: 4, name: 'Books', item: `${BASE_URL}/#books` },
    { '@type': 'ListItem', position: 5, name: 'Gallery', item: `${BASE_URL}/#gallery` },
    { '@type': 'ListItem', position: 6, name: 'Contact', item: `${BASE_URL}/#contact` },
  ],
}

// ── Geo / Local ────────────────────────────────────────────────────────────────
const localSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${BASE_URL}/#webpage`,
  name: 'Mahek Kasdekar — Creative Portfolio',
  url: BASE_URL,
  description:
    'Official portfolio of Mahek Kasdekar, a writer, artist and photographer from Indore, Madhya Pradesh, India. Graduate of Delhi University.',
  isPartOf: {
    '@id': `${BASE_URL}/#website`,
  },
  about: {
    '@id': `${BASE_URL}/#person`,
  },
  author: {
    '@id': `${BASE_URL}/#person`,
  },
  datePublished: '2024-01-01',
  dateModified: new Date().toISOString().split('T')[0],
  inLanguage: 'en-IN',
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', 'h2', '#about p', '#portfolio'],
  },
}

export default function JsonLd() {
  const schemas = [
    personSchema,
    websiteSchema,
    profilePageSchema,
    portfolioListSchema,
    faqSchema,
    breadcrumbSchema,
    localSchema,
  ]

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
