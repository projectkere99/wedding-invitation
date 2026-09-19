/* ================================================
   ADMIN PANEL — Sugianto & Novi Mutiara
   Clean version, no dependencies
================================================ */
'use strict';

(function() {
  const ADMIN_PASSWORD = 'suginovi30'; // ← GANTI!
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbyWRRp4X3OX3dt7rYxA1gSOWa-42m24sr63IN2ppRiVJ7MHXnY_VSu0eNp-Ir6Dn2Pmjw/exec';
  const LS_WISHES = 'wishesSugiantoNovi';
  const LS_PHOTOS = 'photosSugiantoNovi';
  const LS_SIGN = 'signaturesSugiantoNovi';
  const LS_LANTERN = 'lanternsSugiantoNovi';
  const LS_GALLERY = 'gallerySugiantoNovi';

  let wishes = [];
  let photos = [];
  let signatures = [];
  let lanterns = [];
  let gallery = [];

  // Default gallery (fallback pertama kali)
  const DEFAULT_GALLERY = [
    'assets/cover.jpg',
    'assets/groom.jpg',
    'assets/bride.jpg',
    'assets/cover.jpg',
    'assets/groom.jpg',
    'assets/bride.jpg'
  ];


  /* ============ UTILS ============ */
  function $(id) { return document.getElementById(id); }

  function escapeHTML(str) {
    return String(str || '').replace(/[&<>"']/g, function(m) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m];
    });
  }

  function showToast(msg) {
    const t = $('toastAdmin');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(function() { t.classList.remove('show'); }, 2800);
  }

  function loadJSON(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) { return []; }
  }

  function saveJSON(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) { return false; }
  }

  /* ============ AUTH ============ */
  function handleLogin() {
    const pass = $('loginPassword').value;
    if (pass === ADMIN_PASSWORD) {
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

  /* ============ INIT DASHBOARD ============ */
  function initDashboard() {
    // Load data
    wishes = loadJSON(LS_WISHES);
    photos = loadJSON(LS_PHOTOS);
    signatures = loadJSON(LS_SIGN);
    lanterns = loadJSON(LS_LANTERN);
    gallery = loadGallery();


    // Render
    updateStats();
    renderRecent();
    renderProgress();
    renderWishesTable();
    renderPhotosGrid();
    renderSignaturesGrid();
    renderLanternsList();
    renderGalleryAdmin();
    initGalleryManager();

    // Setup nav
    document.querySelectorAll('.nav-item').forEach(function(item) {
      item.onclick = function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(function(i) { i.classList.remove('active'); });
        document.querySelectorAll('.tab-content').forEach(function(t) { t.classList.remove('active'); });
        item.classList.add('active');
        const tab = document.getElementById('tab-' + item.dataset.tab);
        if (tab) tab.classList.add('active');
      };
    });

    // Toolbar
    const searchW = $('searchWishes');
    if (searchW) searchW.addEventListener('input', filterWishes);
    const filterA = $('filterAttend');
    if (filterA) filterA.addEventListener('change', filterWishes);

    const expBtn = $('btnExportCSV');
    if (expBtn) expBtn.addEventListener('click', exportCSV);

    const clearBtn = $('btnClearWishes');
    if (clearBtn) clearBtn.addEventListener('click', clearAllWishes);
  }

  /* ============ STATS ============ */
  function updateStats() {
    const hadir = wishes.filter(function(w) { return w.attend === 'Hadir'; }).length;
    const tidak = wishes.filter(function(w) { return w.attend === 'Tidak Hadir'; }).length;
    const ragu = wishes.filter(function(w) { return w.attend === 'Masih Ragu'; }).length;

    $('statWishes').textContent = wishes.length;
    $('statHadir').textContent = hadir;
    $('statTidak').textContent = tidak;
    $('statRagu').textContent = ragu;
    $('statPhotos').textContent = photos.length;
    $('statSigns').textContent = signatures.length;
    $('statLanterns').textContent = lanterns.length;
    const statGal = $('statGallery');
    if (statGal) statGal.textContent = gallery.length;
  }

  function renderProgress() {
    const total = wishes.length || 1;
    const hadir = wishes.filter(function(w) { return w.attend === 'Hadir'; }).length;
    const tidak = wishes.filter(function(w) { return w.attend === 'Tidak Hadir'; }).length;
    const ragu = wishes.filter(function(w) { return w.attend === 'Masih Ragu'; }).length;

    const items = [
      { label: '✓ Hadir', value: hadir, color: '#16a34a' },
      { label: '✗ Tidak Hadir', value: tidak, color: '#dc2626' },
      { label: '? Masih Ragu', value: ragu, color: '#ea8c00' }
    ];

    $('progressList').innerHTML = items.map(function(it) {
      const pct = (it.value / total) * 100;
      return '<div class="progress-item">' +
        '<div class="progress-item-header">' +
        '<span>' + it.label + '</span>' +
        '<span><strong>' + it.value + '</strong> (' + Math.round(pct) + '%)</span>' +
        '</div>' +
        '<div class="progress-bar-track">' +
        '<div class="progress-bar-fill" style="width:' + pct + '%;background:' + it.color + '"></div>' +
        '</div>' +
        '</div>';
    }).join('');
  }

  function renderRecent() {
    const recent = wishes.slice(-5).reverse();
    const box = $('recentWishes');

    if (recent.length === 0) {
      box.innerHTML = '<p class="empty-state">Belum ada ucapan</p>';
      return;
    }

    box.innerHTML = recent.map(function(w) {
      const cls = w.attend === 'Hadir' ? 'hadir'
        : w.attend === 'Tidak Hadir' ? 'tidak' : 'ragu';
      return '<div class="recent-item">' +
        '<strong>' + escapeHTML(w.name) + '</strong> ' +
        '<span class="badge ' + cls + '">' + escapeHTML(w.attend) + '</span>' +
        '<p style="margin-top:.3rem;color:#5a3a3a">' + escapeHTML(w.message || '(tanpa pesan)') + '</p>' +
        '</div>';
    }).join('');
  }

  /* ============ WISHES TABLE ============ */
  function renderWishesTable(filtered) {
    const data = filtered || wishes;
    const tbody = $('wishesBody');

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Belum ada data</td></tr>';
      return;
    }

    tbody.innerHTML = data.map(function(w, i) {
      const cls = w.attend === 'Hadir' ? 'hadir'
        : w.attend === 'Tidak Hadir' ? 'tidak' : 'ragu';
      return '<tr>' +
        '<td>' + (i + 1) + '</td>' +
        '<td><strong>' + escapeHTML(w.name) + '</strong></td>' +
        '<td><span class="badge ' + cls + '">' + escapeHTML(w.attend) + '</span></td>' +
        '<td>' + escapeHTML(w.message || '-') + '</td>' +
        '<td><small>' + escapeHTML(w.time || '') + '</small></td>' +
        '</tr>';
    }).join('');
  }

  function filterWishes() {
    const q = ($('searchWishes').value || '').toLowerCase();
    const f = $('filterAttend').value;

    const filtered = wishes.filter(function(w) {
      const mQ = !q || w.name.toLowerCase().indexOf(q) !== -1 ||
        (w.message || '').toLowerCase().indexOf(q) !== -1;
      const mF = !f || w.attend === f;
      return mQ && mF;
    });
    renderWishesTable(filtered);
  }

  /* ============ EXPORT CSV ============ */
  function exportCSV() {
    if (wishes.length === 0) { showToast('Tidak ada data'); return; }

    const headers = ['No', 'Nama', 'Kehadiran', 'Ucapan', 'Waktu'];
    const rows = wishes.map(function(w, i) {
      return [
        i + 1,
        w.name,
        w.attend,
        '"' + (w.message || '').replace(/"/g, '""') + '"',
        w.time
      ];
    });

    const csv = [headers.join(',')].concat(rows.map(function(r) { return r.join(','); })).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'RSVP-SugiantoNovi.csv';
    link.click();
    showToast('📥 CSV berhasil di-export!');
  }

  /* ============ CLEAR WISHES ============ */
  function clearAllWishes() {
    if (!confirm('⚠️ Yakin hapus SEMUA ucapan?')) return;
    if (!confirm('Konfirmasi sekali lagi?')) return;

    localStorage.removeItem(LS_WISHES);
    wishes = [];
    updateStats();
    renderWishesTable();
    renderRecent();
    renderProgress();
    showToast('🗑 Semua ucapan dihapus');
  }

  /* ============ PHOTOS ============ */
  function renderPhotosGrid() {
    const grid = $('photosGrid');
    if (!grid) return;

    if (photos.length === 0) {
      grid.innerHTML = '<p class="empty-state" style="grid-column:1/-1">Belum ada foto dari tamu</p>';
      return;
    }

    grid.innerHTML = photos.slice().reverse().map(function(p, revIdx) {
      const realIdx = photos.length - 1 - revIdx;
      return '<div class="mod-item">' +
        '<img src="' + p.data + '" alt="' + escapeHTML(p.name) + '">' +
        '<div class="mod-info">' +
        '<strong>' + escapeHTML(p.name) + '</strong>' +
        '<small>' + escapeHTML(p.caption || '-') + '</small>' +
        '<small>' + escapeHTML(p.time || '') + '</small>' +
        '</div>' +
        '<button class="mod-delete" data-type="photos" data-idx="' + realIdx + '">🗑 Hapus</button>' +
        '</div>';
    }).join('');

    grid.querySelectorAll('.mod-delete').forEach(function(btn) {
      btn.onclick = function() {
        deleteItem(btn.dataset.type, parseInt(btn.dataset.idx));
      };
    });
  }

  /* ============ SIGNATURES ============ */
  function renderSignaturesGrid() {
    const grid = $('signaturesGrid');
    if (!grid) return;

    if (signatures.length === 0) {
      grid.innerHTML = '<p class="empty-state" style="grid-column:1/-1">Belum ada tanda tangan</p>';
      return;
    }

    grid.innerHTML = signatures.slice().reverse().map(function(s, revIdx) {
      const realIdx = signatures.length - 1 - revIdx;
      return '<div class="mod-item">' +
        '<img src="' + s.signature + '" style="background:#fff;padding:.5rem;object-fit:contain" alt="' + escapeHTML(s.name) + '">' +
        '<div class="mod-info">' +
        '<strong>' + escapeHTML(s.name) + '</strong>' +
        '<small>' + escapeHTML(s.message || '-') + '</small>' +
        '<small>' + escapeHTML(s.time || '') + '</small>' +
        '</div>' +
        '<button class="mod-delete" data-type="signatures" data-idx="' + realIdx + '">🗑 Hapus</button>' +
        '</div>';
    }).join('');

    grid.querySelectorAll('.mod-delete').forEach(function(btn) {
      btn.onclick = function() {
        deleteItem(btn.dataset.type, parseInt(btn.dataset.idx));
      };
    });
  }

  /* ============ LANTERNS ============ */
  function renderLanternsList() {
    const box = $('lanternsList');
    if (!box) return;

    if (lanterns.length === 0) {
      box.innerHTML = '<p class="empty-state">Belum ada lentera</p>';
      return;
    }

    box.innerHTML = lanterns.slice().reverse().map(function(l, revIdx) {
      const realIdx = lanterns.length - 1 - revIdx;
      return '<div class="mod-list-item">' +
        '<div>' +
        '<strong>🏮 ' + escapeHTML(l.name) + '</strong>' +
        '<p>' + escapeHTML(l.wish) + '</p>' +
        '<small>' + escapeHTML(l.time || '') + '</small>' +
        '</div>' +
        '<button class="mod-delete" data-type="lanterns" data-idx="' + realIdx + '">🗑</button>' +
        '</div>';
    }).join('');

    box.querySelectorAll('.mod-delete').forEach(function(btn) {
      btn.onclick = function() {
        deleteItem(btn.dataset.type, parseInt(btn.dataset.idx));
      };
    });
  }

  /* ============ DELETE ITEM ============ */
  function deleteItem(type, idx) {
    if (!confirm('Hapus item ini?')) return;

    const map = {
      photos: { key: LS_PHOTOS, arr: photos },
      signatures: { key: LS_SIGN, arr: signatures },
      lanterns: { key: LS_LANTERN, arr: lanterns }
    };

    const target = map[type];
    if (!target) return;

    target.arr.splice(idx, 1);
    saveJSON(target.key, target.arr);

    if (type === 'photos') renderPhotosGrid();
    if (type === 'signatures') renderSignaturesGrid();
    if (type === 'lanterns') renderLanternsList();

    updateStats();
    showToast('🗑 Item dihapus');
  }
  
    /* ============ GALLERY MANAGER ============ */
  function loadGallery() {
    // Load lokal dulu
    try {
      const stored = JSON.parse(localStorage.getItem(LS_GALLERY) || 'null');
      if (stored && Array.isArray(stored) && stored.length > 0) {
        // Load dari GAS di background
        if (typeof GAS_URL !== 'undefined' && GAS_URL) {
          fetch(GAS_URL + '?action=getGallery')
            .then(function(res) { return res.json(); })
            .then(function(data) {
              if (data.gallery && data.gallery.length > 0) {
                gallery = data.gallery;
                localStorage.setItem(LS_GALLERY, JSON.stringify(gallery));
                renderGalleryAdmin();
              }
            })
            .catch(function(err) { console.warn('GAS load error:', err); });
        }
        return stored;
      }
    } catch (e) {}

    // Fallback
    return DEFAULT_GALLERY.slice();
  }

  function saveGallery() {
    try {
      localStorage.setItem(LS_GALLERY, JSON.stringify(gallery));
      localStorage.setItem(LS_GALLERY + '_updated', Date.now().toString());

      // Sync ke Google Sheets
      if (typeof GAS_URL !== 'undefined' && GAS_URL) {
        fetch(GAS_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'saveGallery',
            gallery: gallery,
            password: ADMIN_PASSWORD
          })
        }).catch(function(err) { console.warn('GAS save error:', err); });
      }

      return true;
    } catch (e) {
      showToast('⚠️ Penyimpanan penuh');
      return false;
    }
  }

  function renderGalleryAdmin() {
    const grid = $('galleryAdminGrid');
    if (!grid) return;

    const countEl = $('galleryCount');
    if (countEl) countEl.textContent = gallery.length;

    if (gallery.length === 0) {
      grid.innerHTML = '<p class="empty-state" style="grid-column:1/-1">Belum ada gambar. Tambahkan dari form di atas.</p>';
      return;
    }

    grid.innerHTML = gallery.map(function(src, i) {
      const isFirst = i === 0;
      const isLast = i === gallery.length - 1;
      return '<div class="gallery-admin-item">' +
        '<div class="item-order">' + (i + 1) + '</div>' +
        '<img src="' + src + '" alt="Gallery ' + (i + 1) + '" onerror="this.src=\'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23f0e8d8%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2265%22 font-size=%2240%22 fill=%22%23a01c1c%22 text-anchor=%22middle%22 font-family=%22serif%22>?</text></svg>\'">' +
        '<div class="gallery-admin-overlay">' +
        '<div class="action-row">' +
        '<button type="button" class="btn-up" ' + (isFirst ? 'disabled' : '') + ' data-action="up" data-idx="' + i + '">⬆</button>' +
        '<button type="button" class="btn-down" ' + (isLast ? 'disabled' : '') + ' data-action="down" data-idx="' + i + '">⬇</button>' +
        '</div>' +
        '<div class="action-row">' +
        '<button type="button" class="btn-edit" data-action="edit" data-idx="' + i + '">✏ Edit</button>' +
        '<button type="button" class="btn-delete" data-action="delete" data-idx="' + i + '">🗑</button>' +
        '</div>' +
        '</div>' +
        '</div>';
    }).join('');

    // Attach listeners
    grid.querySelectorAll('[data-action]').forEach(function(btn) {
      btn.onclick = function(e) {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx);
        const action = btn.dataset.action;

        if (action === 'up') moveGalleryItem(idx, -1);
        else if (action === 'down') moveGalleryItem(idx, 1);
        else if (action === 'edit') editGalleryItem(idx);
        else if (action === 'delete') deleteGalleryItem(idx);
      };
    });
  }

  function moveGalleryItem(idx, dir) {
    const target = idx + dir;
    if (target < 0 || target >= gallery.length) return;

    const temp = gallery[idx];
    gallery[idx] = gallery[target];
    gallery[target] = temp;

    saveGallery();
    renderGalleryAdmin();
    showToast(dir === -1 ? '⬆ Gambar dinaikkan' : '⬇ Gambar diturunkan');
  }

  function editGalleryItem(idx) {
    const current = gallery[idx];
    const newUrl = prompt('Edit URL gambar:', current);
    if (newUrl === null) return;
    const trimmed = newUrl.trim();
    if (trimmed === '') {
      showToast('URL tidak boleh kosong');
      return;
    }

    gallery[idx] = trimmed;
    saveGallery();
    renderGalleryAdmin();
    showToast('✓ Gambar diperbarui');
  }

  function deleteGalleryItem(idx) {
    if (!confirm('Hapus gambar ini dari gallery?')) return;
    gallery.splice(idx, 1);
    saveGallery();
    renderGalleryAdmin();
    showToast('✓ Gambar dihapus');
  }

  function addGalleryItem() {
    const urlInput = $('galleryNewUrl');
    const fileInput = $('galleryNewFile');

    const activePanel = document.querySelector('.gallery-tab-btn.active');
    const mode = activePanel ? activePanel.dataset.input : 'url';

    let newSrc = '';

    if (mode === 'url') {
      newSrc = (urlInput.value || '').trim();
      if (!newSrc) { showToast('⚠️ Masukkan URL gambar'); return; }
    } else {
      // Upload mode — ambil dari preview base64 yang sudah di-set
      newSrc = fileInput.dataset.base64 || '';
      if (!newSrc) { showToast('⚠️ Pilih file gambar dulu'); return; }
    }

    gallery.push(newSrc);

    if (!saveGallery()) {
      gallery.pop();
      return;
    }

    renderGalleryAdmin();

    // Reset form
    if (urlInput) urlInput.value = '';
    if (fileInput) {
      fileInput.value = '';
      delete fileInput.dataset.base64;
    }
    const preview = $('galleryPreviewBox');
    if (preview) preview.innerHTML = '<p class="preview-placeholder">Preview muncul di sini</p>';

    showToast('✓ Gambar ditambahkan ke gallery!');
  }

  function resetGallery() {
    if (!confirm('Reset gallery ke default? Semua gambar kustom akan hilang.')) return;
    gallery = DEFAULT_GALLERY.slice();
    saveGallery();
    renderGalleryAdmin();
    showToast('↻ Gallery direset ke default');
  }

  function initGalleryManager() {
    // Tab switch URL / Upload
    document.querySelectorAll('.gallery-tab-btn').forEach(function(btn) {
      btn.onclick = function() {
        document.querySelectorAll('.gallery-tab-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');

        const mode = btn.dataset.input;
        const urlPanel = $('galleryUrlPanel');
        const uploadPanel = $('galleryUploadPanel');

        if (mode === 'url') {
          if (urlPanel) urlPanel.classList.remove('hidden');
          if (uploadPanel) uploadPanel.classList.add('hidden');
        } else {
          if (urlPanel) urlPanel.classList.add('hidden');
          if (uploadPanel) uploadPanel.classList.remove('hidden');
        }
      };
    });

    // Preview URL input
    const urlInput = $('galleryNewUrl');
    if (urlInput) {
      urlInput.addEventListener('input', function(e) {
        const val = e.target.value.trim();
        const preview = $('galleryPreviewBox');
        if (!preview) return;
        if (val) {
          preview.innerHTML = '<img src="' + val + '" onerror="this.parentElement.innerHTML=\'<p class=&quot;preview-placeholder&quot;>⚠️ Gambar tidak bisa dimuat</p>\'">';
        } else {
          preview.innerHTML = '<p class="preview-placeholder">Preview muncul di sini</p>';
        }
      });
    }

    // Preview file upload
    const fileInput = $('galleryNewFile');
    if (fileInput) {
      fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 500 * 1024) {
          showToast('⚠️ File >500KB, sebaiknya kompres dulu');
          // tetap lanjut tapi warning
        }

        const reader = new FileReader();
        reader.onload = function(ev) {
          fileInput.dataset.base64 = ev.target.result;
          const preview = $('galleryPreviewBox');
          if (preview) preview.innerHTML = '<img src="' + ev.target.result + '">';
        };
        reader.readAsDataURL(file);
      });
    }

    // Buttons
    const btnAdd = $('btnAddGallery');
    if (btnAdd) btnAdd.onclick = addGalleryItem;

    const btnReset = $('btnResetGallery');
    if (btnReset) btnReset.onclick = resetGallery;
  }


  /* ============ STARTUP ============ */
  function init() {
    const btnLogin = $('btnLogin');
    if (btnLogin) btnLogin.onclick = handleLogin;

    const pwInput = $('loginPassword');
    if (pwInput) {
      pwInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleLogin();
      });
    }

    const btnLogout = $('btnLogout');
    if (btnLogout) btnLogout.onclick = handleLogout;

    // Auto-login jika session ada
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
      showDashboard();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();