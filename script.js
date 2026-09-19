/* ================================================
   UNDANGAN CHINESE WEDDING — Sugianto & Novi Mutiara
   Author: Clean version
================================================ */
window.refreshGallery = refreshGallery;
'use strict';

/* ================================================
   1. CONFIG
================================================ */
const CONFIG = {
  groom: 'Sugianto',
  bride: 'Novi Mutiara',
  weddingDate: '2026-09-30T07:00:00',
  gasUrl:'https://script.google.com/macros/s/AKfycbyWRRp4X3OX3dt7rYxA1gSOWa-42m24sr63IN2ppRiVJ7MHXnY_VSu0eNp-Ir6Dn2Pmjw/exec',
  gallery: [
    'assets/cover.jpg',
    'assets/groom.jpg',
    'assets/bride.jpg',
    'assets/cover.jpg',
    'assets/groom.jpg',
    'assets/bride.jpg'
  ]
};

/* ================================================
   LOAD GALLERY DARI ADMIN (localStorage)
================================================ */
(function loadAdminGallery() {
  try {
    const stored = JSON.parse(localStorage.getItem('gallerySugiantoNovi') || 'null');
    if (stored && Array.isArray(stored) && stored.length > 0) {
      CONFIG.gallery = stored;
    }
  } catch (e) {}
})();

/* ================================================
   REAL-TIME SYNC GALLERY (kalau admin ubah di tab lain)
================================================ */
window.addEventListener('storage', function(e) {
  if (e.key === 'gallerySugiantoNovi' || e.key === 'gallerySugiantoNovi_updated') {
    try {
      const updated = JSON.parse(localStorage.getItem('gallerySugiantoNovi') || 'null');
      if (updated && Array.isArray(updated)) {
        CONFIG.gallery = updated;
        refreshGallery();
      }
    } catch (err) {}
  }
});

function refreshGallery() {
  const grid = $('galleryGrid');
  if (!grid) return;
  grid.innerHTML = '';
  CONFIG.gallery.forEach(function(src, i) {
    const d = document.createElement('div');
    d.className = 'gallery-item';
    d.onclick = function() { openLightbox(i); };
    d.innerHTML = '<img src="' + src + '" alt="Gallery ' + (i + 1) + '" loading="lazy" onerror="this.src=\'assets/cover.jpg\'">';
    grid.appendChild(d);
  });
}

/* ================================================
   2. UTILS
================================================ */
function $(id) {
  return document.getElementById(id);
}

function escapeHTML(str) {
  return String(str || '').replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m];
  });
}

function showToast(msg) {
  const old = document.querySelector('.toast');
  if (old) old.remove();

  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);

  requestAnimationFrame(function() {
    t.classList.add('show');
  });

  setTimeout(function() {
    t.classList.remove('show');
    setTimeout(function() { t.remove(); }, 500);
  }, 2500);
}

/* ================================================
   3. GUEST NAME FROM URL
================================================ */
(function initGuestName() {
  const params = new URLSearchParams(window.location.search);
  const guest = params.get('to');
  if (guest) {
    const name = decodeURIComponent(guest.replace(/\+/g, ' '));
    const el = $('guestName');
    if (el) el.textContent = name;
  }
})();

/* ================================================
   4. PRELOADER
================================================ */
window.addEventListener('load', function() {
  setTimeout(function() {
    const p = $('preloader');
    if (p) p.classList.add('hide');
  }, 1500);
});

document.body.style.overflow = 'hidden';

/* ================================================
   5. PETALS CANVAS (SIMPLE, NO DPR)
================================================ */
(function initPetals() {
  const canvas = $('petalsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const petals = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function Petal() {
    this.reset(true);
  }

  Petal.prototype.reset = function(initial) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : -20;
    this.size = 5 + Math.random() * 6;
    this.speedY = 0.4 + Math.random() * 0.9;
    this.speedX = -0.4 + Math.random() * 0.8;
    this.rotation = Math.random() * 360;
    this.rotSpeed = -0.4 + Math.random() * 0.8;
    this.opacity = 0.35 + Math.random() * 0.4;
    this.sway = Math.random() * Math.PI * 2;
    this.type = Math.random() > 0.65 ? 'gold' : 'petal';
    if (this.type === 'gold') {
      this.hue = 'hsl(' + (40 + Math.random() * 15) + ',85%,' + (60 + Math.random() * 20) + '%)';
    } else {
      this.hue = 'hsl(' + (350 + Math.random() * 15) + ',70%,' + (55 + Math.random() * 15) + '%)';
    }
  };

  Petal.prototype.update = function() {
    this.y += this.speedY;
    this.sway += 0.02;
    this.x += this.speedX + Math.sin(this.sway) * 0.3;
    this.rotation += this.rotSpeed;
    if (this.y > canvas.height + 20) this.reset();
  };

  Petal.prototype.draw = function() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.hue;
    ctx.shadowBlur = 6;
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
  };

  for (let i = 0; i < 28; i++) petals.push(new Petal());

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ================================================
   6. CONFETTI
