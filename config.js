// ==========================================
//   KONFIGURASI UNDANGAN - EDIT DI SINI
// ==========================================
const CONFIG = {
  groom: "Sugianto",
  bride: "Novi Mutiara",
  weddingDate: "2026-09-30T09:00:00",
  gasUrl: "",                    // isi jika sudah setup GAS
  // ===== BACKEND GOOGLE APPS SCRIPT =====
  // Kosongkan "" jika belum setup → fallback ke localStorage
  gasUrl: "",

  // ===== ADMIN PASSWORD =====
  // (Juga di-set di GAS untuk validasi server-side)
  adminPassword: "noviaho99",

  // ===== GOOGLE MAPS EMBED =====
  // Cara ambil: buka maps.google.com → share → embed a map → copy src iframe
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15925.53574551169!2d98.66798923613206!3d3.726183952443338!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3036cd6c76a84d65%3A0x954c069b1e6a2274!2sMURNI%20BAN!5e0!3m2!1sen!2skh!4v1789824054998!5m2!1sen!2skh",

  // ===== VIDEO PRE-WEDDING =====
  // YouTube video ID (contoh: "dQw4w9WgXcQ")
  videoId: "dQw4w9WgXcQ",

  // ===== GALLERY (default, bisa di-edit lewat admin) =====
  gallery: [
    "assets/cover.jpg",
    "assets/bride.jpg",
    "assets/groom.jpg",
    "assets/cover.jpg"
  ]
};

// Load config dari Google Sheets jika tersedia
async function loadRemoteConfig() {
  if (!CONFIG.gasUrl) return;
  try {
    const res = await fetch(CONFIG.gasUrl + '?action=getConfig');
    const data = await res.json();
    if (data.config) {
      Object.assign(CONFIG, data.config);
    }
  } catch (e) {
    console.warn('Config remote gagal dimuat, pakai default');
  }
}