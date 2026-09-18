# 📊 Setup Backend Google Apps Script (GAS)

Backend ini menangani: **RSVP, Ucapan, Config (gallery/events/mempelai), & Upload Gambar ke Drive**.

## 1. Buat Google Sheet Baru

1. Buka https://sheets.new
2. Rename: `WeddingSugiantoNovi`
3. Buat 2 sheet dengan nama: **RSVP** dan **Config**

### Sheet `RSVP` — header baris 1:
```
Timestamp | Nama | Kehadiran | Ucapan
```

### Sheet `Config` — header baris 1:
```
Key | Value
```

## 2. Buat Folder Google Drive untuk Gambar

1. Buka https://drive.google.com
2. Buat folder: `Wedding-Gallery`
3. Buka folder → copy **FOLDER_ID** dari URL:
   `https://drive.google.com/drive/folders/[FOLDER_ID_INI]`

## 3. Buka Apps Script

1. Di Google Sheet: **Extensions → Apps Script**
2. Paste kode lengkap di bawah:

```javascript
// ==========================================
//   WEDDING BACKEND - Sugianto & Novi
// ==========================================

const SHEET_RSVP = 'RSVP';
const SHEET_CONFIG = 'Config';
const DRIVE_FOLDER_ID = 'PASTE_FOLDER_ID_DISINI'; // ← ganti!
const ADMIN_PASSWORD = 'admin123'; // ← ganti!

// ========== ROUTING ==========
function doGet(e) {
  const action = e.parameter.action;
  let result = {};

  try {
    if (action === 'list') {
      result = { wishes: getWishes() };
    } else if (action === 'getConfig') {
      result = { config: getConfig() };
    } else if (action === 'stats') {
      result = getStats();
    } else {
      result = { status: 'ok' };
    }
  } catch (err) {
    result = { error: err.toString() };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let result = {};
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === 'add') {
      addWish(data);
      result = { status: 'ok' };
    } else if (action === 'saveConfig') {
      saveConfig(data.config, data.password);
      result = { status: 'ok' };
    } else if (action === 'uploadImage') {
      const url = uploadImage(data.data, data.name);
      result = { status: 'ok', url: url };
    } else if (action === 'deleteWish') {
      deleteWish(data.index);
      result = { status: 'ok' };
    } else {
      result = { status: 'unknown action' };
    }
  } catch (err) {
    result = { status: 'error', message: err.toString() };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ========== RSVP ==========
function getWishes() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_RSVP);
  const rows = sheet.getDataRange().getValues();
  const wishes = [];
  for (let i = 1; i < rows.length; i++) {
    const [time, name, attend, message] = rows[i];
    if (!name) continue;
    wishes.push({
      time: String(time),
      name: String(name),
      attend: String(attend),
      message: String(message || '')
    });
  }
  return wishes;
}

function addWish(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_RSVP);
  sheet.appendRow([
    data.time || new Date().toLocaleString('id-ID'),
    data.name,
    data.attend,
    data.message || ''
  ]);
}

function deleteWish(index) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_RSVP);
  sheet.deleteRow(parseInt(index) + 2); // +2 karena header di baris 1 & index mulai 0
}

function getStats() {
  const wishes = getWishes();
  return {
    total: wishes.length,
    hadir: wishes.filter(w => w.attend === 'Hadir').length,
    tidak: wishes.filter(w => w.attend === 'Tidak Hadir').length,
    ragu: wishes.filter(w => w.attend === 'Masih Ragu').length
  };
}

// ========== CONFIG ==========
function getConfig() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIG);
  const rows = sheet.getDataRange().getValues();
  const config = {};
  for (let i = 1; i < rows.length; i++) {
    const [key, value] = rows[i];
    if (!key) continue;
    try {
      config[key] = JSON.parse(value);
    } catch (e) {
      config[key] = value;
    }
  }
  return config;
}

function saveConfig(config, password) {
  if (password !== ADMIN_PASSWORD) {
    throw new Error('Unauthorized');
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CONFIG);

  // Hapus semua data (kecuali header)
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 2).clearContent();
  }

  // Simpan setiap key
  const keys = Object.keys(config);
  const rows = keys.map(k => [k, JSON.stringify(config[k])]);
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 2).setValues(rows);
  }
}

// ========== UPLOAD IMAGE ==========
function uploadImage(base64Data, fileName) {
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const parts = base64Data.split(',');
  const mimeMatch = parts[0].match(/data:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

  const blob = Utilities.newBlob(
    Utilities.base64Decode(parts[1]),
    mimeType,
    fileName || `img-${Date.now()}.jpg`
  );

  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return `https://drive.google.com/uc?export=view&id=${file.getId()}`;
}

