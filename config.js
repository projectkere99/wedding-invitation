// ==========================================
//   KONFIGURASI UNDANGAN - EDIT DI SINI
// ==========================================
const CONFIG = {
  groom: "Sugianto",
  bride: "Novi Mutirara",
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
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5!2d106.8!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMDAuMCJTIDEwNsKwNDgnMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890",

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