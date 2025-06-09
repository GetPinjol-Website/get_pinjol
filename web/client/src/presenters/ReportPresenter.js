import ReportModel from '../models/ReportModel';
import UserModel from '../models/UserModel';

// Presenter untuk mengelola logika laporan
class ReportPresenter {
  constructor(view) {
    this.view = view;
  }

  // Membuat laporan berbasis web
  async createWebReport(reportData) {
    try {
      this.view.setLoading(true);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      const response = await ReportModel.createWebReport(reportData, token);
      this.view.showSuccess('Laporan berhasil dibuat');
      this.view.navigate('/dashboard');
      return response;
    } catch (error) {
      this.view.showError(error.message || 'Gagal membuat laporan');
    } finally {
      this.view.setLoading(false);
    }
  }

  // Membuat laporan berbasis aplikasi
  async createAppReport(reportData) {
    try {
      this.view.setLoading(true);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      const response = await ReportModel.createAppReport(reportData, token);
      this.view.showSuccess('Laporan berhasil dibuat');
      this.view.navigate('/dashboard');
      return response;
    } catch (error) {
      this.view.showError(error.message || 'Gagal membuat laporan');
    } finally {
      this.view.setLoading(false);
    }
  }

  // Mendapatkan laporan teratas
  async getTopReports() {
    try {
      this.view.setLoading(true);
      const reports = await ReportModel.getTopReports();
      this.view.setTopReports(reports);
    } catch (error) {
      this.view.showError(error.message || 'Gagal mengambil laporan teratas');
    } finally {
      this.view.setLoading(false);
    }
  }

  // Mendapatkan laporan berdasarkan ID
  async getReportById(id) {
    try {
      this.view.setLoading(true);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      const report = await ReportModel.getReportById(id, token);
      this.view.setReport(report);
      return report;
    } catch (error) {
      this.view.showError(error.message || 'Gagal mengambil laporan');
    } finally {
      this.view.setLoading(false);
    }
  }

  // Mendapatkan semua laporan dengan filter
  async getAllReports(filters = {}) {
    try {
      this.view.setLoading(true);
      const reports = await ReportModel.getAllReports(filters);
      this.view.setReports(reports);
    } catch (error) {
      this.view.showError(error.message || 'Gagal mengambil daftar laporan');
    } finally {
      this.view.setLoading(false);
    }
  }
}

export default ReportPresenter;