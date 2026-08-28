import { html, raw } from 'hono/html'

// Demo job postings — clearly labeled CMS-managed content
export const jobs = [
  {
    slug: 'merchandiser', title: 'Merchandiser', department: 'Merchandising', location: 'Head Office, Dhaka',
    type: 'Full-time', experience: '2–4 years',
    summary: 'Coordinate buyer communication, sampling and order follow-up for knitwear programs.',
    responsibilities: ['Manage buyer correspondence and order files', 'Coordinate sampling, lab dips and approvals', 'Follow up production status against T&A calendars', 'Prepare costing support documentation'],
    requirements: ['Bachelor degree', '2–4 years merchandising experience in knit RMG', 'Strong written English', 'Proficiency with spreadsheets'],
    deadline: 'Rolling',
  },
  {
    slug: 'quality-controller', title: 'Quality Controller', department: 'Quality Assurance', location: 'Factory, Gazipur',
    type: 'Full-time', experience: '3+ years',
    summary: 'Run in-line and final AQL inspections across sewing and finishing sections.',
    responsibilities: ['Conduct in-line and end-of-line inspections', 'Maintain inspection records and defect analysis', 'Coordinate corrective actions with production', 'Support buyer/third-party audits'],
    requirements: ['3+ years QC experience in knit garments', 'Working knowledge of AQL sampling', 'Measurement and specification literacy'],
    deadline: 'Rolling',
  },
  {
    slug: 'dyeing-technician', title: 'Dyeing Lab Technician', department: 'Dyeing', location: 'Factory, Gazipur',
    type: 'Full-time', experience: '2+ years',
    summary: 'Support lab dip development, shade matching and bulk color reproduction.',
    responsibilities: ['Prepare lab dips against buyer standards', 'Support shade continuity control in bulk', 'Maintain lab equipment and records'],
    requirements: ['Textile engineering diploma/degree preferred', 'Experience in a dye house laboratory'],
    deadline: 'Rolling',
  },
]

export const news = [
  {
    slug: 'website-launch', title: 'Gumti Textiles Launches Its Digital B2B Platform', category: 'Company News',
    date: '2026-08-28', author: 'Corporate Communications',
    excerpt: 'A new digital platform brings Gumti\u2019s integrated manufacturing story, product catalog and RFQ workflow to international buyers.',
    body: `Gumti Textiles Ltd. has launched its corporate digital platform, giving buyers and sourcing managers direct access to the company\u2019s integrated knit-composite capabilities, publicly documented product categories, and a structured request-for-quotation workflow.\n\nThe platform reflects the company\u2019s verified public profile — established in 1993, registered with BGMEA (Reg. 2443) and the Export Promotion Bureau (Reg. 3311) — and is built to be updated through a CMS-managed data model so that company information remains accurate and verifiable.`,
  },
  {
    slug: 'compliance-standards', title: 'Our Compliance Standards: BCI, SEDEX, OEKO-TEX and GOTS', category: 'Sustainability',
    date: '2026-08-20', author: 'Compliance Team',
    excerpt: 'An overview of the standards and memberships publicly listed for Gumti Textiles by BGMEA, and what they mean for buyers.',
    body: `BGMEA public records list four standards and memberships for Gumti Textiles Ltd.: the Better Cotton Initiative (BCI), SEDEX, OEKO-TEX and the Global Organic Textile Standard (GOTS).\n\nEach framework plays a distinct role: BCI supports responsible cotton sourcing; SEDEX provides a platform for ethical supply-chain data; OEKO-TEX addresses product safety and harmful substances; and GOTS covers organic fibre processing with environmental and social criteria.\n\nCertificate numbers and validity windows are published on this site only when confirmed by Gumti management.`,
  },
  {
    slug: 'integrated-manufacturing', title: 'Why Vertical Integration Matters in Knitwear Sourcing', category: 'Manufacturing',
    date: '2026-08-10', author: 'Editorial',
    excerpt: 'Knitting, dyeing, finishing and garment production under one system — what integration means for lead time, quality and accountability.',
    body: `A knit-composite manufacturer controls the critical path of a knitwear order: fabric formation, color, finish and garment assembly. Integration shortens communication loops, keeps quality decisions inside one system, and gives buyers a single point of accountability.\n\nAt Gumti Textiles, the integrated workflow spans knitting, dyeing, finishing, garment manufacturing, quality control and packing for export — the model on which the company has operated since 1993.`,
  },
]

