import ReportModel from '../models/ReportModel';
import UserModel from '../models/UserModel';
import { REPORT_TYPES } from '../utils/constants';
import { isValidDate, isValidUrl } from '../utils/helpers';

class ReportPresenter {
  constructor(view) {
    this.view = view;
    // Validasi metode view yang diperlukan
    if (!view.setReports || typeof view.setReports !== 'function') {
      console.warn('view.setReports bukan fungsi. View yang diteruskan:', view);
    }
    if (!view.setLoading || typeof view.setLoading !== 'function') {
      console.warn('view.setLoading bukan fungsi. View yang diteruskan:', view);
    }
    if (!view.showError || typeof view.showError !== 'function') {
      console.warn('view.showError bukan fungsi. View yang diteruskan:', view);
    }
  }

  validateReportData(reportData) {
    if (!reportData.appName || !reportData.description || !reportData.category?.length || !reportData.incidentDate) {
      throw new Error('Semua field wajib diisi kecuali bukti');
    }
    if (!isValidDate(reportData.incidentDate)) {
      throw new Error('Tanggal kejadian tidak valid');
    }
    if (reportData.evidence && !isValidUrl(reportData.evidence)) {
      throw new Error('Link bukti tidak valid');
    }
  }

  async createWebReport(reportData) {
    try {
      this.view.setLoading?.(true);
      this.validateReportData(reportData);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      const response = await ReportModel.createWebReport(reportData, token);
      this.view.showSuccess?.('Laporan web berhasil dibuat');
      this.view.navigate?.('/dashboard');
      return response;
    } catch (error) {
      this.view.showError?.(error.message || 'Gagal membuat laporan web');
    } finally {
      this.view.setLoading?.(false);
    }
  }

  async createAppReport(reportData) {
    try {
      this.view.setLoading?.(true);
      this.validateReportData(reportData);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      const response = await ReportModel.createAppReport(reportData, token);
      this.view.showSuccess?.('Laporan aplikasi berhasil dibuat');
      this.view.navigate?.('/dashboard');
      return response;
    } catch (error) {
      this.view.showError?.(error.message || 'Gagal membuat laporan aplikasi');
    } finally {
      this.view.setLoading?.(false);
    }
  }

  async updateWebReport(id, reportData) {
    try {
      this.view.setLoading?.(true);
      this.validateReportData(reportData);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      const response = await ReportModel.updateWebReport(id, reportData, token);
      this.view.showSuccess?.('Laporan web berhasil diperbarui');
      this.view.navigate?.('/dashboard');
      return response;
    } catch (error) {
      this.view.showError?.(error.message || 'Gagal memperbarui laporan web');
    } finally {
      this.view.setLoading?.(false);
    }
  }

  async updateAppReport(id, reportData) {
    try {
      this.view.setLoading?.(true);
      this.validateReportData(reportData);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      const response = await ReportModel.updateAppReport(id, reportData, token);
      this.view.showSuccess?.('Laporan aplikasi berhasil diperbarui');
      this.view.navigate?.('/dashboard');
      return response;
    } catch (error) {
      this.view.showError?.(error.message || 'Gagal memperbarui laporan aplikasi');
    } finally {
      this.view.setLoading?.(false);
    }
  }

  async deleteWebReport(id) {
    try {
      this.view.setLoading?.(true);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      await ReportModel.deleteWebReport(id, token);
      this.view.showSuccess?.('Laporan web berhasil dihapus');
      this.view.refreshReports?.();
    } catch (error) {
      this.view.showError?.(error.message || 'Gagal menghapus laporan web');
    } finally {
      this.view.setLoading?.(false);
    }
  }

  async deleteAppReport(id) {
    try {
      this.view.setLoading?.(true);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      await ReportModel.deleteAppReport(id, token);
      this.view.showSuccess?.('Laporan aplikasi berhasil dihapus');
      this.view.refreshReports?.();
    } catch (error) {
      this.view.showError?.(error.message || 'Gagal menghapus laporan aplikasi');
    } finally {
      this.view.setLoading?.(false);
    }
  }

  async getReportById(id, type = REPORT_TYPES.WEB) {
    try {
      this.view.setLoading?.(true);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      const report = await ReportModel.getReportById(id, token, type);
      this.view.setReport?.(report);
      return report;
    } catch (error) {
      this.view.showError?.(error.message || 'Gagal mengambil laporan');
    } finally {
      this.view.setLoading?.(false);
    }
  }

  async getAllReports(filters = {}) {
    try {
      this.view.setLoading?.(true);
      const token = UserModel.getToken();
      const reports = await ReportModel.getAllReports(filters, token);
      if (filters.type === 'app') {
        this.view.setTotalAppReports?.(reports.length);
      } else if (filters.type === 'web' && reports.length > 0) {
        const counts = {};
        reports.forEach(report => {
          counts[report.appName] = (counts[report.appName] || 0) + 1;
        });
        const mostReported = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, '');
        this.view.setMostReportedWeb?.({ appName: mostReported, count: counts[mostReported] || 0 });
      }
      if (this.view.setReports) {
        this.view.setReports(reports);
      } else {
        console.warn('Tidak dapat mengatur laporan karena setReports tidak tersedia.');
      }
      return reports;
    } catch (error) {
      this.view.showError?.(error.message || 'Gagal mengambil daftar laporan');
    } finally {
      this.view.setLoading?.(false);
    }
  }

  async getUserReports(filters = {}) {
    try {
      this.view.setLoading?.(true);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      const reports = await ReportModel.getUserReports(filters, token);
      if (this.view.setReports) {
        this.view.setReports(reports);
      } else {
        console.warn('Tidak dapat mengatur laporan pengguna karena setReports tidak tersedia.');
      }
    } catch (error) {
      this.view.showError?.(error.message || 'Gagal mengambil daftar laporan pengguna');
    } finally {
      this.view.setLoading?.(false);
    }
  }

  async syncOfflineReports() {
    try {
      this.view.setLoading?.(true);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      await ReportModel.syncOfflineReports(token);
      this.view.showSuccess?.('Laporan offline berhasil disinkronkan');
    } catch (error) {
      this.view.showError?.(error.message || 'Gagal menyinkronkan laporan offline');
    } finally {
      this.view.setLoading?.(false);
    }
  }
}

export default ReportPresenter;