================================================ */
const confettiCanvas = $('confettiCanvas');
const confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
let confettiParticles = [];

function resizeConfetti() {
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeConfetti();
window.addEventListener('resize', resizeConfetti);

function launchConfetti() {
  if (!confettiCanvas) return;
  const colors = ['#d4af37', '#ffd700', '#f6e27a', '#a01c1c', '#6b0a0a', '#fff8dc'];

  for (let i = 0; i < 150; i++) {
    const side = Math.random() > 0.5 ? 'left' : 'right';
    const startX = side === 'left' ? -10 : confettiCanvas.width + 10;
    const angle = side === 'left'
      ? (Math.random() * 30 + 20) * Math.PI / 180
      : (Math.random() * 30 + 130) * Math.PI / 180;

    confettiParticles.push({
      x: startX,
      y: Math.random() * confettiCanvas.height * 0.5,
      vx: Math.cos(angle) * (7 + Math.random() * 7),
      vy: Math.sin(angle) * (7 + Math.random() * 7) - 3,
      size: 5 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: -6 + Math.random() * 12,
      gravity: 0.28,
      drag: 0.985,
      life: 1
    });
  }
}

function animateConfetti() {
  if (!confettiCanvas) return;

  if (confettiParticles.length === 0) {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    return;
  }

  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiParticles = confettiParticles.filter(function(p) {
    p.vx *= p.drag;
    p.vy = p.vy * p.drag + p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotSpeed;
    p.life -= 0.006;

    if (p.life <= 0 || p.y > confettiCanvas.height + 30) return false;

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rotation * Math.PI / 180);
    confettiCtx.globalAlpha = p.life;
    confettiCtx.fillStyle = p.color;
    confettiCtx.shadowBlur = 8;
    confettiCtx.shadowColor = p.color;
    confettiCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    confettiCtx.restore();
    return true;
  });

  requestAnimationFrame(animateConfetti);
}

/* ================================================
   7. FIREWORKS
================================================ */
const fwCanvas = $('fireworksCanvas');
const fwCtx = fwCanvas ? fwCanvas.getContext('2d') : null;
let fwParticles = [];
let fwRunning = false;

function resizeFw() {
  if (!fwCanvas) return;
  fwCanvas.width = window.innerWidth;
  fwCanvas.height = window.innerHeight;
}
resizeFw();
window.addEventListener('resize', resizeFw);

function createFirework(x, y) {
  const colors = ['#d4af37', '#ffd700', '#f6e27a', '#ff6b6b', '#ffd93d'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  for (let i = 0; i < 45; i++) {
    const angle = (i / 45) * Math.PI * 2;
    const speed = 2 + Math.random() * 3.5;
    fwParticles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 2 + Math.random() * 2,
      color: color,
      alpha: 1,
      decay: 0.015 + Math.random() * 0.015
    });
  }
}

function animateFw() {
  if (!fwCanvas) return;
  fwCtx.fillStyle = 'rgba(0,0,0,0.18)';
  fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);

  fwParticles = fwParticles.filter(function(p) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.045;
    p.vx *= 0.98;
    p.vy *= 0.98;
    p.alpha -= p.decay;
    if (p.alpha <= 0) return false;

    fwCtx.globalAlpha = p.alpha;
    fwCtx.fillStyle = p.color;
    fwCtx.shadowBlur = 12;
    fwCtx.shadowColor = p.color;
    fwCtx.beginPath();
    fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    fwCtx.fill();
    return true;
  });

  if (fwParticles.length > 0) {
    requestAnimationFrame(animateFw);
  } else {
    fwRunning = false;
    fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
  }
}

function launchFireworks(duration) {
  if (!fwCanvas) return;
  duration = duration || 3000;
  const start = Date.now();

  const interval = setInterval(function() {
    if (Date.now() - start > duration) {
      clearInterval(interval);
      return;
    }
    const x = Math.random() * fwCanvas.width * 0.8 + fwCanvas.width * 0.1;
    const y = Math.random() * fwCanvas.height * 0.5 + 50;
    createFirework(x, y);
  }, 380);

  if (!fwRunning) {
    fwRunning = true;
    animateFw();
  }
}

