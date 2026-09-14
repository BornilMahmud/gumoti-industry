import { html, raw } from 'hono/html'

export const jobs = [
  {
    slug: 'merchandiser', title: 'Senior Merchandiser (Knitwear)', department: 'Merchandising', location: 'Dhaka Head Office',
    type: 'Full-time', experience: '3–5 years',
    summary: 'Coordinate international brand communication, sampling critical paths, lab dip approvals, and production execution.',
    responsibilities: ['Manage international buyer accounts & FOB pricing files', 'Coordinate lab dips, trim approvals and fit samples', 'Track critical path T&A schedules against shipping deadlines', 'Collaborate directly with Gazipur plant production heads'],
    requirements: ['Graduate/BSc in Textile Engineering or Merchandising', '3+ years experience in composite knitwear manufacturing', 'Fluent written and verbal English communication', 'Proficient in ERP & modern apparel workflows'],
    deadline: 'Rolling',
  },
  {
    slug: 'quality-controller', title: 'Quality Assurance Executive (Garments)', department: 'Quality Assurance', location: 'Chandra Plant, Gazipur',
    type: 'Full-time', experience: '3+ years',
    summary: 'Lead in-line and end-of-line AQL inspections across 22 sewing lines and garment finishing sections.',
    responsibilities: ['Conduct continuous in-line audits and stitch density verifications', 'Monitor root-cause analysis on reject items', 'Enforce buyer quality manuals and AQL 1.5 standards', 'Coordinate pre-shipment inspections and metal detection records'],
    requirements: ['3+ years QC experience in knit export garments', 'Comprehensive mastery of AQL standards & measurement charts', 'Strong leadership and reporting capabilities'],
    deadline: 'Rolling',
  },
  {
    slug: 'dyeing-technician', title: 'Dyeing Shift In-Charge & Lab Technician', department: 'Dyeing', location: 'Chandra Plant, Gazipur',
    type: 'Full-time', experience: '2+ years',
    summary: 'Manage computerized dye recipe formulation, spectrophotometer shade matching, and low-liquor soft-flow machines.',
    responsibilities: ['Formulate lab dip recipes on X-Rite spectrophotometer', 'Supervise high-pressure Sclavos Athena dyeing cycles', 'Audit batch continuity, fastness, and liquor ratio efficiency'],
    requirements: ['Diploma/BSc in Textile Chemistry or Wet Processing', 'Hands-on experience in cotton, CVC, and Lycra reactive dyeing'],
    deadline: 'Rolling',
  },
]

export const news = [
  {
    slug: 'composite-expansion', title: 'Gumti Textiles Upgrades High-Speed Finishing & Eco-Dyeing Systems', category: 'Manufacturing',
    date: '2026-08-28', author: 'Operations Desk',
    excerpt: 'Installation of advanced European low-liquor soft-flow vessels and automated stenter compacting lines raises daily capacity to 50T dyeing and 80T finishing.',
    body: `Gumti Textiles Ltd. has completed commissioning of upgraded wet-processing machinery at its Chandra, Gazipur manufacturing complex. The addition of latest Sclavos Athena soft-flow dyeing vessels enables ultra-low liquor ratio operations, reducing water consumption while maintaining superior dye levelness and fastness.\n\nCombined with high-efficiency Korean Ehwha stenters and Italian compacting machinery, Gumti’s total finishing throughput now stands at 80 metric tons per day, supporting expedited delivery windows for European and North American knitwear buyers.\n\nAll wastewater is processed through the plant's dedicated biological Effluent Treatment Plant (ETP), ensuring 100% compliant discharge in line with international environmental standards.`,
  },
  {
    slug: 'compliance-excellence', title: 'Gumti Reaffirms Global Accreditations: OEKO-TEX, GOTS, BCI & SEDEX', category: 'Compliance',
    date: '2026-08-15', author: 'Compliance & Audit Desk',
    excerpt: 'Comprehensive overview of Gumti Textiles’ verified standards and ethical trade memberships registered with BGMEA.',
    body: `Gumti Textiles continues to lead in responsible manufacturing practices, maintaining active memberships and accreditations across the Better Cotton Initiative (BCI), SEDEX, OEKO-TEX Standard 100, and Global Organic Textile Standard (GOTS).\n\nThese verified frameworks guarantee that fabrics manufactured at Gumti are free from harmful chemicals, sourced through sustainable cotton agricultural routes, and assembled within a socially compliant facility that prioritizes workforce welfare, female empowerment (74% female staff), and zero workplace compromise.`,
  },
  {
    slug: 'vertical-integration', title: 'The Competitive Advantage of Vertical Composite Manufacturing', category: 'Industry Insights',
    date: '2026-07-30', author: 'Merchandising Team',
    excerpt: 'Why international brands choose integrated knit composite partners over fragmented sourcing routes in Bangladesh.',
    body: `Controlling every stage from circular knitting and high-pressure dyeing to computerized sewing lines gives buyers unmatched consistency and shorter lead times. At Gumti Textiles, 22 sewing lines are synchronized with in-house knitting (10T/day) and dyeing (50T/day).\n\nThis vertical consolidation eliminates third-party transport delays, ensures single-source color consistency across dye lots, and provides global retail partners with a transparent, unified point of accountability.`,
  },
]

