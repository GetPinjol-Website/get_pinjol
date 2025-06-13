# GetPinjol - Solusi Aman Pinjaman Online

![Coding Camp Logo](https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/academy/dos-univ_coding_camp_powered_by_dbs_foundation_2025_ilt_quiz_soft_skill_logo_051224110842.png)

**Powered by DBS Foundation | Road to Future Workforce**

[![Status Proyek](https://img.shields.io/badge/status-Selesai-green)](./)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Selamat datang di repositori proyek **GetPinjol** oleh tim **CC25-CF001**. GetPinjol adalah platform web untuk membantu masyarakat Indonesia mengenali, memilah, dan memilih aplikasi pinjaman online (pinjol) yang aman dan legal, serta meningkatkan literasi keuangan.

## 🌟 Tentang Proyek

GetPinjol hadir sebagai solusi berbasis data untuk mengatasi maraknya pinjol ilegal. Platform ini menggabungkan data legalitas OJK dan analisis sentimen ulasan pengguna untuk memberikan rekomendasi pinjol yang akurat melalui sistem klasifikasi otomatis. Tersedia juga konten edukatif untuk mencegah masyarakat terjerat pinjol ilegal.

## 🌐 Demo Aplikasi

Lihat aplikasi kami di:  
**[GetPinjol - Live Website](https://getpinjol-website.vercel.app/)**

## ✨ Fitur Utama

| Fitur | Deskripsi |
| :--- | :--- |
| 🛡️ **Analisis Keamanan Real-Time** | Cek legalitas dan risiko aplikasi pinjol secara instan. |
| 👥 **Laporan Komunitas** | Manfaatkan pengalaman pengguna lain untuk mengenali pinjol aman. |
| 📚 **Edukasi Finansial** | Panduan dan tips cerdas untuk mengelola keuangan. |
| ⚙️ **Klasifikasi Otomatis** | Rekomendasi aplikasi pinjol berdasarkan legalitas OJK dan data tren/ulasan. |

## 🛠️ Tumpukan Teknologi

| Komponen | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Front-End** | React, Tailwind CSS, Vite | Web interaktif & responsif (PWA). |
| **Back-End (Web Server)** | Hapi.js, Node.js | RESTful API untuk fitur utama. |
| **Back-End (ML API)** | Node.js, Express.js | API terpisah untuk inferensi ML (JavaScript). |
| **Database** | PostgreSQL | Data pengguna, laporan, konten, pinjol. |
| **Machine Learning** | Python (training), Node.js (inference) | TF-IDF & Logistic Regression. Model diekspor ke JSON. |

---

## 🚀 Panduan Replikasi Proyek

Jalankan 3 terminal terpisah untuk Front-End, Back-End, dan ML API.

### 1. Prasyarat

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (v18+)
- `npm`

### 2. Kloning Repositori

```bash
git clone https://github.com/GetPinjol-Website/GetPinjol-Website.git
cd GetPinjol-Website
```

### 3. Setup Machine Learning API

```bash
# Terminal 1
cd ml/backend-api
npm install
npm start
```
Server ML berjalan di port 3000.

### 4. Setup Back-End Utama

```bash
# Terminal 2
cd web/server
npm install
# Buat file .env, contoh:
# DB_HOST=localhost
# DB_USER=postgres
# DB_PASSWORD=your_password
# DB_NAME=getpinjol_db
# JWT_SECRET=secret_key
# ML_API_URL=http://localhost:3000
npm start
```
Server utama berjalan di port 5000.

### 5. Setup Front-End

```bash
# Terminal 3
cd web/client
npm install
# Buat file .env.local:
# VITE_API_BASE_URL=http://localhost:5000
npm run dev
```
Aplikasi web tersedia di http://localhost:5173.

### 6. Setup Database

```bash
cd database
node setup.js
```
Pastikan konfigurasi di `web/server/config/db.js` sudah benar.

---

## 📁 Struktur Repositori

```
get_pinjol/
├── database/
│   └── setup.js
├── ml/
│   ├── backend-api/
│   │   ├── model_assets/
│   │   ├── inference.js
│   │   └── server.js
│   ├── dataset/
│   └── models/
├── web/
│   ├── client/
│   └── server/
└── README.md
```

---

## 👥 Tim Kami (CC25-CF001)

| Foto | Nama | Peran | Universitas |
| :---: | :--- | :--- | :--- |
| 👤 | Muhammad Alif (MC269D5Y0636) | Machine Learning | Universitas Mulawarman |
| 👤 | Andi Zahrina Athirah Ahmad (MC269D5X0800) | Machine Learning | Universitas Mulawarman |
| 👤 | Muchlas Andrey Pahlevi (MC269D5Y0683) | Machine Learning | Universitas Mulawarman |
| 👤 | Dinda Ayu Aprilia (FC269D5X0976) | Front-End & Back-End | Universitas Mulawarman |
| 👤 | Vista Mellyna Atsfi (FC269D5X0916) | Front-End & Back-End | Universitas Mulawarman |

---

## 📜 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT. Lihat file LICENSE untuk detail lebih lanjut.
