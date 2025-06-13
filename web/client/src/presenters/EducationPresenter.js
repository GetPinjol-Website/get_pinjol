import EducationModel from '../models/EducationModel';

class EducationPresenter {
  constructor(view) {
    this.view = view;
  }

  async createEducation(data, token) {
    this.view.setLoading(true);
    try {
      await EducationModel.createEducation(data, token);
      this.view.showSuccess('Konten berhasil dibuat');
      await this.getAllEducation({}, token);
      this.view.navigate('/admin/education');
    } catch (err) {
      if (err.isOffline) {
        this.view.showError('Anda sedang offline, tidak dapat membuat konten edukasi');
      } else {
        this.view.showError(err.message || 'Gagal membuat konten edukasi');
      }
    } finally {
      this.view.setLoading(false);
    }
  }

  async getAllEducation(filters = {}, token) {
    this.view.setLoading(true);
    try {
      console.log('Fetching all educations with token', token);
      const list = await EducationModel.getAllEducation({ ...filters, _t: Date.now() }, token); // Cache-busting
      console.log('Received educations:', list);
      // Pastikan referensi baru untuk memicu re-render
      this.view.setEducations([...list]);
    } catch (err) {
      console.error('Error fetching educations:', err);
      if (err.isOffline) {
        this.view.setEducations([]);
        this.view.showError('Anda sedang offline, tidak dapat memuat konten edukasi');
      } else {
        this.view.showError(err.message || 'Gagal memuat konten edukasi');
      }
    } finally {
      this.view.setLoading(false);
    }
  }

  async getEducationById(id, token) {
    this.view.setLoading(true);
    try {
      const edu = await EducationModel.getEducationById(id, token);
      this.view.setEducation(edu);
    } catch (err) {
      if (err.isOffline) {
        this.view.showError('Anda sedang offline, tidak dapat memuat konten edukasi');
      } else {
        this.view.showError(err.message || 'Gagal memuat konten edukasi');
      }
    } finally {
      this.view.setLoading(false);
    }
  }

  async updateEducation(id, data, token) {
    this.view.setLoading(true);
    try {
      await EducationModel.updateEducation(id, data, token);
      this.view.showSuccess('Konten berhasil diperbarui');
      await this.getAllEducation({}, token);
      this.view.navigate('/admin/education');
    } catch (err) {
      if (err.isOffline) {
        this.view.showError('Anda sedang offline, tidak dapat memperbarui konten edukasi');
      } else {
        this.view.showError(err.message || 'Gagal memperbarui konten edukasi');
      }
    } finally {
      this.view.setLoading(false);
    }
  }

  async deleteEducation(id, token) {
    this.view.setLoading(true);
    try {
      console.log('Deleting education with ID:', id);
      await EducationModel.deleteEducation(id, token);
      this.view.showSuccess('Konten berhasil dihapus');
      console.log('Refreshing educations after deletion');
      await this.getAllEducation({}, token);
    } catch (err) {
      console.error('Error deleting education:', err);
      if (err.isOffline) {
        this.view.showError('Anda sedang offline, tidak dapat menghapus konten edukasi');
      } else {
        this.view.showError(err.message || 'Gagal menghapus konten edukasi');
      }
    } finally {
      this.view.setLoading(false);
    }
  }
}

export default EducationPresenter;