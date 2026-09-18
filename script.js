/* ========== INIT ========== */
(async () => {
  await loadRemoteConfig();
  initApp();
})();

function initApp() {
  // Set nama & content
  document.getElementById('coverGroom').textContent = CONFIG.groom;
  document.getElementById('coverBride').textContent = CONFIG.bride;
  document.getElementById('groomName').textContent = CONFIG.groom;
  document.getElementById('brideName').textContent = CONFIG.bride;
  document.title = `囍 ${CONFIG.groom} & ${CONFIG.bride} 囍`;

  // Guest name dari URL
  const params = new URLSearchParams(window.location.search);
  const guest = params.get('to');
  if (guest) {
    document.getElementById('guestName').textContent =
      decodeURIComponent(guest.replace(/\+/g, ' '));
  }

  // Video
  if (CONFIG.videoId) {
    document.getElementById('videoIframe').src =
      `https://www.youtube.com/embed/${CONFIG.videoId}?rel=0&modestbranding=1`;
  }

  // Map
  if (CONFIG.mapEmbedUrl) {
    document.getElementById('mapIframe').src = CONFIG.mapEmbedUrl;
  }

  // Render gallery
  renderGallery();

  // Render events
  renderEvents();

  // Init lainnya
  initPetals();
  initCountdown();
  initWishes();
  initScrollReveal();
}

// Preloader
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('preloader').classList.add('hide'), 1800);
});
document.body.style.overflow = 'hidden';

/* ========== PETALS ========== */
function initPetals() {
  const canvas = document.getElementById('petalsCanvas');
  const ctx = canvas.getContext('2d');
  let petals = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Petal {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : -20;
      this.size = 6 + Math.random() * 8;
      this.speedY = 0.5 + Math.random() * 1.2;
      this.speedX = -0.5 + Math.random();
      this.rotation = Math.random() * 360;
      this.rotSpeed = -0.5 + Math.random();
      this.opacity = 0.3 + Math.random() * 0.4;
      this.type = Math.random() > 0.6 ? 'gold' : 'petal';
      this.hue = this.type === 'gold'
        ? `hsl(${40 + Math.random() * 15}, 80%, ${60 + Math.random() * 20}%)`
        : `hsl(${350 + Math.random() * 15}, 70%, ${55 + Math.random() * 15}%)`;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y / 60) * 0.4;
      this.rotation += this.rotSpeed;
      if (this.y > canvas.height + 20) this.reset();
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation * Math.PI / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.hue;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.hue;
      if (this.type === 'petal') {
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.35, this.size, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < 35; i++) petals.push(new Petal());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ========== CONFETTI ========== */
const confettiCanvas = document.getElementById('confettiCanvas');
const confettiCtx = confettiCanvas.getContext('2d');
function resizeConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeConfetti();
window.addEventListener('resize', resizeConfetti);

let confettiParticles = [];
function launchConfetti() {
  const colors = ['#d4af37', '#ffd700', '#f6e27a', '#a01c1c', '#6b0a0a', '#fff8dc'];
  for (let i = 0; i < 180; i++) {
    const side = Math.random() > 0.5 ? 'left' : 'right';
    const startX = side === 'left' ? -10 : confettiCanvas.width + 10;
    const angle = side === 'left'
      ? (Math.random() * 30 + 20) * Math.PI / 180
      : (Math.random() * 30 + 130) * Math.PI / 180;
    confettiParticles.push({
      x: startX, y: Math.random() * confettiCanvas.height * 0.5,
      vx: Math.cos(angle) * (8 + Math.random() * 8),
      vy: Math.sin(angle) * (8 + Math.random() * 8) - 4,
      size: 6 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: -8 + Math.random() * 16,
      gravity: 0.3, drag: 0.98, life: 1
    });
  }
}

function animateConfetti() {
  if (confettiParticles.length === 0) {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    return;
  }
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiParticles = confettiParticles.filter(p => {
    p.vx *= p.drag;
    p.vy = p.vy * p.drag + p.gravity;
    p.x += p.vx; p.y += p.vy;
    p.rotation += p.rotSpeed;
    p.life -= 0.005;
    if (p.life <= 0 || p.y > confettiCanvas.height + 30) return false;
    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rotation * Math.PI / 180);
    confettiCtx.globalAlpha = p.life;
    confettiCtx.fillStyle = p.color;
    confettiCtx.shadowBlur = 10;
    confettiCtx.shadowColor = p.color;
    confettiCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    confettiCtx.restore();
    return true;
  });
  requestAnimationFrame(animateConfetti);
}

