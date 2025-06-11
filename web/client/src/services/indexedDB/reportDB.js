import { initDB } from './dbConfig';

export const saveReport = async (report, type = 'web') => {
  try {
    const db = await initDB();
    const storeName = type === 'web' ? 'webReports' : 'appReports';
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.put({ ...report, type });
    await tx.done;
  } catch (error) {
    console.error(`Gagal menyimpan laporan ${type} ke IndexedDB:`, error);
    throw new Error('Tidak dapat menyimpan laporan secara lokal');
  }
};

export const getReport = async (id, type = 'web') => {
  try {
    const db = await initDB();
    const storeName = type === 'web' ? 'webReports' : 'appReports';
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const report = await store.get(id);
    await tx.done;
    return report || null;
  } catch (error) {
    console.error(`Gagal mengambil laporan ${type} dari IndexedDB:`, error);
    throw new Error('Tidak dapat mengambil laporan dari database lokal');
  }
};

export const getAllReportsDB = async (type = 'web') => {
  try {
    const db = await initDB();
    const storeName = type === 'web' ? 'webReports' : 'appReports';
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const reports = await store.getAll();
    await tx.done;
    return reports;
  } catch (error) {
    console.error(`Gagal mengambil semua laporan ${type} dari IndexedDB:`, error);
    throw new Error('Tidak dapat mengambil laporan dari database lokal');
  }
};

export const deleteReport = async (id, type = 'web') => {
  try {
    const db = await initDB();
    const storeName = type === 'web' ? 'webReports' : 'appReports';
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.delete(id);
    await tx.done;
  } catch (error) {
    console.error(`Gagal menghapus laporan ${type} dari IndexedDB:`, error);
    throw new Error('Tidak dapat menghapus laporan dari database lokal');
  }
};

export const syncOfflineReports = async (token) => {
  try {
    const db = await initDB();
    const types = ['webReports', 'appReports'];
    for (const storeName of types) {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const reports = await store.getAll();
      for (const report of reports) {
        if (report.id.startsWith('offline-')) {
          const type = storeName === 'webReports' ? 'web' : 'app';
          const { id, userId, updatedAt, ...reportData } = report;
          try {
            const response = await (type === 'web'
              ? createWebReport(reportData, token)
              : createAppReport(reportData, token));
            await store.put(response.data);
          } catch (error) {
            console.error(`Gagal menyinkronkan laporan ${type} ${id}:`, error);
          }
        }
      }
      await tx.done;
    }
  } catch (error) {
    console.error('Gagal menyinkronkan laporan offline:', error);
    throw new Error('Tidak dapat menyinkronkan laporan offline');
  }
};