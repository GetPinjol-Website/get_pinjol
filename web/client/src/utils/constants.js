export const BASE_URL = 'http://localhost:9000';

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const REPORT_CATEGORIES = [
  'phishing: Penipuan',
  'malware: Perangkat Lunak Berbahaya',
  'data breach: Pelanggaran Data',
  'privacy: Pelanggaran Privasi',
  'scam: Penipuan',
  'fraud: Kecurangan',
  'identity theft: Pencurian Identitas',
  'harassment: Pelecehan',
  'illegal charges: Pungutan Ilegal',
  'false advertising: Iklan Palsu',
  'unfair practices: Praktik Tidak Adil',
];

export const REPORT_TYPES = {
  WEB: 'web',
  APP: 'app',
};

export const REPORT_STATUSES = {
  PENDING: 'Menunggu',
  ACCEPTED: 'Diterima',
  REJECTED: 'Ditolak',
};

export const REPORT_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const EDUCATION_CATEGORIES = [
  'Fintech: Teknologi Keuangan',
  'Keamanan Data: Data Security',
  'Keuangan Pribadi: Personal Finance',
  'Literasi Digital: Digital Literacy',
  'Hak Konsumen: Consumer Rights',
  'Pencegahan Penipuan: Fraud Prevention',
  'Manajemen Utang: Debt Management',
  'Investasi Aman: Safe Investment',
];

export const EVIDENCE_PLACEHOLDER = 'Masukkan link bukti, misalnya: https://example.com/bukti.jpg';