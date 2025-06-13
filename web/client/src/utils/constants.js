export const BASE_URL = 'http://localhost:9000';

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const REPORT_CATEGORIES = [
  'Penipuan: Penipuan',
  'Perangkat Lunak Berbahaya: Perangkat Lunak Berbahaya',
  'Pelanggaran Data: Pelanggaran Data',
  'Pelanggaran Data: Pelanggaran Privasi',
  'Kecurangan: Kecurangan',
  'Pencurian Identitas: Pencurian Identitas',
  'Pelecehan: Pelecehan',
  'Pungutan Ilegal: Pungutan Ilegal',
  'Iklan Palsu: Iklan Palsu',
  'Praktik Tidak Adil : Praktik Tidak Adil',
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