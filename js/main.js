/* ===================================================
   WEDDING INVITATION — Awen & Rudi
   main.js
   =================================================== */

/* ===================================================
   1. ENVELOPE OPEN ANIMATION
   =================================================== */
function openEnvelope() {
  const envelope = document.getElementById('envelope');
  const btn      = document.getElementById('open-btn');

  envelope.classList.add('open');
  btn.disabled = true;
  btn.style.opacity = '0.5';

  // Step 1: flap opens (900ms), then fade wrapper out (800ms), then show content
  setTimeout(() => {
    const wrapper = document.getElementById('envelope-wrapper');
    wrapper.classList.add('closing');

    // Step 2: after fade-out, hide wrapper and unlock scroll RELIABLY
    setTimeout(() => {
      wrapper.style.display = 'none';
      // Always unlock scroll here — no relying on transitionend
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      showMainContent();
    }, 850); // slightly longer than CSS transition (0.8s)
  }, 900);
}

function showMainContent() {
  const main = document.getElementById('main-content');

  // Remove hidden class — CSS sets display:none on .hidden
  main.classList.remove('hidden');

  // Force a reflow so the browser registers the display change before animating
  main.offsetHeight;

  main.classList.add('visible');

  // Auto-play music
  setTimeout(() => {
    const audio = document.getElementById('bg-music');
    audio.play().catch(() => {
      // Autoplay blocked — user can click play button
    });
    updateMusicUI(true);
  }, 600);

  // Init scroll reveal after content is painted
  setTimeout(initReveal, 150);
}

/* ===================================================
   2. SCROLL REVEAL
   =================================================== */
function initReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ===================================================
   3. MUSIC PLAYER
   =================================================== */
let isPlaying = false;

function toggleMusic() {
  const audio = document.getElementById('bg-music');
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play().catch(() => {});
  }
  isPlaying = !isPlaying;
  updateMusicUI(isPlaying);
}

function updateMusicUI(playing) {
  isPlaying = playing;
  const iconPlay  = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  const label     = document.getElementById('music-label');

  if (playing) {
    iconPlay.style.display  = 'none';
    iconPause.style.display = 'block';
    label.textContent = '♪ Memutar Musik';
  } else {
    iconPlay.style.display  = 'block';
    iconPause.style.display = 'none';
    label.textContent = '♪ Putar Musik';
  }
}

// Sync UI when audio ends or pauses externally
document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-music');
  if (audio) {
    audio.addEventListener('pause', () => updateMusicUI(false));
    audio.addEventListener('play',  () => updateMusicUI(true));
  }
});

/* ===================================================
   4. COUNTDOWN TIMER
   =================================================== */
function startCountdown() {
  // Tanggal pernikahan — sesuaikan di sini
  const weddingDate = new Date('2025-06-14T08:00:00');

  function update() {
    const now  = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent  = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-mins').textContent  = '00';
      document.getElementById('cd-secs').textContent  = '00';
      // Show congratulation message
      const wrap = document.querySelector('.countdown-label');
      if (wrap) wrap.textContent = '🎊 Hari Bahagia Telah Tiba!';
      return;
    }

    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs  = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent  = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-mins').textContent  = String(mins).padStart(2, '0');
    document.getElementById('cd-secs').textContent  = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

startCountdown();

/* ===================================================
   5. COPY REKENING
   =================================================== */
function copyText(elementId, btn) {
  const text = document.getElementById(elementId).textContent.trim();

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => showCopied(btn));
  } else {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showCopied(btn);
  }
}

function showCopied(btn) {
  const original = btn.innerHTML;
  btn.classList.add('copied');
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Tersalin!';
  setTimeout(() => {
    btn.classList.remove('copied');
    btn.innerHTML = original;
  }, 2200);
}

/* ===================================================
   6. WISHES / GUESTBOOK
   =================================================== */
const STORAGE_KEY = 'wedding_wishes_awen_rudi';

function loadWishes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveWishes(wishes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
  } catch {}
}

function renderWishes() {
  const wishes  = loadWishes();
  const list    = document.getElementById('wish-list');
  if (!list) return;

  if (wishes.length === 0) {
    list.innerHTML = '<p style="text-align:center;color:rgba(250,247,242,0.3);font-size:0.85rem;padding:20px 0;">Jadilah yang pertama mengucapkan selamat 💕</p>';
    return;
  }

  list.innerHTML = wishes.slice().reverse().map(w => `
    <div class="wish-item">
      <p class="wish-item-name">❤ ${escapeHtml(w.name)}</p>
      <p class="wish-item-text">${escapeHtml(w.text)}</p>
      <p class="wish-item-time">${w.time}</p>
    </div>
  `).join('');
}

function addWish() {
  const nameEl = document.getElementById('wish-name');
  const textEl = document.getElementById('wish-text');

  const name = nameEl.value.trim();
  const text = textEl.value.trim();

  if (!name) { shake(nameEl); return; }
  if (!text)  { shake(textEl); return; }

  const wishes = loadWishes();
  wishes.push({
    name,
    text,
    time: new Date().toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  });

  saveWishes(wishes);
  renderWishes();

  nameEl.value = '';
  textEl.value = '';

  // Scroll to wish list
  document.getElementById('wish-list').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function shake(el) {
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.border = '1px solid #E05A7A';
  setTimeout(() => {
    el.style.border = '1px solid rgba(201,168,76,0.25)';
  }, 1200);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Initial render
renderWishes();

/* ===================================================
   7. GALLERY LIGHTBOX
   =================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const items    = document.querySelectorAll('.gallery-item img');
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lb-img');

  items.forEach(img => {
    img.addEventListener('click', () => {
      lbImg.src = img.src;
      lightbox.classList.add('open');
    });
  });
});

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

/* ===================================================
   8. LOCK SCROLL on envelope, unlock reliably on open
   =================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('envelope-wrapper');
  if (wrapper) {
    // Lock scroll while envelope is shown
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  // Safety net: if somehow still locked after 10s, force unlock
  setTimeout(() => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }, 10000);
});