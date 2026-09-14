import { html, raw } from 'hono/html'
import { companyProfile as co } from './data/company'

const facebookUrl = 'https://www.facebook.com/gumtitextile'
const whatsappUrl = 'https://wa.me/8801329713736?text=Hello%20Gumti%20Textiles,%20I%20would%20like%20to%20inquire%20about%20knitwear%20manufacturing...'

const BrandMark = () => raw(`
  <div class="flex items-center gap-2.5">
    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00E599] via-[#008F5D] to-[#046A44] flex items-center justify-center shadow-[0_0_16px_rgba(0,229,153,0.3)] p-1.5 shrink-0 group-hover:scale-105 transition-transform border border-[#00E599]/30">
      <img src="/images/logo/textiles-logo.png" alt="Gumti Logo" class="w-full h-full object-contain filter brightness-0 invert" />
    </div>
    <div class="flex flex-col">
      <span class="font-extrabold text-base tracking-tight leading-none font-display flex items-center gap-1 transition-colors">
        <span class="text-[#DC2626] dark:text-[#EF4444] font-black tracking-tight">GUMTI</span>
        <span class="text-[#00875A] dark:text-[#00E599] font-extrabold">TEXTILES</span>
      </span>
      <span class="text-[9px] font-semibold tracking-[0.2em] text-[var(--text-muted)] uppercase mt-0.5">Knit Composite · Est. 1993</span>
    </div>
  </div>
`)

interface LayoutProps {
  title: string
  description?: string
  path?: string
  darkNav?: boolean
  children?: any
}

