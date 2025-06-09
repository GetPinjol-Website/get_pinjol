import { getPinjolPrediction, getAllPinjol } from '../services/api/pinjolApi';

// Model untuk mengelola data pinjaman online
class PinjolModel {
  // Mendapatkan prediksi pinjaman online
  static async getPinjolPrediction() {
    try {
      const response = await getPinjolPrediction();
      if (response.status !== 'sukses') {
        throw new Error(response.message || 'Gagal mengambil prediksi');
      }
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Gagal mengambil prediksi pinjaman online');
    }
  }

  // Mendapatkan daftar semua pinjaman online
  static async getAllPinjol() {
    try {
      const response = await getAllPinjol();
      if (response.status !== 'sukses') {
        throw new Error(response.message || 'Gagal mengambil daftar pinjaman');
      }
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Gagal mengambil daftar pinjaman online');
    }
  }
}

export default PinjolModel;