export const CareersPage = (dept?: string) => {
  const list = dept ? jobs.filter((j) => j.department.toLowerCase().includes(dept.toLowerCase())) : jobs
  return html`
<section class="relative bg-[var(--bg-canvas)] pt-32 pb-14 border-b border-[var(--border-subtle)] transition-colors">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <span class="kicker-pill mb-3">Talent & Manufacturing Culture</span>
    <h1 class="text-3xl sm:text-5xl lg:text-[54px] font-extrabold font-display leading-[1.06] text-[var(--text-primary)]">
      Build Your Career <span class="text-[#00E599]">in Manufacturing</span>
    </h1>
    <p class="mt-3 max-w-xl text-[var(--text-muted)] text-xs sm:text-sm leading-relaxed">
      Join 1,600 dedicated textile engineers, merchandising specialists, and garment professionals at Gumti Textiles Ltd.
    </p>
  </div>
</section>

<section class="bg-[var(--bg-canvas)] py-14 lg:py-20 min-h-[60vh] transition-colors">
  <div class="max-w-[1100px] mx-auto px-5 lg:px-10">
    <form method="get" action="/careers" class="editorial-card p-4 rounded-xl flex flex-wrap items-center gap-3 mb-8" aria-label="Filter jobs">
      <label class="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider" for="dept-filter">Filter Department:</label>
      <select id="dept-filter" name="department" class="w-full sm:w-auto rounded-xl p-2 text-xs" onchange="this.form.submit()">
        <option value="">All Departments</option>
        ${raw(['Merchandising', 'Quality Assurance', 'Dyeing'].map((d) => `<option value="${d}" ${dept === d ? 'selected' : ''}>${d}</option>`).join(''))}
      </select>
    </form>

    <div class="space-y-4">
      ${raw(list.map((j) => `
        <article class="editorial-card p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full bg-[#00E599]/15 border border-[#00E599]/30 text-[10px] font-bold text-[#00E599] uppercase tracking-wider">${j.department}</span>
              <span class="text-xs text-[var(--text-muted)]"><i class="fa-solid fa-location-dot mr-1 text-[#00D2FF]"></i>${j.location}</span>
              <span class="text-xs text-[var(--text-muted)]">·</span>
              <span class="text-xs text-[var(--text-muted)]">${j.type}</span>
              <span class="text-xs text-[var(--text-muted)]">·</span>
              <span class="text-xs text-[var(--text-muted)]">${j.experience}</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold font-display text-[var(--text-primary)] mt-1">${j.title}</h2>
            <p class="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">${j.summary}</p>
          </div>
          <a href="/careers/${j.slug}" class="shrink-0 pill-btn-emerald py-2.5 px-6 text-xs">
            <span>View & Apply</span>
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </a>
        </article>`).join('') || '<p class="text-xs text-[var(--text-muted)]">No open positions currently listed for this department.</p>')}
    </div>
  </div>
</section>`
}

