import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import { saveEducation } from '../indexedDB/educationDB';

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

// Membuat konten edukasi baru
export const createEducation = async (educationData) => {
  try {
    const response = await axios.post(`${BASE_URL}/education`, educationData);
    // Simpan ke IndexedDB untuk caching offline
    await saveEducation(response.data.data);
    return {
      status: response.data.status,
      message: response.data.pesan,
      data: response.data.data,
      code: response.status,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

// Mendapatkan semua konten edukasi dengan filter opsional
export const getAllEducation = async (filters = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/education`, { params: filters });
    return {
      status: response.data.status,
      data: response.data.data,
      code: response.status,
      headers: {
        cacheControl: response.headers['cache-control'],
        etag: response.headers['etag'],
        lastModified: response.headers['last-modified'],
      },
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

// Mendapatkan konten edukasi berdasarkan ID
export const getEducationById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/education/${id}`);
    return {
      status: response.data.status,
      data: response.data.data,
      code: response.status,
      headers: {
        cacheControl: response.headers['cache-control'],
        etag: response.headers['etag'],
        lastModified: response.headers['last-modified'],
      },
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

// Memperbarui konten edukasi
export const updateEducation = async (id, educationData) => {
  try {
    const response = await axios.put(`${BASE_URL}/education/${id}`, educationData);
    // Perbarui di IndexedDB
    await saveEducation({ ...educationData, id });
    return {
      status: response.data.status,
      message: response.data.pesan,
      code: response.status,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

// Menghapus konten edukasi
export const deleteEducation = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/education/${id}`);
    // Hapus dari IndexedDB
    await deleteEducationFromDB(id);
    return {
      status: response.data.status,
      message: response.data.pesan,
      code: response.status,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

// Fungsi placeholder untuk menghapus dari IndexedDB (implementasi di educationDB.js)
const deleteEducationFromDB = async (id) => {
  // Implementasi sebenarnya ada di educationDB.js
};