/* ================================================
   INTERACTIVE FEATURES — Clean Version (No DPR Bug)
================================================ */
'use strict';

(function() {
  const LS_LANTERN = 'lanternsSugiantoNovi';
  const LS_PHOTOS = 'photosSugiantoNovi';
  const LS_SIGN = 'signaturesSugiantoNovi';

  /* ============ UTILS ============ */
  function $(id) { return document.getElementById(id); }

  function escapeHTML(str) {
    return String(str || '').replace(/[&<>"']/g, function(m) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m];
    });
  }

  function showToast(msg) {
    if (typeof window.showToast === 'function') {
      window.showToast(msg);
      return;
    }
    const old = document.querySelector('.toast');
    if (old) old.remove();
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function() { t.classList.add('show'); });
    setTimeout(function() {
      t.classList.remove('show');
      setTimeout(function() { t.remove(); }, 500);
    }, 2500);
  }

  /* ================================================
     WISH LANTERN
  ================================================ */
  const lanternCanvas = $('lanternCanvas');
  let lanternCtx = null;
  let lanterns = [];

  function initLantern() {
    if (!lanternCanvas) return;

    lanternCtx = lanternCanvas.getContext('2d');
    resizeLantern();
    window.addEventListener('resize', resizeLantern);

    const saved = loadLanterns();
    saved.forEach(function(w) { spawnLantern(w.name, w.wish, true); });
    updateLanternCounter();

    const form = $('lanternForm');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = $('lanternName').value.trim();
        const wish = $('lanternWish').value.trim();
        if (!name || !wish) return;

        spawnLantern(name, wish, false);
        saveLantern({ name: name, wish: wish, time: new Date().toLocaleString('id-ID') });
        form.reset();
        updateLanternCounter();
        showToast('🏮 Lentera berhasil dilepaskan!');
      });
    }

    requestAnimationFrame(animateLanterns);
  }

  function resizeLantern() {
    if (!lanternCanvas) return;
    const parent = lanternCanvas.parentElement;
    const rect = parent.getBoundingClientRect();
    lanternCanvas.width = rect.width;
    lanternCanvas.height = rect.height;
  }

  function Lantern(name, wish, isBackground) {
    this.name = name;
    this.wish = wish;
    this.x = lanternCanvas.width * (0.2 + Math.random() * 0.6);
    this.y = isBackground
      ? Math.random() * lanternCanvas.height
      : lanternCanvas.height - 20;
    this.vy = -0.4 - Math.random() * 0.6;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.size = 22 + Math.random() * 10;
    this.opacity = isBackground ? 0.35 : 1;
    this.rotation = 0;
    this.rotSpeed = (Math.random() - 0.5) * 0.02;
    this.sway = Math.random() * Math.PI * 2;
    this.life = isBackground ? Infinity : 1;
    this.showLabel = !isBackground;
    this.age = 0;
  }

  Lantern.prototype.update = function() {
    this.y += this.vy;
    this.sway += 0.03;
    this.x += this.vx + Math.sin(this.sway) * 0.5;
    this.rotation += this.rotSpeed;
    this.age++;

    if (this.y < -this.size * 3) {
      if (this.life === Infinity) {
        this.y = lanternCanvas.height + 30;
        this.x = lanternCanvas.width * (0.2 + Math.random() * 0.6);
      } else {
        return false;
      }
    }
    return true;
  };

  Lantern.prototype.draw = function() {
    lanternCtx.save();
    lanternCtx.translate(this.x, this.y);
    lanternCtx.rotate(this.rotation);
    lanternCtx.globalAlpha = this.opacity;

    const gradient = lanternCtx.createRadialGradient(0, 0, 0, 0, 0, this.size * 2.5);
    gradient.addColorStop(0, 'rgba(255,150,50,.5)');
    gradient.addColorStop(1, 'rgba(255,150,50,0)');
    lanternCtx.fillStyle = gradient;
    lanternCtx.beginPath();
    lanternCtx.arc(0, 0, this.size * 2.5, 0, Math.PI * 2);
    lanternCtx.fill();

    lanternCtx.fillStyle = 'rgba(220,50,50,.9)';
    lanternCtx.beginPath();
    lanternCtx.ellipse(0, 0, this.size * 0.7, this.size, 0, 0, Math.PI * 2);
    lanternCtx.fill();

    lanternCtx.strokeStyle = 'rgba(212,175,55,1)';
    lanternCtx.lineWidth = 1.5;
    lanternCtx.stroke();

    lanternCtx.fillStyle = '#d4af37';
    lanternCtx.fillRect(-this.size * 0.35, -this.size - 3, this.size * 0.7, 4);
    lanternCtx.fillRect(-this.size * 0.35, this.size - 1, this.size * 0.7, 4);

    lanternCtx.save();
    lanternCtx.rotate(-this.rotation);
    lanternCtx.fillStyle = '#ffd700';
    lanternCtx.font = 'bold ' + (this.size * 0.9) + 'px serif';
    lanternCtx.textAlign = 'center';
    lanternCtx.textBaseline = 'middle';
    lanternCtx.fillText('囍', 0, 0);
    lanternCtx.restore();

    if (this.showLabel && this.opacity > 0.5) {
      lanternCtx.rotate(-this.rotation);
      lanternCtx.globalAlpha = this.opacity * 0.9;
      lanternCtx.fillStyle = '#fff';
      lanternCtx.font = 'bold 11px Poppins, sans-serif';
      lanternCtx.textAlign = 'center';
      const t = this.wish.length > 20 ? this.wish.slice(0, 20) + '…' : this.wish;
      lanternCtx.fillText(t, 0, this.size + 14);
      lanternCtx.font = '10px Poppins, sans-serif';
      lanternCtx.fillStyle = '#ffd700';
      lanternCtx.fillText('— ' + this.name, 0, this.size + 26);
    }

    lanternCtx.restore();
  };

  function spawnLantern(name, wish, isBg) {
    if (!lanternCanvas) return;
    lanterns.push(new Lantern(name, wish, isBg));
  }

  function animateLanterns() {
    if (!lanternCtx) return;

    lanternCtx.fillStyle = 'rgba(251,245,230,0.2)';
    lanternCtx.fillRect(0, 0, lanternCanvas.width, lanternCanvas.height);

    lanterns = lanterns.filter(function(l) {
      const alive = l.update();
      if (alive) l.draw();
      return alive;
    });

    requestAnimationFrame(animateLanterns);
  }

  function loadLanterns() {
    try {
      return JSON.parse(localStorage.getItem(LS_LANTERN) || '[]');
    } catch (e) { return []; }
  }

  function saveLantern(data) {
    const arr = loadLanterns();
    arr.push(data);
    try {
      localStorage.setItem(LS_LANTERN, JSON.stringify(arr));
    } catch (e) {}
  }

  function updateLanternCounter() {
    const el = $('lanternCount');
    if (!el) return;
    const arr = loadLanterns();
    el.textContent = arr.length;
  }

  /* ================================================
     PHOTO WALL
  ================================================ */
  let pendingPhotoData = null;

  function initPhotoWall() {
    const input = $('photoInput');
    if (!input) return;

    input.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 3 * 1024 * 1024) {
        showToast('⚠️ Foto terlalu besar (max 3MB)');
        return;
      }

      const reader = new FileReader();
      reader.onload = function(ev) {
        pendingPhotoData = ev.target.result;
        const img = $('previewImg');
        const prev = $('photoPreview');
        if (img) img.src = pendingPhotoData;
        if (prev) prev.classList.remove('hidden');
        prev.style.display = 'flex';
      };
      reader.readAsDataURL(file);
    });

    loadPhotoWall();
  }

  function loadPhotoWall() {
    let photos = [];
    try {
      photos = JSON.parse(localStorage.getItem(LS_PHOTOS) || '[]');
    } catch (e) { photos = []; }
    renderPhotoWall(photos);
  }

  function renderPhotoWall(photos) {
    const grid = $('photoWallGrid');
    if (!grid) return;

    if (photos.length === 0) {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#999;padding:2rem">Belum ada foto. Jadilah yang pertama! 📸</p>';
      return;
    }

    grid.innerHTML = photos.slice(-12).reverse().map(function(p) {
      return '<div class="photo-wall-item" onclick="openPhotoLightbox(\'' + (p.data || '').replace(/'/g, "\\'") + '\')">' +
        '<img src="' + p.data + '" alt="' + escapeHTML(p.name) + '">' +
        '<div class="photo-wall-caption"><strong>' + escapeHTML(p.name) + '</strong>' +
        (p.caption ? escapeHTML(p.caption) : '') + '</div>' +
        '</div>';
    }).join('');
  }

  function submitPhoto() {
    const nameEl = $('photoName');
    const capEl = $('photoCaption');
    const name = nameEl ? nameEl.value.trim() : '';
    const caption = capEl ? capEl.value.trim() : '';

    if (!name) { showToast('⚠️ Isi nama Anda'); return; }
    if (!pendingPhotoData) { showToast('⚠️ Pilih foto dulu'); return; }

    const photoData = {
      name: name,
      caption: caption,
      data: pendingPhotoData,
      time: new Date().toLocaleString('id-ID')
    };

    const arr = [];
    try {
      const existing = JSON.parse(localStorage.getItem(LS_PHOTOS) || '[]');
      existing.forEach(function(p) { arr.push(p); });
    } catch (e) {}
    arr.push(photoData);

    try {
      localStorage.setItem(LS_PHOTOS, JSON.stringify(arr));
    } catch (e) {
      showToast('⚠️ Foto terlalu besar untuk disimpan');
      return;
    }

    pendingPhotoData = null;
    const prev = $('photoPreview');
    if (prev) { prev.classList.add('hidden'); prev.style.display = ''; }
    if (nameEl) nameEl.value = '';
    if (capEl) capEl.value = '';
    const input = $('photoInput');
    if (input) input.value = '';

    if (typeof window.launchConfetti === 'function') {
      window.launchConfetti();
      if (typeof window.animateConfetti === 'function') window.animateConfetti();
    }

    showToast('📸 Terima kasih! Foto Anda tersimpan.');
    loadPhotoWall();
  }

  function openPhotoLightbox(url) {
    if (!url) return;
    const lb = document.createElement('div');
    lb.className = 'lightbox active';
    lb.style.cssText = 'position:fixed;inset:0;background:rgba(20,0,0,.96);z-index:9999;display:flex;align-items:center;justify-content:center;padding:1.5rem;cursor:pointer';
    lb.innerHTML = '<img src="' + url + '" style="max-width:90vw;max-height:85vh;border:4px solid #d4af37;border-radius:12px">';
    lb.onclick = function() { lb.remove(); };
    document.body.appendChild(lb);
  }

  /* ================================================
     SIGNATURE PAD
  ================================================ */
  let sigCanvas = null;
  let sigCtx = null;
  let sigDrawing = false;
  let sigPoints = [];

  function initSignaturePad() {
    sigCanvas = $('signatureCanvas');
    if (!sigCanvas) return;

    sigCtx = sigCanvas.getContext('2d');

    // Resize saat pertama buka modal (bukan saat load)
    window.addEventListener('resize', function() {
      if ($('signatureModal').classList.contains('active')) {
        resizeSignatureCanvas();
        redrawSignature();
      }
    });

    sigCanvas.addEventListener('pointerdown', startDraw);
    sigCanvas.addEventListener('pointermove', draw);
    sigCanvas.addEventListener('pointerup', endDraw);
    sigCanvas.addEventListener('pointercancel', endDraw);
    sigCanvas.addEventListener('pointerleave', endDraw);

    loadSignatureWall();
  }

  function resizeSignatureCanvas() {
    if (!sigCanvas) return;
    const rect = sigCanvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Simpan gambar lama
    const oldData = sigPoints.length > 0 ? sigCanvas.toDataURL() : null;

    sigCanvas.width = rect.width;
    sigCanvas.height = rect.height;
    sigCtx.lineCap = 'round';
    sigCtx.lineJoin = 'round';
    sigCtx.strokeStyle = '#1a0f0a';
    sigCtx.lineWidth = 2.5;

    if (oldData) {
      const img = new Image();
      img.onload = function() {
        sigCtx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = oldData;
    }
  }

  function startDraw(e) {
    sigDrawing = true;
    sigPoints = [];
    const rect = sigCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    sigPoints.push({ x: x, y: y });
    sigCtx.beginPath();
    sigCtx.moveTo(x, y);
  }

  function draw(e) {
    if (!sigDrawing) return;
    const rect = sigCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    sigPoints.push({ x: x, y: y });
    sigCtx.lineTo(x, y);
    sigCtx.stroke();
  }

  function endDraw() { sigDrawing = false; }

  function redrawSignature() {
    if (!sigCanvas || sigPoints.length === 0) return;
    const rect = sigCanvas.getBoundingClientRect();
    sigCtx.clearRect(0, 0, rect.width, rect.height);
    sigCtx.beginPath();
    sigPoints.forEach(function(p, i) {
      if (i === 0) sigCtx.moveTo(p.x, p.y);
      else sigCtx.lineTo(p.x, p.y);
    });
    sigCtx.stroke();
  }

  function clearSignature() {
    if (!sigCanvas) return;
    const rect = sigCanvas.getBoundingClientRect();
    sigCtx.clearRect(0, 0, rect.width, rect.height);
    sigPoints = [];
  }

  function openSignaturePad() {
    const modal = $('signatureModal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Resize setelah modal visible
    setTimeout(resizeSignatureCanvas, 100);
  }

  function closeSignaturePad() {
    const modal = $('signatureModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    clearSignature();
  }

  function saveSignature() {
    const name = $('sigName').value.trim();
    const message = $('sigMessage').value.trim();

    if (!name) { showToast('⚠️ Isi nama Anda'); return; }
    if (sigPoints.length < 5) { showToast('⚠️ Tanda tangan dulu'); return; }

    const dataUrl = sigCanvas.toDataURL('image/png');

    const sigData = {
      name: name,
      message: message,
      signature: dataUrl,
      time: new Date().toLocaleString('id-ID')
    };

    const arr = [];
    try {
      const existing = JSON.parse(localStorage.getItem(LS_SIGN) || '[]');
      existing.forEach(function(s) { arr.push(s); });
    } catch (e) {}
    arr.push(sigData);

    try {
      localStorage.setItem(LS_SIGN, JSON.stringify(arr));
    } catch (e) {
      showToast('⚠️ Penyimpanan penuh');
      return;
    }

    showToast('✍️ Tanda tangan tersimpan!');
    $('sigName').value = '';
    $('sigMessage').value = '';
    clearSignature();
    loadSignatureWall();
  }

  function loadSignatureWall() {
    const wall = $('signatureWall');
    if (!wall) return;

    let arr = [];
    try {
      arr = JSON.parse(localStorage.getItem(LS_SIGN) || '[]');
    } catch (e) {}

    if (arr.length === 0) {
      wall.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#999;font-size:.8rem">Belum ada tanda tangan</p>';
      return;
    }

    wall.innerHTML = arr.slice(-8).reverse().map(function(s) {
      return '<div class="signature-wall-item">' +
        '<img src="' + s.signature + '" alt="' + escapeHTML(s.name) + '">' +
        '<strong>' + escapeHTML(s.name) + '</strong>' +
        '</div>';
    }).join('');
  }

  /* ================================================
     LIVE WALL
  ================================================ */
  let livewallTimer = null;
  let livewallIndex = 0;
  let livewallItems = [];
  let livewallPaused = false;

  function openLiveWall() {
    const modal = $('livewallModal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    livewallItems = [];

    try {
      const photos = JSON.parse(localStorage.getItem(LS_PHOTOS) || '[]');
      photos.forEach(function(p) {
        livewallItems.push({ type: 'photo', data: p.data, name: p.name, caption: p.caption });
      });
    } catch (e) {}

    try {
      const wishes = JSON.parse(localStorage.getItem('wishesSugiantoNovi') || '[]');
      wishes.forEach(function(w) {
        livewallItems.push({ type: 'wish', name: w.name, message: w.message });
      });
    } catch (e) {}

    try {
      const sigs = JSON.parse(localStorage.getItem(LS_SIGN) || '[]');
      sigs.forEach(function(s) {
        livewallItems.push({ type: 'signature', signature: s.signature, name: s.name, message: s.message });
      });
    } catch (e) {}

    livewallItems.sort(function() { return Math.random() - 0.5; });

    if (livewallItems.length === 0) {
      $('livewallContent').innerHTML =
        '<div class="livewall-ornament">囍</div>' +
        '<p class="livewall-wish">Belum ada konten. Bagikan foto & ucapan Anda!</p>';
      return;
    }

    livewallIndex = 0;
    livewallPaused = false;
    showLivewallItem();
    startLivewallTimer();
  }

  function showLivewallItem() {
    const item = livewallItems[livewallIndex];
    const c = $('livewallContent');
    if (!c) return;

    c.style.animation = 'none';
    void c.offsetWidth;
    c.style.animation = 'livewallFade 1s ease';

    if (item.type === 'photo') {
      c.innerHTML =
        '<img class="livewall-photo" src="' + item.data + '" alt="' + escapeHTML(item.name) + '">' +
        '<div class="livewall-caption"><strong>' + escapeHTML(item.name) + '</strong>' +
        (item.caption ? '<p>"' + escapeHTML(item.caption) + '"</p>' : '') + '</div>';
    } else if (item.type === 'wish') {
      c.innerHTML =
        '<div class="livewall-ornament">囍</div>' +
        '<p class="livewall-wish">"' + escapeHTML(item.message || 'Selamat menempuh hidup baru!') + '"</p>' +
        '<p class="livewall-wish-author">— ' + escapeHTML(item.name) + '</p>';
    } else if (item.type === 'signature') {
      c.innerHTML =
        '<div class="livewall-ornament">✍</div>' +
        '<img src="' + item.signature + '" style="max-width:400px;background:#fff;padding:1rem;border-radius:12px;border:3px solid #d4af37">' +
        '<div class="livewall-caption"><strong>' + escapeHTML(item.name) + '</strong>' +
        (item.message ? '<p>"' + escapeHTML(item.message) + '"</p>' : '') + '</div>';
    }
  }

  function startLivewallTimer() {
    if (livewallTimer) clearInterval(livewallTimer);
    livewallTimer = setInterval(function() {
      if (livewallPaused) return;
      livewallIndex = (livewallIndex + 1) % livewallItems.length;
      showLivewallItem();
    }, 5000);
  }

  function closeLiveWall() {
    const modal = $('livewallModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    if (livewallTimer) clearInterval(livewallTimer);
  }

  // Toggle pause
  document.addEventListener('click', function(e) {
    if (e.target.closest('#livewallContent')) {
      livewallPaused = !livewallPaused;
      showToast(livewallPaused ? '⏸ Paused' : '▶ Playing');
    }
  });

  // ESC close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const lw = $('livewallModal');
      const sm = $('signatureModal');
      if (lw && lw.classList.contains('active')) closeLiveWall();
      if (sm && sm.classList.contains('active')) closeSignaturePad();
    }
  });

  /* ================================================
     EXPOSE GLOBAL
  ================================================ */
  window.submitPhoto = submitPhoto;
  window.openPhotoLightbox = openPhotoLightbox;
  window.openSignaturePad = openSignaturePad;
  window.closeSignaturePad = closeSignaturePad;
  window.clearSignature = clearSignature;
  window.saveSignature = saveSignature;
  window.openLiveWall = openLiveWall;
  window.closeLiveWall = closeLiveWall;

  /* ================================================
     INIT
  ================================================ */
  function init() {
    initLantern();
    initPhotoWall();
    initSignaturePad();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();