import UserModel from '../models/UserModel';
import ReportModel from '../models/ReportModel';
import PinjolModel from '../models/PinjolModel';
import EducationModel from '../models/EducationModel';

// Presenter untuk mengelola logika admin
class AdminPresenter {
  constructor(view) {
    this.view = view;
  }

  // Mendapatkan daftar semua pengguna
  async getAllUsers(filters = {}) {
    try {
      this.view.setLoading(true);
      const users = await UserModel.getAllUsers(filters);
      this.view.setUsers(users);
    } catch (error) {
      this.view.showError(error.message || 'Gagal mengambil daftar pengguna');
    } finally {
      this.view.setLoading(false);
    }
  }

  // Mendapatkan semua laporan untuk verifikasi
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

  // Mendapatkan semua pinjaman online
  async getAllPinjol() {
    try {
      this.view.setLoading(true);
      const pinjols = await PinjolModel.getAllPinjol();
      this.view.setPinjols(pinjols);
    } catch (error) {
      this.view.showError(error.message || 'Gagal mengambil daftar pinjaman');
    } finally {
      this.view.setLoading(false);
    }
  }

  // Mendapatkan semua konten edukasi
  async getAllEducation(filters = {}) {
    try {
      this.view.setLoading(true);
      const educations = await EducationModel.getAllEducation(filters);
      this.view.setEducations(educations);
    } catch (error) {
      this.view.showError(error.message || 'Gagal mengambil daftar edukasi');
    } finally {
      this.view.setLoading(false);
    }
  }

  // Verifikasi laporan (placeholder, karena endpoint verifikasi tidak ada)
  async verifyReport(id, status) {
    try {
      this.view.setLoading(true);
      // Asumsi endpoint verifikasi akan ditambahkan
      this.view.showSuccess(`Laporan ${status} berhasil`);
    } catch (error) {
      this.view.showError(error.message || 'Gagal memverifikasi laporan');
    } finally {
      this.view.setLoading(false);
    }
  }
}

export default AdminPresenter;