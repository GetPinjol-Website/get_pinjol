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

// Register pengguna baru
export const register = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, userData);
    return {
      status: response.data.status,
      message: response.data.pesan,
      code: response.status,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

// Login pengguna
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, credentials);
    return {
      status: response.data.status,
      message: response.data.pesan,
      token: response.data.token,
      role: response.data.role,
      code: response.status,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

// Mendapatkan semua pengguna dengan filter opsional
export const getAllUsers = async (filters = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/users`, { params: filters });
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

// Mendapatkan pengguna berdasarkan ID
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/${id}`);
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

// Memeriksa role pengguna berdasarkan token
export const checkRole = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/check-role`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      status: response.data.status,
      message: response.data.pesan,
      role: response.data.role,
      code: response.status,
      headers: {
        cacheControl: response.headers['cache-control'],
        etag: response.headers['etag'],
      },
    };
  } catch (error) {
    throw handleApiError(error);
  }
};