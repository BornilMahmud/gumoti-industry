// ============================================================
// PRODUCT CATALOG — Based on publicly documented Gumti product
// categories: T-Shirts, Polo Shirts, Knit Jackets, Shorts.
// Technical values are DEMO/CMS-managed specification templates,
// clearly labeled — not verified production claims.
// ============================================================
import { media } from './company'

export interface Product {
  slug: string
  code: string
  name: string
  category: 'T-Shirts' | 'Polo Shirts' | 'Knit Jackets' | 'Shorts'
  construction: string
  composition: string
  gsm: string
  finish: string
  colors: string[]
  application: string
  certifications: string[]
  moq: string
  leadTime: string
  availability: 'Available for Order' | 'Development' | 'Information to be confirmed'
  description: string
  image: string
  specNote: string
}

const SPEC_NOTE = 'Specification template — final technical values are confirmed per order by Gumti Textiles Ltd.'

export const products: Product[] = [
  {
    slug: 'classic-crew-neck-tshirt', code: 'GT-TS-001', name: 'Classic Crew Neck T-Shirt',
    category: 'T-Shirts', construction: 'Single Jersey', composition: '100% Cotton',
    gsm: '160–180', finish: 'Soft / Bio-wash', colors: ['White', 'Black', 'Navy', 'Heather Grey', 'Custom'],
    application: 'Casualwear / Basics programs', certifications: ['OEKO-TEX', 'BCI'],
    moq: 'Per order confirmation', leadTime: 'Per order confirmation', availability: 'Available for Order',
    description: 'A core knitwear program: combed cotton single jersey crew neck with rib collar, engineered for consistent shade and dimensional stability across bulk production.',
    image: media.garments, specNote: SPEC_NOTE,
  },
  {
    slug: 'premium-heavyweight-tshirt', code: 'GT-TS-002', name: 'Premium Heavyweight T-Shirt',
    category: 'T-Shirts', construction: 'Single Jersey (Heavy)', composition: '100% Combed Cotton',
    gsm: '200–240', finish: 'Enzyme / Silicone Soft', colors: ['Off-White', 'Charcoal', 'Olive', 'Custom'],
    application: 'Premium retail / Streetwear', certifications: ['OEKO-TEX', 'GOTS (organic option)'],
    moq: 'Per order confirmation', leadTime: 'Per order confirmation', availability: 'Available for Order',
    description: 'Heavyweight boxy-fit tee for premium retail programs, with tight stitch density for structure and a soft enzyme-washed surface.',
    image: media.fabricPile, specNote: SPEC_NOTE,
  },
  {
    slug: 'organic-cotton-tshirt', code: 'GT-TS-003', name: 'Organic Cotton T-Shirt',
    category: 'T-Shirts', construction: 'Single Jersey', composition: '100% Organic Cotton (GOTS route)',
    gsm: '150–170', finish: 'Soft finish', colors: ['Natural', 'White', 'Black', 'Custom'],
    application: 'Sustainable collections', certifications: ['GOTS', 'OEKO-TEX'],
    moq: 'Per order confirmation', leadTime: 'Per order confirmation', availability: 'Development',
    description: 'Organic cotton tee developed for GOTS-route programs, supporting traceable organic fibre sourcing and low-impact processing.',
    image: media.shirts, specNote: SPEC_NOTE,
  },
  {
    slug: 'classic-pique-polo', code: 'GT-PL-001', name: 'Classic Piqué Polo Shirt',
    category: 'Polo Shirts', construction: 'Piqué', composition: '100% Cotton',
    gsm: '180–220', finish: 'Soft / Bio-wash', colors: ['White', 'Navy', 'Black', 'Red', 'Custom'],
    application: 'Corporate / Retail / Uniform', certifications: ['OEKO-TEX', 'BCI'],
    moq: 'Per order confirmation', leadTime: 'Per order confirmation', availability: 'Available for Order',
    description: 'Classic two-button piqué polo with flat-knit collar and cuffs — a flagship export category for Gumti Textiles.',
    image: media.shirtRack, specNote: SPEC_NOTE,
  },
  {
    slug: 'cvc-performance-polo', code: 'GT-PL-002', name: 'CVC Performance Polo',
    category: 'Polo Shirts', construction: 'Piqué / Lacoste knit', composition: '60% Cotton 40% Polyester (CVC)',
    gsm: '170–200', finish: 'Moisture-management option', colors: ['Navy', 'Grey Melange', 'Bottle Green', 'Custom'],
    application: 'Workwear / Sports-inspired retail', certifications: ['OEKO-TEX'],
    moq: 'Per order confirmation', leadTime: 'Per order confirmation', availability: 'Available for Order',
    description: 'Cotton-rich CVC polo balancing natural hand feel with durability and shade retention across industrial wash cycles.',
    image: media.garments, specNote: SPEC_NOTE,
  },
  {
    slug: 'fleece-knit-jacket', code: 'GT-KJ-001', name: 'Brushed Fleece Knit Jacket',
    category: 'Knit Jackets', construction: 'Fleece (Brushed)', composition: '80% Cotton 20% Polyester',
    gsm: '280–320', finish: 'Anti-pilling / Brushed inner', colors: ['Black', 'Charcoal', 'Navy', 'Custom'],
    application: 'Outerwear / Athleisure', certifications: ['OEKO-TEX'],
    moq: 'Per order confirmation', leadTime: 'Per order confirmation', availability: 'Available for Order',
    description: 'Full-zip brushed fleece jacket with ribbed hem and cuffs, produced through the integrated knit-dye-finish route for shade consistency.',
    image: media.sewing2, specNote: SPEC_NOTE,
  },
  {
    slug: 'interlock-track-jacket', code: 'GT-KJ-002', name: 'Interlock Track Jacket',
    category: 'Knit Jackets', construction: 'Interlock', composition: '95% Cotton 5% Elastane',
    gsm: '240–280', finish: 'Soft finish', colors: ['Navy/White', 'Black/Grey', 'Custom'],
    application: 'Athleisure / Sports retail', certifications: ['OEKO-TEX'],
    moq: 'Per order confirmation', leadTime: 'Per order confirmation', availability: 'Development',
    description: 'Structured interlock track jacket with contrast piping options, developed for athleisure programs requiring stretch recovery.',
    image: media.sewing3, specNote: SPEC_NOTE,
  },
  {
    slug: 'jersey-lounge-shorts', code: 'GT-SH-001', name: 'Jersey Lounge Shorts',
    category: 'Shorts', construction: 'Single Jersey', composition: '100% Cotton',
    gsm: '160–190', finish: 'Soft / Enzyme wash', colors: ['Grey Melange', 'Black', 'Navy', 'Custom'],
    application: 'Loungewear / Basics', certifications: ['OEKO-TEX', 'BCI'],
    moq: 'Per order confirmation', leadTime: 'Per order confirmation', availability: 'Available for Order',
    description: 'Drawstring jersey shorts with side pockets — a versatile knit bottoms program complementing tee and polo categories.',
    image: media.fabricPile, specNote: SPEC_NOTE,
  },
  {
    slug: 'french-terry-shorts', code: 'GT-SH-002', name: 'French Terry Shorts',
    category: 'Shorts', construction: 'French Terry (Loopback)', composition: '85% Cotton 15% Polyester',
    gsm: '240–280', finish: 'Soft finish', colors: ['Charcoal', 'Sand', 'Black', 'Custom'],
    application: 'Athleisure / Streetwear', certifications: ['OEKO-TEX'],
    moq: 'Per order confirmation', leadTime: 'Per order confirmation', availability: 'Available for Order',
    description: 'Midweight loopback French terry shorts with structured waistband, produced within the integrated knit-composite workflow.',
    image: media.garments, specNote: SPEC_NOTE,
  },
]

export const categories = ['T-Shirts', 'Polo Shirts', 'Knit Jackets', 'Shorts'] as const

export function filterProducts(q: { category?: string; composition?: string; construction?: string; certification?: string; search?: string }) {
  return products.filter((p) => {
    if (q.category && p.category.toLowerCase().replace(/[^a-z]/g, '') !== q.category.toLowerCase().replace(/[^a-z]/g, '')) return false
    if (q.composition && !p.composition.toLowerCase().includes(q.composition.toLowerCase())) return false
    if (q.construction && !p.construction.toLowerCase().includes(q.construction.toLowerCase())) return false
    if (q.certification && !p.certifications.some((c) => c.toLowerCase().includes(q.certification!.toLowerCase()))) return false
    if (q.search) {
      const s = q.search.toLowerCase()
      const hay = `${p.name} ${p.category} ${p.composition} ${p.construction} ${p.description} ${p.code}`.toLowerCase()
      if (!hay.includes(s)) return false
    }
    return true
  })
}
