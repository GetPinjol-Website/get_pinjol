import EducationModel from '../models/EducationModel';

// Presenter untuk mengelola logika konten edukasi
class EducationPresenter {
  constructor(view) {
    this.view = view;
  }

  // Membuat konten edukasi baru
  async createEducation(educationData) {
    try {
      this.view.setLoading(true);
      const response = await EducationModel.createEducation(educationData);
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
  async updateEducation(id, educationData) {
    try {
      this.view.setLoading(true);
      const response = await EducationModel.updateEducation(id, educationData);
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
  async deleteEducation(id) {
    try {
      this.view.setLoading(true);
      const response = await EducationModel.deleteEducation(id);
      this.view.showSuccess('Konten edukasi berhasil dihapus');
      return response;
    } catch (error) {
      this.view.showError(error.message || 'Gagal menghapus konten edukasi');
    } finally {
      this.view.setLoading(false);
    }
  }
}

export default EducationPresenter;