import { html, raw } from 'hono/html'
import { companyProfile as co } from './data/company'

const NAV = [
  { href: '/about', label: 'About' },
  { href: '/capabilities', label: 'Capabilities' },
  { href: '/products', label: 'Products' },
  { href: '/quality', label: 'Quality' },
  { href: '/sustainability', label: 'Sustainability' },
  { href: '/global-reach', label: 'Global Reach' },
  { href: '/careers', label: 'Careers' },
  { href: '/news', label: 'News' },
]

interface LayoutProps {
  title: string
  description?: string
  path?: string
  darkNav?: boolean
  children?: any
}

export const Layout = (props: LayoutProps) => {
  const desc = props.description || `${co.name} — established ${co.established}. Integrated knit composite textile & apparel manufacturer in Bangladesh: knitting, dyeing, finishing and garment manufacturing for global markets.`
  return html`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${props.title} | Gumti Textiles Ltd.</title>
  <meta name="description" content="${desc}" />
  <meta property="og:title" content="${props.title} | Gumti Textiles Ltd." />
  <meta property="og:description" content="${desc}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="/static/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
  ${raw(`<script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            navy: '#071A2B', ivory: '#F5F1E8', sand: '#C7B79C',
            ink: '#15191D', mutedgt: '#6D7378', navylight: '#0E2A42'
          },
          fontFamily: {
            serif: ['Fraunces', 'Georgia', 'serif'],
            sans: ['Inter', 'system-ui', 'sans-serif']
          },
          letterSpacing: { widest2: '0.25em' }
        }
      }
    }
  </script>`)}
  <link href="/static/style.css" rel="stylesheet" />
  ${raw(`<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: co.name,
    foundingDate: '1993-10-30',
    address: { '@type': 'PostalAddress', streetAddress: co.headOffice.line1 + ', ' + co.headOffice.line2, addressLocality: 'Dhaka', postalCode: '1206', addressCountry: 'BD' },
    description: desc,
  })}</script>`)}
</head>
<body class="bg-ivory text-ink font-sans antialiased">
  <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-navy focus:text-white focus:px-4 focus:py-2">Skip to main content</a>

  <header id="site-header" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${props.darkNav ? 'nav-solid' : ''}" data-dark-nav="${props.darkNav ? '1' : '0'}">
    <nav class="max-w-[1440px] mx-auto px-5 lg:px-10 flex items-center justify-between h-[72px]" aria-label="Main navigation">
      <a href="/" id="brand-logo" class="flex items-baseline gap-2 group">
        <span class="font-serif text-xl tracking-wide text-white transition-colors">GUMTI</span>
        <span class="text-[10px] tracking-widest2 uppercase text-sand">Textiles Ltd.</span>
      </a>
      <ul class="hidden xl:flex items-center gap-7 text-[13px] tracking-wide">
        ${raw(NAV.map((n) => `<li><a href="${n.href}" class="nav-link text-white/85 hover:text-sand transition-colors ${props.path === n.href ? 'text-sand nav-active' : ''}">${n.label}</a></li>`).join(''))}
      </ul>
      <div class="flex items-center gap-3">
        <a href="/portal" id="nav-account" class="hidden md:inline-flex items-center gap-2 text-[13px] text-white/85 hover:text-sand transition-colors" aria-label="Buyer portal">
          <i class="fa-regular fa-user"></i><span id="nav-account-label">Sign In</span>
        </a>
        <a href="/request-quote" class="hidden md:inline-flex items-center gap-2 bg-sand text-navy text-[13px] font-semibold tracking-wide px-5 py-2.5 hover:bg-white transition-colors">
          Request a Quote
        </a>
        <button id="mobile-menu-btn" class="xl:hidden text-white text-xl p-2" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>
    </nav>
  </header>

  <div id="mobile-menu" class="fixed inset-0 z-[60] bg-navy hidden flex-col" role="dialog" aria-modal="true" aria-label="Mobile menu">
    <div class="flex items-center justify-between px-5 h-[72px]">
      <span class="font-serif text-xl text-white">GUMTI <span class="text-[10px] tracking-widest2 uppercase text-sand align-middle">Textiles Ltd.</span></span>
      <button id="mobile-menu-close" class="text-white text-2xl p-2" aria-label="Close menu"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <nav class="flex-1 overflow-y-auto px-8 py-6" aria-label="Mobile navigation">
      <ul class="space-y-1">
        ${raw(NAV.map((n, i) => `<li><a href="${n.href}" class="block font-serif text-3xl text-white/90 hover:text-sand py-3 border-b border-white/10" style="animation-delay:${i * 40}ms">${n.label}</a></li>`).join(''))}
        <li><a href="/contact" class="block font-serif text-3xl text-white/90 hover:text-sand py-3 border-b border-white/10">Contact</a></li>
        <li><a href="/portal" class="block font-serif text-3xl text-white/90 hover:text-sand py-3">Buyer Portal</a></li>
      </ul>
      <a href="/request-quote" class="mt-8 block text-center bg-sand text-navy font-semibold px-6 py-4">Request a Quote</a>
    </nav>
  </div>

  <main id="main-content">${props.children}</main>

  <!-- Sticky mobile CTA (Spec §68) -->
  <div class="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-navy/95 backdrop-blur border-t border-white/10">
    <a href="/request-quote" class="block text-center bg-sand text-navy font-semibold py-3 text-sm tracking-wide">Request Quote</a>
  </div>

  <footer class="bg-navy text-white/80 pb-20 md:pb-0">
    <div class="max-w-[1440px] mx-auto px-5 lg:px-10 py-16 lg:py-20">
      <div class="grid md:grid-cols-12 gap-10">
        <div class="md:col-span-4">
          <p class="font-serif text-2xl text-white">GUMTI <span class="text-xs tracking-widest2 uppercase text-sand">Textiles Ltd.</span></p>
          <p class="mt-4 text-sm leading-relaxed text-white/60 max-w-sm">Integrated knit composite textile and apparel manufacturer, established ${co.established} in Bangladesh. Export-oriented, quality-driven, responsible production.</p>
          <div class="mt-6 flex gap-4 text-white/50">
            <a href="#" class="hover:text-sand" aria-label="LinkedIn"><i class="fa-brands fa-linkedin text-lg"></i></a>
            <a href="#" class="hover:text-sand" aria-label="Facebook"><i class="fa-brands fa-facebook text-lg"></i></a>
            <a href="mailto:${co.contact.email}" class="hover:text-sand" aria-label="Email"><i class="fa-regular fa-envelope text-lg"></i></a>
          </div>
        </div>
        <div class="md:col-span-2">
          <p class="text-[11px] tracking-widest2 uppercase text-sand mb-4">Navigation</p>
          <ul class="space-y-2 text-sm">
            ${raw(NAV.slice(0, 5).map((n) => `<li><a href="${n.href}" class="hover:text-sand transition-colors">${n.label}</a></li>`).join(''))}
          </ul>
        </div>
        <div class="md:col-span-2">
          <p class="text-[11px] tracking-widest2 uppercase text-sand mb-4">Company</p>
          <ul class="space-y-2 text-sm">
            ${raw(NAV.slice(5).map((n) => `<li><a href="${n.href}" class="hover:text-sand transition-colors">${n.label}</a></li>`).join(''))}
            <li><a href="/contact" class="hover:text-sand transition-colors">Contact</a></li>
            <li><a href="/request-quote" class="hover:text-sand transition-colors">Request Quote</a></li>
          </ul>
        </div>
        <div class="md:col-span-4 text-sm space-y-5">
          <div>
            <p class="text-[11px] tracking-widest2 uppercase text-sand mb-2">Head Office</p>
            <p class="text-white/60 leading-relaxed">${co.headOffice.line1}<br/>${co.headOffice.line2}, ${co.headOffice.line3}</p>
          </div>
          <div>
            <p class="text-[11px] tracking-widest2 uppercase text-sand mb-2">Factory</p>
            <p class="text-white/60 leading-relaxed">${co.factoryAddress.line1}<br/>${co.factoryAddress.line2}, ${co.factoryAddress.line3}</p>
          </div>
        </div>
      </div>
      <div class="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-white/40">
        <p>© ${new Date().getFullYear()} ${co.name} · BGMEA Reg. ${co.bgmeaRegistration} · EPB Reg. ${co.epbRegistration}</p>
        <div class="flex gap-6">
          <a href="/privacy" class="hover:text-sand">Privacy Policy</a>
          <a href="/terms" class="hover:text-sand">Terms</a>
          <a href="/privacy#cookies" class="hover:text-sand">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>

  <div id="toast" class="fixed bottom-24 md:bottom-8 right-4 z-[80] hidden max-w-sm bg-navy text-white text-sm px-5 py-4 shadow-2xl border-l-2 border-sand" role="status"></div>

  <script src="/static/app.js" defer></script>
  <script type="module" src="/static/firebase-app.js"></script>
</body>
</html>`
}

export const SectionLabel = (p: { text: string; light?: boolean }) => html`
  <p class="text-[11px] tracking-widest2 uppercase ${p.light ? 'text-sand' : 'text-mutedgt'} mb-4 flex items-center gap-3">
    <span class="inline-block w-8 h-px ${p.light ? 'bg-sand' : 'bg-sand'}"></span>${p.text}
  </p>`
