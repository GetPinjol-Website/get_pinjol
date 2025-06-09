import PinjolModel from '../models/PinjolModel';

// Presenter untuk mengelola logika pinjaman online
class PinjolPresenter {
  constructor(view) {
    this.view = view;
  }

  // Mendapatkan prediksi pinjaman online
  async getPinjolPrediction() {
    try {
      this.view.setLoading(true);
      const prediction = await PinjolModel.getPinjolPrediction();
      this.view.setPrediction(prediction);
    } catch (error) {
      this.view.showError(error.message || 'Gagal mengambil prediksi pinjaman');
    } finally {
      this.view.setLoading(false);
    }
  }

  // Mendapatkan daftar semua pinjaman online
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
}

export default PinjolPresenter;