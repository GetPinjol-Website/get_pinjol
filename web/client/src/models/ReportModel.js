import { createWebReport, createAppReport, getTopReports, getReportById, getAllReports } from '../services/api/reportApi';
import { saveReport, getReport, getAllReportsDB, deleteReport } from '../services/indexedDB/reportDB';

// Model untuk mengelola data laporan
class ReportModel {
  // Membuat laporan berbasis web
  static async createWebReport(reportData, token) {
    try {
      const response = await createWebReport(reportData, token);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      // Simpan ke IndexedDB
      await saveReport(response.data);
      return response.data;
    } catch (error) {
      // Coba ambil dari IndexedDB jika offline
      if (error.message.includes('Koneksi jaringan gagal')) {
        const offlineReport = { ...reportData, id: `offline-${Date.now()}`, userId: 'unknown', updatedAt: new Date().toISOString() };
        await saveReport(offlineReport);
        return offlineReport;
      }
      throw new Error(error.message || 'Gagal membuat laporan web');
    }
  }

  // Membuat laporan berbasis aplikasi
  static async createAppReport(reportData, token) {
    try {
      const response = await createAppReport(reportData, token);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      // Simpan ke IndexedDB
      await saveReport(response.data);
      return response.data;
    } catch (error) {
      // Coba ambil dari IndexedDB jika offline
      if (error.message.includes('Koneksi jaringan gagal')) {
        const offlineReport = { ...reportData, id: `offline-${Date.now()}`, userId: 'unknown', updatedAt: new Date().toISOString() };
        await saveReport(offlineReport);
        return offlineReport;
      }
      throw new Error(error.message || 'Gagal membuat laporan aplikasi');
    }
  }

  // Mendapatkan 5 kategori laporan teratas
  static async getTopReports() {
    try {
      const response = await getTopReports();
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Gagal mengambil laporan teratas');
    }
  }

  // Mendapatkan laporan berdasarkan ID
  static async getReportById(id, token) {
    try {
      const response = await getReportById(id, token);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      return response.data;
    } catch (error) {
      // Coba ambil dari IndexedDB jika offline
      if (error.message.includes('Koneksi jaringan gagal')) {
        const report = await getReport(id);
        if (report) return report;
      }
      throw new Error(error.message || 'Gagal mengambil laporan');
    }
  }

  // Mendapatkan semua laporan dengan filter
  static async getAllReports(filters = {}) {
    try {
      const response = await getAllReports(filters);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      return response.data;
    } catch (error) {
      // Coba ambil dari IndexedDB jika offline
      if (error.message.includes('Koneksi jaringan gagal')) {
        const reports = await getAllReportsDB();
        return reports.filter((report) =>
          (!filters.appName || report.appName.toLowerCase().includes(filters.appName.toLowerCase())) &&
          (!filters.category || report.category === filters.category)
        );
      }
      throw new Error(error.message || 'Gagal mengambil daftar laporan');
    }
  }

  // Menghapus laporan (opsional, jika diperlukan)
  static async deleteReport(id) {
    try {
      await deleteReport(id);
      return true;
    } catch (error) {
      throw new Error(error.message || 'Gagal menghapus laporan');
    }
  }
}

export default ReportModel;