/* ═══════════════════════════════════════════════
   shared.js — Language, theme, drawer, utilities
   Used by both index.html and photography.html
   ═══════════════════════════════════════════════ */

/* ─── LANGUAGE ─── */
let lang = 'ja';

function toggleLanguage() {
  lang = (lang === 'ja') ? 'en' : 'ja';
  applyLanguage();
}

function applyLanguage() {
  const isEn = (lang === 'en');
  document.querySelectorAll('.lang.ja').forEach(el => el.classList.toggle('hidden', isEn));
  document.querySelectorAll('.lang.en').forEach(el => el.classList.toggle('hidden', !isEn));
  document.documentElement.lang = lang;
  const btn = document.getElementById('langBtn');
  if (btn) btn.textContent = isEn ? 'JA' : 'EN';
  try { localStorage.setItem('lang', lang); } catch(e) {}
}

/* ─── THEME ─── */
function toggleTheme() {
  const isDark = document.body.dataset.theme === 'dark';
  document.body.dataset.theme = isDark ? '' : 'dark';
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = isDark ? '◑' : '◕';
  try { localStorage.setItem('theme', document.body.dataset.theme); } catch(e) {}
}

/* ─── DRAWER ─── */
function toggleDrawer() {
  const drawer = document.getElementById('navDrawer');
  const btn    = document.getElementById('hamburger');
  if (!drawer || !btn) return;
  const isOpen = drawer.classList.toggle('open');
  btn.classList.toggle('open', isOpen);
}

function closeDrawer() {
  const drawer = document.getElementById('navDrawer');
  const btn    = document.getElementById('hamburger');
  if (!drawer || !btn) return;
  drawer.classList.remove('open');
  btn.classList.remove('open');
}

// Close drawer on outside tap
document.addEventListener('click', e => {
  const drawer = document.getElementById('navDrawer');
  const btn    = document.getElementById('hamburger');
  if (!drawer || !btn) return;
  if (drawer.classList.contains('open') &&
      !drawer.contains(e.target) && !btn.contains(e.target)) {
    closeDrawer();
  }
});

/* ─── PERSISTENCE: restore on load ─── */
document.addEventListener('DOMContentLoaded', function restorePrefs() {
  try {
    const savedTheme = localStorage.getItem('theme');
    const savedLang  = localStorage.getItem('lang');

    if (savedTheme === 'dark') {
      document.body.dataset.theme = 'dark';
      const btn = document.getElementById('themeBtn');
      if (btn) btn.textContent = '◕';
    }
    if (savedLang && savedLang !== lang) {
      lang = savedLang;
      applyLanguage();
    }
  } catch(e) {}
});
