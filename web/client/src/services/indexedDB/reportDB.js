import { initDB, limitReports } from './dbConfig';
import { createWebReport, createAppReport, updateWebReport, updateAppReport, deleteWebReport, deleteAppReport } from '../api/reportApi';
import { isValidDate } from '../../utils/helpers';

const validateReport = (report) => {
  if (
    !report.id ||
    !report.appName ||
    !report.description ||
    !isValidDate(report.incidentDate) ||
    !Array.isArray(report.category) ||
    !report.category.length ||
    !['positive', 'negative'].includes(report.reportType) ||
    !['low', 'medium', 'high'].includes(report.level)
  ) {
    throw new Error('Data laporan tidak lengkap atau tidak valid');
  }
  return true;
};

const normalizeReport = (report) => {
  return {
    ...report,
    id: report.id || `offline-${Date.now()}`,
    appName: report.appName || 'Unknown',
    description: report.description || 'No description provided',
    category: Array.isArray(report.category) && report.category.length ? report.category : ['unknown'],
    incidentDate: isValidDate(report.incidentDate) ? new Date(report.incidentDate).toISOString() : new Date().toISOString(),
    reportType: ['positive', 'negative'].includes(report.reportType) ? report.reportType : 'negative',
    level: ['low', 'medium', 'high'].includes(report.level) ? report.level : 'low',
    status: report.status || 'pending',
    userId: report.userId || 'unknown',
    pending_sync: report.pending_sync || false,
    deleted: report.deleted || false,
    updatedAt: report.updatedAt || new Date().toISOString(),
    reportedAt: report.reportedAt || new Date().toISOString(),
  };
};

export const saveReport = async (report, type = 'web', role = 'user') => {
  try {
    const normalizedReport = normalizeReport(report);
    if (!normalizedReport.deleted) {
      validateReport(normalizedReport);
    }
    const db = await initDB();
    const storeName = type === 'web' ? 'webReports' : 'appReports';
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.put({ ...normalizedReport, type });
    await tx.done;
    const limit = role === 'admin' ? 50 : role === 'user' ? 10 : 5;
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
    return report ? normalizeReport(report) : null;
  } catch (error) {
    console.error(`Gagal mengambil laporan ${type} dari IndexedDB:`, error);
    throw new Error('Tidak dapat mengambil laporan dari database lokal');
  }
};

export const getAllReportsDB = async (type = null, role = 'guest') => {
  try {
    const db = await initDB();
    const storeNames = type === 'web' ? ['webReports'] : type === 'app' ? ['appReports'] : ['webReports', 'appReports'];
    let allReports = [];
    for (const storeName of storeNames) {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const index = store.index('deleted');
      const reports = await index.getAll(false); // Hanya ambil yang tidak deleted
      allReports = allReports.concat(reports.map(normalizeReport));
      await tx.done;
    }
    const limit = role === 'admin' ? 50 : role === 'user' ? 10 : 5;
    return allReports
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, limit);
  } catch (error) {
    console.error(`Gagal mengambil semua laporan dari IndexedDB:`, error);
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
    let syncedCount = 0;
    for (const storeName of types) {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const index = store.index('pending_sync');
      const reports = await index.getAll(true); // Ambil laporan yang pending_sync
      for (const report of reports) {
        const type = storeName === 'webReports' ? 'web' : 'app';
        const normalizedReport = normalizeReport(report);
        const { id, userId, updatedAt, pending_sync, deleted, ...reportData } = normalizedReport;
        try {
          if (deleted) {
            const response = await (type === 'web' ? deleteWebReport(id, token) : deleteAppReport(id, token));
            if (response.status === 'sukses') {
              await store.delete(id);
              syncedCount++;
            }
          } else if (id.startsWith('offline-')) {
            const response = await (type === 'web' ? createWebReport(reportData, token) : createAppReport(reportData, token));
            if (response.status === 'sukses') {
              await store.delete(id); // Hapus laporan offline
              await store.put(normalizeReport(response.data)); // Simpan laporan baru dari server
              syncedCount++;
            }
          } else {
            const response = await (type === 'web' ? updateWebReport(id, reportData, token) : updateAppReport(id, reportData, token));
            if (response.status === 'sukses') {
              await store.put(normalizeReport(response.data.data));
              syncedCount++;
            }
          }
        } catch (error) {
          console.error(`Gagal menyinkronkan laporan ${type} ${id}:`, error);
          // Tandai laporan gagal untuk dicoba lagi nanti
          await store.put({ ...normalizedReport, pending_sync: true });
        }
      }
      await tx.done;
      const limit = role === 'admin' ? 50 : role === 'user' ? 10 : 5;
      await limitReports(storeName, limit, role);
    }
    return syncedCount;
  } catch (error) {
    console.error('Gagal menyinkronkan laporan offline:', error);
    throw new Error('Tidak dapat menyinkronkan laporan offline');
  }
};