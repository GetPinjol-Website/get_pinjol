import ReportModel from '../models/ReportModel';
import UserModel from '../models/UserModel';
import { REPORT_TYPES } from '../utils/constants';
import { isValidDate, isValidUrl } from '../utils/helpers';

class ReportPresenter {
  constructor(view) {
    this.view = view;
  }

  validateReportData(reportData) {
    if (!reportData.appName || !reportData.description || !Array.isArray(reportData.category) || !reportData.category.length || !reportData.incidentDate || !reportData.userId) {
      throw new Error('Semua field wajib diisi kecuali bukti');
    }
    if (!isValidDate(reportData.incidentDate)) throw new Error('Tanggal kejadian tidak valid');
    if (reportData.evidence && !isValidUrl(reportData.evidence)) throw new Error('Link bukti tidak valid');
  }

  async createWebReport(reportData) {
    try {
      this.view.setLoading?.(true);
      // Hapus field type dari data yang dikirim
      const { type, ...dataToSend } = reportData;
      // Tambahkan userId dari UserModel
      dataToSend.userId = UserModel.getUserId();
      this.validateReportData(dataToSend);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      console.log('Creating web report:', dataToSend);
      const response = await ReportModel.createWebReport(dataToSend, token);
      this.view.showSuccess?.('Laporan web berhasil dibuat');
      this.view.navigate?.('/dashboard');
      return response;
    } catch (error) {
      console.error('Error in createWebReport:', error);
      if (error.isOffline) {
        this.view.showError?.('Anda sedang offline, tidak dapat membuat laporan');
      } else {
        const errorMessage = error.response?.data?.pesan || error.message || 'Gagal membuat laporan web';
        this.view.showError?.(errorMessage);
      }
      throw error;
    } finally {
      this.view.setLoading?.(false);
    }
  }

  async createAppReport(reportData) {
    try {
      this.view.setLoading?.(true);
      const { type, ...dataToSend } = reportData;
      dataToSend.userId = UserModel.getUserId();
      this.validateReportData(dataToSend);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      console.log('Creating app report:', dataToSend);
      const response = await ReportModel.createAppReport(dataToSend, token);
      this.view.showSuccess?.('Laporan aplikasi berhasil dibuat');
      this.view.navigate?.('/dashboard');
      return response;
    } catch (error) {
      console.error('Error in createAppReport:', error);
      if (error.isOffline) {
        this.view.showError?.('Anda sedang offline, tidak dapat membuat laporan');
      } else {
        const errorMessage = error.response?.data?.pesan || error.message || 'Gagal membuat laporan aplikasi';
        this.view.showError?.(errorMessage);
      }
      throw error;
    } finally {
      this.view.setLoading?.(false);
    }
  }

  async updateWebReport(id, reportData) {
    try {
      this.view.setLoading?.(true);
      const { type, id: reportId, ...dataToSend } = reportData;
      dataToSend.userId = UserModel.getUserId();
      if (!dataToSend.status) this.validateReportData(dataToSend);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      console.log('Updating web report ID:', id, 'Data:', dataToSend);
      const response = await ReportModel.updateWebReport(id, dataToSend, token);
      this.view.showSuccess?.('Laporan web berhasil diperbarui');
      this.view.navigate?.('/dashboard');
      return response;
    } catch (error) {
      console.error('Error in updateWebReport:', error);
      if (error.isOffline) {
        this.view.showError?.('Anda sedang offline, tidak dapat memperbarui laporan');
      } else if (error.status === 404) {
        this.view.showError?.('Laporan tidak ditemukan');
      } else {
        const errorMessage = error.response?.data?.pesan || error.message || 'Gagal memperbarui laporan web';
        this.view.showError?.(errorMessage);
      }
      throw error;
    } finally {
      this.view.setLoading?.(false);
    }
  }

  async updateAppReport(id, reportData) {
    try {
      this.view.setLoading?.(true);
      const { type, id: reportId, ...dataToSend } = reportData;
      dataToSend.userId = UserModel.getUserId();
      if (!dataToSend.status) this.validateReportData(dataToSend);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      console.log('Updating app report ID:', id, 'Data:', dataToSend);
      const response = await ReportModel.updateAppReport(id, dataToSend, token);
      this.view.showSuccess?.('Laporan aplikasi berhasil diperbarui');
      this.view.navigate?.('/dashboard');
      return response;
    } catch (error) {
      console.error('Error in updateAppReport:', error);
      if (error.isOffline) {
        this.view.showError?.('Anda sedang offline, tidak dapat memperbarui laporan');
      } else if (error.status === 404) {
        this.view.showError?.('Laporan tidak ditemukan');
      } else {
        const errorMessage = error.response?.data?.pesan || error.message || 'Gagal memperbarui laporan aplikasi';
        this.view.showError?.(errorMessage);
      }
      throw error;
    } finally {
      this.view.setLoading?.(false);
    }
  }

  async deleteWebReport(id) {
    try {
      this.view.setLoading?.(true);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      console.log('Deleting web report ID:', id);
      await ReportModel.deleteWebReport(id, token);
      this.view.showSuccess?.('Laporan web berhasil dihapus');
      this.view.refreshReports?.();
    } catch (error) {
      console.error('Error in deleteWebReport:', error);
      if (error.isOffline) {
        this.view.showError?.('Anda sedang offline, tidak dapat menghapus laporan');
      } else {
        const errorMessage = error.response?.data?.pesan || error.message || 'Gagal menghapus laporan web';
        this.view.showError?.(errorMessage);
      }
      throw error;
    } finally {
      this.view.setLoading?.(false);
    }
  }

