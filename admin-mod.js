/* ============ ADMIN MOD — Moderasi Foto, Signature, Lantern ============ */
(function () {
  'use strict';

  // Auto-inject menu di sidebar
  function injectNav() {
    const nav = document.querySelector('.sidebar-nav');
    if (!nav || document.getElementById('nav-moderation')) return;

    const link = document.createElement('a');
    link.href = '#';
    link.className = 'nav-item';
    link.dataset.tab = 'moderation';
    link.id = 'nav-moderation';
    link.innerHTML = '<span>🖼️</span> Moderasi';
    nav.appendChild(link);

    link.onclick = (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      link.classList.add('active');

      let tab = document.getElementById('tab-moderation');
      if (!tab) {
        tab = document.createElement('section');
        tab.className = 'tab-content';
        tab.id = 'tab-moderation';
        document.querySelector('.main-panel').appendChild(tab);
        buildModerationUI(tab);
      }
      tab.classList.add('active');
    };
  }

  function buildModerationUI(container) {
    container.innerHTML = `
      <div class="page-header">
        <h2>🖼️ Moderasi Konten</h2>
        <p class="page-sub">Approve / reject foto, signature, dan lantern dari tamu</p>
      </div>

      <div class="moderasi-tabs">
        <button class="mod-tab active" data-mod="photos">📸 Foto</button>
        <button class="mod-tab" data-mod="signatures">✍️ Signature</button>
        <button class="mod-tab" data-mod="lanterns">🏮 Lentera</button>
      </div>

      <div id="modContent"></div>
    `;

    container.querySelectorAll('.mod-tab').forEach(btn => {
      btn.onclick = () => {
        container.querySelectorAll('.mod-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMod(btn.dataset.mod);
      };
    });

    renderMod('photos');
  }

  function renderMod(type) {
    const box = document.getElementById('modContent');
    if (!box) return;

    let data = [];
    try {
      if (type === 'photos') data = JSON.parse(localStorage.getItem('weddingPhotos_SugiantoNovi') || '[]');
      else if (type === 'signatures') data = JSON.parse(localStorage.getItem('weddingSignatures_SugiantoNovi') || '[]');
      else data = JSON.parse(localStorage.getItem('weddingLanterns_SugiantoNovi') || '[]');
    } catch (e) { data = []; }

    if (data.length === 0) {
      box.innerHTML = `<p style="text-align:center;color:#999;padding:3rem">Belum ada ${type} dari tamu.</p>`;
      return;
    }

    if (type === 'photos') {
      box.innerHTML = `
        <div class="mod-grid">
          ${data.map((p, i) => `
            <div class="mod-item">
              <img src="${p.url || p.data}" alt="${escapeHtml(p.name)}">
              <div class="mod-info">
                <strong>${escapeHtml(p.name)}</strong>
                <small>${escapeHtml(p.caption || '-')}</small>
                <small>${escapeHtml(p.time)}</small>
              </div>
              <button class="mod-delete" onclick="modDelete('photos', ${i})">🗑 Hapus</button>
            </div>
          `).join('')}
        </div>
      `;
    } else if (type === 'signatures') {
      box.innerHTML = `
        <div class="mod-grid">
          ${data.map((s, i) => `
            <div class="mod-item">
              <img src="${s.signature}" style="background:#fff;padding:.5rem;object-fit:contain">
              <div class="mod-info">
                <strong>${escapeHtml(s.name)}</strong>
                <small>${escapeHtml(s.message || '-')}</small>
                <small>${escapeHtml(s.time)}</small>
              </div>
              <button class="mod-delete" onclick="modDelete('signatures', ${i})">🗑 Hapus</button>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      box.innerHTML = `
        <div class="mod-list">
          ${data.map((l, i) => `
            <div class="mod-list-item">
              <div>
                <strong>🏮 ${escapeHtml(l.name)}</strong>
                <p>${escapeHtml(l.wish)}</p>
                <small>${escapeHtml(l.time)}</small>
              </div>
              <button class="mod-delete" onclick="modDelete('lanterns', ${i})">🗑</button>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, m => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[m]));
  }

  window.modDelete = function (type, index) {
    if (!confirm('Hapus item ini?')) return;
    const map = {
      photos: 'weddingPhotos_SugiantoNovi',
      signatures: 'weddingSignatures_SugiantoNovi',
      lanterns: 'weddingLanterns_SugiantoNovi'
    };
    const key = map[type];
    const arr = JSON.parse(localStorage.getItem(key) || '[]');
    arr.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(arr));
    renderMod(type);
    if (window.showToast) window.showToast('🗑 Item dihapus');
  };

  // Init setelah dashboard tampil
  const obs = new MutationObserver(() => {
    if (document.getElementById('dashboard') &&
        !document.getElementById('dashboard').classList.contains('hidden')) {
      injectNav();
    }
  });
  obs.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });

  // Fallback
  setTimeout(injectNav, 2000);

  // Tambahkan CSS moderation
  const style = document.createElement('style');
  style.textContent = `
    .moderasi-tabs {
      display: flex; gap: .5rem; margin-bottom: 1.5rem; flex-wrap: wrap;
    }
    .mod-tab {
      padding: .6rem 1.2rem; border-radius: 10px; border: 2px solid var(--border);
      background: #fff; cursor: pointer; font-family: inherit; font-weight: 600;
      font-size: .85rem; transition: .2s;
    }
    .mod-tab.active {
      background: linear-gradient(135deg, var(--red), var(--red-dark));
      color: var(--gold-light); border-color: var(--gold);
    }
    .mod-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1rem;
    }
    .mod-item {
      background: #fff; border-radius: 14px; overflow: hidden;
      border: 2px solid var(--border);
      box-shadow: 0 5px 15px rgba(107,10,10,.08);
    }
    .mod-item img {
      width: 100%; height: 180px; object-fit: cover; display: block;
      border-bottom: 1px solid var(--border);
    }
    .mod-info {
      padding: .8rem; display: flex; flex-direction: column; gap: .2rem;
    }
    .mod-info strong { color: var(--red-dark); font-size: .9rem; }
    .mod-info small { color: #999; font-size: .75rem; }
    .mod-delete {
      width: 100%; padding: .6rem; border: none; border-top: 1px solid var(--border);
      background: #fef2f2; color: #dc2626; cursor: pointer;
      font-family: inherit; font-weight: 600; font-size: .8rem;
    }
    .mod-delete:hover { background: #fee2e2; }
    .mod-list { display: flex; flex-direction: column; gap: .8rem; }
    .mod-list-item {
      display: flex; justify-content: space-between; align-items: center;
      gap: 1rem; padding: 1rem; background: #fff;
      border-radius: 12px; border-left: 4px solid var(--gold);
      box-shadow: 0 5px 15px rgba(107,10,10,.06);
    }
    .mod-list-item strong { color: var(--red-dark); }
    .mod-list-item p { color: #5a3a3a; font-size: .9rem; margin: .3rem 0; }
    .mod-list-item small { color: #999; font-size: .75rem; }
    .mod-list-item .mod-delete {
      width: auto; padding: .5rem .8rem; border: none; border-radius: 8px;
      background: #fef2f2; color: #dc2626; cursor: pointer;
    }
  `;
  document.head.appendChild(style);
})();