import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import { saveReport } from '../indexedDB/reportDB';

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

// Membuat laporan berbasis web
export const createWebReport = async (reportData, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/report/web`, reportData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Simpan ke IndexedDB untuk caching offline
    await saveReport(response.data.data);
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

// Membuat laporan berbasis aplikasi
export const createAppReport = async (reportData, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/report/app`, reportData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Simpan ke IndexedDB untuk caching offline
    await saveReport(response.data.data);
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

// Mendapatkan 5 kategori laporan teratas
export const getTopReports = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/report/top`);
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

// Mendapatkan laporan berdasarkan ID
export const getReportById = async (id, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/report/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
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

// Mendapatkan semua laporan dengan filter opsional
export const getAllReports = async (filters = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/reports`, { params: filters });
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