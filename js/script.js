/* =============================================
   LA VIDA DEL COLOR · MODA ECCI
   JavaScript
   ============================================= */

'use strict';

/* ---- CUSTOM CURSOR ---- */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

if (cursorDot && cursorRing) {
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.left  = mouseX + 'px';
    cursorDot.style.top   = mouseY + 'px';
  });

  document.addEventListener('mousedown', () => cursorDot.classList.add('clicking'));
  document.addEventListener('mouseup',   () => cursorDot.classList.remove('clicking'));

  (function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursor);
  })();

  document.querySelectorAll('a, button, .gallery-item, .pantone-chip, .harmony-card, .glos-card, .reason-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  });
}

/* ---- NAVBAR SCROLL ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ---- MOBILE MENU ---- */
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  burger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ---- SCROLL REVEAL ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---- CANVAS COLOR WHEEL ---- */
function drawColorWheel() {
  const canvas = document.getElementById('colorWheel');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = canvas.offsetWidth * window.devicePixelRatio || 600;
  canvas.width = size;
  canvas.height = size;
  const cx = size / 2, cy = size / 2, r = size / 2 - 4;

  for (let angle = 0; angle < 360; angle += 0.5) {
    const startAngle = (angle - 1) * Math.PI / 180;
    const endAngle   = (angle + 1) * Math.PI / 180;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    gradient.addColorStop(0, `hsla(${angle}, 0%, 100%, 0)`);
    gradient.addColorStop(0.3, `hsla(${angle}, 50%, 85%, 1)`);
    gradient.addColorStop(0.7, `hsla(${angle}, 90%, 55%, 1)`);
    gradient.addColorStop(1, `hsla(${angle}, 100%, 30%, 1)`);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  // center fade
  const fade = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.3);
  fade.addColorStop(0, 'rgba(10,10,15,0.9)');
  fade.addColorStop(1, 'rgba(10,10,15,0)');
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, size, size);
}

drawColorWheel();
window.addEventListener('resize', drawColorWheel, { passive: true });

/* ---- ROTATING COLOR WHEEL (hover interaction) ---- */
let wheelAngle = 0;
const wheelEl  = document.getElementById('colorWheel');
if (wheelEl) {
  (function rotateWheel() {
    wheelAngle += 0.05;
    wheelEl.style.transform = `translateY(-50%) rotate(${wheelAngle}deg)`;
    requestAnimationFrame(rotateWheel);
  })();

  wheelEl.parentElement.addEventListener('mousemove', e => {
    const rect = wheelEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    wheelEl.style.transform = `translateY(-50%) rotate(${wheelAngle}deg) scale(${1 + Math.abs(dx) * 0.04})`;
  });
}

/* ---- LANGUAGE TOGGLE ---- */
let currentLang = 'es';
const langToggle = document.getElementById('langToggle');

function applyLang(lang) {
  currentLang = lang;
  langToggle.textContent = lang === 'es' ? 'EN' : 'ES';

  document.querySelectorAll('[data-es]').forEach(el => {
    const text = el.dataset[lang];
    if (text) el.textContent = text;
  });

  // placeholder
  const search = document.getElementById('glossarySearch');
  if (search) {
    search.placeholder = search.dataset[`placeholder${lang === 'es' ? 'Es' : 'En'}`] || 'Search...';
  }
}

langToggle.addEventListener('click', () => {
  const next = currentLang === 'es' ? 'en' : 'es';
  langToggle.classList.add('switching');
  setTimeout(() => { applyLang(next); langToggle.classList.remove('switching'); }, 150);
});

/* ---- GALLERY — FILE UPLOAD ---- */
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightboxImg');
const lightboxClose= document.getElementById('lightboxClose');

document.querySelectorAll('.gallery-item').forEach(item => {
  const input       = item.querySelector('.gallery-input');
  const placeholder = item.querySelector('.gallery-placeholder');
  const img         = item.querySelector('.gallery-img');

  // file chosen
  input.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      img.src = ev.target.result;
      img.alt = file.name;
      img.classList.remove('hidden');
      placeholder.style.display = 'none';
      item.style.borderStyle = 'solid';
      item.style.borderColor = 'var(--gold)';
      item.dataset.hasImage = '1';
    };
    reader.readAsDataURL(file);
  });

  // click to open lightbox if image loaded
  item.addEventListener('click', e => {
    if (e.target === input) return;
    if (item.dataset.hasImage === '1') {
      lightboxImg.src = img.src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

/* ---- GLOSSARY SEARCH ---- */
const glossarySearch = document.getElementById('glossarySearch');
if (glossarySearch) {
  glossarySearch.addEventListener('input', () => {
    const q = glossarySearch.value.toLowerCase().trim();
    document.querySelectorAll('.glos-card').forEach(card => {
      const term = (card.dataset.term || '') + ' ' + (card.dataset.termEn || '');
      const text = card.textContent.toLowerCase();
      const match = !q || term.toLowerCase().includes(q) || text.includes(q);
      card.classList.toggle('hidden', !match);
    });
  });
}

/* ---- PANTONE CHIP TOOLTIP ---- */
document.querySelectorAll('.pantone-chip').forEach(chip => {
  chip.addEventListener('mouseenter', () => {
    chip.style.zIndex = 10;
  });
  chip.addEventListener('mouseleave', () => {
    chip.style.zIndex = '';
  });
});

/* ---- SMOOTH ACTIVE NAV LINK ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        const active = a.getAttribute('href') === '#' + entry.target.id;
        a.style.color = active ? 'var(--gold)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ---- HARMONY CARD TILT ---- */
document.querySelectorAll('.harmony-card, .reason-card, .identity-item').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-5px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ---- RULE BARS ANIMATE ON SCROLL ---- */
const ruleObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar-fill').forEach(bar => {
        const target = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = target; }, 100);
      });
      ruleObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const ruleSection = document.querySelector('.rule-section');
if (ruleSection) ruleObs.observe(ruleSection);

/* ---- HERO PARALLAX ---- */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && scrollY < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
    heroContent.style.opacity = 1 - scrollY / (window.innerHeight * 0.7);
  }
}, { passive: true });

/* ---- TICKER PAUSE ON HOVER ---- */
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack) {
  tickerTrack.parentElement.addEventListener('mouseenter', () => {
    tickerTrack.style.animationPlayState = 'paused';
  });
  tickerTrack.parentElement.addEventListener('mouseleave', () => {
    tickerTrack.style.animationPlayState = 'running';
  });
}

/* ---- GLOSSARY CARD ENTRANCE STAGGER ---- */
const glossObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.glos-card');
      cards.forEach((c, i) => {
        c.style.opacity = '0';
        c.style.transform = 'translateY(20px)';
        c.style.transition = `opacity 0.5s ${i * 0.05}s, transform 0.5s ${i * 0.05}s`;
        setTimeout(() => {
          c.style.opacity = '1';
          c.style.transform = 'translateY(0)';
        }, 100 + i * 50);
      });
      glossObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

const glossaryGrid = document.getElementById('glossaryGrid');
if (glossaryGrid) glossObs.observe(glossaryGrid);
