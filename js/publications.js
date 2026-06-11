/* ═══════════════════════════════════════════════
   publications.js — Data & rendering for index.html
   ─────────────────────────────────────────────
   ADD NEW PUBLICATIONS HERE:
   conferences[]  → 学会発表
   papers[]       → 論文
   awards[]       → 受賞
   ═══════════════════════════════════════════════ */

const MY_NAME = "Makoto Oikawa";

/* ── DATA ── */

const conferences = [
  {
    authors: "Hiroshi Yoshikawa, Makoto Oikawa and Takeshi Yamaguchi",
    title:   "Real-time calculation and display of 14K rainbow hologram on transmission liquid crystal panel",
    venue:   "SPIE Practical Holography XXXX",
    cite:    "Vol.13917, 1391707",
    date:    "Jan. 2026"
  },
  {
    authors: "Hiroshi Yoshikawa, Makoto Oikawa and Takeshi Yamaguchi",
    title:   "Computer-Generated Rainbow Hologram from Point Cloud Obtained by NeRF",
    venue:   "Digital Holography and Three-Dimensional Imaging (DH) 2025",
    cite:    "DTh3A.2",
    date:    "Aug. 2025"
  }
];

const papers = [
  // Example entry (remove when adding real paper):
  // {
  //   authors: "Makoto Oikawa, Hiroshi Yoshikawa and Takeshi Yamaguchi",
  //   title:   "Title of the paper",
  //   journal: "Journal Name",
  //   year:    "2026"
  // }
];

const awards = [
  { date: "2026.03", titleJa: "優等賞",        titleEn: "Excellence Award" },
  { date: "2026.03", titleJa: "応用情報工学科賞", titleEn: "Dept. Award" }
];

/* ── HELPERS ── */

function formatAuthors(authors) {
  return authors.replace(
    MY_NAME,
    `<strong style="color:var(--ink)">${MY_NAME}</strong>`
  );
}

function authorRole(authors) {
  return authors.trimStart().startsWith(MY_NAME)
    ? { label: '筆頭著者', labelEn: 'First Author', cls: 'role-first' }
    : { label: '共著',     labelEn: 'Co-Author',    cls: 'role-co'    };
}

/* ── RENDER ── */

function renderPublications() {
  const cl = document.getElementById('conference-list');
  const pl = document.getElementById('paper-list');
  const al = document.getElementById('award-list');
  if (!cl || !pl || !al) return;

  // Conference
  cl.innerHTML = conferences.length === 0
    ? '<p style="color:var(--muted);font-size:13px;padding:16px 0;">—</p>'
    : conferences.map(c => {
        const role = authorRole(c.authors);
        return `
        <div class="pub-item">
          <div class="pub-date">${c.date}</div>
          <div class="pub-content">
            <div class="pub-title-row">
              <span class="pub-title">${c.title}</span>
              <span class="role-badge ${role.cls}">
                <span class="lang ja">${role.label}</span>
                <span class="lang en hidden">${role.labelEn}</span>
              </span>
            </div>
            <div class="pub-meta">${formatAuthors(c.authors)}<br>
              <em>${c.venue}</em>, ${c.cite}
            </div>
          </div>
        </div>`;
      }).join('');

  // Papers
  pl.innerHTML = papers.length === 0
    ? '<p style="color:var(--muted);font-size:13px;padding:16px 0;">—</p>'
    : papers.map(p => {
        const role = authorRole(p.authors);
        return `
        <div class="pub-item">
          <div class="pub-date">${p.year}</div>
          <div class="pub-content">
            <div class="pub-title-row">
              <span class="pub-title">${p.title}</span>
              <span class="role-badge ${role.cls}">
                <span class="lang ja">${role.label}</span>
                <span class="lang en hidden">${role.labelEn}</span>
              </span>
            </div>
            <div class="pub-meta">${formatAuthors(p.authors)}<br>
              <em>${p.journal}</em>
            </div>
          </div>
        </div>`;
      }).join('');

  // Awards
  al.innerHTML = awards.map(a => `
    <div class="award-item">
      <span class="award-date">${a.date}</span>
      <span class="award-title">
        <span class="lang ja" style="display:block;">${a.titleJa}</span>
        <span class="lang en hidden" style="display:block;">${a.titleEn}</span>
      </span>
    </div>`).join('');
}

/* ── TABS ── */

function showPubTab(id, btn) {
  document.querySelectorAll('.pub-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.pub-tab').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', renderPublications);
