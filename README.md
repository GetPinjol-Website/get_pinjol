# GetPinjol - Solusi Aman Pinjaman Online

![Coding Camp Logo](https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/academy/dos-univ_coding_camp_powered_by_dbs_foundation_2025_ilt_quiz_soft_skill_logo_051224110842.png)

**Powered by DBS Foundation | Road to Future Workforce**

[![Status Proyek](https://img.shields.io/badge/status-Selesai-green)](./)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Selamat datang di repositori proyek **GetPinjol** oleh tim **CC25-CF001**. GetPinjol adalah platform berbasis web yang dikembangkan untuk membantu masyarakat Indonesia mengenali, memilah, dan memilih aplikasi pinjaman online (pinjol) yang aman dan legal, serta meningkatkan literasi keuangan.

---

## 🌟 Tentang Proyek

Seiring meningkatnya kasus penyalahgunaan pinjol ilegal, GetPinjol hadir sebagai solusi berbasis data. Platform kami menggabungkan data legalitas resmi dari Otoritas Jasa Keuangan (OJK) dengan analisis sentimen dari ulasan pengguna untuk memberikan rekomendasi pinjol yang akurat melalui sistem klasifikasi otomatis. Selain itu, platform ini juga menawarkan konten edukatif untuk mencegah masyarakat terjerat pinjol ilegal.

---

## 🌐 Demo Aplikasi

Lihat aplikasi kami secara langsung di sini:  
**[GetPinjol - Live Website](https://getpinjol-website.vercel.app/)**

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
| :--- | :--- |
| 🛡️ **Analisis Keamanan Real-Time** | Cek legalitas dan risiko aplikasi pinjol secara instan untuk melindungi Anda dari penipuan. |
| 👥 **Laporan Komunitas** | Manfaatkan pengalaman ribuan pengguna lain untuk mengenali pinjol aman dan menghindari yang berisiko. |
| 📚 **Edukasi Finansial** | Tingkatkan literasi keuangan Anda dengan panduan praktis dan tips cerdas untuk mengelola keuangan dengan lebih baik. |
| ⚙️ **Klasifikasi Otomatis** | Sistem merekomendasikan aplikasi pinjol tidak hanya berdasarkan legalitas OJK, tetapi juga berdasarkan data tren dan ulasan pengguna. |

---

## 🛠️ Tumpukan Teknologi (Tech Stack)

Proyek ini dibangun dengan arsitektur monorepo yang memisahkan antara Front-End, Back-End, dan Machine Learning.

| Komponen | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Front-End** | React, Tailwind CSS, Vite | Aplikasi web interaktif dan responsif dengan dukungan PWA (Progressive Web App) untuk pengalaman seperti aplikasi native. |
| **Back-End** | Hapi.js, Node.js | Menyediakan RESTful API untuk menangani logika bisnis, otentikasi, dan sebagai jembatan ke model Machine Learning. |
| **Database** | PostgreSQL / Sesuai `db.js` | Mengelola data pengguna, laporan, konten edukasi, dan data aplikasi pinjol. |
| **Machine Learning** | Scikit-learn, ONNX | Model klasifikasi menggunakan **TF-IDF & Logistic Regression** untuk memprediksi legalitas dan sentimen, diekspor ke format ONNX untuk inferensi cepat di sisi server. |

---

## 🚀 Panduan Replikasi Proyek (Getting Started)

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ini di lingkungan lokal Anda.

### 1. Prasyarat

Pastikan Anda telah menginstal perangkat lunak berikut:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (v18 atau lebih tinggi)
- [Python](https://www.python.org/) (v3.8 atau lebih tinggi)
- `npm` (biasanya terinstal bersama Node.js)

### 2. Kloning Repositori

```bash
git clone https://github.com/GetPinjol-Website/GetPinjol-Website.git
cd GetPinjol-Website
```

### 3. Setup Back-End (Server)

Server back-end ini akan menyediakan API untuk aplikasi web.

```bash
# Arahkan ke direktori server
cd web/server

# Instal semua dependensi
npm install

# Buat file environment (.env) dari contoh yang ada
# Salin konten dari .env.example (jika ada) atau buat file baru
# Isi dengan konfigurasi database, secret key, dll.
# Contoh isi .env:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=yourpassword
# DB_NAME=getpinjol_db
# JWT_SECRET=your_super_secret_key

# Jalankan server
npm run start
```

Server akan berjalan di http://localhost:5000 (atau port yang dikonfigurasi).

### 4. Setup Front-End (Client)

Aplikasi web yang akan dikonsumsi oleh pengguna.

```bash
# Dari direktori root, arahkan ke direktori client
cd web/client

# Instal semua dependensi
npm install

# Atur variabel lingkungan untuk menghubungkan ke API backend
# Buat file .env.local dan tambahkan baris berikut:
# VITE_API_BASE_URL=http://localhost:5000

# Jalankan aplikasi dalam mode development
npm run dev
```

Aplikasi web akan tersedia di http://localhost:5173.

### 5. Setup Database

Proyek ini memerlukan database untuk berjalan. Skrip setup ada di direktori database.

```bash
# Arahkan ke direktori database
cd database

# Instal dependensi (jika diperlukan)
# npm install

# Jalankan skrip setup untuk membuat tabel
# Pastikan konfigurasi di web/server/config/db.js sudah benar
node setup.js
```

### 6. Model Machine Learning

Model ML sudah dilatih sebelumnya dan file-filenya (`.onnx`, `.json`) ditempatkan di direktori `ml/models` dan `web/server/ml`. Model ini dimuat langsung oleh server back-end untuk inferensi.

- **Dataset:** Data mentah yang digunakan untuk pelatihan ada di `ml/dataset`.
- **Model Files:** Model yang sudah diekspor (`sentiment_model.onnx`), bobot IDF, dan vokabular TF-IDF (`.json`) berada di `ml/models`. Versi yang digunakan oleh server ada di `web/server/ml`.
- **Contoh Implementasi:** Anda dapat melihat cara menggunakan model secara mandiri di `ml/models/contoh_implementasi.py`.

---

## 📁 Struktur Repositori

```
get_pinjol/
├── database/
│   └── setup.js              # Skrip untuk inisialisasi tabel database
├── ml/
│   ├── dataset/              # Dataset mentah (CSV)
│   └── models/               # Model terlatih (ONNX) dan file pendukung
├── web/
│   ├── client/               # Kode sumber Front-End (React)
│   │   ├── public/           # Aset statis dan PWA manifest
│   │   ├── src/
│   │   │   ├── components/   # Komponen UI yang dapat digunakan kembali
│   │   │   ├── pages/        # Komponen halaman (Landing, Dashboard, dll.)
│   │   │   ├── presenters/   # Logika presentasi (MVP)
│   │   │   ├── services/     # Logika API, IndexedDB, dan service worker
│   │   │   └── App.jsx       # Komponen root aplikasi
│   │   ├── vite.config.js    # Konfigurasi Vite
│   │   └── tailwind.config.js # Konfigurasi Tailwind CSS
│   └── server/               # Kode sumber Back-End (Hapi.js)
│       ├── config/           # Konfigurasi (seperti koneksi DB)
│       ├── handlers/         # Logika untuk setiap endpoint
│       ├── ml/               # File model ML yang digunakan server
│       ├── models/           # Skema model database
│       ├── routes.js         # Definisi semua rute API
│       └── server.js         # Titik masuk server Hapi
└── README.md
```

---
## 👥 Tim Kami (CC25-CF001)

| Nama | Peran | Universitas |
| :--- | :--- | :--- |
| Muhammad Alif (MC269D5Y0636) | Machine Learning & Project Manager | Universitas Mulawarman |
| Andi Zahrina Athirah Ahmad (MC269D5X0800) | Machine Learning | Universitas Mulawarman |
| Muchlas Andrey Pahlevi (MC269D5Y0683) | Machine Learning | Universitas Mulawarman |
| Dinda Ayu Aprilia (FC269D5X0976) | Front-End & Back-End | Universitas Mulawarman |
| Vista Mellyna Atsfi (FC269D5X0916) | Front-End & Back-End | Universitas Mulawarman |

---

## 📜 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT. Lihat file [LICENSE](./LICENSE) untuk detail lebih lanjut.