/* ================================================
   8. OPEN INVITATION
================================================ */
function openInvitation() {
  const cover = $('cover');
  const main = $('mainContent');

  cover.classList.add('hide');
  main.classList.remove('hidden');
  document.body.style.overflow = 'auto';

  setTimeout(function() {
    launchConfetti();
    animateConfetti();
  }, 200);

  setTimeout(function() { launchFireworks(4000); }, 400);

  playMusic();

  setTimeout(function() { cover.style.display = 'none'; }, 1100);

  setTimeout(function() {
    const sections = document.querySelectorAll('.section');
    for (let i = 0; i < sections.length; i++) {
      const rect = sections[i].getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        sections[i].classList.add('visible');
      }
    }
  }, 1200);
}

/* ================================================
   9. COUNTDOWN
================================================ */
(function initCountdown() {
  const target = new Date(CONFIG.weddingDate).getTime();

  function tick() {
    const diff = target - Date.now();

    if (diff < 0) {
      const cd = $('countdown');
      if (cd) {
        cd.innerHTML = '<p style="color:#f6e27a;font-size:1.1rem;padding:1rem">囍 百年好合 · Kami telah menikah 囍</p>';
      }
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const elD = $('days');
    const elH = $('hours');
    const elM = $('minutes');
    const elS = $('seconds');

    if (elD) elD.textContent = String(d).padStart(2, '0');
    if (elH) elH.textContent = String(h).padStart(2, '0');
    if (elM) elM.textContent = String(m).padStart(2, '0');
    if (elS) elS.textContent = String(s).padStart(2, '0');
  }

  setInterval(tick, 1000);
  tick();
})();

/* ================================================
   10. MUSIC
================================================ */
const music = $('bgMusic');
const musicPlayer = $('musicPlayer');
const musicBtn = $('musicBtn');

function playMusic() {
  if (!music) return;
  music.play().then(function() {
    if (musicPlayer) musicPlayer.classList.add('playing');
    if (musicBtn) musicBtn.textContent = '❚❚';
  }).catch(function() {
    console.log('Autoplay diblokir browser');
  });
}

function toggleMusic() {
  if (!music) return;

  if (music.paused) {
    music.play();
    if (musicPlayer) musicPlayer.classList.add('playing');
    if (musicBtn) musicBtn.textContent = '❚❚';
  } else {
    music.pause();
    if (musicPlayer) musicPlayer.classList.remove('playing');
    if (musicBtn) musicBtn.textContent = '▶';
  }
}

/* ================================================
   11. COPY TEXT
================================================ */
function copyText(text, btn) {
  function done() {
    showToast('✓ Berhasil disalin!');
    if (btn) {
      const orig = btn.innerHTML;
      btn.classList.add('copied');
      btn.innerHTML = '✓ Tersalin';
      setTimeout(function() {
        btn.classList.remove('copied');
        btn.innerHTML = orig;
      }, 2000);
    }
  }

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(done).catch(function() {
      fallbackCopy(text, done);
    });
  } else {
    fallbackCopy(text, done);
  }
}

function fallbackCopy(text, cb) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();

  try {
    document.execCommand('copy');
    cb();
  } catch (e) {
    alert('Gagal menyalin');
  }

  ta.remove();
}

/* ================================================
   12. GALLERY
================================================ */
let currentLb = 0;

(function initGallery() {
  refreshGallery();
})();

function openLightbox(i) {
  currentLb = i;
  const img = $('lightboxImg');
  const lb = $('lightbox');
  if (img) img.src = CONFIG.gallery[i];
  if (lb) lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  if (e && e.target.id !== 'lightbox' && !e.target.classList.contains('lightbox-close')) return;
  const lb = $('lightbox');
  if (lb) lb.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function lightboxNav(e, dir) {
  e.stopPropagation();
  currentLb = (currentLb + dir + CONFIG.gallery.length) % CONFIG.gallery.length;
  const img = $('lightboxImg');
  if (img) img.src = CONFIG.gallery[currentLb];
}

document.addEventListener('keydown', function(e) {
  const lb = $('lightbox');
  if (!lb || !lb.classList.contains('active')) return;

  if (e.key === 'Escape') closeLightbox({ target: { id: 'lightbox' } });
  if (e.key === 'ArrowLeft') lightboxNav({ stopPropagation: function() {} }, -1);
  if (e.key === 'ArrowRight') lightboxNav({ stopPropagation: function() {} }, 1);
});

/* ================================================
   13. RSVP
================================================ */
const rsvpForm = $('rsvpForm');
const wishesList = $('wishesList');
const wishesCount = $('wishesCount');
let wishes = [];

function loadWishes() {
  // Load dari localStorage dulu (instant)
  try {
    wishes = JSON.parse(localStorage.getItem('wishesSugiantoNovi') || '[]');
  } catch (e) {
    wishes = [];
  }
  renderWishes();

  // Lalu sync dari Google Sheets
  if (CONFIG.gasUrl) {
    fetch(CONFIG.gasUrl + '?action=list')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.wishes && data.wishes.length > 0) {
          // Konversi format dari sheet ke format client
          wishes = data.wishes.map(function(w) {
            return {
              name: w.Nama,
              attend: w.Kehadiran,
              message: w.Ucapan,
              time: w.Timestamp
            };
          });
          try {
            localStorage.setItem('wishesSugiantoNovi', JSON.stringify(wishes));
          } catch (e) {}
          renderWishes();
        }
      })
      .catch(function(err) { console.warn('GAS load error:', err); });
  }
}