// ============ TAMBAHAN PAKET B ============
const SHEET_LANTERNS = 'Lanterns';
const SHEET_PHOTOS = 'Photos';
const SHEET_SIGNATURES = 'Signatures';

// Di doGet, tambahkan routing baru:
// if (action === 'lanterns') result = { lanterns: getLanterns() };
// if (action === 'photos') result = { photos: getPhotos() };
// if (action === 'signatures') result = { signatures: getSignatures() };

// Di doPost, tambahkan routing:
// if (action === 'addLantern') { addLantern(data); result = { status: 'ok' }; }
// if (action === 'addPhoto') { addPhoto(data); result = { status: 'ok' }; }
// if (action === 'uploadPhoto') { const url = uploadImage(data.data, data.name); result = { status: 'ok', url }; }
// if (action === 'addSignature') { addSignature(data); result = { status: 'ok' }; }

// Pastikan sheet dibuat
function ensureSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
  }
  return sheet;
}

function getLanterns() {
  const sheet = ensureSheet(SHEET_LANTERNS, ['Time', 'Name', 'Wish']);
  const rows = sheet.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const [time, name, wish] = rows[i];
    if (!name) continue;
    out.push({ time: String(time), name: String(name), wish: String(wish) });
  }
  return out;
}

function addLantern(data) {
  const sheet = ensureSheet(SHEET_LANTERNS, ['Time', 'Name', 'Wish']);
  sheet.appendRow([data.time || new Date().toLocaleString('id-ID'), data.name, data.wish]);
}

function getPhotos() {
  const sheet = ensureSheet(SHEET_PHOTOS, ['Time', 'Name', 'Caption', 'URL', 'Approved']);
  const rows = sheet.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const [time, name, caption, url, approved] = rows[i];
    if (!name) continue;
    if (approved !== 'YES' && approved !== true) continue; // hanya tampilkan yang approved
    out.push({ time: String(time), name: String(name), caption: String(caption), url: String(url), approved: true });
  }
  return out;
}

function addPhoto(data) {
  const sheet = ensureSheet(SHEET_PHOTOS, ['Time', 'Name', 'Caption', 'URL', 'Approved']);
  sheet.appendRow([
    data.time || new Date().toLocaleString('id-ID'),
    data.name,
    data.caption || '',
    data.url,
    'NO' // butuh approval admin
  ]);
}

function getSignatures() {
  const sheet = ensureSheet(SHEET_SIGNATURES, ['Time', 'Name', 'Message', 'Signature']);
  const rows = sheet.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const [time, name, message, signature] = rows[i];
    if (!name) continue;
    out.push({ time: String(time), name: String(name), message: String(message), signature: String(signature) });
  }
  return out;
}

function addSignature(data) {
  const sheet = ensureSheet(SHEET_SIGNATURES, ['Time', 'Name', 'Message', 'Signature']);
  sheet.appendRow([data.time || new Date().toLocaleString('id-ID'), data.name, data.message || '', data.signature]);
}
```

## 4. Deploy sebagai Web App

1. Klik **Deploy → New deployment**
2. Type: **Web app**
3. Setting:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. **Deploy** → **Authorize** → Allow
5. Copy **Web app URL** (contoh: `https://script.google.com/macros/s/ABC.../exec`)

## 5. Pasang URL ke `config.js`

```javascript
const CONFIG = {
  // ...
  gasUrl: "https://script.google.com/macros/s/ABC.../exec",
  adminPassword: "admin123", // ganti!
  // ...
};
```

## 6. Test

1. Buka `index.html` → submit RSVP → cek Google Sheet **RSVP**
2. Buka `admin.html` → login → edit gallery → cek Sheet **Config**
3. Upload gambar → cek Google Drive folder

## 7. Admin Login

- URL: `https://USERNAME.github.io/undangan-chinese-luxury/admin.html`
- Password default: `admin123` (ganti di `config.js` + GAS)

## 🎯 Fitur Backend

| Endpoint | Fungsi |
|----------|--------|
| `?action=list` | Ambil semua RSVP |
| `?action=getConfig` | Ambil config (gallery, events, dll) |
| `?action=stats` | Statistik kehadiran |
| POST `action:add` | Tambah ucapan |
| POST `action:saveConfig` | Simpan config (butuh password) |
| POST `action:uploadImage` | Upload gambar ke Drive |
| POST `action:deleteWish` | Hapus ucapan |

## 🔐 Keamanan

- Password admin: ganti `admin123` di `config.js` **dan** GAS
- Untuk produksi, gunakan password kuat
- Jangan share URL GAS secara publik jika tidak perlu

## 📸 Google Drive Image Tips

- Setelah upload, gambar akan otomatis public view
- Format URL: `https://drive.google.com/uc?export=view&id=FILE_ID`
- Kalau gambar tidak muncul, coba ganti ke: `https://lh3.googleusercontent.com/d/FILE_ID`