export const Layout = (props: LayoutProps) => {
  const desc = props.description || `${co.name} — Established 1993. Premier integrated knit composite manufacturer in Bangladesh: 50T/day dyeing, 10T/day knitting, 80T/day finishing, 35,000 pcs/day sewing.`
  const currentPath = props.path || ''

  return html`<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${props.title} | Gumti Textiles Ltd.</title>
  <meta name="description" content="${desc}" />
  <meta property="og:title" content="${props.title} | Gumti Textiles Ltd." />
  <meta property="og:description" content="${desc}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="/images/logo/textiles-logo.png" type="image/png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

  <!-- Prevent FOUC Theme Script -->
  ${raw(`<script>
    (function() {
      try {
        const saved = localStorage.getItem('gt_theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (saved === 'light' || (!saved && !prefersDark)) {
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
        } else {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        }
      } catch (e) {}
    })();
  </script>`)}

  ${raw(`<script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            cyberblack: '#060B10',
            cybersurface: '#0C1520',
            cybercard: '#111D2C',
            emerald: {
              DEFAULT: '#00E599',
              400: '#34D399',
              500: '#00E599',
              600: '#059669',
            },
            cyan: {
              DEFAULT: '#00D2FF',
              400: '#38BDF8',
              500: '#00D2FF',
            },
            sandgold: '#E5C378',
            silvertext: '#CBD5E1',
            mutedslate: '#788A9C',
          },
          fontFamily: {
            sans: ['Inter', 'Geist', 'system-ui', 'sans-serif'],
            display: ['Inter', 'Geist', 'sans-serif'],
            mono: ['Geist Mono', 'ui-monospace', 'monospace'],
          }
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
    address: { '@type': 'PostalAddress', streetAddress: co.factoryAddress.full, addressLocality: 'Gazipur', addressCountry: 'BD' },
    description: desc,
  })}</script>`)}
</head>
<body class="selection:bg-[#00E599] selection:text-[#050B10]">
  <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-[#00E599] focus:text-[#050B10] focus:px-4 focus:py-2 rounded">Skip to main content</a>

  <!-- 1.2s Luxury Brand Intro Experience -->
  <div id="gt-intro-overlay" role="presentation" aria-hidden="true">
    <div class="intro-content">
      <div class="intro-emblem">
        <img src="/images/logo/textiles-logo.png" alt="Gumti Textiles Emblem" />
      </div>
      <div class="intro-title"><span class="text-[#EF4444]">GUMTI</span> <span class="text-[#00E599]">TEXTILES</span></div>
      <div class="intro-tagline">Integrated Knit & Apparel Manufacturing · Est. 1993</div>
      <div class="intro-line"></div>
    </div>
    <button id="intro-skip-btn" class="intro-skip-btn" type="button" aria-label="Skip Intro">Skip Intro ➔</button>
  </div>

  <!-- Executive Fixed Glass Navbar -->
  <header id="site-header" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
    <nav class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[74px]" aria-label="Main navigation">
      
      <!-- Brand Logo -->
      <a href="/" id="brand-logo" class="flex items-center gap-3 group shrink-0" aria-label="Gumti Textiles home">
        ${BrandMark()}
      </a>

      <!-- Desktop Links -->
      <ul class="hidden lg:flex items-center gap-1 xl:gap-2">
        <li>
          <a href="/about" class="nav-item-pill ${currentPath === '/about' ? 'active' : ''}">
            About
          </a>
        </li>
        <li>
          <a href="/capabilities" class="nav-item-pill ${currentPath === '/capabilities' ? 'active' : ''}">
            Capabilities
          </a>
        </li>
        <li>
          <a href="/facilities" class="nav-item-pill ${currentPath === '/facilities' ? 'active' : ''}">
            Facilities
          </a>
        </li>
        <li>
          <a href="/products" class="nav-item-pill ${currentPath === '/products' ? 'active' : ''}">
            Products
          </a>
        </li>

        <!-- Company Dropdown -->
        <li class="relative group">
          <button type="button" class="nav-item-pill flex items-center gap-1.5 cursor-pointer ${['/quality', '/sustainability', '/global-reach'].includes(currentPath) ? 'active' : ''}" aria-haspopup="true">
            <span>Company</span>
            <i class="fa-solid fa-chevron-down text-[9px] transition-transform duration-200 group-hover:rotate-180 text-[#788A9C]"></i>
          </button>
          <div class="absolute top-full left-0 pt-2 w-56 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 transform -translate-y-1 group-hover:translate-y-0 z-50">
            <div class="p-2 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-medium)] shadow-2xl space-y-1">
              <a href="/quality" class="dropdown-item ${currentPath === '/quality' ? 'dropdown-active' : ''}">
                <i class="fa-solid fa-shield-check text-xs text-[#00E599] w-4"></i>
                <div>
                  <p class="font-medium text-xs">Quality & ETP</p>
                  <p class="text-[10px] text-[#788A9C]">Zero toxic effluent</p>
                </div>
              </a>
              <a href="/sustainability" class="dropdown-item ${currentPath === '/sustainability' ? 'dropdown-active' : ''}">
                <i class="fa-solid fa-leaf text-xs text-[#00D2FF] w-4"></i>
                <div>
                  <p class="font-medium text-xs">Sustainability</p>
                  <p class="text-[10px] text-[#788A9C]">Twin jute boilers & LPG</p>
                </div>
              </a>
              <a href="/global-reach" class="dropdown-item ${currentPath === '/global-reach' ? 'dropdown-active' : ''}">
                <i class="fa-solid fa-globe text-xs text-[#E5C378] w-4"></i>
                <div>
                  <p class="font-medium text-xs">Global Reach</p>
                  <p class="text-[10px] text-[#788A9C]">$27M annual export</p>
                </div>
              </a>
            </div>
          </div>
        </li>

        <li>
          <a href="/careers" class="nav-item-pill ${currentPath === '/careers' ? 'active' : ''}">
            Careers
          </a>
        </li>
        <li>
          <a href="/news" class="nav-item-pill ${currentPath === '/news' ? 'active' : ''}">
            News
          </a>
        </li>
        <li>
          <a href="/contact" class="nav-item-pill ${currentPath === '/contact' ? 'active' : ''}">
            Contact
          </a>
        </li>
      </ul>

      <!-- Action Cluster -->
      <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
        
        <!-- Theme Switcher -->
        <button id="theme-toggle" class="theme-toggle-btn" type="button" aria-label="Toggle dark/light theme" title="Toggle theme">
          <i id="theme-icon" class="fa-solid fa-moon text-xs"></i>
        </button>

        <!-- WhatsApp Direct Contact (Logo Only) -->
        <a href="${whatsappUrl}" target="_blank" rel="noopener" class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-[#050B10] border border-[#25D366]/30 transition-all duration-200" title="Chat on WhatsApp" aria-label="Chat on WhatsApp">
          <i class="fa-brands fa-whatsapp text-base"></i>
        </a>

        <!-- Guest Only: Sign In Button -->
        <a href="/login" id="nav-login-btn" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)] transition-colors">
          <i class="fa-regular fa-user text-xs"></i>
          <span>Sign In</span>
        </a>

        <!-- Logged In Only: Profile Pill -->
        <a href="/profile" id="nav-user-pill" class="hidden items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-input)] border border-[var(--border-subtle)] hover:border-[#00E599]/40 transition-all text-xs text-[var(--text-primary)]" aria-label="My Profile">
          <span id="nav-user-avatar" class="w-5 h-5 rounded-full bg-[#00E599]/20 text-[#00E599] flex items-center justify-center text-[10px] font-bold">U</span>
          <span id="nav-user-name" class="font-medium truncate max-w-[90px]">Profile</span>
          <span id="nav-user-role-badge" class="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#00E599]/15 text-[#00E599]">ROLE</span>
        </a>

        <!-- Admin Only Pill -->
        <a href="/admin" id="nav-admin-btn" class="hidden items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30 text-xs font-semibold hover:bg-[#00E599]/25 transition-colors">
          <i class="fa-solid fa-gauge text-[10px]"></i>
          <span>Admin</span>
        </a>

        <!-- Request Quote CTA Pill -->
        <a href="/request-quote" class="pill-btn-emerald py-1.5 px-3.5 sm:px-4 text-xs whitespace-nowrap hidden sm:inline-flex">
          <span>Quote</span>
          <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </a>

        <!-- Mobile Drawer Toggle -->
        <button id="mobile-menu-btn" class="lg:hidden text-[var(--text-primary)] text-lg p-2 rounded-xl hover:bg-[var(--bg-input)] transition-colors" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-menu">
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>

    </nav>
  </header>

  <!-- Mobile Drawer Menu -->
  <div id="mobile-menu" class="fixed inset-0 z-[60] bg-[var(--bg-overlay)] backdrop-blur-2xl hidden flex-col" role="dialog" aria-modal="true" aria-label="Mobile navigation">
    <div class="flex items-center justify-between px-6 h-[74px] border-b border-[var(--border-subtle)]">
      <span>${BrandMark()}</span>
      <button id="mobile-menu-close" class="text-[var(--text-primary)] text-2xl p-2" aria-label="Close menu"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <nav class="flex-1 overflow-y-auto px-6 py-6 space-y-4" aria-label="Mobile links">
      <ul class="space-y-1">
        <li><a href="/about" class="block text-lg font-display font-semibold text-[var(--text-primary)] hover:text-[#00E599] py-2.5 border-b border-[var(--border-subtle)]">About</a></li>
        <li><a href="/capabilities" class="block text-lg font-display font-semibold text-[var(--text-primary)] hover:text-[#00E599] py-2.5 border-b border-[var(--border-subtle)]">Capabilities</a></li>
        <li><a href="/facilities" class="block text-lg font-display font-semibold text-[var(--text-primary)] hover:text-[#00E599] py-2.5 border-b border-[var(--border-subtle)]">Facilities</a></li>
        <li><a href="/products" class="block text-lg font-display font-semibold text-[var(--text-primary)] hover:text-[#00E599] py-2.5 border-b border-[var(--border-subtle)]">Products</a></li>
        <li><a href="/quality" class="block text-lg font-display font-semibold text-[var(--text-primary)] hover:text-[#00E599] py-2.5 border-b border-[var(--border-subtle)]">Quality & ETP</a></li>
        <li><a href="/sustainability" class="block text-lg font-display font-semibold text-[var(--text-primary)] hover:text-[#00E599] py-2.5 border-b border-[var(--border-subtle)]">Sustainability</a></li>
        <li><a href="/global-reach" class="block text-lg font-display font-semibold text-[var(--text-primary)] hover:text-[#00E599] py-2.5 border-b border-[var(--border-subtle)]">Global Reach</a></li>
        <li><a href="/careers" class="block text-lg font-display font-semibold text-[var(--text-primary)] hover:text-[#00E599] py-2.5 border-b border-[var(--border-subtle)]">Careers</a></li>
        <li><a href="/news" class="block text-lg font-display font-semibold text-[var(--text-primary)] hover:text-[#00E599] py-2.5 border-b border-[var(--border-subtle)]">News</a></li>
        <li><a href="/contact" class="block text-lg font-display font-semibold text-[var(--text-primary)] hover:text-[#00E599] py-2.5 border-b border-[var(--border-subtle)]">Contact</a></li>
        
        <!-- Auth Links Mobile -->
        <li><a href="/login" data-mobile-login class="block text-lg font-display font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-2.5 border-b border-[var(--border-subtle)]">Sign In</a></li>
        <li><a href="/profile" data-mobile-profile class="hidden block text-lg font-display font-semibold text-[#00E599] py-2.5 border-b border-[var(--border-subtle)]"><i class="fa-regular fa-user mr-2"></i>My Profile</a></li>
        <li><a href="/admin" data-mobile-admin class="hidden block text-lg font-display font-semibold text-[#00E599] py-2.5 border-b border-[var(--border-subtle)]"><i class="fa-solid fa-gauge mr-2"></i>Admin Dashboard</a></li>
      </ul>

      <div class="pt-4 space-y-3">
        <a href="${whatsappUrl}" target="_blank" rel="noopener" class="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold w-full shadow-lg shadow-[#25D366]/20 transition-colors">
          <i class="fa-brands fa-whatsapp text-lg"></i>
          <span>WhatsApp Direct</span>
        </a>
        <a href="/request-quote" class="pill-btn-emerald w-full py-3 text-xs text-center">
          <span>Request Production Quote</span>
        </a>
      </div>
    </nav>
  </div>

  <main id="main-content" class="pt-[74px]">${props.children}</main>

  <!-- Clean Industrial Editorial Footer -->
  <footer class="bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] text-[var(--text-secondary)] pt-16 pb-12 transition-colors">
    <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[var(--border-subtle)]">
        
        <!-- Corporate Column -->
        <div class="lg:col-span-4 space-y-4">
          ${BrandMark()}
          <p class="text-xs text-[var(--text-muted)] leading-relaxed max-w-sm mt-3">
            Over 30 years of integrated knit composite manufacturing in Bangladesh. Exporting high-precision knitwear to global apparel brands across Europe and North America.
          </p>
          
          <div class="pt-2 flex items-center gap-3">
            <a href="${whatsappUrl}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-xs font-bold text-[#25D366] hover:bg-[#25D366]/25 transition-colors">
              <i class="fa-brands fa-whatsapp text-sm"></i>
              <span>WhatsApp Chat</span>
            </a>
            <a href="${facebookUrl}" target="_blank" rel="noopener" class="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[#00E599] transition-colors">
              <i class="fa-brands fa-facebook-f text-sm"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="lg:col-span-2 space-y-3 text-xs">
          <p class="text-[11px] tracking-widest uppercase font-bold text-[var(--text-primary)]">Manufacturing</p>
          <ul class="space-y-2 text-[var(--text-muted)]">
            <li><a href="/capabilities" class="hover:text-[var(--text-primary)] transition-colors">6 Production Stages</a></li>
            <li><a href="/facilities" class="hover:text-[var(--text-primary)] transition-colors">Gazipur Machinery Plant</a></li>
            <li><a href="/products" class="hover:text-[var(--text-primary)] transition-colors">Export Catalog</a></li>
            <li><a href="/quality" class="hover:text-[var(--text-primary)] transition-colors">Quality Control & Lab</a></li>
            <li><a href="/sustainability" class="hover:text-[var(--text-primary)] transition-colors">Green Infrastructure</a></li>
          </ul>
        </div>

        <div class="lg:col-span-2 space-y-3 text-xs">
          <p class="text-[11px] tracking-widest uppercase font-bold text-[var(--text-primary)]">Company</p>
          <ul class="space-y-2 text-[var(--text-muted)]">
            <li><a href="/about" class="hover:text-[var(--text-primary)] transition-colors">About Gumti</a></li>
            <li><a href="/global-reach" class="hover:text-[var(--text-primary)] transition-colors">Global Export Reach</a></li>
            <li><a href="/careers" class="hover:text-[var(--text-primary)] transition-colors">Open Careers</a></li>
            <li><a href="/news" class="hover:text-[var(--text-primary)] transition-colors">Company News</a></li>
            <li><a href="/contact" class="hover:text-[var(--text-primary)] transition-colors">Head Office & Plant</a></li>
          </ul>
        </div>

        <!-- Plant & Coordinates -->
        <div class="lg:col-span-4 space-y-3 text-xs">
          <p class="text-[11px] tracking-widest uppercase font-bold text-[var(--text-primary)]">Factory Coordinates</p>
          <div class="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] space-y-2">
            <p class="text-[var(--text-primary)] leading-relaxed">
              <strong>Chandra Plant:</strong> ${co.factoryAddress.full}
            </p>
            <div class="pt-2 border-t border-[var(--border-subtle)] flex flex-col gap-1 text-[11px]">
              <span>BGMEA Reg: ${co.bgmeaRegistration} · BKMEA: ${co.bkmeaRegistration}</span>
              <a href="mailto:${co.contact.email}" class="text-[#00E599] hover:underline font-mono">
                <i class="fa-regular fa-envelope mr-1.5"></i>${co.contact.email}
              </a>
            </div>
          </div>
        </div>

      </div>

      <!-- Copyright Bar -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
        <p>© ${new Date().getFullYear()} ${co.name} · Integrated Knit Composite Manufacturer. All rights reserved.</p>
        <div class="flex items-center gap-6">
          <a href="/privacy" class="hover:text-[var(--text-primary)] transition-colors">Privacy Policy</a>
          <a href="/terms" class="hover:text-[var(--text-primary)] transition-colors">Terms of Use</a>
          <a href="/portal" class="hover:text-[#00E599] transition-colors">Buyer Portal</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- Fixed Floating WhatsApp Quick Trigger (Bottom Left) -->
  <a href="${whatsappUrl}" target="_blank" rel="noopener" class="fixed bottom-6 left-6 z-50 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-105 transition-all duration-300 group cursor-pointer" aria-label="Chat on WhatsApp" title="Chat on WhatsApp">
    <i class="fa-brands fa-whatsapp text-2xl"></i>
    <span class="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
      <span class="w-2 h-2 rounded-full bg-[#25D366] animate-ping"></span>
    </span>
  </a>

  <!-- Fixed Floating Gumti AI Assistant (Bottom Right) -->
  <aside id="gumti-ai" class="gumti-ai" aria-live="polite">
    <button id="ai-toggle" class="gumti-ai-button" aria-expanded="false" aria-controls="ai-panel">
      <span class="ai-pulse-dot" aria-hidden="true"></span>
      <span>ASK GUMTI AI</span>
    </button>
    <section id="ai-panel" class="gumti-ai-panel" aria-label="GUMTI AI advisor" hidden>
      <div class="ai-panel-header">
        <div>
          <p class="text-[10px] tracking-widest uppercase font-bold text-[#00E599]">Technical Advisor</p>
          <h2 class="text-sm font-bold text-[var(--text-primary)]">Gumti AI Assistant</h2>
        </div>
        <button id="ai-close" aria-label="Close GUMTI AI" class="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 cursor-pointer">
          <i class="fa-solid fa-xmark text-base"></i>
        </button>
      </div>
      <div id="ai-messages" class="ai-messages-list">
        <article class="ai-msg bot">
          <p>Welcome to Gumti Textiles Ltd. Ask me about our 50T/day dyeing capacity, 10T knitting machines, fabric compositions, or how to submit an RFQ.</p>
          <small class="text-[10px] text-[#788A9C] block mt-1.5">Official Factory AI · Powered by Gemini</small>
        </article>
      </div>
      <div class="ai-quick-prompts" aria-label="Suggested prompts">
        <button class="ai-prompt-pill" data-ai-q="What are your daily dyeing and knitting capacities?">Capacities</button>
        <button class="ai-prompt-pill" data-ai-q="What fabrications and GSM ranges do you knit?">Fabrics & GSM</button>
        <button class="ai-prompt-pill" data-ai-q="Tell me about your ETP and sustainability credentials">ETP & Green</button>
        <button class="ai-prompt-pill" data-ai-q="How do I submit an RFQ for production?">Request Quote</button>
      </div>
      <form id="ai-form" class="ai-input-bar">
        <input id="ai-input" type="text" maxlength="300" placeholder="Ask about GSM, lead times, capacities…" autocomplete="off" />
        <button type="submit" aria-label="Send query" class="pill-btn-emerald py-2 px-3 text-xs shrink-0 cursor-pointer">
          <i class="fa-solid fa-arrow-up text-xs"></i>
        </button>
      </form>
    </section>
  </aside>

  <div id="toast" class="fixed bottom-24 md:bottom-8 right-4 z-[80] hidden max-w-sm bg-[var(--bg-surface)] text-[var(--text-primary)] text-xs px-5 py-4 rounded-xl shadow-2xl border border-[#00E599]/40" role="status"></div>

  <script src="/static/app.js" defer></script>
  <script type="module" src="/static/firebase-app.js"></script>
</body>
</html>`
}
