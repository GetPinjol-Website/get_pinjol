import { initDB, limitReports } from './dbConfig';

const validateReport = (report) => {
  if (!report.id || !report.appName || !report.description || !report.incidentDate) {
    throw new Error('Data laporan tidak lengkap');
  }
  return true;
};

export const saveReport = async (report, type = 'web', role = 'user') => {
  try {
    validateReport(report);
    const db = await initDB();
    const storeName = type === 'web' ? 'webReports' : 'appReports';
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.put({ ...report, type, updatedAt: new Date().toISOString() });
    await tx.done;
    // Terapkan batasan jumlah laporan
    const limit = role === 'admin' ? 10 : role === 'user' ? 10 : 5;
    await limitReports(storeName, limit, role);
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

export const getAllReportsDB = async (type = 'web', role = 'user') => {
  try {
    const db = await initDB();
    const storeName = type === 'web' ? 'webReports' : 'appReports';
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    let reports = await store.getAll();
    await tx.done;
    // Terapkan batasan untuk laporan umum
    if (role !== 'admin' && role !== 'user') {
      reports = reports.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);
    } else {
      reports = reports.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 10);
    }
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

export const syncOfflineReports = async (token, role = 'user') => {
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
            await store.delete(id);
            await store.put(response.data);
            // Terapkan batasan setelah sinkronisasi
            const limit = role === 'admin' ? 10 : role === 'user' ? 10 : 5;
            await limitReports(storeName, limit, role);
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