/* ========== FIREWORKS ========== */
const fwCanvas = document.getElementById('fireworksCanvas');
const fwCtx = fwCanvas.getContext('2d');
let fwParticles = [], fwRunning = false;
function resizeFw() {
  fwCanvas.width = window.innerWidth;
  fwCanvas.height = window.innerHeight;
}
resizeFw();
window.addEventListener('resize', resizeFw);

function createFirework(x, y) {
  const colors = ['#d4af37', '#ffd700', '#f6e27a', '#ff6b6b', '#ffd93d'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  for (let i = 0; i < 50; i++) {
    const angle = (i / 50) * Math.PI * 2;
    const speed = 2 + Math.random() * 4;
    fwParticles.push({
      x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      size: 2 + Math.random() * 2, color, alpha: 1,
      decay: 0.015 + Math.random() * 0.015
    });
  }
}
function animateFw() {
  fwCtx.fillStyle = 'rgba(0,0,0,0.15)';
  fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);
  fwParticles = fwParticles.filter(p => {
    p.x += p.vx; p.y += p.vy;
    p.vy += 0.05; p.vx *= 0.98; p.vy *= 0.98;
    p.alpha -= p.decay;
    if (p.alpha <= 0) return false;
    fwCtx.globalAlpha = p.alpha;
    fwCtx.fillStyle = p.color;
    fwCtx.shadowBlur = 15; fwCtx.shadowColor = p.color;
    fwCtx.beginPath(); fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2); fwCtx.fill();
    return true;
  });
  if (fwParticles.length > 0) requestAnimationFrame(animateFw);
  else { fwRunning = false; fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height); }
}
function launchFireworks(duration = 3000) {
  const start = Date.now();
  const interval = setInterval(() => {
    if (Date.now() - start > duration) { clearInterval(interval); return; }
    createFirework(Math.random() * fwCanvas.width * 0.8 + fwCanvas.width * 0.1,
                    Math.random() * fwCanvas.height * 0.5 + 50);
  }, 400);
  if (!fwRunning) { fwRunning = true; animateFw(); }
}

/* ========== OPEN INVITATION ========== */
function openInvitation() {
  const cover = document.getElementById('cover');
  cover.classList.add('hide');
  document.getElementById('mainContent').classList.remove('hidden');
  document.body.style.overflow = 'auto';
  setTimeout(() => { launchConfetti(); animateConfetti(); }, 200);
  setTimeout(() => launchFireworks(4000), 400);
  playMusic();
  setTimeout(() => { cover.style.display = 'none'; }, 1100);
}

/* ========== COUNTDOWN ========== */
function initCountdown() {
  const wd = new Date(CONFIG.weddingDate).getTime();
  function update() {
    const diff = wd - Date.now();
    if (diff < 0) {
      document.getElementById('countdown').innerHTML =
        '<p style="font-size:1.2rem;color:#f6e27a;padding:1rem">囍 百年好合 · Kami telah menikah 囍</p>';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('days').textContent = String(d).padStart(2, '0');
    document.getElementById('hours').textContent = String(h).padStart(2, '0');
    document.getElementById('minutes').textContent = String(m).padStart(2, '0');
    document.getElementById('seconds').textContent = String(s).padStart(2, '0');
  }
  setInterval(update, 1000);
  update();
}

/* ========== MUSIC ========== */
const music = document.getElementById('bgMusic');
const musicPlayer = document.getElementById('musicPlayer');
const musicBtn = document.getElementById('musicBtn');

function playMusic() {
  music.play().then(() => {
    musicPlayer.classList.add('playing');
    musicBtn.textContent = '❚❚';
  }).catch(() => console.log('Autoplay diblokir'));
}
function toggleMusic() {
  if (music.paused) {
    music.play();
    musicPlayer.classList.add('playing');
    musicBtn.textContent = '❚❚';
  } else {
    music.pause();
    musicPlayer.classList.remove('playing');
    musicBtn.textContent = '▶';
  }
}

/* ========== COPY ========== */
function copyText(text, btn) {
  const doCopy = () => {
    showToast('✓ Berhasil disalin!');
    if (btn) {
      const original = btn.innerHTML;
      btn.classList.add('copied');
      btn.innerHTML = '<span>✓ Tersalin</span>';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = original;
      }, 2000);
    }
  };
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(doCopy)
      .catch(() => fallbackCopy(text, doCopy));
  } else fallbackCopy(text, doCopy);
}
function fallbackCopy(text, cb) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); cb(); } catch(e) { alert('Gagal menyalin'); }
  ta.remove();
}

/* ========== TOAST ========== */
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, 2500);
}

