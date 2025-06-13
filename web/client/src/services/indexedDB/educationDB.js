import { openDB } from 'idb';
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';

const DB_NAME = 'PinjolAppDB';
const DB_VERSION = 4;

export const initDB = async () => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        // webReports
        if (!db.objectStoreNames.contains('webReports')) {
          const webStore = db.createObjectStore('webReports', { keyPath: 'id' });
          webStore.createIndex('updatedAt', 'updatedAt');
          webStore.createIndex('deleted', 'deleted');
        }

        // appReports
        if (!db.objectStoreNames.contains('appReports')) {
          const appStore = db.createObjectStore('appReports', { keyPath: 'id' });
          appStore.createIndex('updatedAt', 'updatedAt');
          appStore.createIndex('deleted', 'deleted');
        }

        // educations
        if (!db.objectStoreNames.contains('educations')) {
          const eduStore = db.createObjectStore('educations', { keyPath: 'id' });
          eduStore.createIndex('updatedAt', 'updatedAt');
        }

        // Migrasi dari reports ke web/appReports
        if (oldVersion < 2 && db.objectStoreNames.contains('reports')) {
          const reportsStore = transaction.objectStore('reports');
          reportsStore.getAll().then((reports) => {
            reports.forEach((report) => {
              const target = report.type === 'web' ? 'webReports' : 'appReports';
              transaction.objectStore(target).put({
                ...report,
                deleted: report.deleted || false,
                updatedAt: report.updatedAt || new Date().toISOString(),
              });
            });
            db.deleteObjectStore('reports');
          });
        }

        // Tambahkan index jika belum ada
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

          if (db.objectStoreNames.contains('educations')) {
            const store = transaction.objectStore('educations');
            if (!store.indexNames.contains('updatedAt')) {
              store.createIndex('updatedAt', 'updatedAt');
            }
          }
        }
      },
    });
    return db;
  } catch (error) {
    console.error('Gagal inisialisasi IndexedDB:', error);
    throw new Error('Tidak dapat inisialisasi database lokal');
  }
};

// CRUD Edukasi
export const saveEducation = async (education) => {
  try {
    const db = await initDB();
    const tx = db.transaction('educations', 'readwrite');
    const store = tx.objectStore('educations');
    await store.put({ ...education, updatedAt: new Date().toISOString() });
    await tx.done;
  } catch (error) {
    console.error('Gagal menyimpan edukasi:', error);
    throw new Error('Gagal menyimpan edukasi ke IndexedDB');
  }
};

export const getEducation = async (id) => {
  try {
    const db = await initDB();
    const tx = db.transaction('educations', 'readonly');
    const store = tx.objectStore('educations');
    const education = await store.get(id);
    await tx.done;
    return education || null;
  } catch (error) {
    console.error('Gagal mengambil edukasi:', error);
    throw new Error('Gagal mengambil edukasi dari IndexedDB');
  }
};

export const getAllEducationsDB = async () => {
  try {
    const db = await initDB();
    const tx = db.transaction('educations', 'readonly');
    const store = tx.objectStore('educations');
    const educations = await store.getAll();
    await tx.done;
    return educations;
  } catch (error) {
    console.error('Gagal mengambil semua edukasi:', error);
    throw new Error('Gagal mengambil semua edukasi dari IndexedDB');
  }
};

export const deleteEducation = async (id) => {
  try {
    const db = await initDB();
    const tx = db.transaction('educations', 'readwrite');
    const store = tx.objectStore('educations');
    await store.delete(id);
    await tx.done;
  } catch (error) {
    console.error('Gagal menghapus edukasi:', error);
    throw new Error('Gagal menghapus edukasi dari IndexedDB');
  }
};

// Sync dari API ke IndexedDB
export const updateEducationListInIndexedDB = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/education`);
    if (response.data.status === 'sukses') {
      const educations = response.data.data;
      const db = await initDB();
      const tx = db.transaction('educations', 'readwrite');
      const store = tx.objectStore('educations');
      await store.clear();
      await Promise.all(
        educations.map((edu) =>
          store.put({ ...edu, updatedAt: new Date().toISOString() })
        )
      );
      await tx.done;
      console.log('Edukasi berhasil disinkronkan ke IndexedDB');
    }
  } catch (error) {
    console.error('Gagal update edukasi dari server:', error);
  }
};
