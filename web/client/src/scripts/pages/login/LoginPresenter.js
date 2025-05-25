import { login } from '../../utils/api';

export class LoginPresenter {
    async login(username, password) {
        try {
            const response = await login({ username, password });
            return response;
        } catch (error) {
            throw new Error('Login failed');
        }
    }
}