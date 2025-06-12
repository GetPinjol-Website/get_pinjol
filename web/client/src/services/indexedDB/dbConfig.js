import { openDB } from 'idb';

const DB_NAME = 'PinjolAppDB';
const DB_VERSION = 3;

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
        // Migrasi data dari versi lama
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

// Fungsi untuk membatasi jumlah laporan
export const limitReports = async (storeName, limit, role = 'user') => {
  try {
    const db = await initDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const allReports = await store.getAll();
    if (allReports.length > limit) {
      const sortedReports = allReports.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      const reportsToDelete = sortedReports.slice(limit);
      for (const report of reportsToDelete) {
        await store.delete(report.id);
      }
    }
    await tx.done;
  } catch (error) {
    console.error(`Gagal membatasi laporan di ${storeName}:`, error);
  }
};