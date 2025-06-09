import { register, login, getAllUsers, getUserById, checkRole } from '../services/api/authApi';

// Model untuk mengelola data pengguna
class UserModel {
  // Menyimpan pengguna baru
  static async register(userData) {
    try {
      const response = await register(userData);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      return response;
    } catch (error) {
      throw new Error(error.message || 'Gagal mendaftarkan pengguna');
    }
  }

  // Login pengguna dan mendapatkan token
  static async login(credentials) {
    try {
      const response = await login(credentials);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      // Simpan token ke localStorage untuk akses offline
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Gagal login');
    }
  }

  // Mendapatkan semua pengguna dengan filter
  static async getAllUsers(filters = {}) {
    try {
      const response = await getAllUsers(filters);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Gagal mengambil daftar pengguna');
    }
  }

  // Mendapatkan pengguna berdasarkan ID
  static async getUserById(id) {
    try {
      const response = await getUserById(id);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Gagal mengambil data pengguna');
    }
  }

  // Memeriksa role pengguna
  static async checkRole() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }
      const response = await checkRole(token);
      if (response.status !== 'sukses') {
        throw new Error(response.message);
      }
      return response.role;
    } catch (error) {
      throw new Error(error.message || 'Gagal memeriksa role pengguna');
    }
  }

  // Mendapatkan token dari localStorage
  static getToken() {
    return localStorage.getItem('token');
  }

  // Mendapatkan role dari localStorage
  static getRole() {
    return localStorage.getItem('role');
  }

  // Logout pengguna
  static logout() {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    } catch (error) {
      throw new Error('Gagal logout');
    }
  }
}

export default UserModel;