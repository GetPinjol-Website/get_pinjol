import EducationModel from '../models/EducationModel';

class EducationPresenter {
  constructor(view) {
    this.view = view;
  }

  // Membuat konten edukasi baru
  async createEducation(educationData, token) {
    try {
      this.view.setLoading(true);
      const response = await EducationModel.createEducation(educationData, token);
      this.view.showSuccess('Konten edukasi berhasil dibuat');
      this.view.navigate('/admin/education');
      return response;
    } catch (error) {
      this.view.showError(error.message || 'Gagal membuat konten edukasi');
    } finally {
      this.view.setLoading(false);
    }
  }

  // Mendapatkan semua konten edukasi dengan filter
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

  // Mendapatkan konten edukasi berdasarkan ID
  async getEducationById(id) {
    try {
      this.view.setLoading(true);
      const education = await EducationModel.getEducationById(id);
      this.view.setEducation(education);
      return education;
    } catch (error) {
      this.view.showError(error.message || 'Gagal mengambil konten edukasi');
    } finally {
      this.view.setLoading(false);
    }
  }

  // Memperbarui konten edukasi
  async updateEducation(id, educationData, token) {
    try {
      this.view.setLoading(true);
      const response = await EducationModel.updateEducation(id, educationData, token);
      this.view.showSuccess('Konten edukasi berhasil diperbarui');
      this.view.navigate('/admin/education');
      return response;
    } catch (error) {
      this.view.showError(error.message || 'Gagal memperbarui konten edukasi');
    } finally {
      this.view.setLoading(false);
    }
  }

  // Menghapus konten edukasi
  async deleteEducation(id, token) {
    try {
      this.view.setLoading(true);
      const response = await EducationModel.deleteEducation(id, token);
      this.view.showSuccess('Konten edukasi berhasil dihapus');
      return response;
    } catch (error) {
      this.view.showError(error.message || 'Gagal menghapus konten edukasi');
    } finally {
      this.view.setLoading(false);
    }
  }

  // Sinkronisasi data offline
  async syncOfflineEducations(token) {
    try {
      this.view.setLoading(true);
      await EducationModel.syncOfflineEducations(token);
      this.view.showSuccess('Data edukasi offline berhasil disinkronkan');
    } catch (error) {
      this.view.showError(error.message || 'Gagal menyinkronkan data edukasi offline');
    } finally {
      this.view.setLoading(false);
    }
  }
}

export default EducationPresenter;