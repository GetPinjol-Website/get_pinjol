import UserModel from '../models/UserModel';

class AuthPresenter {
  constructor(view) {
    this.view = view;
  }

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

  async handleLogin(credentials) {
    try {
      this.view.setLoading(true);
      const response = await UserModel.login(credentials);
      const { token, role } = response;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      console.log('Login saved:', { token, role }); // Debugging

      this.view.setToken(true);
      this.view.setRole(role);
      this.view.showSuccess('Login berhasil');

      if (role === 'admin') {
        this.view.navigate('/admin', { replace: true });
      } else {
        this.view.navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error.message);
      this.view.showError(error.message || 'Login gagal');
    } finally {
      this.view.setLoading(false);
    }
  }

  handleLogout() {
    try {
      UserModel.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      this.view.setToken(false);
      this.view.setRole(null);
      this.view.navigate('/login', { replace: true });
    } catch (error) {
      this.view.showError(error.message || 'Gagal logout');
    }
  }

  async checkAuthStatus(signal) {
    try {
      this.view.setLoading(true);
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      if (!token || !role) {
        throw new Error('Tidak ada token atau role di localStorage');
      }

      // Verifikasi token ke server
      const serverRole = await UserModel.checkRole();
      if (serverRole !== role) {
        throw new Error('Role di localStorage tidak sesuai dengan server');
      }

      this.view.setToken(true);
      this.view.setRole(role);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Auth status error:', error.message);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        this.view.setToken(false);
        this.view.setRole(null);
      }
      throw error; // Lempar error untuk ditangani oleh caller
    } finally {
      this.view.setLoading(false);
    }
  }
}

export default AuthPresenter;