/* ========== GALLERY ========== */
let currentLbIndex = 0;
function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  grid.innerHTML = '';
  CONFIG.gallery.forEach((src, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.onclick = () => openLightbox(i);
    item.innerHTML = `<img src="${src}" alt="Gallery ${i+1}" loading="lazy" onerror="this.src='assets/cover.jpg'">`;
    grid.appendChild(item);
  });
}
function openLightbox(i) {
  currentLbIndex = i;
  document.getElementById('lightboxImg').src = CONFIG.gallery[i];
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(e) {
  if (e && e.target.id !== 'lightbox' && !e.target.classList.contains('lightbox-close')) return;
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = 'auto';
}
function lightboxNav(e, dir) {
  e.stopPropagation();
  currentLbIndex = (currentLbIndex + dir + CONFIG.gallery.length) % CONFIG.gallery.length;
  document.getElementById('lightboxImg').src = CONFIG.gallery[currentLbIndex];
}
document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox({ target: { id: 'lightbox' } });
  if (e.key === 'ArrowLeft') lightboxNav({ stopPropagation: () => {} }, -1);
  if (e.key === 'ArrowRight') lightboxNav({ stopPropagation: () => {} }, 1);
});

/* ========== EVENTS ========== */
function renderEvents() {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;
  const events = CONFIG.events || [
    { icon: '💍', title: 'Tea Ceremony & Akad', chinese: '敬茶儀式', day: 'Rabu', date: '30 September 2026',
      time: '09:00 WIB — 12:00 WIB', place: 'Kediaman Mempelai Pria dan Wanita', address: 'Jl. Pulau Bangka Gg. Walet No.3A (Dewa Ruci), Medan' },
    { icon: '🐉', title: 'Resepsi & Makan Malam', chinese: '喜宴', day: 'Rabu', date: '30 September 2026',
      time: '17:00 — Selesai', place: 'Kediaman Mempelai Pria', address: 'Jl. Pulau Bangka Gg. Walet No.3A (Dewa Ruci), Medan'}
  ];
  grid.innerHTML = events.map(ev => `
    <div class="event-card-luxury${ev.wide ? ' wide' : ''}">
      <div class="event-card-inner">
        <div class="event-icon-wrap"><div class="event-icon">${ev.icon}</div></div>
        <h3 class="event-title">${ev.title}</h3>
        <p class="event-title-chinese">${ev.chinese}</p>
        <div class="event-divider"></div>
        <p class="event-day">${ev.day}</p>
        <p class="event-date-luxury">${ev.date}</p>
        <p class="event-time-luxury">${ev.time}</p>
        <div class="event-divider"></div>
        <p class="event-place-luxury">${ev.place}<br><span>${ev.address}</span></p>
      </div>
    </div>
  `).join('');
}

/* ========== ENVELOPE MODAL ========== */
function openEnvelope() {
  const modal = document.getElementById('envelopeModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(() => launchFireworks(2000), 300);
}
function closeEnvelope() {
  document.getElementById('envelopeModal').classList.remove('active');
  document.getElementById('envelopeStage').classList.remove('open');
  document.body.style.overflow = 'auto';
}
document.addEventListener('click', (e) => {
  if (e.target.closest('#envelopeStage') && !e.target.classList.contains('letter-close')) {
    document.getElementById('envelopeStage').classList.toggle('open');
    if (document.getElementById('envelopeStage').classList.contains('open')) {
      launchConfetti(); animateConfetti();
    }
  }
});

/* ========== RSVP / WISHES ========== */
let wishes = [];
const rsvpForm = document.getElementById('rsvpForm');
const wishesList = document.getElementById('wishesList');

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[m]));
}
function badgeClass(attend) {
  if (attend === 'Hadir') return 'hadir';
  if (attend === 'Tidak Hadir') return 'tidak';
  return 'ragu';
}

function renderWishes() {
  wishesList.innerHTML = '';
  document.getElementById('wishesCount').textContent = wishes.length;
  if (wishes.length === 0) {
    wishesList.innerHTML = '<p class="wishes-empty">Belum ada ucapan. Jadilah yang pertama! 💌</p>';
    return;
  }
  wishes.slice().reverse().forEach(w => {
    const div = document.createElement('div');
    div.className = 'wish-item-luxury';
    div.innerHTML = `
      <div class="wish-name">
        ${escapeHTML(w.name)}
        <span class="wish-badge ${badgeClass(w.attend)}">${escapeHTML(w.attend)}</span>
      </div>
      ${w.message ? `<p class="wish-message">${escapeHTML(w.message)}</p>` : ''}
      <p class="wish-time">${escapeHTML(w.time || '')}</p>
    `;
    wishesList.appendChild(div);
  });
}