export const JobDetailPage = (j: (typeof jobs)[0]) => html`
<section class="relative bg-[var(--bg-canvas)] pt-32 pb-14 border-b border-[var(--border-subtle)] transition-colors">
  <div class="max-w-[1100px] mx-auto px-5 lg:px-10">
    <nav class="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-4 flex items-center gap-2" aria-label="Breadcrumb">
      <a href="/careers" class="hover:text-[#00E599]">Careers</a>
      <span>/</span>
      <span class="text-[#00E599] font-medium">${j.title}</span>
    </nav>
    <h1 class="text-3xl sm:text-5xl font-extrabold font-display text-[var(--text-primary)]">${j.title}</h1>
    <div class="mt-4 flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
      <span class="px-3 py-1 rounded-full bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">${j.department}</span>
      <span class="px-3 py-1 rounded-full bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">${j.location}</span>
      <span class="px-3 py-1 rounded-full bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">${j.type}</span>
    </div>
  </div>
</section>

<section class="bg-[var(--bg-canvas)] py-14 lg:py-20 transition-colors">
  <div class="max-w-[1100px] mx-auto px-5 lg:px-10 grid lg:grid-cols-12 gap-10">
    
    <div class="lg:col-span-7 space-y-8">
      <div>
        <h2 class="text-xl font-bold font-display text-[var(--text-primary)]">Role Responsibilities</h2>
        <ul class="mt-4 space-y-2.5 text-xs sm:text-sm text-[var(--text-secondary)]">
          ${raw(j.responsibilities.map((r) => `<li class="flex items-start gap-2.5"><i class="fa-solid fa-check text-[#00E599] mt-1 text-xs"></i><span>${r}</span></li>`).join(''))}
        </ul>
      </div>

      <div>
        <h2 class="text-xl font-bold font-display text-[var(--text-primary)]">Qualifications & Requirements</h2>
        <ul class="mt-4 space-y-2.5 text-xs sm:text-sm text-[var(--text-secondary)]">
          ${raw(j.requirements.map((r) => `<li class="flex items-start gap-2.5"><i class="fa-solid fa-circle text-[#00D2FF] mt-1.5 text-[6px]"></i><span>${r}</span></li>`).join(''))}
        </ul>
      </div>

      <div>
        <h2 class="text-xl font-bold font-display text-[var(--text-primary)]">Workplace & Compensation</h2>
        <p class="mt-2 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
          Competitive salary based on experience, two festival bonuses, annual leave encashment, subsidized canteen, on-site medical clinic, and transport facilities per company HR policies.
        </p>
      </div>
    </div>

    <div class="lg:col-span-5">
      <div id="apply-success" class="hidden editorial-card p-8 text-center border-[#00E599]/40 mb-6">
        <div class="w-12 h-12 rounded-xl bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599] text-2xl mx-auto mb-3">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h2 class="text-xl font-bold text-[var(--text-primary)]">Application Received</h2>
        <p class="text-xs text-[var(--text-muted)] mt-1">Application reference:</p>
        <p class="text-lg font-mono font-bold text-[#00E599] mt-1" data-ref-id>—</p>
        <p class="text-xs text-[var(--text-secondary)] mt-3">Our HR recruitment team will review your qualifications.</p>
      </div>

      <form data-ajax="/api/apply" data-success="apply-success" class="editorial-card p-6 sm:p-8 space-y-4" novalidate>
        <h2 class="text-lg font-bold font-display text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-2">Apply for this Position</h2>
        <input type="hidden" name="position" value="${j.title}" />
        
        <div>
          <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5" for="a-name">Full Name *</label>
          <input id="a-name" name="name" class="w-full rounded-xl p-2.5 text-xs" required maxlength="120" placeholder="Full Name" />
        </div>
        <div>
          <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5" for="a-email">Email Address *</label>
          <input id="a-email" name="email" type="email" class="w-full rounded-xl p-2.5 text-xs" required maxlength="150" placeholder="yourname@email.com" />
        </div>
        <div>
          <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5" for="a-phone">Phone / WhatsApp *</label>
          <input id="a-phone" name="phone" type="tel" class="w-full rounded-xl p-2.5 text-xs" required pattern="[+0-9()\\-\\s]{6,20}" maxlength="20" placeholder="+880 1716 776393" />
        </div>
        <div>
          <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5" for="a-linkedin">LinkedIn / Portfolio</label>
          <input id="a-linkedin" name="linkedin" type="url" class="w-full rounded-xl p-2.5 text-xs" maxlength="200" placeholder="https://linkedin.com/in/..." />
        </div>
        <div>
          <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5" for="a-exp">Experience Summary *</label>
          <textarea id="a-exp" name="experience" rows="3" class="w-full rounded-xl p-2.5 text-xs" required maxlength="1500" placeholder="Briefly describe your RMG manufacturing background..."></textarea>
        </div>
        <div>
          <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5" for="a-edu">Education</label>
          <input id="a-edu" name="education" class="w-full rounded-xl p-2.5 text-xs" maxlength="200" placeholder="Degree / Institution" />
        </div>
        <div>
          <label class="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1.5" for="a-cover">Cover Note</label>
          <textarea id="a-cover" name="cover_letter" rows="3" class="w-full rounded-xl p-2.5 text-xs" maxlength="3000" placeholder="Why are you a good fit for this role?"></textarea>
        </div>

        <div style="position:absolute;left:-9999px" aria-hidden="true"><label>Leave blank<input name="_hp" tabindex="-1" autocomplete="off" /></label></div>

        <button type="submit" class="pill-btn-emerald w-full py-3 text-xs mt-2 cursor-pointer">
          <span>Submit Application</span>
          <i class="fa-solid fa-arrow-right text-xs"></i>
        </button>
      </form>
    </div>

  </div>
</section>`

