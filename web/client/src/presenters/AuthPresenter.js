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
      this.view.setToken(response.token);
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
      this.view.setLoading(true);
      const role = await UserModel.checkRole();
      this.view.setRole(role);
      return role;
    } catch (error) {
      this.view.showError(error.message || 'Gagal memeriksa role');
      return null;
    } finally {
      this.view.setLoading(false);
    }
  }

  // Menangani logout
  handleLogout() {
    try {
      UserModel.logout();
      this.view.setToken(null);
      this.view.setRole(null);
      this.view.navigate('/login');
    } catch (error) {
      this.view.showError(error.message || 'Gagal logout');
    }
  }
}

export default AuthPresenter;