export const CareersPage = (dept?: string) => {
  const list = dept ? jobs.filter((j) => j.department.toLowerCase().includes(dept.toLowerCase())) : jobs
  return html`
<section class="relative bg-navy text-white pt-40 pb-16">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <p class="text-[11px] tracking-widest2 uppercase text-sand mb-5 flex items-center gap-3"><span class="w-10 h-px bg-sand inline-block"></span>Careers</p>
    <h1 class="font-serif text-4xl lg:text-[60px] leading-[1.02]">Build Your Career<br/>in Manufacturing</h1>
    <p class="mt-6 max-w-xl text-white/60 text-sm">Open positions below are demo/CMS-managed listings — final postings are published by Gumti Textiles HR.</p>
  </div>
</section>

<section class="bg-ivory py-16 lg:py-24">
  <div class="max-w-[1100px] mx-auto px-5 lg:px-10">
    <form method="get" action="/careers" class="flex flex-wrap gap-3 mb-10" aria-label="Filter jobs">
      <label class="sr-only" for="dept-filter">Filter by department</label>
      <select id="dept-filter" name="department" class="field max-w-xs" onchange="this.form.submit()">
        <option value="">All departments</option>
        ${raw(['Merchandising', 'Quality Assurance', 'Dyeing'].map((d) => `<option value="${d}" ${dept === d ? 'selected' : ''}>${d}</option>`).join(''))}
      </select>
    </form>
    <div class="space-y-5">
      ${raw(list.map((j) => `
        <article class="bg-white border border-sand/40 p-7 lg:p-9 flex flex-col lg:flex-row lg:items-center justify-between gap-5 reveal">
          <div>
            <div class="flex flex-wrap items-center gap-3 text-[10px] tracking-widest2 uppercase text-mutedgt">
              <span class="bg-sand/25 text-navy px-2.5 py-1">${j.department}</span>
              <span><i class="fa-solid fa-location-dot mr-1"></i>${j.location}</span>
              <span>${j.type}</span><span>${j.experience}</span>
            </div>
            <h2 class="font-serif text-2xl lg:text-3xl text-navy mt-3">${j.title}</h2>
            <p class="text-sm text-mutedgt mt-2 max-w-2xl">${j.summary}</p>
          </div>
          <a href="/careers/${j.slug}" class="shrink-0 inline-flex items-center gap-2 bg-navy text-white text-sm font-semibold px-7 py-3.5 hover:bg-ink transition-colors">View & Apply <i class="fa-solid fa-arrow-right text-xs"></i></a>
        </article>`).join('') || '<p class="text-mutedgt text-sm">No open positions in this department right now.</p>')}
    </div>
  </div>
</section>`
}

export const JobDetailPage = (j: (typeof jobs)[0]) => html`
<section class="relative bg-navy text-white pt-40 pb-16">
  <div class="max-w-[1100px] mx-auto px-5 lg:px-10">
    <nav class="text-[11px] tracking-widest uppercase text-white/50 mb-6" aria-label="Breadcrumb"><a href="/careers" class="hover:text-sand">Careers</a> <span class="mx-2">/</span> <span class="text-sand">${j.title}</span></nav>
    <h1 class="font-serif text-4xl lg:text-[56px]">${j.title}</h1>
    <div class="mt-5 flex flex-wrap gap-4 text-xs tracking-widest uppercase text-white/60">
      <span class="bg-white/10 px-3 py-1.5">${j.department}</span>
      <span class="bg-white/10 px-3 py-1.5">${j.location}</span>
      <span class="bg-white/10 px-3 py-1.5">${j.type}</span>
      <span class="bg-white/10 px-3 py-1.5">Deadline: ${j.deadline}</span>
    </div>
  </div>
</section>

<section class="bg-ivory py-16 lg:py-24">
  <div class="max-w-[1100px] mx-auto px-5 lg:px-10 grid lg:grid-cols-12 gap-12">
    <div class="lg:col-span-7">
      <h2 class="font-serif text-2xl text-navy">Responsibilities</h2>
      <ul class="mt-4 space-y-2.5 text-sm text-ink/75">
        ${raw(j.responsibilities.map((r) => `<li class="flex gap-3"><i class="fa-solid fa-check text-sand mt-1"></i>${r}</li>`).join(''))}
      </ul>
      <h2 class="font-serif text-2xl text-navy mt-10">Requirements</h2>
      <ul class="mt-4 space-y-2.5 text-sm text-ink/75">
        ${raw(j.requirements.map((r) => `<li class="flex gap-3"><i class="fa-solid fa-circle-dot text-sand mt-1 text-[8px]"></i>${r}</li>`).join(''))}
      </ul>
      <h2 class="font-serif text-2xl text-navy mt-10">Benefits</h2>
      <p class="mt-3 text-sm text-mutedgt">Compensation and benefits per company policy — details confirmed by Gumti Textiles HR during the interview process.</p>
    </div>
    <div class="lg:col-span-5">
      <div id="apply-success" class="hidden bg-white border-l-4 border-emerald-600 p-8 text-center">
        <i class="fa-solid fa-circle-check text-emerald-600 text-3xl"></i>
        <h2 class="font-serif text-2xl text-navy mt-4">Application Received</h2>
        <p class="text-mutedgt text-sm mt-2">Reference:</p>
        <p class="font-serif text-2xl text-navy mt-1" data-ref-id>—</p>
      </div>
      <form data-ajax="/api/apply" data-success="apply-success" class="bg-white border border-sand/40 p-8 space-y-5" novalidate>
        <h2 class="font-serif text-2xl text-navy">Apply for this Position</h2>
        <input type="hidden" name="position" value="${j.title}" />
        <div><label class="field-label" for="a-name">Name *</label><input id="a-name" name="name" class="field" required maxlength="120" /></div>
        <div><label class="field-label" for="a-email">Email *</label><input id="a-email" name="email" type="email" class="field" required maxlength="150" /></div>
        <div><label class="field-label" for="a-phone">Phone *</label><input id="a-phone" name="phone" type="tel" class="field" required pattern="[+0-9()\\-\\s]{6,20}" maxlength="20" /></div>
        <div><label class="field-label" for="a-linkedin">LinkedIn (optional)</label><input id="a-linkedin" name="linkedin" type="url" class="field" maxlength="200" placeholder="https://linkedin.com/in/…" /></div>
        <div><label class="field-label" for="a-exp">Experience Summary *</label><textarea id="a-exp" name="experience" rows="3" class="field" required maxlength="1500"></textarea></div>
        <div><label class="field-label" for="a-edu">Education</label><input id="a-edu" name="education" class="field" maxlength="200" /></div>
        <div><label class="field-label" for="a-cover">Cover Letter</label><textarea id="a-cover" name="cover_letter" rows="4" class="field" maxlength="3000"></textarea></div>
        <p class="text-[11px] text-mutedgt"><i class="fa-solid fa-paperclip mr-1"></i> CV/portfolio files can be emailed after submission, quoting your application reference.</p>
        <div style="position:absolute;left:-9999px" aria-hidden="true"><label>Leave blank<input name="_hp" tabindex="-1" autocomplete="off" /></label></div>
        <button type="submit" class="w-full bg-navy text-white font-semibold px-8 py-4 text-sm tracking-wide hover:bg-ink transition-colors cursor-pointer">Submit Application</button>
      </form>
    </div>
  </div>
</section>`

