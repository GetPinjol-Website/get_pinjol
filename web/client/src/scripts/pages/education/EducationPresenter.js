import { getArticles } from '../../utils/api';

export class EducationPresenter {
    async getArticles() {
        try {
            const response = await getArticles();
            return response.data;
        } catch (error) {
            return [];
        }
    }
}