import { createEducation, getAllEducation, getEducationById, updateEducation, deleteEducation } from '../services/api/educationApi';
import { saveEducation, getEducation, getAllEducationsDB, deleteEducation as deleteEducationDB } from '../services/indexedDB/educationDB';

class EducationModel {
  // Membuat konten edukasi baru
  static async createEducation(educationData, token) {
    try {
      const response = await createEducation(educationData, token);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      // Simpan ke IndexedDB
      await saveEducation(response.data);
      return response.data;
    } catch (error) {
      // Simpan ke IndexedDB jika offline
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
      // Simpan semua data ke IndexedDB
      await Promise.all(response.data.map((edu) => saveEducation(edu)));
      return response.data;
    } catch (error) {
      // Ambil dari IndexedDB jika offline
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
      // Simpan ke IndexedDB
      await saveEducation(response.data);
      return response.data;
    } catch (error) {
      // Ambil dari IndexedDB jika offline
      if (error.message.includes('Koneksi jaringan gagal')) {
        const education = await getEducation(id);
        if (education) return education;
      }
      throw new Error(error.message || 'Gagal mengambil konten edukasi');
    }
  }

  // Memperbarui konten edukasi
  static async updateEducation(id, educationData, token) {
    try {
      const response = await updateEducation(id, educationData, token);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      // Perbarui di IndexedDB
      await saveEducation({ ...educationData, id });
      return response;
    } catch (error) {
      // Tandai untuk sinkronisasi ulang jika offline
      if (error.message.includes('Koneksi jaringan gagal')) {
        await saveEducation({ ...educationData, id, updatedAt: new Date().toISOString(), needsSync: true });
        return { status: 'sukses', message: 'Perubahan disimpan lokal, akan disinkronkan saat online' };
      }
      throw new Error(error.message || 'Gagal memperbarui konten edukasi');
    }
  }

  // Menghapus konten edukasi
  static async deleteEducation(id, token) {
    try {
      const response = await deleteEducation(id, token);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      // Hapus dari IndexedDB
      await deleteEducationDB(id);
      return response;
    } catch (error) {
      // Tandai untuk penghapusan saat online jika offline
      if (error.message.includes('Koneksi jaringan gagal')) {
        await saveEducation({ id, deleted: true, needsSync: true });
        return { status: 'sukses', message: 'Penghapusan disimpan lokal, akan disinkronkan saat online' };
      }
      throw new Error(error.message || 'Gagal menghapus konten edukasi');
    }
  }

  // Sinkronisasi data offline
  static async syncOfflineEducations(token) {
    try {
      const educations = await getAllEducationsDB();
      const offlineEducations = educations.filter((edu) => edu.id.startsWith('offline-') || edu.needsSync);
      for (const edu of offlineEducations) {
        if (edu.deleted) {
          await deleteEducation(edu.id, token);
          await deleteEducationDB(edu.id);
        } else if (edu.needsSync) {
          const { id, needsSync, updatedAt, ...educationData } = edu;
          await updateEducation(id, educationData, token);
          await saveEducation({ ...educationData, id });
        } else {
          const { id, ...educationData } = edu;
          const response = await createEducation(educationData, token);
          await deleteEducationDB(id);
          await saveEducation(response.data);
        }
      }
    } catch (error) {
      throw new Error(error.message || 'Gagal menyinkronkan data edukasi offline');
    }
  }
}

export default EducationModel;