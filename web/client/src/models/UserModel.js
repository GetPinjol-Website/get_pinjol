import { register, login, getAllUsers, getUserById, checkRole } from '../services/api/authApi';

class UserModel {
  static async register(userData) {
    try {
      const response = await register(userData);
      if (response.status !== 'sukses') throw new Error(response.message);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Gagal mendaftarkan pengguna');
    }
  }

  static async login(credentials) {
    try {
      const response = await login(credentials);
      if (response.status !== 'sukses') throw new Error(response.message);
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Gagal login');
    }
  }

  static async getAllUsers(filters = {}) {
    try {
      const response = await getAllUsers(filters);
      if (response.status !== 'sukses') throw new Error(response.message);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Gagal mengambil daftar pengguna');
    }
  }

  static async getUserById(id) {
    try {
      const response = await getUserById(id);
      if (response.status !== 'sukses') throw new Error(response.message);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Gagal mengambil data pengguna');
    }
  }

  static async checkRole() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan');
      const response = await checkRole(token); // Pastikan fungsi checkRole mengirim token sebagai header
      if (response.status !== 'sukses') throw new Error(response.message);
      return response.role;
    } catch (error) {
      throw new Error(error.message || 'Gagal memeriksa role pengguna');
    }
  }

  static getToken() {
    return localStorage.getItem('token');
  }

  static getRole() {
    return localStorage.getItem('role');
  }

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