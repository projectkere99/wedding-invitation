/* ================================================
   INTERACTIVE FEATURES - Paket B
   ================================================ */
(function () {
  'use strict';

  const CFG = window.CONFIG || {};
  const GAS = CFG.gasUrl || '';
  const LS_KEY_PHOTOS = 'weddingPhotos_SugiantoNovi';
  const LS_KEY_SIGN = 'weddingSignatures_SugiantoNovi';
  const LS_KEY_LANTERN = 'weddingLanterns_SugiantoNovi';
  const LS_KEY_PENDING = 'weddingPendingPhotos';

  // ============ CHIBI COUPLE SVG ============
  function getChibiGroomSVG() {
    return `
    <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
      <!-- Body / Changshan -->
      <ellipse cx="50" cy="112" rx="26" ry="8" fill="rgba(0,0,0,.1)"/>
      <path d="M50 65 Q35 65 28 90 L28 110 Q50 118 72 110 L72 90 Q65 65 50 65 Z" fill="#a01c1c"/>
      <path d="M50 65 Q35 65 28 90 L28 110 Q50 118 72 110 L72 90 Q65 65 50 65 Z" fill="none" stroke="#d4af37" stroke-width="1.5"/>
      <!-- Collar -->
      <path d="M42 65 L50 78 L58 65" fill="none" stroke="#d4af37" stroke-width="2"/>
      <!-- Arms -->
      <ellipse cx="28" cy="88" rx="7" ry="12" fill="#a01c1c" stroke="#d4af37" stroke-width="1"/>
      <ellipse cx="72" cy="88" rx="7" ry="12" fill="#a01c1c" stroke="#d4af37" stroke-width="1"/>
      <!-- Head -->
      <circle cx="50" cy="45" r="22" fill="#f5d7b8"/>
      <!-- Hair -->
      <path d="M28 45 Q28 22 50 22 Q72 22 72 45 Q70 32 50 30 Q30 32 28 45 Z" fill="#1a0f0a"/>
      <!-- Eyes -->
      <ellipse cx="42" cy="46" rx="2.5" ry="3" fill="#1a0f0a"/>
      <ellipse cx="58" cy="46" rx="2.5" ry="3" fill="#1a0f0a"/>
      <circle cx="42.7" cy="45" r="1" fill="#fff"/>
      <circle cx="58.7" cy="45" r="1" fill="#fff"/>
      <!-- Blush -->
      <ellipse cx="38" cy="52" rx="3" ry="1.5" fill="#ffb3b3" opacity=".6"/>
      <ellipse cx="62" cy="52" rx="3" ry="1.5" fill="#ffb3b3" opacity=".6"/>
      <!-- Smile -->
      <path d="M46 54 Q50 57 54 54" fill="none" stroke="#8b4513" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Gold crown -->
      <path d="M40 26 L44 20 L48 26 L52 20 L56 26 L60 20 L60 26 Z" fill="#d4af37" stroke="#8b6914" stroke-width="1"/>
      <circle cx="50" cy="22" r="2" fill="#ffd700"/>
    </svg>`;
  }

  function getChibiBrideSVG() {
    return `
    <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
      <!-- Shadow -->
      <ellipse cx="50" cy="112" rx="26" ry="8" fill="rgba(0,0,0,.1)"/>
      <!-- Qipao body -->
      <path d="M50 65 Q38 65 32 90 L32 110 Q50 118 68 110 L68 90 Q62 65 50 65 Z" fill="#c41e3a"/>
      <path d="M50 65 Q38 65 32 90 L32 110 Q50 118 68 110 L68 90 Q62 65 50 65 Z" fill="none" stroke="#d4af37" stroke-width="1.5"/>
      <!-- Decorative pattern -->
      <circle cx="50" cy="90" r="4" fill="none" stroke="#d4af37" stroke-width="1"/>
      <path d="M46 86 Q50 90 54 86" fill="none" stroke="#d4af37" stroke-width=".8"/>
      <!-- Collar -->
      <path d="M42 65 Q50 72 58 65" fill="#c41e3a" stroke="#d4af37" stroke-width="1.5"/>
      <!-- Arms -->
      <ellipse cx="32" cy="88" rx="6" ry="11" fill="#c41e3a" stroke="#d4af37" stroke-width="1"/>
      <ellipse cx="68" cy="88" rx="6" ry="11" fill="#c41e3a" stroke="#d4af37" stroke-width="1"/>
      <!-- Head -->
      <circle cx="50" cy="45" r="22" fill="#f5d7b8"/>
      <!-- Hair -->
      <path d="M28 45 Q26 20 50 20 Q74 20 72 45 Q74 55 78 60 L74 60 Q72 50 70 48 Q70 34 50 32 Q30 34 30 48 Q28 50 26 60 L22 60 Q26 55 28 45 Z" fill="#1a0f0a"/>
      <!-- Hair buns -->
      <circle cx="32" cy="30" r="7" fill="#1a0f0a"/>
      <circle cx="68" cy="30" r="7" fill="#1a0f0a"/>
      <circle cx="32" cy="30" r="2.5" fill="#d4af37"/>
      <circle cx="68" cy="30" r="2.5" fill="#d4af37"/>
      <!-- Hair ornament -->
      <path d="M46 24 L50 18 L54 24 L50 22 Z" fill="#d4af37"/>
      <!-- Eyes -->
      <path d="M38 46 Q42 43 46 46" fill="none" stroke="#1a0f0a" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M54 46 Q58 43 62 46" fill="none" stroke="#1a0f0a" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="42" cy="47" r="1.8" fill="#1a0f0a"/>
      <circle cx="58" cy="47" r="1.8" fill="#1a0f0a"/>
      <circle cx="42.5" cy="46.5" r=".8" fill="#fff"/>
      <circle cx="58.5" cy="46.5" r=".8" fill="#fff"/>
      <!-- Blush -->
      <ellipse cx="36" cy="52" rx="3.5" ry="1.8" fill="#ffb3b3" opacity=".7"/>
      <ellipse cx="64" cy="52" rx="3.5" ry="1.8" fill="#ffb3b3" opacity=".7"/>
      <!-- Smile -->
      <path d="M46 55 Q50 58 54 55" fill="none" stroke="#8b4513" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`;
  }

  function initChibi() {
    const g = document.getElementById('chibiGroom');
    const b = document.getElementById('chibiBride');
    if (g) g.innerHTML = getChibiGroomSVG();
    if (b) b.innerHTML = getChibiBrideSVG();
  }

  // ============ WISH LANTERN ============
  const lanternCanvas = document.getElementById('lanternCanvas');
  let lanternCtx, lanterns = [], lanternAnimId;

  function initLantern() {
    if (!lanternCanvas) return;

    lanternCtx = lanternCanvas.getContext('2d');
    resizeLantern();
    window.addEventListener('resize', resizeLantern);

    loadLanterns().then(() => {
      // Spawn existing lanterns (background)
      lanterns.forEach(w => spawnLantern(w.name, w.wish, true));
      updateLanternCounter();
    });

    lanternAnimId = requestAnimationFrame(animateLanterns);

    const form = document.getElementById('lanternForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('lanternName').value.trim();
        const wish = document.getElementById('lanternWish').value.trim();
        if (!name || !wish) return;

        spawnLantern(name, wish, false);
        saveLantern({ name, wish, time: new Date().toLocaleString('id-ID') });
        form.reset();
        updateLanternCounter();
        showToast('🏮 Lentera berhasil dilepaskan!');
      });
    }
  }

  function resizeLantern() {
    if (!lanternCanvas) return;
    const rect = lanternCanvas.parentElement.getBoundingClientRect();
    lanternCanvas.width = rect.width;
    lanternCanvas.height = rect.height;
  }

  class Lantern {
    constructor(name, wish, isBackground) {
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
      this.targetOpacity = isBackground ? 0.35 : 1;
      this.rotation = 0;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.sway = Math.random() * Math.PI * 2;
      this.life = isBackground ? Infinity : 1;
      this.showLabel = !isBackground;
      this.age = 0;
    }

    update() {
      this.y += this.vy;
      this.x += this.vx + Math.sin(this.sway) * 0.5;
      this.sway += 0.03;
      this.rotation += this.rotSpeed;
      this.age++;

      if (this.age > 100) this.opacity += (this.targetOpacity - this.opacity) * 0.02;

      // Fade out kalau di luar canvas
      if (this.y < -this.size * 3) {
        if (this.life === Infinity) {
          // Reset background lantern ke bawah
          this.y = lanternCanvas.height + 30;
          this.x = lanternCanvas.width * (0.2 + Math.random() * 0.6);
        } else {
          return false;
        }
      }
      return true;
    }

    draw() {
      lanternCtx.save();
      lanternCtx.translate(this.x, this.y);
      lanternCtx.rotate(this.rotation);
      lanternCtx.globalAlpha = this.opacity;

      // Glow
      const gradient = lanternCtx.createRadialGradient(0, 0, 0, 0, 0, this.size * 2.5);
      gradient.addColorStop(0, 'rgba(255,150,50,.5)');
      gradient.addColorStop(1, 'rgba(255,150,50,0)');
      lanternCtx.fillStyle = gradient;
      lanternCtx.beginPath();
      lanternCtx.arc(0, 0, this.size * 2.5, 0, Math.PI * 2);
      lanternCtx.fill();

      // Lantern body
      lanternCtx.fillStyle = 'rgba(220,50,50,.9)';
      lanternCtx.beginPath();
      lanternCtx.ellipse(0, 0, this.size * 0.7, this.size, 0, 0, Math.PI * 2);
      lanternCtx.fill();

      // Gold outline
      lanternCtx.strokeStyle = 'rgba(212,175,55,1)';
      lanternCtx.lineWidth = 1.5;
      lanternCtx.stroke();

      // Top & bottom caps
      lanternCtx.fillStyle = '#d4af37';
      lanternCtx.fillRect(-this.size * 0.35, -this.size - 3, this.size * 0.7, 4);
      lanternCtx.fillRect(-this.size * 0.35, this.size - 1, this.size * 0.7, 4);

      // 囍 character
      lanternCtx.save();
      lanternCtx.rotate(-this.rotation);
      lanternCtx.fillStyle = '#ffd700';
      lanternCtx.font = `bold ${this.size * 0.9}px 'Ma Shan Zheng', serif`;
      lanternCtx.textAlign = 'center';
      lanternCtx.textBaseline = 'middle';
      lanternCtx.fillText('囍', 0, 0);
      lanternCtx.restore();

      // Wish text (only for user lanterns)
      if (this.showLabel && this.opacity > 0.5) {
        lanternCtx.rotate(-this.rotation);
        lanternCtx.globalAlpha = this.opacity * 0.9;
        lanternCtx.fillStyle = '#fff';
        lanternCtx.font = 'bold 11px Poppins, sans-serif';
        lanternCtx.textAlign = 'center';
        const wishText = this.wish.length > 20 ? this.wish.slice(0, 20) + '…' : this.wish;
        lanternCtx.fillText(wishText, 0, this.size + 14);
        lanternCtx.font = '10px Poppins, sans-serif';
        lanternCtx.fillStyle = '#ffd700';
        lanternCtx.fillText(`— ${this.name}`, 0, this.size + 26);
      }

      lanternCtx.restore();
    }
  }

  function spawnLantern(name, wish, isBackground) {
    if (!lanternCanvas) return;
    lanterns.push(new Lantern(name, wish, isBackground));
  }

  function animateLanterns() {
    if (!lanternCtx || !lanternCanvas) return;

    // Fade trail
    lanternCtx.fillStyle = 'rgba(20,0,0,0.15)';
    lanternCtx.fillRect(0, 0, lanternCanvas.width, lanternCanvas.height);

    lanterns = lanterns.filter(l => {
      const alive = l.update();
      if (alive) l.draw();
      return alive;
    });

    lanternAnimId = requestAnimationFrame(animateLanterns);
  }

  // Load & save lanterns
  async function loadLanterns() {
    if (GAS) {
      try {
        const res = await fetch(GAS + '?action=lanterns');
        const data = await res.json();
        return data.lanterns || [];
      } catch (e) { console.warn('GAS lantern gagal'); }
    }
    try {
      return JSON.parse(localStorage.getItem(LS_KEY_LANTERN) || '[]');
    } catch (e) { return []; }
  }

  function saveLantern(data) {
    // Save to localStorage
    const arr = JSON.parse(localStorage.getItem(LS_KEY_LANTERN) || '[]');
    arr.push(data);
    localStorage.setItem(LS_KEY_LANTERN, JSON.stringify(arr));

    // Save to GAS
    if (GAS) {
      fetch(GAS, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addLantern', ...data })
      }).catch(e => console.warn(e));
    }
  }

  async function updateLanternCounter() {
    const el = document.getElementById('lanternCount');
    if (!el) return;
    const arr = JSON.parse(localStorage.getItem(LS_KEY_LANTERN) || '[]');
    el.textContent = arr.length;
  }

  // ============ PHOTO WALL ============
  let pendingPhotoData = null;

  function initPhotoWall() {
    const input = document.getElementById('photoInput');
    if (!input) return;

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 3 * 1024 * 1024) {
        showToast('⚠️ Foto terlalu besar (max 3MB)');
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        pendingPhotoData = ev.target.result;
        document.getElementById('previewImg').src = pendingPhotoData;
        document.getElementById('photoPreview').style.display = 'flex';
      };
      reader.readAsDataURL(file);
    });

    loadPhotoWall();
  }

  async function loadPhotoWall() {
    let photos = [];
    if (GAS) {
      try {
        const res = await fetch(GAS + '?action=photos');
        const data = await res.json();
        photos = data.photos || [];
      } catch (e) { console.warn('GAS photos gagal'); }
    }
    if (photos.length === 0) {
      try {
        photos = JSON.parse(localStorage.getItem(LS_KEY_PHOTOS) || '[]');
      } catch (e) { photos = []; }
    }
    renderPhotoWall(photos);
  }

  function renderPhotoWall(photos) {
    const grid = document.getElementById('photoWallGrid');
    if (!grid) return;

    if (photos.length === 0) {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#999;padding:2rem">Belum ada foto. Jadilah yang pertama! 📸</p>';
      return;
    }

    grid.innerHTML = photos.slice(-12).reverse().map(p => `
      <div class="photo-wall-item" onclick="openPhotoLightbox('${(p.url || p.data || '').replace(/'/g, "\\'")}')">
        <img src="${p.url || p.data}" alt="${escapeHtml(p.name)}">
        <div class="photo-wall-caption">
          <strong>${escapeHtml(p.name)}</strong>
          ${p.caption ? escapeHtml(p.caption) : ''}
        </div>
      </div>
    `).join('');
  }

  async function submitPhoto() {
    const name = document.getElementById('photoName').value.trim();
    const caption = document.getElementById('photoCaption').value.trim();

    if (!name) { showToast('⚠️ Isi nama Anda'); return; }
    if (!pendingPhotoData) { showToast('⚠️ Pilih foto dulu'); return; }

    let url = pendingPhotoData;

    // Upload ke Drive via GAS
    if (GAS) {
      showToast('⏳ Mengupload foto...');
      try {
        const res = await fetch(GAS, {
          method: 'POST',
          body: JSON.stringify({
            action: 'uploadPhoto',
            data: pendingPhotoData,
            name: `photo-${Date.now()}.jpg`
          })
        });
        const data = await res.json();
        if (data.url) url = data.url;
      } catch (e) {
        console.warn('Gagal upload ke Drive, simpan lokal');
      }
    }

    const photoData = {
      name,
      caption,
      url,
      data: GAS ? '' : pendingPhotoData, // hanya simpan base64 kalau tidak ada GAS
      time: new Date().toLocaleString('id-ID'),
      approved: !GAS // auto-approve kalau tidak pakai GAS
    };

    // Save
    const arr = JSON.parse(localStorage.getItem(LS_KEY_PHOTOS) || '[]');
    arr.push(photoData);
    localStorage.setItem(LS_KEY_PHOTOS, JSON.stringify(arr));

    if (GAS) {
      fetch(GAS, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addPhoto', ...photoData })
      }).catch(e => console.warn(e));
    }

    // Reset
    pendingPhotoData = null;
    document.getElementById('photoPreview').style.display = 'none';
    document.getElementById('photoName').value = '';
    document.getElementById('photoCaption').value = '';
    document.getElementById('photoInput').value = '';

    // Confetti!
    if (window.launchConfetti) {
      window.launchConfetti();
      if (window.animateConfetti) window.animateConfetti();
    }

    showToast('📸 Terima kasih! Foto akan segera tampil.');
    loadPhotoWall();
  }

  function openPhotoLightbox(url) {
    if (!url) return;
    const lb = document.createElement('div');
    lb.className = 'lightbox active';
    lb.innerHTML = `<img src="${url}" style="max-width:90vw;max-height:85vh;border:4px solid #d4af37;border-radius:12px">`;
    lb.onclick = () => lb.remove();
    document.body.appendChild(lb);
  }

  // ============ SIGNATURE PAD ============
  let sigCanvas, sigCtx, sigDrawing = false, sigPoints = [];

  function initSignaturePad() {
    sigCanvas = document.getElementById('signatureCanvas');
    if (!sigCanvas) return;

    sigCtx = sigCanvas.getContext('2d');
    resizeSignatureCanvas();
    window.addEventListener('resize', () => {
      resizeSignatureCanvas();
      redrawSignature();
    });

    // Pointer events (mouse + touch + stylus)
    sigCanvas.addEventListener('pointerdown', startDraw);
    sigCanvas.addEventListener('pointermove', draw);
    sigCanvas.addEventListener('pointerup', endDraw);
    sigCanvas.addEventListener('pointercancel', endDraw);
    sigCanvas.addEventListener('pointerleave', endDraw);

    loadSignatureWall();
  }

  function resizeSignatureCanvas() {
    const rect = sigCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    sigCanvas.width = rect.width * dpr;
    sigCanvas.height = rect.height * dpr;
    sigCtx.scale(dpr, dpr);
    sigCtx.lineCap = 'round';
    sigCtx.lineJoin = 'round';
    sigCtx.strokeStyle = '#1a0f0a';
    sigCtx.lineWidth = 2.5;
  }

  function startDraw(e) {
    sigDrawing = true;
    sigPoints = [];
    const rect = sigCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    sigPoints.push({ x, y });
    sigCtx.beginPath();
    sigCtx.moveTo(x, y);
  }

  function draw(e) {
    if (!sigDrawing) return;
    const rect = sigCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    sigPoints.push({ x, y });
    sigCtx.lineTo(x, y);
    sigCtx.stroke();
  }

  function endDraw() {
    sigDrawing = false;
  }

  function redrawSignature() {
    if (sigPoints.length === 0) return;
    const rect = sigCanvas.getBoundingClientRect();
    sigCtx.clearRect(0, 0, rect.width, rect.height);
    sigCtx.beginPath();
    sigPoints.forEach((p, i) => {
      if (i === 0) sigCtx.moveTo(p.x, p.y);
      else sigCtx.lineTo(p.x, p.y);
    });
    sigCtx.stroke();
  }

  function clearSignature() {
    const rect = sigCanvas.getBoundingClientRect();
    sigCtx.clearRect(0, 0, rect.width, rect.height);
    sigPoints = [];
  }

  function openSignaturePad() {
    document.getElementById('signatureModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => resizeSignatureCanvas(), 100);
  }

  function closeSignaturePad() {
    document.getElementById('signatureModal').classList.remove('active');
    document.body.style.overflow = 'auto';
    clearSignature();
  }

  async function saveSignature() {
    const name = document.getElementById('sigName').value.trim();
    const message = document.getElementById('sigMessage').value.trim();

    if (!name) { showToast('⚠️ Isi nama Anda'); return; }
    if (sigPoints.length < 5) { showToast('⚠️ Tanda tangan dulu'); return; }

    // Trim canvas (remove whitespace)
    const trimmed = trimCanvas(sigCanvas);
    const dataUrl = trimmed.toDataURL('image/png');

    const sigData = {
      name,
      message,
      signature: dataUrl,
      time: new Date().toLocaleString('id-ID')
    };

    // Save
    const arr = JSON.parse(localStorage.getItem(LS_KEY_SIGN) || '[]');
    arr.push(sigData);
    localStorage.setItem(LS_KEY_SIGN, JSON.stringify(arr));

    if (GAS) {
      fetch(GAS, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addSignature', ...sigData })
      }).catch(e => console.warn(e));
    }

    showToast('✍️ Tanda tangan tersimpan!');
    document.getElementById('sigName').value = '';
    document.getElementById('sigMessage').value = '';
    clearSignature();
    loadSignatureWall();
  }

  // Trim whitespace dari canvas
  function trimCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const pixels = ctx.getImageData(0, 0, w, h);
    const data = pixels.data;

    let top = null, left = null, right = null, bottom = null;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        if (data[idx + 3] > 10) {
          if (top === null) top = y;
          if (left === null || x < left) left = x;
          if (right === null || x > right) right = x;
          bottom = y;
        }
      }
    }

    if (top === null) return canvas;

    const padding = 10;
    top = Math.max(0, top - padding);
    left = Math.max(0, left - padding);
    right = Math.min(w - 1, right + padding);
    bottom = Math.min(h - 1, bottom + padding);

    const nw = right - left + 1;
    const nh = bottom - top + 1;

    const out = document.createElement('canvas');
    out.width = nw;
    out.height = nh;
    out.getContext('2d').drawImage(canvas, left, top, nw, nh, 0, 0, nw, nh);
    return out;
  }

  function loadSignatureWall() {
    const wall = document.getElementById('signatureWall');
    if (!wall) return;

    const arr = JSON.parse(localStorage.getItem(LS_KEY_SIGN) || '[]');
    if (arr.length === 0) {
      wall.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#999;font-size:.8rem">Belum ada tanda tangan</p>';
      return;
    }

    wall.innerHTML = arr.slice(-8).reverse().map(s => `
      <div class="signature-wall-item">
        <img src="${s.signature}" alt="${escapeHtml(s.name)}">
        <strong>${escapeHtml(s.name)}</strong>
      </div>
    `).join('');
  }

  // ============ LIVE WALL ============
  let livewallTimer = null;
  let livewallIndex = 0;
  let livewallItems = [];
  let livewallPaused = false;

  async function openLiveWall() {
    const modal = document.getElementById('livewallModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Collect items
    livewallItems = [];

    // Photos
    try {
      const photos = JSON.parse(localStorage.getItem(LS_KEY_PHOTOS) || '[]');
      photos.forEach(p => livewallItems.push({ type: 'photo', ...p }));
    } catch (e) {}

    // Wishes (RSVP)
    try {
      const wishes = JSON.parse(localStorage.getItem('weddingWishesSugiantoNovi') || '[]');
      wishes.forEach(w => livewallItems.push({ type: 'wish', ...w }));
    } catch (e) {}

    // Signatures
    try {
      const sigs = JSON.parse(localStorage.getItem(LS_KEY_SIGN) || '[]');
      sigs.forEach(s => livewallItems.push({ type: 'signature', ...s }));
    } catch (e) {}

    // Shuffle
    livewallItems.sort(() => Math.random() - 0.5);

    if (livewallItems.length === 0) {
      document.getElementById('livewallContent').innerHTML =
        '<div class="livewall-ornament">囍</div><p class="livewall-wish">Belum ada konten. Bagikan foto & ucapan Anda!</p>';
      return;
    }

    livewallIndex = 0;
    livewallPaused = false;
    showLivewallItem();
    startLivewallTimer();
  }

  function showLivewallItem() {
    const item = livewallItems[livewallIndex];
    const container = document.getElementById('livewallContent');
    container.style.animation = 'none';
    void container.offsetWidth;
    container.style.animation = 'livewallFade 1s ease';

    if (item.type === 'photo') {
      container.innerHTML = `
        <img class="livewall-photo" src="${item.url || item.data}" alt="${escapeHtml(item.name)}">
        <div class="livewall-caption">
          <strong>${escapeHtml(item.name)}</strong>
          ${item.caption ? `<p>"${escapeHtml(item.caption)}"</p>` : ''}
        </div>
      `;
    } else if (item.type === 'wish') {
      container.innerHTML = `
        <div class="livewall-ornament">囍</div>
        <p class="livewall-wish">"${escapeHtml(item.message || 'Selamat menempuh hidup baru!')}"</p>
        <p class="livewall-wish-author">— ${escapeHtml(item.name)}</p>
      `;
    } else if (item.type === 'signature') {
      container.innerHTML = `
        <div class="livewall-ornament">✍</div>
        <img src="${item.signature}" style="max-width:400px;background:#fff;padding:1rem;border-radius:12px;border:3px solid #d4af37">
        <div class="livewall-caption">
          <strong>${escapeHtml(item.name)}</strong>
          ${item.message ? `<p>"${escapeHtml(item.message)}"</p>` : ''}
        </div>
      `;
    }
  }

  function startLivewallTimer() {
    if (livewallTimer) clearInterval(livewallTimer);
    livewallTimer = setInterval(() => {
      if (livewallPaused) return;
      livewallIndex = (livewallIndex + 1) % livewallItems.length;
      showLivewallItem();
    }, 5000);
  }

  function closeLiveWall() {
    document.getElementById('livewallModal').classList.remove('active');
    document.body.style.overflow = 'auto';
    if (livewallTimer) clearInterval(livewallTimer);
  }

  // Toggle pause on click
  document.addEventListener('click', (e) => {
    if (e.target.closest('#livewallContent')) {
      livewallPaused = !livewallPaused;
      showToast(livewallPaused ? '⏸ Paused' : '▶ Playing');
    }
  });

  // ESC closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (document.getElementById('livewallModal')?.classList.contains('active')) closeLiveWall();
      if (document.getElementById('signatureModal')?.classList.contains('active')) closeSignaturePad();
    }
  });

  // ============ UTILS ============
  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }

  function showToast(msg) {
    if (typeof window.showToast === 'function') {
      window.showToast(msg);
      return;
    }
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 500);
    }, 2500);
  }

  // ============ EXPOSE GLOBAL ============
  window.submitPhoto = submitPhoto;
  window.openPhotoLightbox = openPhotoLightbox;
  window.openSignaturePad = openSignaturePad;
  window.closeSignaturePad = closeSignaturePad;
  window.clearSignature = clearSignature;
  window.saveSignature = saveSignature;
  window.openLiveWall = openLiveWall;
  window.closeLiveWall = closeLiveWall;

  // ============ INIT ============
  function init() {
    initChibi();
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