function renderWishes() {
  if (!wishesList) return;
  wishesList.innerHTML = '';

  if (wishesCount) wishesCount.textContent = wishes.length;

  if (wishes.length === 0) {
    wishesList.innerHTML = '<p class="wishes-empty">Belum ada ucapan. Jadilah yang pertama! 💌</p>';
    return;
  }

  wishes.slice().reverse().forEach(function(w) {
    const cls = w.attend === 'Hadir' ? 'hadir'
      : w.attend === 'Tidak Hadir' ? 'tidak' : 'ragu';

    const d = document.createElement('div');
    d.className = 'wish-item';
    d.innerHTML =
      '<div class="wish-name">' + escapeHTML(w.name) +
      ' <span class="wish-badge ' + cls + '">' + escapeHTML(w.attend) + '</span></div>' +
      (w.message ? '<p class="wish-message">' + escapeHTML(w.message) + '</p>' : '') +
      '<p class="wish-time">' + escapeHTML(w.time || '') + '</p>';

    wishesList.appendChild(d);
  });
}

if (rsvpForm) {
  rsvpForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = $('rsvpName').value.trim();
    const attendEl = document.querySelector('input[name="attend"]:checked');
    const message = $('rsvpMsg').value.trim();

    if (!name || !attendEl) {
      showToast('Mohon lengkapi nama & konfirmasi');
      return;
    }

    const wish = {
      name: name,
      attend: attendEl.value,
      message: message,
      time: new Date().toLocaleString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    };

    // Simpan ke localStorage (untuk tampil instant)
    wishes.push(wish);
    try {
      localStorage.setItem('wishesSugiantoNovi', JSON.stringify(wishes));
    } catch (e) {}

    // Kirim ke Google Sheets (background)
    if (CONFIG.gasUrl) {
      fetch(CONFIG.gasUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addWish', ...wish })
      }).catch(function(err) { console.warn('GAS error:', err); });
    }

    renderWishes();
    rsvpForm.reset();

    launchConfetti();
    animateConfetti();
    setTimeout(function() { launchFireworks(1500); }, 300);
    showToast('囍 Terima kasih atas doa & konfirmasinya!');
  });
}

loadWishes();

/* ================================================
   14. SCROLL REVEAL
================================================ */
(function initScrollReveal() {
  const sections = document.querySelectorAll('.section');

  function check() {
    for (let i = 0; i < sections.length; i++) {
      const rect = sections[i].getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
        sections[i].classList.add('visible');
      }
    }
  }

  window.addEventListener('scroll', check, { passive: true });
  window.addEventListener('resize', check);
  setTimeout(check, 100);
})();

/* ================================================
   15. FIREWORKS TRIGGER ON COUNTDOWN
================================================ */
(function initFireworksTrigger() {
  const cdSec = document.querySelector('.section-countdown');
  if (!cdSec) return;

  let triggered = false;

  window.addEventListener('scroll', function() {
    if (triggered) return;
    const rect = cdSec.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.6 && rect.bottom > 0) {
      triggered = true;
      setTimeout(function() { launchFireworks(3000); }, 300);
    }
  }, { passive: true });
})();

/* ================================================
   16. MOBILE VIEWPORT FIX
================================================ */
(function initViewportFix() {
  function setVH() {
    document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
  }
  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', function() {
    setTimeout(setVH, 150);
  });
})();

/* ================================================
   17. EXPOSE GLOBAL
================================================ */
window.openInvitation = openInvitation;
window.toggleMusic = toggleMusic;
window.copyText = copyText;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.lightboxNav = lightboxNav;