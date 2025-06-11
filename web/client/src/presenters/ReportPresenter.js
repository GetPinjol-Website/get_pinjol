import ReportModel from '../models/ReportModel';
import UserModel from '../models/UserModel';
import { REPORT_TYPES } from '../utils/constants';

class ReportPresenter {
  constructor(view) {
    this.view = view;
  }

  async createWebReport(reportData) {
    try {
      this.view.setLoading(true);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      const response = await ReportModel.createWebReport(reportData, token);
      this.view.showSuccess('Laporan web berhasil dibuat');
      this.view.navigate('/dashboard');
      return response;
    } catch (error) {
      this.view.showError(error.message || 'Gagal membuat laporan web');
    } finally {
      this.view.setLoading(false);
    }
  }

  async createAppReport(reportData) {
    try {
      this.view.setLoading(true);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      const response = await ReportModel.createAppReport(reportData, token);
      this.view.showSuccess('Laporan aplikasi berhasil dibuat');
      this.view.navigate('/dashboard');
      return response;
    } catch (error) {
      this.view.showError(error.message || 'Gagal membuat laporan aplikasi');
    } finally {
      this.view.setLoading(false);
    }
  }

  async updateWebReport(id, reportData) {
    try {
      this.view.setLoading(true);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      const response = await ReportModel.updateWebReport(id, reportData, token);
      this.view.showSuccess('Laporan web berhasil diperbarui');
      this.view.navigate('/dashboard');
      return response;
    } catch (error) {
      this.view.showError(error.message || 'Gagal memperbarui laporan web');
    } finally {
      this.view.setLoading(false);
    }
  }

  async updateAppReport(id, reportData) {
    try {
      this.view.setLoading(true);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      const response = await ReportModel.updateAppReport(id, reportData, token);
      this.view.showSuccess('Laporan aplikasi berhasil diperbarui');
      this.view.navigate('/dashboard');
      return response;
    } catch (error) {
      this.view.showError(error.message || 'Gagal memperbarui laporan aplikasi');
    } finally {
      this.view.setLoading(false);
    }
  }

  async deleteWebReport(id) {
    try {
      this.view.setLoading(true);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      await ReportModel.deleteWebReport(id, token);
      this.view.showSuccess('Laporan web berhasil dihapus');
      this.view.refreshReports();
    } catch (error) {
      this.view.showError(error.message || 'Gagal menghapus laporan web');
    } finally {
      this.view.setLoading(false);
    }
  }

  async deleteAppReport(id) {
    try {
      this.view.setLoading(true);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      await ReportModel.deleteAppReport(id, token);
      this.view.showSuccess('Laporan aplikasi berhasil dihapus');
      this.view.refreshReports();
    } catch (error) {
      this.view.showError(error.message || 'Gagal menghapus laporan aplikasi');
    } finally {
      this.view.setLoading(false);
    }
  }

  async getReportById(id, type = REPORT_TYPES.WEB) {
    try {
      this.view.setLoading(true);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      const report = await ReportModel.getReportById(id, token, type);
      this.view.setReport(report);
      return report;
    } catch (error) {
      this.view.showError(error.message || 'Gagal mengambil laporan');
    } finally {
      this.view.setLoading(false);
    }
  }

  async getAllReports(filters = {}) {
    try {
      this.view.setLoading(true);
      const token = UserModel.getToken();
      const reports = await ReportModel.getAllReports(filters, token);
      this.view.setReports(reports);
    } catch (error) {
      this.view.showError(error.message || 'Gagal mengambil daftar laporan');
    } finally {
      this.view.setLoading(false);
    }
  }

  async getUserReports(filters = {}) {
    try {
      this.view.setLoading(true);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      const reports = await ReportModel.getUserReports(filters, token);
      this.view.setReports(reports);
    } catch (error) {
      this.view.showError(error.message || 'Gagal mengambil daftar laporan pengguna');
    } finally {
      this.view.setLoading(false);
    }
  }

  async syncOfflineReports() {
    try {
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      await ReportModel.syncOfflineReports(token);
      this.view.showSuccess('Laporan offline berhasil disinkronkan');
    } catch (error) {
      this.view.showError(error.message || 'Gagal menyinkronkan laporan offline');
    }
  }
}

export default ReportPresenter;