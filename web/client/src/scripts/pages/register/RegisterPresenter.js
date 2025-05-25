import { register } from '../../utils/api';

export class RegisterPresenter {
    async register(username, email, password) {
        try {
            const response = await register({ username, email, password });
            return response;
        } catch (error) {
            throw new Error('Registration failed');
        }
    }
}