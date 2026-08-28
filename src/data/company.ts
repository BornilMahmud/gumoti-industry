// ============================================================
// GUMTI TEXTILES LTD. — SINGLE SOURCE OF TRUTH (Spec §60)
// Every public page must consume company facts from this file.
// Only VERIFIED data is rendered publicly (Spec §61).
// ============================================================

export type VerificationStatus = 'VERIFIED' | 'PENDING_VERIFICATION' | 'ARCHIVED'

export const companyProfile = {
  name: 'Gumti Textiles Ltd.',
  shortName: 'GUMTI TEXTILES',
  tagline: 'Engineering Quality. Crafting Possibility.',
  subTagline: 'Integrated textile and apparel manufacturing from Bangladesh for global markets.',
  established: '1993',
  establishedFull: '30 October 1993', // per BGMEA
  factoryType: 'Knit Composite',
  business: 'Knit Composite / Textile & Ready-Made Garment Manufacturing',
  bgmeaRegistration: '2443',
  epbRegistration: '3311',
  managingDirector: 'Mohd. Akhter', // publicly listed by BGMEA
  factoryAddress: {
    line1: 'Plot #1163, opposite Ansar Academy',
    line2: 'Chandra, Shafipur',
    line3: 'Kaliakoir, Gazipur, Bangladesh',
    full: 'Plot #1163, opposite Ansar Academy, Chandra, Shafipur, Kaliakoir, Gazipur, Bangladesh',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Chandra+Shafipur+Kaliakoir+Gazipur+Bangladesh',
  },
  headOffice: {
    line1: 'House #150, Road #1',
    line2: 'Baridhara DOHS',
    line3: 'Dhaka-1206, Bangladesh',
    full: 'House #150, Road #1, Baridhara DOHS, Dhaka-1206, Bangladesh',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Baridhara+DOHS+Dhaka+Bangladesh',
  },
  contact: {
    // Contact details to be confirmed by Gumti Textiles Ltd. (CMS-managed)
    email: 'info@gumtitextiles.com',
    emailNote: 'Information to be confirmed by Gumti Textiles Ltd.',
    phone: '',
    phoneNote: 'Information to be confirmed by Gumti Textiles Ltd.',
  },
  capabilities: ['Knitting', 'Dyeing', 'Finishing', 'Garment Manufacturing', 'Export-oriented Apparel Manufacturing'],
  principalProducts: ['T-Shirts', 'Polo Shirts', 'Knit Jackets', 'Shorts'],
  certifications: [
    {
      code: 'BCI',
      name: 'Better Cotton Initiative',
      description: 'Membership initiative promoting better standards in cotton farming and sourcing across the global cotton supply chain.',
      scope: 'Cotton sourcing',
      status: 'VERIFIED' as VerificationStatus,
      certificateNumber: '', // Only populate when provided by Gumti management
      validUntil: '',
      note: 'Certificate metadata to be confirmed by Gumti Textiles Ltd.',
    },
    {
      code: 'SEDEX',
      name: 'SEDEX (Supplier Ethical Data Exchange)',
      description: 'Global membership platform for responsible supply chain data covering labour, health & safety, environment and business ethics.',
      scope: 'Ethical trade / social compliance',
      status: 'VERIFIED' as VerificationStatus,
      certificateNumber: '',
      validUntil: '',
      note: 'Certificate metadata to be confirmed by Gumti Textiles Ltd.',
    },
    {
      code: 'OEKO-TEX',
      name: 'OEKO-TEX®',
      description: 'Independent testing and certification system for textile raw materials, intermediate and end products at all processing stages.',
      scope: 'Product safety / harmful substances',
      status: 'VERIFIED' as VerificationStatus,
      certificateNumber: '',
      validUntil: '',
      note: 'Certificate metadata to be confirmed by Gumti Textiles Ltd.',
    },
    {
      code: 'GOTS',
      name: 'Global Organic Textile Standard',
      description: 'Leading textile processing standard for organic fibres, including ecological and social criteria, backed by independent certification.',
      scope: 'Organic textile processing',
      status: 'VERIFIED' as VerificationStatus,
      certificateNumber: '',
      validUntil: '',
      note: 'Certificate metadata to be confirmed by Gumti Textiles Ltd.',
    },
  ],
  timeline: [
    { year: '1993', title: 'Foundation', text: 'Gumti Textiles Ltd. is established on 30 October 1993 in Bangladesh.' },
    { year: '—', title: 'Production Development', text: 'Development of knit fabric production and garment manufacturing operations.' },
    { year: '—', title: 'Integrated Textile Operations', text: 'Knitting, dyeing and finishing brought together as an integrated knit-composite operation.' },
    { year: '—', title: 'Garment Manufacturing', text: 'Export-oriented ready-made garment manufacturing for knitwear categories.' },
    { year: 'Today', title: 'International Export Focus', text: 'Serving international, export-oriented markets with quality-driven, responsible manufacturing.' },
  ],
}

