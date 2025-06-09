import { openDB } from 'idb';

// Konfigurasi database IndexedDB
const DB_NAME = 'PinjolAppDB';
const DB_VERSION = 1;

export const initDB = async () => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Buat object store untuk laporan
        if (!db.objectStoreNames.contains('reports')) {
          db.createObjectStore('reports', { keyPath: 'id' });
        }
        // Buat object store untuk edukasi
        if (!db.objectStoreNames.contains('educations')) {
          db.createObjectStore('educations', { keyPath: 'id' });
        }
      },
    });
    return db;
  } catch (error) {
    console.error('Gagal menginisialisasi IndexedDB:', error);
    throw new Error('Tidak dapat menginisialisasi database lokal');
  }
};