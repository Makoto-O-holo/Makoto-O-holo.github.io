/* ═══════════════════════════════════════════════
   gallery.js — Photo data, filtering, lightbox
   ─────────────────────────────────────────────

   HOW TO ADD PHOTOS
   ─────────────────
   1. Place your image file in  pages/img/  (create the folder)
   2. Add an entry to the PHOTOS array below.
   3. That's it — the page rebuilds automatically.

   PHOTO ENTRY FORMAT:
   {
     src:      "img/my-photo.jpg",    // path relative to photography.html
     thumb:    "img/my-photo.jpg",    // can be same as src, or a smaller file
     title:    "作品タイトル",          // shown in overlay & lightbox
     titleEn:  "Work Title",
     date:     "YYYY.MM",
     location: "Area",                // optional
     camera:   "camera",         // optional
     tags:     ["landscape"]         // at least one from CATEGORIES keys
   }

   CATEGORIES (add/rename freely — the filter bar auto-updates):
   "all"        → すべて / All
   "landscape"  → 風景 / Landscape
   "everyday"   → 日常 / Everyday
   "light"      → 光と影 / Light & Shadow
   ═══════════════════════════════════════════════ */

/* ── CATEGORIES ── */
const CATEGORIES = {
  all:       { ja: 'すべて',    en: 'All' },
  landscape: { ja: '風景',      en: 'Landscape' },
  everyday:  { ja: '日常',      en: 'Everyday' },
  light:     { ja: '光と影',    en: 'Light & Shadow' },
};

/* ── PHOTOS ──
   Currently empty — add your photos here.
   The placeholder state is shown when this array is empty.
   ── */
const PHOTOS = [
  {
    src:      "img/reflect.jpeg",
    thumb:    "img/reflect.jpeg",   // サムネイル（同じファイルでも可）
    title:    "夜空",
    titleEn:  "The night sky",
    date:     "2021.05",
    tags:     ["light", "all"] // CATEGORIES のキーを使う
  },

  {
    src:      "img/ball.jpeg",
    thumb:    "img/ball.jpeg",   // サムネイル（同じファイルでも可）
    title:    "秩序",
    titleEn:  "Order",
    date:     "2021.01",
    tags:     ["light", "all"] // CATEGORIES のキーを使う
  }

];

/* ── STATE ── */
let activeFilter = 'all';
let lightboxIndex = 0;
let currentLang = 'ja';

/* ── RENDER FILTER BAR ── */
function renderFilterBar() {
  const inner = document.getElementById('filterInner');
  if (!inner) return;

  inner.innerHTML = Object.entries(CATEGORIES).map(([key, labels]) => {
    const count = key === 'all'
      ? PHOTOS.length
      : PHOTOS.filter(p => p.tags.includes(key)).length;
    return `
      <button
        class="filter-btn ${key === activeFilter ? 'active' : ''}"
        data-filter="${key}"
        onclick="setFilter('${key}', this)"
      >
        <span class="lang ja">${labels.ja}</span>
        <span class="lang en${currentLang === 'en' ? '' : ' hidden'}">${labels.en}</span>
        <span class="filter-count">${count}</span>
      </button>`;
  }).join('');
}

/* ── RENDER GRID ── */
function renderGrid() {
  const grid    = document.getElementById('photoGrid');
  const placeholder = document.getElementById('galleryPlaceholder');
  const filterEmpty  = document.getElementById('filterEmpty');
  if (!grid) return;

  if (PHOTOS.length === 0) {
    grid.innerHTML = '';
    if (placeholder) placeholder.style.display = 'block';
    if (filterEmpty)  filterEmpty.classList.remove('visible');
    return;
  }

  if (placeholder) placeholder.style.display = 'none';

  grid.innerHTML = PHOTOS.map((p, i) => {
    const visible = activeFilter === 'all' || p.tags.includes(activeFilter);
    return `
      <div
        class="photo-item${visible ? '' : ' hidden-by-filter'}"
        data-index="${i}"
        onclick="openLightbox(${i})"
        role="button"
        tabindex="0"
        aria-label="${p.title}"
        onkeydown="if(event.key==='Enter'||event.key===' ')openLightbox(${i})"
      >
        <img
          src="${p.thumb}"
          alt="${p.title}"
          loading="lazy"
        >
        <div class="photo-item-overlay">
          <div class="photo-item-meta">
            <div class="photo-item-title">
              <span class="lang ja">${p.title}</span>
              <span class="lang en${currentLang === 'en' ? '' : ' hidden'}">${p.titleEn || p.title}</span>
            </div>
            <div class="photo-item-info">
              ${p.date     ? `<span>${p.date}</span>` : ''}
              ${p.location ? `<span>${p.location}</span>` : ''}
            </div>
          </div>
        </div>
      </div>`;
  }).join('');

  // Show "no results" for this filter?
  const hasVisible = PHOTOS.some(p => activeFilter === 'all' || p.tags.includes(activeFilter));
  if (filterEmpty) filterEmpty.classList.toggle('visible', !hasVisible);
}

