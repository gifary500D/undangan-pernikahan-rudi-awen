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

  setTimeout(() => {
    const wrapper = document.getElementById('envelope-wrapper');
    wrapper.classList.add('closing');

    setTimeout(() => {
      wrapper.style.display = 'none';
      // Always unlock scroll reliably here
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      showMainContent();
    }, 850);
  }, 900);
}

function showMainContent() {
  const main = document.getElementById('main-content');
  main.classList.remove('hidden');
  main.offsetHeight; // force reflow
  main.classList.add('visible');

  // Auto-play music
  setTimeout(() => {
    const audio = document.getElementById('bg-music');
    audio.play().catch(() => {});
    updateMusicUI(true);
  }, 600);

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
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  elements.forEach(el => observer.observe(el));
}

/* ===================================================
   3. MUSIC PLAYER
   =================================================== */
let isPlaying = false;

function toggleMusic() {
  const audio = document.getElementById('bg-music');
  if (isPlaying) { audio.pause(); } else { audio.play().catch(() => {}); }
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

document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-music');
  if (audio) {
    audio.addEventListener('pause', () => updateMusicUI(false));
    audio.addEventListener('play',  () => updateMusicUI(true));
  }
});

/* ===================================================
   4. COUNTDOWN TIMER — 4 Juli 2026 08:00 WIB (UTC+7)
   =================================================== */
function startCountdown() {
  // UTC+7 = UTC+420 menit. 4 Juli 2026 08:00 WIB = 4 Juli 2026 01:00 UTC
  const weddingDate = new Date('2026-07-04T01:00:00Z');

  function update() {
    const now  = new Date();
    const diff = weddingDate - now;

    const labelEl = document.querySelector('.countdown-label');

    if (diff <= 0) {
      document.getElementById('cd-days').textContent  = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-mins').textContent  = '00';
      document.getElementById('cd-secs').textContent  = '00';
      if (labelEl) labelEl.textContent = '🎊 Hari Bahagia Telah Tiba!';
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
6. UCAPAN VIA WHATSAPP
=================================================== */

function sendWhatsApp() {

const nama = document.getElementById('rsvp-name').value.trim();
const pesan = document.getElementById('rsvp-message').value.trim();

if (!nama) {
alert('Silakan isi nama terlebih dahulu');
return;
}

if (!pesan) {
alert('Silakan tulis ucapan atau doa');
return;
}

const text =
`Assalamu'alaikum

Saya *${nama}* ingin menyampaikan ucapan:

${pesan}

Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. 🤍`;

const nomorWA = "6281260609351"; 

window.open(
`https://wa.me/${nomorWA}?text=${encodeURIComponent(text)}`,
'_blank'
);
}


/* ===================================================
   7. GALLERY LIGHTBOX
   =================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lb-img');

  document.querySelectorAll('.gallery-item img').forEach(img => {
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
   8. SCROLL LOCK — lock on load, unlock after open
   =================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('envelope-wrapper');
  if (wrapper) {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }
  // Safety net: force-unlock after 10s if somehow stuck
  setTimeout(() => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }, 10000);
});