import UserModel from '../models/UserModel';

// Presenter untuk mengelola logika autentikasi
class AuthPresenter {
  constructor(view) {
    this.view = view; // View adalah komponen React
  }

  // Menangani proses register
  async handleRegister(userData) {
    try {
      this.view.setLoading(true);
      const response = await UserModel.register(userData);
      this.view.showSuccess(response.message);
      this.view.navigate('/login');
    } catch (error) {
      this.view.showError(error.message || 'Gagal mendaftarkan pengguna');
    } finally {
      this.view.setLoading(false);
    }
  }

  // Menangani proses login
  async handleLogin(credentials) {
    try {
      this.view.setLoading(true);
      const response = await UserModel.login(credentials);
      this.view.setToken(true); // berhasil login
      this.view.setRole(response.role);
      this.view.showSuccess(response.message);
      this.view.navigate(response.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      this.view.showError(error.message || 'Gagal login');
    } finally {
      this.view.setLoading(false);
    }
  }

  // Memeriksa role pengguna
  async checkRole() {
    try {
      const role = await UserModel.checkRole();
      this.view.setRole(role);
      return role;
    } catch (error) {
      this.view.showError(error.message || 'Gagal memeriksa role');
      return null;
    }
  }

  // Menangani logout
  handleLogout() {
    try {
      UserModel.logout();
      this.view.setToken(false);
      this.view.setRole(null);
      this.view.navigate('/login');
    } catch (error) {
      this.view.showError(error.message || 'Gagal logout');
    }
  }

  // Memeriksa status autentikasi
  async checkAuthStatus(signal) {
    try {
      this.view.setLoading(true);
      const token = await UserModel.getToken();
      if (token) {
        const role = await this.checkRole();
        this.view.setToken(true);
        this.view.setRole(role);
      } else {
        this.view.setToken(false);
        this.view.setRole(null);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        this.view.showError(error.message || 'Gagal memeriksa status autentikasi');
        this.view.setToken(false);
        this.view.setRole(null);
      }
    } finally {
      this.view.setLoading(false);
    }
  }
}

export default AuthPresenter;