/* ================================================
   ADMIN PANEL - Sugianto & Novi (FIXED VERSION)
   ================================================ */
(function () {
  'use strict';

  // ============ CONFIG FALLBACK ============
  // Kalau config.js gagal load, pakai default ini
  const DEFAULT_CONFIG = {
    groom: "Sugianto",
    bride: "Novi Mutirara",
    weddingDate: "2025-12-12T07:00:00",
    gasUrl: "",
    adminPassword: "admin123",
    videoId: "dQw4w9WgXcQ",
    mapEmbedUrl: "",
    gallery: ["assets/cover.jpg", "assets/bride.jpg", "assets/groom.jpg"],
    events: [
      { icon: '🍵', title: 'Tea Ceremony', chinese: '敬茶儀式', day: 'Jumat', date: '12 Desember 2025', time: '07:00 WIB', place: 'Kediaman Mempelai Pria', address: 'Jl. Kemenangan No. 88, Jakarta' },
      { icon: '💍', title: 'Akad & Pemberkatan', chinese: '證婚儀式', day: 'Jumat', date: '12 Desember 2025', time: '10:00 WIB', place: 'Vihara Dharma Bhakti', address: 'Jl. Kemenangan III No. 13, Jakarta' },
      { icon: '🐉', title: 'Resepsi', chinese: '喜宴', day: 'Sabtu', date: '13 Desember 2025', time: '18:00 - 22:00', place: 'Golden Dragon Ballroom', address: 'Jl. Asia Afrika No. 8, Jakarta', wide: true }
    ]
  };

  const CFG = (typeof window.CONFIG !== 'undefined') ? window.CONFIG : DEFAULT_CONFIG;

  let adminConfig = JSON.parse(JSON.stringify(CFG));
  let adminWishes = [];

  // ============ HELPERS ============
  function $(id) { return document.getElementById(id); }

  function escapeHTML(str) {
    return String(str || '').replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }

  function showToast(msg) {
    const t = $('toastAdmin');
    if (!t) { alert(msg); return; }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 3000);
  }

  // ============ AUTH ============
  function handleLogin() {
    const pass = $('loginPassword').value;
    const expected = CFG.adminPassword || 'admin123';

    if (pass === expected) {
      sessionStorage.setItem('adminLoggedIn', 'true');
      showDashboard();
    } else {
      $('loginError').textContent = '❌ Password salah!';
      $('loginPassword').value = '';
    }
  }

  function handleLogout() {
    if (!confirm('Keluar dari admin panel?')) return;
    sessionStorage.removeItem('adminLoggedIn');
    location.reload();
  }

  function showDashboard() {
    $('loginScreen').classList.add('hidden');
    $('dashboard').classList.remove('hidden');
    initDashboard();
  }

  // ============ INIT ============
  async function initDashboard() {
    // Load config tersimpan
    const localCfg = localStorage.getItem('weddingConfigSugiantoNovi');
    if (localCfg) {
      try {
        Object.assign(adminConfig, JSON.parse(localCfg));
      } catch (e) { console.warn('Config lokal rusak'); }
    }

    // Load config dari GAS (jika ada)
    if (CFG.gasUrl) {
      try {
        const res = await fetch(CFG.gasUrl + '?action=getConfig');
        const data = await res.json();
        if (data.config) Object.assign(adminConfig, data.config);
      } catch (e) { console.warn('GAS config gagal', e); }
    }

    // Load data
    await loadWishesData();

    // Render semua
    updateStats();
    renderRecentWishes();
    renderProgress();
    renderWishesTable();
    renderGalleryAdmin();
    loadEventsEditor();
    loadCoupleEditor();
    loadSettingsEditor();

    // Setup nav
    document.querySelectorAll('.nav-item').forEach(item => {
      item.onclick = (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        item.classList.add('active');
        const tab = document.getElementById('tab-' + item.dataset.tab);
        if (tab) tab.classList.add('active');
      };
    });
  }

  // ============ LOAD WISHES ============
  async function loadWishesData() {
    if (CFG.gasUrl) {
      try {
        const res = await fetch(CFG.gasUrl + '?action=list');
        const data = await res.json();
        adminWishes = data.wishes || [];
        return;
      } catch (e) { console.warn('GAS gagal, pakai localStorage'); }
    }
    try {
      adminWishes = JSON.parse(localStorage.getItem('weddingWishesSugiantoNovi') || '[]');
    } catch (e) { adminWishes = []; }
  }

  // ============ STATS ============
  function updateStats() {
    const hadir = adminWishes.filter(w => w.attend === 'Hadir').length;
    const tidak = adminWishes.filter(w => w.attend === 'Tidak Hadir').length;
    const ragu = adminWishes.filter(w => w.attend === 'Masih Ragu').length;

    const el = (id, val) => { const e = $(id); if (e) e.textContent = val; };
    el('statTotal', adminWishes.length);
    el('statHadir', hadir);
    el('statTidak', tidak);
    el('statRagu', ragu);
  }

  function renderProgress() {
    const total = adminWishes.length || 1;
    const hadir = adminWishes.filter(w => w.attend === 'Hadir').length;
    const tidak = adminWishes.filter(w => w.attend === 'Tidak Hadir').length;
    const ragu = adminWishes.filter(w => w.attend === 'Masih Ragu').length;

    const items = [
      { label: '✓ Hadir', value: hadir, color: 'var(--green, #16a34a)' },
      { label: '✗ Tidak Hadir', value: tidak, color: '#dc2626' },
      { label: '? Masih Ragu', value: ragu, color: 'var(--orange, #ea8c00)' }
    ];

    const box = $('progressList');
    if (!box) return;

    box.innerHTML = items.map(it => {
      const pct = (it.value / total) * 100;
      return `
        <div class="progress-item">
          <div class="progress-item-header">
            <span>${it.label}</span>
            <span><strong>${it.value}</strong> (${Math.round(pct)}%)</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width:${pct}%;background:${it.color}"></div>
          </div>
        </div>`;
    }).join('');
  }

  function renderRecentWishes() {
    const box = $('recentWishes');
    if (!box) return;

    const recent = adminWishes.slice(-5).reverse();
    if (recent.length === 0) {
      box.innerHTML = '<p style="color:#999;font-size:.85rem">Belum ada ucapan</p>';
      return;
    }
    box.innerHTML = recent.map(w => `
      <div class="recent-item">
        <strong>${escapeHTML(w.name)}</strong>
        <span class="badge ${w.attend === 'Hadir' ? 'hadir' : w.attend === 'Tidak Hadir' ? 'tidak' : 'ragu'}">${escapeHTML(w.attend)}</span>
        <p style="margin-top:.3rem;color:#5a3a3a">${escapeHTML(w.message || '(tanpa pesan)')}</p>
      </div>`).join('');
  }

  // ============ WISHES TABLE ============
  function renderWishesTable(filtered) {
    const tbody = $('wishesTableBody');
    if (!tbody) return;

    const data = filtered || adminWishes;
    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:#999">Belum ada data</td></tr>';
      return;
    }
    tbody.innerHTML = data.map((w, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${escapeHTML(w.name)}</strong></td>
        <td><span class="badge ${w.attend === 'Hadir' ? 'hadir' : w.attend === 'Tidak Hadir' ? 'tidak' : 'ragu'}">${escapeHTML(w.attend)}</span></td>
        <td>${escapeHTML(w.message || '-')}</td>
        <td><small>${escapeHTML(w.time || '')}</small></td>
      </tr>`).join('');
  }

  function filterWishes() {
    const q = ($('searchWishes')?.value || '').toLowerCase();
    const filter = $('filterAttend')?.value || '';

    const filtered = adminWishes.filter(w => {
      const matchQ = !q || w.name.toLowerCase().includes(q) ||
        (w.message || '').toLowerCase().includes(q);
      const matchF = !filter || w.attend === filter;
      return matchQ && matchF;
    });
    renderWishesTable(filtered);
  }

  // ============ EXPORT CSV ============
  function exportCSV() {
    if (adminWishes.length === 0) { showToast('Tidak ada data'); return; }

    const headers = ['No', 'Nama', 'Kehadiran', 'Ucapan', 'Waktu'];
    const rows = adminWishes.map((w, i) => [
      i + 1, w.name, w.attend,
      `"${(w.message || '').replace(/"/g, '""')}"`,
      w.time
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `RSVP-${adminConfig.groom}-${adminConfig.bride}.csv`;
    link.click();
    showToast('📥 CSV berhasil di-export!');
  }

  // ============ CLEAR WISHES ============
  function confirmClearWishes() {
    if (!confirm('⚠️ Yakin hapus SEMUA ucapan?')) return;
    if (!confirm('Konfirmasi sekali lagi?')) return;
    localStorage.removeItem('weddingWishesSugiantoNovi');
    adminWishes = [];
    updateStats();
    renderWishesTable();
    renderRecentWishes();
    renderProgress();
    showToast('🗑 Semua ucapan dihapus');
  }

  // ============ GALLERY ============
  function renderGalleryAdmin() {
    const grid = $('galleryAdminGrid');
    if (!grid) return;

    const countEl = $('galleryCount');
    if (countEl) countEl.textContent = adminConfig.gallery.length;

    if (adminConfig.gallery.length === 0) {
      grid.innerHTML = '<p style="color:#999;grid-column:1/-1;text-align:center;padding:2rem">Belum ada gambar</p>';
      return;
    }

    grid.innerHTML = adminConfig.gallery.map((src, i) => `
      <div class="gallery-admin-item">
        <img src="${src}" alt="Gallery ${i+1}" onerror="this.src='assets/cover.jpg'">
        <div class="gallery-admin-overlay">
          <button class="edit" data-action="edit" data-index="${i}">✏ Edit</button>
          <button class="delete" data-action="delete" data-index="${i}">🗑 Hapus</button>
        </div>
      </div>`).join('');

    // Attach listeners (bukan inline onclick)
    grid.querySelectorAll('[data-action]').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.index);
        if (btn.dataset.action === 'edit') editGalleryImage(idx);
        else deleteGalleryImage(idx);
      };
    });
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const box = $('previewBox');
      if (box) box.innerHTML = `<img src="${ev.target.result}">`;
      e.target.dataset.base64 = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  async function addGalleryImage() {
    const urlInput = $('newImageUrl')?.value.trim();
    const fileInput = $('newImageFile');
    const base64 = fileInput?.dataset.base64;

    let imageUrl = urlInput;

    if (base64 && CFG.gasUrl) {
      showToast('⏳ Upload ke Drive...');
      try {
        const res = await fetch(CFG.gasUrl, {
          method: 'POST',
          body: JSON.stringify({ action: 'uploadImage', data: base64, name: `gallery-${Date.now()}.jpg` })
        });
        const data = await res.json();
        if (data.url) imageUrl = data.url;
      } catch (err) {
        showToast('❌ Gagal upload, pakai URL manual');
      }
    } else if (base64 && !CFG.gasUrl) {
      imageUrl = base64;
    }

    if (!imageUrl) { showToast('⚠️ Isi URL atau pilih file'); return; }

    adminConfig.gallery.push(imageUrl);
    saveConfig();
    renderGalleryAdmin();

    if ($('newImageUrl')) $('newImageUrl').value = '';
    if (fileInput) { fileInput.value = ''; delete fileInput.dataset.base64; }
    if ($('previewBox')) $('previewBox').innerHTML = '<p class="preview-placeholder">Preview muncul di sini</p>';
    showToast('✓ Gambar ditambahkan!');
  }

  function editGalleryImage(index) {
    const current = adminConfig.gallery[index];
    const newUrl = prompt('Edit URL gambar:', current);
    if (newUrl === null) return;
    if (newUrl.trim() === '') { showToast('URL tidak boleh kosong'); return; }
    adminConfig.gallery[index] = newUrl.trim();
    saveConfig();
    renderGalleryAdmin();
    showToast('✓ Gambar diperbarui');
  }

  function deleteGalleryImage(index) {
    if (!confirm('Hapus gambar ini dari gallery?')) return;
    adminConfig.gallery.splice(index, 1);
    saveConfig();
    renderGalleryAdmin();
    showToast('✓ Gambar dihapus');
  }

  // ============ EVENTS ============
  function loadEventsEditor() {
    if (!adminConfig.events) adminConfig.events = JSON.parse(JSON.stringify(DEFAULT_CONFIG.events));
    renderEventsEditor();
  }

  function renderEventsEditor() {
    const container = $('eventsEditor');
    if (!container) return;

    container.innerHTML = (adminConfig.events || []).map((ev, i) => `
      <div class="event-editor-card">
        <div class="event-editor-header">
          <h3>Acara #${i + 1}: ${escapeHTML(ev.title || '(tanpa judul)')}</h3>
          <button class="btn-remove" data-remove="${i}">🗑 Hapus</button>
        </div>
        <div class="form-row">
          <div class="input-group">
            <label>Icon (emoji)</label>
            <input type="text" value="${escapeHTML(ev.icon || '')}" data-ev="${i}" data-key="icon">
          </div>
          <div class="input-group">
            <label>Judul</label>
            <input type="text" value="${escapeHTML(ev.title || '')}" data-ev="${i}" data-key="title">
          </div>
        </div>
        <div class="form-row">
          <div class="input-group">
            <label>Judul Chinese</label>
            <input type="text" value="${escapeHTML(ev.chinese || '')}" data-ev="${i}" data-key="chinese">
          </div>
          <div class="input-group">
            <label>Hari</label>
            <input type="text" value="${escapeHTML(ev.day || '')}" data-ev="${i}" data-key="day">
          </div>
        </div>
        <div class="form-row">
          <div class="input-group">
            <label>Tanggal</label>
            <input type="text" value="${escapeHTML(ev.date || '')}" data-ev="${i}" data-key="date">
          </div>
          <div class="input-group">
            <label>Waktu</label>
            <input type="text" value="${escapeHTML(ev.time || '')}" data-ev="${i}" data-key="time">
          </div>
        </div>
        <div class="input-group">
          <label>Tempat</label>
          <input type="text" value="${escapeHTML(ev.place || '')}" data-ev="${i}" data-key="place">
        </div>
        <div class="input-group">
          <label>Alamat</label>
          <input type="text" value="${escapeHTML(ev.address || '')}" data-ev="${i}" data-key="address">
        </div>
      </div>`).join('');

    // Attach listeners
    container.querySelectorAll('[data-ev]').forEach(input => {
      input.onchange = (e) => {
        const i = parseInt(e.target.dataset.ev);
        const key = e.target.dataset.key;
        adminConfig.events[i][key] = e.target.value;
      };
    });
    container.querySelectorAll('[data-remove]').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        removeEvent(parseInt(btn.dataset.remove));
      };
    });
  }

  function addNewEvent() {
    if (!adminConfig.events) adminConfig.events = [];
    adminConfig.events.push({
      icon: '🎉', title: 'Acara Baru', chinese: '新活動',
      day: 'Hari', date: 'Tanggal', time: 'Waktu',
      place: 'Tempat', address: 'Alamat'
    });
    renderEventsEditor();
    showToast('✓ Acara baru ditambahkan, jangan lupa Simpan');
  }

  function removeEvent(i) {
    if (!confirm('Hapus acara ini?')) return;
    adminConfig.events.splice(i, 1);
    renderEventsEditor();
  }

  function saveEvents() {
    saveConfig();
    showToast('✓ Semua acara disimpan');
  }

  // ============ COUPLE ============
  function loadCoupleEditor() {
    if ($('editGroomName')) $('editGroomName').value = adminConfig.groom || '';
    if ($('editBrideName')) $('editBrideName').value = adminConfig.bride || '';
    if ($('editGroomPhoto')) $('editGroomPhoto').value = adminConfig.groomPhoto || 'assets/groom.jpg';
    if ($('editBridePhoto')) $('editBridePhoto').value = adminConfig.bridePhoto || 'assets/bride.jpg';
    if ($('editGroomParents')) $('editGroomParents').value =
      adminConfig.groomParents ? adminConfig.groomParents.join(', ') : 'Bapak Sugiharto, Ibu Liem Mei Hwa';
    if ($('editBrideParents')) $('editBrideParents').value =
      adminConfig.brideParents ? adminConfig.brideParents.join(', ') : 'Bapak Tan Kok Beng, Ibu Ong Siew Lan';
  }

  function saveCouple() {
    adminConfig.groom = $('editGroomName').value;
    adminConfig.bride = $('editBrideName').value;
    adminConfig.groomPhoto = $('editGroomPhoto').value;
    adminConfig.bridePhoto = $('editBridePhoto').value;
    adminConfig.groomParents = $('editGroomParents').value.split(',').map(s => s.trim());
    adminConfig.brideParents = $('editBrideParents').value.split(',').map(s => s.trim());
    saveConfig();
    showToast('✓ Info mempelai disimpan');
  }

  // ============ SETTINGS ============
  function loadSettingsEditor() {
    const d = new Date(adminConfig.weddingDate);
    const iso = !isNaN(d.getTime()) ? d.toISOString().slice(0, 16) : '';
    if ($('editWeddingDate')) $('editWeddingDate').value = iso;
    if ($('editVideoId')) $('editVideoId').value = adminConfig.videoId || '';
    if ($('editMapEmbed')) $('editMapEmbed').value = adminConfig.mapEmbedUrl || '';
    if ($('gasStatus')) {
      $('gasStatus').textContent = CFG.gasUrl ? '✓ Terhubung' : '⚠ Belum disetup (pakai localStorage)';
    }
  }

  function saveSettings() {
    const dt = $('editWeddingDate')?.value;
    if (dt) adminConfig.weddingDate = new Date(dt).toISOString();
    adminConfig.videoId = $('editVideoId')?.value.trim() || '';
    adminConfig.mapEmbedUrl = $('editMapEmbed')?.value.trim() || '';
    saveConfig();
    showToast('✓ Pengaturan disimpan');
  }

  // ============ CONFIG SAVE/LOAD ============
  function saveConfig() {
    localStorage.setItem('weddingConfigSugiantoNovi', JSON.stringify(adminConfig));

    if (CFG.gasUrl) {
      fetch(CFG.gasUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'saveConfig',
          config: adminConfig,
          password: CFG.adminPassword
        })
      }).catch(e => console.warn('GAS save gagal', e));
    }
  }

  function exportConfig() {
    const data = JSON.stringify(adminConfig, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `wedding-config-${Date.now()}.json`;
    link.click();
    showToast('📤 Config di-export!');
  }

  function importConfig(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        Object.assign(adminConfig, data);
        saveConfig();
        renderGalleryAdmin();
        loadEventsEditor();
        loadCoupleEditor();
        loadSettingsEditor();
        showToast('✓ Config di-import!');
      } catch (err) {
        showToast('❌ File tidak valid');
      }
    };
    reader.readAsText(file);
  }

  // ============ EVENT BINDINGS (GLOBAL) ============
  window.handleLogin = handleLogin;
  window.handleLogout = handleLogout;
  window.filterWishes = filterWishes;
  window.exportCSV = exportCSV;
  window.confirmClearWishes = confirmClearWishes;
  window.addGalleryImage = addGalleryImage;
  window.handleFileUpload = handleFileUpload;
  window.editGalleryImage = editGalleryImage;
  window.deleteGalleryImage = deleteGalleryImage;
  window.addNewEvent = addNewEvent;
  window.removeEvent = removeEvent;
  window.saveEvents = saveEvents;
  window.saveCouple = saveCouple;
  window.saveSettings = saveSettings;
  window.exportConfig = exportConfig;
  window.importConfig = importConfig;

  // ============ STARTUP ============
  function onReady() {
    // Enter key pada input password
    const pwInput = $('loginPassword');
    if (pwInput) {
      pwInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
      });
    }

    // Preview input URL gallery
    const urlInput = $('newImageUrl');
    if (urlInput) {
      urlInput.addEventListener('input', (e) => {
        const url = e.target.value;
        const preview = $('previewBox');
        if (!preview) return;
        if (url) {
          preview.innerHTML = `<img src="${url}" onerror="this.parentNode.innerHTML='<p class=&quot;preview-placeholder&quot;>⚠️ Gambar tidak bisa dimuat</p>'">`;
        } else {
          preview.innerHTML = '<p class="preview-placeholder">Preview muncul di sini</p>';
        }
      });
    }

    // File input
    const fileInput = $('newImageFile');
    if (fileInput) fileInput.addEventListener('change', handleFileUpload);

    // Auto-login kalau session aktif
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
      showDashboard();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();