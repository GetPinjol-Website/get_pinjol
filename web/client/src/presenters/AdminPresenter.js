import ReportModel from '../models/ReportModel';
import UserModel from '../models/UserModel';
import { REPORT_TYPES } from '../utils/constants';

class AdminPresenter {
  constructor(view) {
    this.view = view;
  }

  async getAllReports(filters = {}) {
    try {
      this.view.setLoading?.(true);
      const token = UserModel.getToken();
      const role = UserModel.getRole() || 'admin';
      console.log('Fetching all reports with filters:', filters);
      const response = await ReportModel.getAllReports(filters, token, role);
      this.view.setReports?.(response.data);
      console.log('Received reports:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getAllReports:', error);
      if (error.isOffline) {
        this.view.setReports?.([]);
        this.view.showError?.('Anda sedang offline, tidak dapat memuat laporan');
      } else {
        this.view.showError?.(error.message || 'Gagal mengambil daftar laporan');
      }
      throw error;
    } finally {
      this.view.setLoading?.(false);
    }
  }

  async verifyReport(id, { status, level }, type) {
    try {
      this.view.setLoading?.(true);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      const role = UserModel.getRole();
      if (role !== 'admin') throw new Error('Hanya admin yang dapat memverifikasi laporan');
      if (!type || ![REPORT_TYPES.WEB, REPORT_TYPES.APP].includes(type)) {
        throw new Error('Tipe laporan tidak valid');
      }
      if (!['low', 'medium', 'high'].includes(level)) {
        throw new Error('Level harus low, medium, atau high');
      }
      const reportData = { status, level };
      console.log('Verifying report ID:', id, 'Status:', status, 'Type:', type, 'Level:', level);
      const response = await (type === REPORT_TYPES.WEB
        ? ReportModel.updateWebReport(id, reportData, token, role)
        : ReportModel.updateAppReport(id, reportData, token, role));
      this.view.showSuccess?.(`Laporan ${status === 'accepted' ? 'diterima' : 'ditolak'} berhasil`);
      this.view.refreshReports?.();
      return response;
    } catch (error) {
      console.error('Error in verifyReport:', error);
      if (error.isOffline) {
        this.view.showError?.('Anda sedang offline, tidak dapat memverifikasi laporan');
      } else if (error.status === 404) {
        this.view.showError?.('Laporan tidak ditemukan');
      } else {
        this.view.showError?.(error.message || 'Terjadi kesalahan pada server');
      }
      throw error;
    } finally {
      this.view.setLoading?.(false);
    }
  }
}

export default AdminPresenter;