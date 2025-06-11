import { createEducation, getAllEducation, getEducationById, updateEducation, deleteEducation } from '../services/api/educationApi';
import { saveEducation, getEducation, getAllEducationsDB, deleteEducation as deleteEducationDB } from '../services/indexedDB/educationDB';

// Model untuk mengelola data konten edukasi
class EducationModel {
  // Membuat konten edukasi baru
  static async createEducation(educationData) {
    try {
      const response = await createEducation(educationData);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      // Simpan ke IndexedDB
      await saveEducation(response.data);
      return response.data;
    } catch (error) {
      // Coba simpan ke IndexedDB jika offline
      if (error.message.includes('Koneksi jaringan gagal')) {
        const offlineEducation = { ...educationData, id: `offline-${Date.now()}`, updatedAt: new Date().toISOString() };
        await saveEducation(offlineEducation);
        return offlineEducation;
      }
      throw new Error(error.message || 'Gagal membuat konten edukasi');
    }
  }

  // Mendapatkan semua konten edukasi dengan filter
  static async getAllEducation(filters = {}) {
    try {
      const response = await getAllEducation(filters);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      return response.data;
    } catch (error) {
      // Coba ambil dari IndexedDB jika offline
      if (error.message.includes('Koneksi jaringan gagal')) {
        const educations = await getAllEducationsDB();
        return educations.filter((edu) =>
          (!filters.title || edu.title.toLowerCase().includes(filters.title.toLowerCase())) &&
          (!filters.category || edu.category === filters.category)
        );
      }
      throw new Error(error.message || 'Gagal mengambil daftar edukasi');
    }
  }

  // Mendapatkan konten edukasi berdasarkan ID
  static async getEducationById(id) {
    try {
      const response = await getEducationById(id);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      return response.data;
    } catch (error) {
      // Coba ambil dari IndexedDB jika offline
      if (error.message.includes('Koneksi jaringan gagal')) {
        const education = await getEducation(id);
        if (education) return education;
      }
      throw new Error(error.message || 'Gagal mengambil konten edukasi');
    }
  }

  // Memperbarui konten edukasi
  static async updateEducation(id, educationData) {
    try {
      const response = await updateEducation(id, educationData);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      // Perbarui di IndexedDB
      await saveEducation({ ...educationData, id });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Gagal memperbarui konten edukasi');
    }
  }

  // Menghapus konten edukasi
  static async deleteEducation(id) {
    try {
      const response = await deleteEducation(id);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      // Hapus dari IndexedDB
      await deleteEducationDB(id);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Gagal menghapus konten edukasi');
    }
  }
}

export default EducationModel;