export const NewsPage = () => html`
<section class="relative bg-[var(--bg-canvas)] pt-32 pb-14 border-b border-[var(--border-subtle)] transition-colors">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <span class="kicker-pill mb-3">Corporate & Industry Insights</span>
    <h1 class="text-3xl sm:text-5xl lg:text-[54px] font-extrabold font-display leading-[1.06] text-[var(--text-primary)]">
      News & <span class="text-[#00E599]">Announcements</span>
    </h1>
    <p class="mt-3 max-w-xl text-[var(--text-muted)] text-xs sm:text-sm leading-relaxed">
      Plant modernizations, compliance milestones, and industry perspectives from Gumti Textiles Ltd.
    </p>
  </div>
</section>

<section class="bg-[var(--bg-canvas)] py-14 lg:py-20 min-h-[60vh] transition-colors">
  <div class="max-w-[1100px] mx-auto px-5 lg:px-10 space-y-6">
    ${raw(news.map((n) => `
      <article class="editorial-card p-6 sm:p-8 group">
        <div class="flex flex-wrap items-center gap-3 text-[11px] text-[var(--text-muted)]">
          <span class="px-2.5 py-0.5 rounded-full bg-[#00E599]/15 border border-[#00E599]/30 font-bold text-[#00E599] uppercase tracking-wider">${n.category}</span>
          <time datetime="${n.date}">${new Date(n.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
          <span>·</span>
          <span>${n.author}</span>
        </div>
        <a href="/news/${n.slug}" class="block text-xl sm:text-2xl font-bold font-display text-[var(--text-primary)] mt-3 group-hover:text-[#00E599] transition-colors leading-snug">
          ${n.title}
        </a>
        <p class="text-xs sm:text-sm text-[var(--text-muted)] mt-2.5 leading-relaxed max-w-3xl">${n.excerpt}</p>
        <div class="mt-5">
          <a href="/news/${n.slug}" class="inline-flex items-center gap-2 text-xs font-bold text-[#00E599] hover:underline">
            Read Full Article <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </div>
      </article>`).join(''))}
  </div>
</section>`

export const ArticlePage = (n: (typeof news)[0]) => html`
<section class="relative bg-[var(--bg-canvas)] pt-32 pb-14 border-b border-[var(--border-subtle)] transition-colors">
  <div class="max-w-[900px] mx-auto px-5 lg:px-10">
    <nav class="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-4 flex items-center gap-2" aria-label="Breadcrumb">
      <a href="/news" class="hover:text-[#00E599]">News</a>
      <span>/</span>
      <span class="text-[#00E599] font-medium">${n.category}</span>
    </nav>
    <h1 class="text-3xl sm:text-4xl lg:text-[46px] font-extrabold font-display leading-[1.1] text-[var(--text-primary)]">${n.title}</h1>
    <div class="mt-4 flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
      <time datetime="${n.date}">${new Date(n.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
      <span>·</span>
      <span>${n.author}</span>
    </div>
  </div>
</section>

<section class="bg-[var(--bg-canvas)] py-14 lg:py-20 transition-colors">
  <article class="max-w-[800px] mx-auto px-5 lg:px-10 editorial-card p-8 sm:p-12">
    ${raw(n.body.split('\n\n').map((p) => `<p class="text-sm sm:text-base leading-relaxed text-[var(--text-secondary)] mb-6">${p}</p>`).join(''))}
    <div class="mt-10 pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
      <a href="/news" class="inline-flex items-center gap-2 text-xs font-bold text-[#00E599] hover:underline">
        <i class="fa-solid fa-arrow-left text-[10px]"></i> Back to News
      </a>
      <a href="/request-quote" class="pill-btn-emerald py-2 px-5 text-xs">Inquire with Merchandising</a>
    </div>
  </article>
</section>`
