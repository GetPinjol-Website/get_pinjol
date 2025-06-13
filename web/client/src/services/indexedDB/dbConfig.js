import { openDB } from 'idb';

const DB_NAME = 'PinjolAppDB';
const DB_VERSION = 4; // Naikkan versi untuk mendukung indeks baru

export const initDB = async () => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        // Buat object store untuk laporan web
        if (!db.objectStoreNames.contains('webReports')) {
          const webStore = db.createObjectStore('webReports', { keyPath: 'id' });
          webStore.createIndex('updatedAt', 'updatedAt');
          webStore.createIndex('deleted', 'deleted');
        }
        // Buat object store untuk laporan app
        if (!db.objectStoreNames.contains('appReports')) {
          const appStore = db.createObjectStore('appReports', { keyPath: 'id' });
          appStore.createIndex('updatedAt', 'updatedAt');
          appStore.createIndex('deleted', 'deleted');
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
              transaction.objectStore(targetStore).put({
                ...report,
                deleted: report.deleted || false,
                updatedAt: report.updatedAt || new Date().toISOString(),
              });
            });
            db.deleteObjectStore('reports');
          });
        }
        // Migrasi untuk versi 3 ke atas: tambahkan indeks
        if (oldVersion < 4) {
          ['webReports', 'appReports'].forEach((storeName) => {
            const store = transaction.objectStore(storeName);
            if (!store.indexNames.contains('updatedAt')) {
              store.createIndex('updatedAt', 'updatedAt');
            }
            if (!store.indexNames.contains('deleted')) {
              store.createIndex('deleted', 'deleted');
            }
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

// Fungsi untuk membatasi jumlah laporan, mengabaikan yang ditandai deleted
export const limitReports = async (storeName, limit, role = 'user') => {
  try {
    const db = await initDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const index = store.index('deleted');
    const nonDeletedReports = await index.getAll(false); // Ambil hanya yang tidak deleted
    if (nonDeletedReports.length > limit) {
      const sortedReports = nonDeletedReports.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
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