import { initDB } from './dbConfig';

// Simpan laporan ke IndexedDB
export const saveReport = async (report) => {
  try {
    const db = await initDB();
    const tx = db.transaction('reports', 'readwrite');
    const store = tx.objectStore('reports');
    await store.put(report);
    await tx.done;
  } catch (error) {
    console.error('Gagal menyimpan laporan ke IndexedDB:', error);
    throw new Error('Tidak dapat menyimpan laporan secara lokal');
  }
};

// Mendapatkan laporan berdasarkan ID dari IndexedDB
export const getReport = async (id) => {
  try {
    const db = await initDB();
    const tx = db.transaction('reports', 'readonly');
    const store = tx.objectStore('reports');
    const report = await store.get(id);
    await tx.done;
    return report || null;
  } catch (error) {
    console.error('Gagal mengambil laporan dari IndexedDB:', error);
    throw new Error('Tidak dapat mengambil laporan dari database lokal');
  }
};

// Mendapatkan semua laporan dari IndexedDB
export const getAllReportsDB = async () => {
  try {
    const db = await initDB();
    const tx = db.transaction('reports', 'readonly');
    const store = tx.objectStore('reports');
    const reports = await store.getAll();
    await tx.done;
    return reports;
  } catch (error) {
    console.error('Gagal mengambil semua laporan dari IndexedDB:', error);
    throw new Error('Tidak dapat mengambil laporan dari database lokal');
  }
};

// Menghapus laporan dari IndexedDB
export const deleteReport = async (id) => {
  try {
    const db = await initDB();
    const tx = db.transaction('reports', 'readwrite');
    const store = tx.objectStore('reports');
    await store.delete(id);
    await tx.done;
  } catch (error) {
    console.error('Gagal menghapus laporan dari IndexedDB:', error);
    throw new Error('Tidak dapat menghapus laporan dari database lokal');
  }
};