async function initWishes() {
  if (!CONFIG.gasUrl) {
    wishes = JSON.parse(localStorage.getItem('weddingWishesSugiantoNovi') || '[]');
    renderWishes();
    return;
  }
  try {
    const res = await fetch(CONFIG.gasUrl + '?action=list');
    const data = await res.json();
    wishes = data.wishes || [];
  } catch (err) {
    console.warn('Fallback localStorage');
    wishes = JSON.parse(localStorage.getItem('weddingWishesSugiantoNovi') || '[]');
  }
  renderWishes();
}

rsvpForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('rsvpName').value.trim();
  const attendRadio = document.querySelector('input[name="attend"]:checked');
  const message = document.getElementById('rsvpMsg').value.trim();
  if (!name || !attendRadio) { showToast('Mohon lengkapi nama & konfirmasi'); return; }

  const wish = {
    name,
    attend: attendRadio.value,
    message,
    time: new Date().toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  };

  const btn = rsvpForm.querySelector('.btn-luxury');
  const orig = btn.innerHTML;
  btn.innerHTML = '<span>Mengirim...</span>';
  btn.disabled = true;

  if (CONFIG.gasUrl) {
    try {
      await fetch(CONFIG.gasUrl, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', ...wish })
      });
    } catch (err) { console.warn('Gagal kirim ke GAS', err); }
  }

  const local = JSON.parse(localStorage.getItem('weddingWishesSugiantoNovi') || '[]');
  local.push(wish);
  localStorage.setItem('weddingWishesSugiantoNovi', JSON.stringify(local));

  wishes.push(wish);
  renderWishes();
  rsvpForm.reset();
  btn.innerHTML = orig;
  btn.disabled = false;

  launchConfetti(); animateConfetti();
  setTimeout(() => launchFireworks(1500), 300);
  showToast('囍 Terima kasih atas doa & konfirmasinya!');
});

/* ========== DOWNLOAD GUEST BOOK PDF ========== */
function downloadGuestbook() {
  if (!window.jspdf) { showToast('PDF library belum dimuat'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(107, 10, 10);
  doc.rect(0, 0, pageW, 40, 'F');
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(24);
  doc.text('囍', pageW / 2, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text('Guest Book & Ucapan', pageW / 2, 30, { align: 'center' });

  doc.setTextColor(60, 30, 30);
  doc.setFontSize(16);
  doc.text(`${CONFIG.groom} & ${CONFIG.bride}`, pageW / 2, 55, { align: 'center' });
  doc.setFontSize(10);
  doc.setTextColor(150, 100, 100);
  doc.text('12 Desember 2025', pageW / 2, 63, { align: 'center' });

  // Stats
  const hadir = wishes.filter(w => w.attend === 'Hadir').length;
  const tidak = wishes.filter(w => w.attend === 'Tidak Hadir').length;
  const ragu = wishes.filter(w => w.attend === 'Masih Ragu').length;

  doc.setFillColor(251, 245, 230);
  doc.rect(15, 75, pageW - 30, 20, 'F');
  doc.setTextColor(107, 10, 10);
  doc.setFontSize(10);
  doc.text(`Total: ${wishes.length}   |   Hadir: ${hadir}   |   Tidak: ${tidak}   |   Ragu: ${ragu}`,
    pageW / 2, 88, { align: 'center' });

  // Wishes list
  let y = 110;
  doc.setFontSize(10);
  wishes.forEach((w, i) => {
    if (y > 270) { doc.addPage(); y = 30; }
    doc.setTextColor(107, 10, 10);
    doc.setFont(undefined, 'bold');
    doc.text(`${i + 1}. ${w.name} [${w.attend}]`, 15, y);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(80, 50, 50);
    if (w.message) {
      const lines = doc.splitTextToSize(w.message, pageW - 40);
      doc.text(lines, 20, y + 6);
      y += 6 + lines.length * 5;
    }
    doc.setTextColor(180, 140, 140);
    doc.setFontSize(8);
    doc.text(w.time || '', 15, y + 3);
    doc.setFontSize(10);
    y += 15;
  });

  doc.save(`GuestBook-${CONFIG.groom}-${CONFIG.bride}.pdf`);
  showToast('📄 Guest book berhasil di-download!');
}

/* ========== SCROLL REVEAL ========== */
function initScrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.section').forEach(s => obs.observe(s));

  // Fireworks on countdown
  let triggered = false;
  const cdSec = document.querySelector('.section-countdown');
  if (cdSec) {
    const fwObs = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting && !triggered) {
          triggered = true;
          setTimeout(() => launchFireworks(3500), 500);
        }
      });
    }, { threshold: 0.4 });
    fwObs.observe(cdSec);
  }
}