import { register, login, getAllUsers, getUserById, checkRole } from '../services/api/authApi';

class UserModel {
  static async register(userData) {
    try {
      const response = await register(userData);
      console.log('Respons registrasi di UserModel:', response);
      if (response.status !== 'sukses') throw new Error(response.message);
      return response;
    } catch (error) {
      console.error('Error registrasi di UserModel:', error.message);
      throw new Error(error.message || 'Gagal mendaftarkan pengguna');
    }
  }

  static async login(credentials) {
    try {
      const response = await login(credentials);
      console.log('Respons login di UserModel:', response);
      if (response.status !== 'sukses') throw new Error(response.message);
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      return response;
    } catch (error) {
      console.error('Error login di UserModel:', error.message);
      throw new Error(error.message || 'Gagal login');
    }
  }

  static async getAllUsers(filters = {}) {
    try {
      const token = this.getToken();
      const response = await getAllUsers({ ...filters, token });
      if (response.status !== 'sukses') throw new Error(response.message);
      return response.data;
    } catch (error) {
      console.error('Error getAllUsers di UserModel:', error.message);
      throw new Error(error.message || 'Gagal mengambil daftar pengguna');
    }
  }

  static async getUserById(id) {
    try {
      const response = await getUserById(id);
      if (response.status !== 'sukses') throw new Error(response.message);
      return response.data;
    } catch (error) {
      console.error('Error getUserById di UserModel:', error.message);
      throw new Error(error.message || 'Gagal mengambil data pengguna');
    }
  }

  static async checkRole() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token tidak ditemukan di localStorage');
        throw new Error('Token tidak ditemukan');
      }
      const response = await checkRole(token);
      console.log('Respons checkRole:', response);
      if (response.status !== 'sukses') throw new Error(response.message);
      if (!response.role) throw new Error('Role tidak ditemukan dalam respons');
      return response.role;
    } catch (error) {
      console.error('Error checkRole di UserModel:', error.message);
      throw new Error(error.message || 'Gagal memeriksa role pengguna');
    }
  }

  static getToken() {
    const token = localStorage.getItem('token');
    console.log('Retrieved token:', token); // Debugging
    return token;
  }

  static getRole() {
    const role = localStorage.getItem('role');
    console.log('Retrieved role:', role); // Debugging
    return role;
  }

  static logout() {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    } catch (error) {
      console.error('Error logout di UserModel:', error.message);
      throw new Error('Gagal logout');
    }
  }

  static getUserId() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token tidak ditemukan di localStorage');
        return '';
      }
      // Dekode payload JWT (bagian tengah dari token: header.payload.signature)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      console.log('Decoded JWT payload:', payload); // Debugging
      return payload.id || '';
    } catch (error) {
      console.error('Error decoding token in getUserId:', error.message);
      return '';
    }
  }
}

export default UserModel;