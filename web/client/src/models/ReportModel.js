import {
  createWebReport,
  createAppReport,
  updateWebReport,
  updateAppReport,
  deleteWebReport,
  deleteAppReport,
  getReportById,
  getAllReports,
  getUserReports,
} from '../services/api/reportApi';
import {
  saveReport,
  getReport,
  getAllReportsDB,
  deleteReport,
  syncOfflineReports,
} from '../services/indexedDB/reportDB';
import { REPORT_TYPES } from '../utils/constants';

class ReportModel {
  static async createWebReport(reportData, token) {
    try {
      const response = await createWebReport(reportData, token);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      await saveReport(response.data, REPORT_TYPES.WEB);
      return response.data;
    } catch (error) {
      if (error.message.includes('Koneksi jaringan gagal')) {
        const offlineReport = {
          ...reportData,
          id: `offline-${Date.now()}`,
          type: REPORT_TYPES.WEB,
          status: 'pending',
          updatedAt: new Date().toISOString(),
        };
        await saveReport(offlineReport, REPORT_TYPES.WEB);
        return offlineReport;
      }
      throw new Error(error.message || 'Gagal membuat laporan web');
    }
  }

  static async createAppReport(reportData, token) {
    try {
      const response = await createAppReport(reportData, token);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      await saveReport(response.data, REPORT_TYPES.APP);
      return response.data;
    } catch (error) {
      if (error.message.includes('Koneksi jaringan gagal')) {
        const offlineReport = {
          ...reportData,
          id: `offline-${Date.now()}`,
          type: REPORT_TYPES.APP,
          status: 'pending',
          updatedAt: new Date().toISOString(),
        };
        await saveReport(offlineReport, REPORT_TYPES.APP);
        return offlineReport;
      }
      throw new Error(error.message || 'Gagal membuat laporan aplikasi');
    }
  }

  static async updateWebReport(id, reportData, token) {
    try {
      const response = await updateWebReport(id, reportData, token);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      await saveReport(response.data, REPORT_TYPES.WEB);
      return response.data;
    } catch (error) {
      if (error.message.includes('Koneksi jaringan gagal')) {
        const offlineReport = {
          ...reportData,
          id,
          type: REPORT_TYPES.WEB,
          updatedAt: new Date().toISOString(),
        };
        await saveReport(offlineReport, REPORT_TYPES.WEB);
        return offlineReport;
      }
      throw new Error(error.message || 'Gagal memperbarui laporan web');
    }
  }

  static async updateAppReport(id, reportData, token) {
    try {
      const response = await updateAppReport(id, reportData, token);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      await saveReport(response.data, REPORT_TYPES.APP);
      return response.data;
    } catch (error) {
      if (error.message.includes('Koneksi jaringan gagal')) {
        const offlineReport = {
          ...reportData,
          id,
          type: REPORT_TYPES.APP,
          updatedAt: new Date().toISOString(),
        };
        await saveReport(offlineReport, REPORT_TYPES.APP);
        return offlineReport;
      }
      throw new Error(error.message || 'Gagal memperbarui laporan aplikasi');
    }
  }

  static async deleteWebReport(id, token) {
    try {
      const response = await deleteWebReport(id, token);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      await deleteReport(id, REPORT_TYPES.WEB);
      return true;
    } catch (error) {
      if (error.message.includes('Koneksi jaringan gagal')) {
        await deleteReport(id, REPORT_TYPES.WEB);
        return true;
      }
      throw new Error(error.message || 'Gagal menghapus laporan web');
    }
  }

  static async deleteAppReport(id, token) {
    try {
      const response = await deleteAppReport(id, token);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      await deleteReport(id, REPORT_TYPES.APP);
      return true;
    } catch (error) {
      if (error.message.includes('Koneksi jaringan gagal')) {
        await deleteReport(id, REPORT_TYPES.APP);
        return true;
      }
      throw new Error(error.message || 'Gagal menghapus laporan aplikasi');
    }
  }

  static async getReportById(id, token, type = REPORT_TYPES.WEB) {
    try {
      const response = await getReportById(id, token);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      return response.data;
    } catch (error) {
      if (error.message.includes('Koneksi jaringan gagal')) {
        const report = await getReport(id, type);
        if (report) return report;
      }
      throw new Error(error.message || 'Gagal mengambil laporan');
    }
  }

  static async getAllReports(filters = {}, token = null) {
    try {
      const response = await getAllReports(filters, token);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      return response.data;
    } catch (error) {
      if (error.message.includes('Koneksi jaringan gagal')) {
        const type = filters.type || REPORT_TYPES.WEB;
        const reports = await getAllReportsDB(type);
        return reports.filter((report) =>
          (!filters.appName || report.appName.toLowerCase().includes(filters.appName.toLowerCase())) &&
          (!filters.category || report.category.includes(filters.category))
        );
      }
      throw new Error(error.message || 'Gagal mengambil daftar laporan');
    }
  }

  static async getUserReports(filters = {}, token) {
    try {
      const response = await getUserReports(filters, token);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      return response.data;
    } catch (error) {
      if (error.message.includes('Koneksi jaringan gagal')) {
        const type = filters.type || REPORT_TYPES.WEB;
        const reports = await getAllReportsDB(type);
        return reports.filter((report) =>
          (!filters.appName || report.appName.toLowerCase().includes(filters.appName.toLowerCase())) &&
          (!filters.category || report.category.includes(filters.category))
        );
      }
      throw new Error(error.message || 'Gagal mengambil daftar laporan pengguna');
    }
  }

  static async syncOfflineReports(token) {
    try {
      await syncOfflineReports(token);
      return true;
    } catch (error) {
      throw new Error(error.message || 'Gagal menyinkronkan laporan offline');
    }
  }
}

export default ReportModel;