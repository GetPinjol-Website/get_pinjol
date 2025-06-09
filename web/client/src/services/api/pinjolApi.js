import axios from 'axios';
import { BASE_URL } from '../../utils/constants';

// Helper function untuk menangani error respons API
const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    return {
      status: data.status || 'error',
      message: data.pesan || 'Terjadi kesalahan pada server',
      code: status,
    };
  }
  return {
    status: 'error',
    message: error.message || 'Koneksi jaringan gagal',
    code: 0,
  };
};

// Mendapatkan prediksi pinjaman online
export const getPinjolPrediction = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/pinjol`);
    return {
      status: response.data.status || 'sukses',
      data: response.data.data || {},
      code: response.status,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

// Mendapatkan daftar semua pinjaman online
export const getAllPinjol = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/pinjols`);
    return {
      status: response.data.status || 'sukses',
      data: response.data.data || [],
      code: response.status,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};