// Licensed (Creative Commons / Public Domain) placeholder imagery.
// Replace with official Gumti Textiles imagery when provided (Spec §45).
export const media = {
  hero: 'https://sspark.genspark.ai/cfimages?u1=baVnthpATpTWldZsHYfI2gagcZuKU3KByhKTgAucDDfmcq%2BK%2BQZyHbOUZPajC7Lp%2BvwmIP%2BKC9bxVRtWjJMSOOdwJq7dtAurI1Jw%2F1Si&u2=hTigi4VfkwxebxTE&width=2560',
  knitting: 'https://sspark.genspark.ai/cfimages?u1=QOKZnOcPpeQLwVc4Rg3uAKFqyyxQ3SnuRvQ3RXqtEGNDKjyMzfAquJRznRYRSbjkUvDKgc%2F0T%2FeYnlXC%2B%2Fd%2FGvSLb%2B%2BGhiwbNTGF1xsR03dRVkwh0B1UbBZwcC1o%2FT7vf%2Bx1vMiCMqHZr2nPmIo%2BQw83cm1yHYamcNvQ5w7oCPS4rpMUHgPO%2BKhDe3T6DoYjg%2BuoXE3z79E9tbblz4juJLEfmLC%2FKw%3D%3D&u2=52gdtquHbetkqAwp&width=2560',
  knitting2: 'https://sspark.genspark.ai/cfimages?u1=rGNBCoNtNu86PvlTwlPlhY2uBMuSwZfzQt03YHGRxgvFh3%2FNlOcZnSEBuGbxlGiqYOKyO4gsYzY03nIOhn6zbwrcexNP1Txy0MukCHQXJ0Gk32AehYpIPH9VO3QZL74HA%2F%2BzyMryVks2oWx%2BUtlVBkQLJFrxC6%2Fb2xPHTszm4WiiQNkLynIdZ2kv9aVJ%2FO1xhIgKe0PsUF0VTgF6flvasNUbW2MkmSoOyyaMHevUKKPwoThGmVaQOuyaIVEY4YI%2FhrCQ5Dc%3D&u2=bYGo4JhwWORF8gkU&width=2560',
  dyeing: 'https://sspark.genspark.ai/cfimages?u1=SMJjB8WM7A9QBaPgWt7fT48QGC3WApfGsKT6%2F6uDxoUSj4pu7xlPZVKonrUyeEJM3nanNrEcHPyJpuxXaQuFjXs511co2JpOLICAnEGsP5RB9K%2B7zTGhdjHLg52GsmJFj3kPHU71biKaxgi5PnFLRvN1Rs8MAlcm80KzADEHKyo%3D&u2=QDfv3v2PN3taZ%2BGY&width=2560',
  sewing: 'https://sspark.genspark.ai/cfimages?u1=qtwi0cNTRowTBHxCSmCeuVntsWf5djPYYOAQbYoP26W%2B%2FTRDrl7bB%2BKkjmWMZfjg8TXOKKUslD3D90vhiT6%2F7dIvtzZmy54fGnrGT4pS%2FOYA%3D&u2=UM99hNJekqlFpDel&width=2560',
  sewing2: 'https://sspark.genspark.ai/cfimages?u1=O0dqYNL%2FD4Y1TrtAQqpK%2BOJc6lkM8XHqcCVctUviwoGpjVzUsD2imbZrp1z2aUkesjdpMslNJLIYJ2Z7%2FtQQoQsyao4jG8M68qUtgPW%2FUw%3D%3D&u2=teu4nQZVLIgnz1p9&width=2560',
  sewing3: 'https://sspark.genspark.ai/cfimages?u1=vB5XWH9UIR7FrYvMzUD7AyJ%2FRYsNQFiPRWfaBuX3uP1lf2Iuj0NMWqC8G9oos7TAanILTACs7JGDAq4cGV5BVBDWrZUf%2FueIZ7Hjb4Dl&u2=mMadEsxIfYh%2FOPYz&width=2560',
  quality: 'https://sspark.genspark.ai/cfimages?u1=zbJEReTvLHYizU1XEk%2BXCdf%2FvRhSo0wbqI1jrCYuK2Adv4ebeNsH%2BCuz%2BNrgDK7jbvLa3czdn2wXuM%2FnLl38T6Z1JlHe5YomROMMa3mzAw%3D%3D&u2=ih3DFg76BfbAXHvG&width=2560',
  worker: 'https://sspark.genspark.ai/cfimages?u1=Yq6Vjdh%2BiEz8bID4PenswDvJlmxfEIW9LidkEfX6N%2FFNUdNL5%2F3SGvhExr6eUGlkvzglXbzmbmflBiFwF%2F8eDUusQbVaVGh9kbBoreU3lg%3D%3D&u2=%2Bwml3OUu81JJF4SE&width=2560',
  garments: 'https://sspark.genspark.ai/cfimages?u1=k2Qov7zWmTzWAJPBmUNAIfDS%2FVhlLVR628yx%2Fu5g1upO8hwz2Kn5ugwobHpPG%2BncYtLZrKeMKjyBJql5CMWOmxu40L7w3jPN1p15SyAHR75zHV4hbhYgNC%2FkMItXmDULU2A%3D&u2=uZ9klkcfqpVmBU0H&width=2560',
  fabricPile: 'https://sspark.genspark.ai/cfimages?u1=vP5caA%2FcIdzqSzJYSzWZFsvov3avkp1OPTDhDjX0PMBW4LRqqsv%2BZ0uZiUq073dXn5NXJPStfukGxm4%2FrT9ieX%2Bj7fk6ZwaMKhO03VMi2eiRVGdUQSmnjNjXMJfOoa9XqdnA1K5taF%2F686nNMbnX2ByMrKugczf19w%3D%3D&u2=0aDMa6XQnJlhfgmx&width=2560',
  shirtRack: 'https://sspark.genspark.ai/cfimages?u1=vdM%2BFO%2B76RejcrgLIKAjZP%2BuqFrMp%2FNUnBxcqrFvMh808EuHwd7gGc4SbxHTvJufNGFramYaGi%2FCJ50qH9tHZa9loOpf%2B%2FvvHj%2BHnk1XDJhIJLYSMeBO0AWRd8KxJu%2FJjRzdPBKYPDr9pg%3D%3D&u2=7uXxtv1myZTkkaUE&width=2560',
  shirts: 'https://sspark.genspark.ai/cfimages?u1=8L97Rm%2Bkh%2F3HnEsjMR3DdEI3GTUBRPgaUx1kADC3oDszXyM2q%2BVXXUAzNnaUP2dioFoXCO9OoPsUKV5sMPZA5%2BplmaP9oOrQdmkICxAw1M3Jqq2NroWpj13XKrpS7aoI7J4swAzDI1fJCzDDoJ18Ag%3D%3D&u2=FSwlHMS7C2XaQPkH&width=2560',
}