/* ── FILTER ── */
function setFilter(key, btn) {
  activeFilter = key;

  // Update button states
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === key);
  });

  // Show/hide items with a tiny fade
  document.querySelectorAll('.photo-item').forEach(item => {
    const idx  = parseInt(item.dataset.index, 10);
    const show = key === 'all' || PHOTOS[idx].tags.includes(key);
    item.classList.toggle('hidden-by-filter', !show);
  });

  const filterEmpty = document.getElementById('filterEmpty');
  const hasVisible  = PHOTOS.some(p => key === 'all' || p.tags.includes(key));
  if (filterEmpty) filterEmpty.classList.toggle('visible', PHOTOS.length > 0 && !hasVisible);
}

/* ── LIGHTBOX ── */
function openLightbox(index) {
  const filteredPhotos = activeFilter === 'all'
    ? PHOTOS
    : PHOTOS.filter(p => p.tags.includes(activeFilter));

  // Find position within filtered set
  const photo = PHOTOS[index];
  lightboxIndex = filteredPhotos.indexOf(photo);
  if (lightboxIndex === -1) lightboxIndex = 0;

  renderLightboxContent(filteredPhotos);
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function lightboxNav(dir) {
  const filteredPhotos = activeFilter === 'all'
    ? PHOTOS
    : PHOTOS.filter(p => p.tags.includes(activeFilter));

  lightboxIndex = (lightboxIndex + dir + filteredPhotos.length) % filteredPhotos.length;
  renderLightboxContent(filteredPhotos);
}

function renderLightboxContent(filteredPhotos) {
  if (filteredPhotos.length === 0) return;
  const p = filteredPhotos[lightboxIndex];

  const img = document.getElementById('lbImg');
  img.style.opacity = '0';
  img.onload = () => { img.style.opacity = '1'; };
  img.src = p.src;
  img.alt = p.title;

  document.getElementById('lbTitle').innerHTML =
    `<span class="lang ja">${p.title}</span>` +
    `<span class="lang en${currentLang === 'en' ? '' : ' hidden'}">${p.titleEn || p.title}</span>`;

  const details = [p.date, p.location, p.camera].filter(Boolean);
  document.getElementById('lbDetails').innerHTML =
    details.map(d => `<span>${d}</span>`).join('');

  document.getElementById('lbCounter').textContent =
    `${lightboxIndex + 1} / ${filteredPhotos.length}`;

  // Hide nav if only 1 photo
  const navBtns = document.querySelectorAll('.lb-nav');
  navBtns.forEach(b => b.style.display = filteredPhotos.length <= 1 ? 'none' : '');
}

/* ── KEYBOARD NAVIGATION ── */
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb || !lb.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowRight') lightboxNav(1);
  if (e.key === 'ArrowLeft')  lightboxNav(-1);
});

/* ── LANGUAGE SYNC ──
   Called from shared.js toggleLanguage to sync filter labels & titles ── */
function syncGalleryLang(newLang) {
  currentLang = newLang;
  const isEn = newLang === 'en';

  document.querySelectorAll('#filterInner .lang.ja').forEach(el => el.classList.toggle('hidden', isEn));
  document.querySelectorAll('#filterInner .lang.en').forEach(el => el.classList.toggle('hidden', !isEn));

  // Also sync lightbox title if open
  const lb = document.getElementById('lightbox');
  if (lb && lb.classList.contains('open')) {
    lb.querySelectorAll('.lang.ja').forEach(el => el.classList.toggle('hidden', isEn));
    lb.querySelectorAll('.lang.en').forEach(el => el.classList.toggle('hidden', !isEn));
  }

  // Sync grid overlays
  document.querySelectorAll('.photo-item .lang.ja').forEach(el => el.classList.toggle('hidden', isEn));
  document.querySelectorAll('.photo-item .lang.en').forEach(el => el.classList.toggle('hidden', !isEn));
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  renderFilterBar();
  renderGrid();
});