  async deleteAppReport(id) {
    try {
      this.view.setLoading?.(true);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      console.log('Deleting app report ID:', id);
      await ReportModel.deleteAppReport(id, token);
      this.view.showSuccess?.('Laporan aplikasi berhasil dihapus');
      this.view.refreshReports?.();
    } catch (error) {
      console.error('Error in deleteAppReport:', error);
      if (error.isOffline) {
        this.view.showError?.('Anda sedang offline, tidak dapat menghapus laporan');
      } else {
        const errorMessage = error.response?.data?.pesan || error.message || 'Gagal menghapus laporan aplikasi';
        this.view.showError?.(errorMessage);
      }
      throw error;
    } finally {
      this.view.setLoading?.(false);
    }
  }

  async getReportById(id, type = REPORT_TYPES.WEB, params = {}) {
    try {
      this.view.setLoading?.(true);
      const token = UserModel.getToken();
      console.log('Fetching report ID:', id, 'Type:', type, 'Params:', params);
      const report = await ReportModel.getReportById(id, token, type, params);
      if (report.deleted) throw new Error('Laporan telah dihapus');
      this.view.setReport?.({ ...report });
      return report;
    } catch (error) {
      console.error('Error in getReportById:', error);
      if (error.isOffline) {
        this.view.showError?.('Anda sedang offline, tidak dapat memuat laporan');
      } else {
        const errorMessage = error.response?.data?.pesan || error.message || 'Gagal mengambil laporan';
        this.view.showError?.(errorMessage);
      }
      throw error;
    } finally {
      this.view.setLoading?.(false);
    }
  }

  async getAllReports(filters = {}) {
    try {
      this.view.setLoading?.(true);
      const token = UserModel.getToken();
      console.log('Fetching all reports with filters:', filters);
      const reports = await ReportModel.getAllReports(filters, token);
      this.view.setReports?.(reports);
      console.log('Received reports:', reports);
      return reports;
    } catch (error) {
      console.error('Error in getAllReports:', error);
      if (error.isOffline) {
        this.view.setReports?.([]);
        this.view.showError?.('Anda sedang offline, tidak dapat memuat laporan');
      } else {
        const errorMessage = error.response?.data?.pesan || error.message || 'Gagal mengambil semua laporan';
        this.view.showError?.(errorMessage);
      }
      throw error;
    } finally {
      this.view.setLoading?.(false);
    }
  }

  async getUserReports(filters = {}) {
    try {
      this.view.setLoading?.(true);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      console.log('Fetching user reports with filters:', filters);
      const reports = await ReportModel.getUserReports(filters, token);
      this.view.setReports?.([...reports.data]);
      console.log('Received user reports:', reports);
      return reports;
    } catch (error) {
      console.error('Error in getUserReports:', error);
      if (error.isOffline) {
        this.view.setReports?.([]);
        this.view.showError?.('Anda sedang offline, tidak dapat memuat laporan');
      } else {
        const errorMessage = error.response?.data?.pesan || error.message || 'Gagal mengambil daftar laporan pengguna';
        this.view.showError?.(errorMessage);
      }
      throw error;
    } finally {
      this.view.setLoading?.(false);
    }
  }

  async getAllApplications(filters = {}) {
    try {
      this.view.setLoading?.(true);
      const token = UserModel.getToken();
      console.log('Fetching all applications with filters:', filters);
      const applications = await ReportModel.getAllApplications(filters, token);
      this.view.setApplications?.(applications);
      console.log('Received applications:', applications);
      return applications;
    } catch (error) {
      console.error('Error in getAllApplications:', error);
      if (error.isOffline) {
        this.view.setApplications?.([]);
        this.view.showError?.('Anda sedang offline, tidak dapat memuat daftar aplikasi');
      } else {
        const errorMessage = error.response?.data?.pesan || error.message || 'Gagal mengambil daftar aplikasi';
        this.view.showError?.(errorMessage);
      }
      throw error;
    } finally {
      this.view.setLoading?.(false);
    }
  }

  async verifyReport(id, { status } = {}, type) {
    try {
      this.view.setLoading?.(true);
      const token = UserModel.getToken();
      if (!token) throw new Error('Autentikasi diperlukan');
      const role = UserModel.getRole();
      if (role !== 'admin') throw new Error('Hanya admin yang dapat memverifikasi laporan');
      if (!type || ![REPORT_TYPES.WEB, REPORT_TYPES.APP].includes(type)) {
        throw new Error('Tipe laporan tidak valid');
      }
      const reportData = { status };
      console.log('Verifying report ID:', id, 'Status:', status, 'Type:', type);
      const response = await (type === REPORT_TYPES.WEB
        ? ReportModel.updateWebReport(id, reportData, token)
        : ReportModel.updateAppReport(id, reportData, token));
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
        const errorMessage = error.response?.data?.pesan || error.message || 'Terjadi kesalahan pada server';
        this.view.showError?.(errorMessage);
      }
      throw error;
    } finally {
      this.view.setLoading?.(false);
    }
  }
}

export default ReportPresenter;