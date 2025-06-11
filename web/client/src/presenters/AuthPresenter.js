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

            this.view.setToken(true);
            this.view.setRole(role);
            this.view.showSuccess('Login berhasil!');

            if (role === 'admin') {
                this.view.navigate('/admin');
            } else {
                this.view.navigate('/dashboard');
            }
        } catch (error) {
            this.view.showError(error.message || 'Login gagal');
        } finally {
            this.view.setLoading(false);
        }
    }

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