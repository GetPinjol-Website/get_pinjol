import { openDB } from 'idb';

const DB_NAME = 'PinjolAppDB';
const DB_VERSION = 2;

export const initDB = async () => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        // Buat object store untuk laporan web
        if (!db.objectStoreNames.contains('webReports')) {
          db.createObjectStore('webReports', { keyPath: 'id' });
        }
        // Buat object store untuk laporan app
        if (!db.objectStoreNames.contains('appReports')) {
          db.createObjectStore('appReports', { keyPath: 'id' });
        }
        // Buat object store untuk edukasi
        if (!db.objectStoreNames.contains('educations')) {
          db.createObjectStore('educations', { keyPath: 'id' });
        }
        // Jika versi lama memiliki 'reports', hapus setelah migrasi
        if (oldVersion < 2 && db.objectStoreNames.contains('reports')) {
          const reportsStore = transaction.objectStore('reports');
          reportsStore.getAll().then((reports) => {
            reports.forEach((report) => {
              const targetStore = report.type === 'web' ? 'webReports' : 'appReports';
              transaction.objectStore(targetStore).put(report);
            });
            db.deleteObjectStore('reports');
          });
        }
      },
    });
    return db;
  } catch (error) {
    console.error('Gagal menginisialisasi IndexedDB:', error);
    throw new Error('Tidak dapat menginisialisasi database lokal');
  }
};