export const manufacturingStages = [
  {
    num: '01', slug: 'knitting', name: 'Knitting',
    tagline: 'Precision Begins at the Fabric Stage',
    description: 'Knit fabric production forms the foundation of the integrated manufacturing process. Fabric construction, GSM and composition are engineered to buyer specification before any downstream process begins.',
    checkpoints: ['Yarn inspection', 'Fabric construction verification', 'GSM control', 'Greige fabric inspection'],
    image: 'knitting',
    specs: [
      { label: 'Machine type', value: 'Information to be confirmed by Gumti Textiles Ltd.' },
      { label: 'Machine count', value: 'Information to be confirmed by Gumti Textiles Ltd.' },
      { label: 'Daily capacity', value: 'Information to be confirmed by Gumti Textiles Ltd.' },
      { label: 'Fabric types', value: 'Single jersey, pique, interlock, fleece and rib constructions (CMS-managed)' },
      { label: 'GSM range', value: 'Information to be confirmed by Gumti Textiles Ltd.' },
    ],
  },
  {
    num: '02', slug: 'dyeing', name: 'Dyeing',
    tagline: 'Color. Consistency. Control.',
    description: 'In-house dyeing brings shade development, lab dips and bulk color reproduction under a single quality system — from fabric preparation to final shade approval.',
    checkpoints: ['Lab dip approval', 'Shade continuity control', 'Fastness testing', 'Bulk-to-lab shade matching'],
    image: 'dyeing',
    specs: [
      { label: 'Machine type', value: 'Information to be confirmed by Gumti Textiles Ltd.' },
      { label: 'Capacity', value: 'Information to be confirmed by Gumti Textiles Ltd.' },
      { label: 'Color matching', value: 'Laboratory-based lab dip and shade approval workflow (CMS-managed)' },
      { label: 'Water management', value: 'Information to be confirmed by Gumti Textiles Ltd.' },
    ],
  },
  {
    num: '03', slug: 'finishing', name: 'Finishing',
    tagline: 'The Transformation Stage',
    description: 'Finishing defines the hand feel, appearance and dimensional stability of every fabric. Shrinkage control and surface finish are managed against buyer tolerance standards.',
    checkpoints: ['Shrinkage control', 'Width & GSM verification', 'Hand-feel assessment', 'Final fabric inspection'],
    image: 'fabricPile',
    specs: [
      { label: 'Finish types', value: 'Soft finish, functional finish (processes confirmed by Gumti displayed only)' },
      { label: 'Dimensional stability', value: 'Managed against buyer tolerance standards (CMS-managed)' },
    ],
  },
  {
    num: '04', slug: 'garment-manufacturing', name: 'Garment Manufacturing',
    tagline: 'From Fabric to Finished Garment',
    description: 'Export-oriented garment manufacturing covering cutting, sewing, finishing and packing for knitwear categories including T-shirts, polo shirts, knit jackets and shorts.',
    checkpoints: ['Cutting accuracy', 'In-line sewing inspection', 'Measurement audit', 'End-of-line inspection'],
    image: 'sewing',
    specs: [
      { label: 'Production lines', value: 'Information to be confirmed by Gumti Textiles Ltd.' },
      { label: 'Product categories', value: 'T-Shirts, Polo Shirts, Knit Jackets, Shorts (publicly documented)' },
    ],
  },
  {
    num: '05', slug: 'quality-control', name: 'Quality Control',
    tagline: 'Quality Is Built Into the Process',
    description: 'Quality is enforced at every stage — raw material, fabric, dyeing, finishing, garment production and final inspection — rather than inspected in at the end.',
    checkpoints: ['Incoming material QC', 'In-process audits', 'AQL-based final inspection', 'Pre-shipment verification'],
    image: 'quality',
    specs: [
      { label: 'Inspection standard', value: 'AQL-based sampling inspection (CMS-managed)' },
      { label: 'Compliance', value: 'BCI · SEDEX · OEKO-TEX · GOTS (publicly listed by BGMEA)' },
    ],
  },
  {
    num: '06', slug: 'packing-export', name: 'Packing & Export',
    tagline: 'Ready for Global Markets',
    description: 'Finished garments are packed to buyer specification and prepared for export documentation and international shipment from Bangladesh.',
    checkpoints: ['Carton audit', 'Packing list verification', 'Export documentation', 'Shipment handover'],
    image: 'shirtRack',
    specs: [
      { label: 'Export focus', value: 'International markets (EPB-registered exporter, Reg. 3311)' },
    ],
  },
]