export const NewsPage = () => html`
<section class="relative bg-navy text-white pt-40 pb-16">
  <div class="max-w-[1440px] mx-auto px-5 lg:px-10">
    <p class="text-[11px] tracking-widest2 uppercase text-sand mb-5 flex items-center gap-3"><span class="w-10 h-px bg-sand inline-block"></span>News & Insights</p>
    <h1 class="font-serif text-4xl lg:text-[60px]">From the Company</h1>
  </div>
</section>
<section class="bg-ivory py-16 lg:py-24">
  <div class="max-w-[1100px] mx-auto px-5 lg:px-10 space-y-6">
    ${raw(news.map((n) => `
      <article class="bg-white border border-sand/40 p-8 lg:p-10 reveal">
        <div class="flex flex-wrap items-center gap-4 text-[10px] tracking-widest2 uppercase text-mutedgt">
          <span class="bg-sand/25 text-navy px-2.5 py-1">${n.category}</span>
          <time datetime="${n.date}">${new Date(n.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
          <span>${n.author}</span>
        </div>
        <a href="/news/${n.slug}" class="block font-serif text-2xl lg:text-4xl text-navy mt-4 hover:text-sand transition-colors leading-tight">${n.title}</a>
        <p class="text-sm text-mutedgt mt-3 max-w-3xl leading-relaxed">${n.excerpt}</p>
        <a href="/news/${n.slug}" class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy border-b border-sand pb-0.5 hover:text-sand transition-colors">Read Article <i class="fa-solid fa-arrow-right text-xs"></i></a>
      </article>`).join(''))}
  </div>
</section>`

export const ArticlePage = (n: (typeof news)[0]) => html`
<section class="relative bg-navy text-white pt-40 pb-16">
  <div class="max-w-[900px] mx-auto px-5 lg:px-10">
    <nav class="text-[11px] tracking-widest uppercase text-white/50 mb-6" aria-label="Breadcrumb"><a href="/news" class="hover:text-sand">News</a> <span class="mx-2">/</span> <span class="text-sand">${n.category}</span></nav>
    <h1 class="font-serif text-3xl lg:text-[52px] leading-[1.05]">${n.title}</h1>
    <div class="mt-6 flex flex-wrap gap-5 text-xs tracking-widest uppercase text-white/50">
      <time datetime="${n.date}">${new Date(n.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
      <span>${n.author}</span>
    </div>
  </div>
</section>
<section class="bg-ivory py-16 lg:py-24">
  <article class="max-w-[760px] mx-auto px-5 lg:px-10">
    ${raw(n.body.split('\n\n').map((p) => `<p class="text-base lg:text-lg leading-relaxed text-ink/80 mb-6">${p}</p>`).join(''))}
    <div class="mt-10 pt-8 border-t border-sand/50 flex flex-wrap items-center justify-between gap-4">
      <a href="/news" class="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-sand"><i class="fa-solid fa-arrow-left text-xs"></i> All News</a>
      <div class="flex gap-3 text-mutedgt">
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=" class="hover:text-navy" aria-label="Share on LinkedIn"><i class="fa-brands fa-linkedin text-lg"></i></a>
        <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(n.title)}" class="hover:text-navy" aria-label="Share on X"><i class="fa-brands fa-x-twitter text-lg"></i></a>
      </div>
    </div>
  </article>
</section>`
