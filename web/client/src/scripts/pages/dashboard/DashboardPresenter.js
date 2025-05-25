import { getDashboardStats } from '../../utils/api';

export class DashboardPresenter {
    async getDashboardStats() {
        try {
            const response = await getDashboardStats();
            return response.data;
        } catch (error) {
            return { totalReports: 150, pendingReports: 30 }; // Data statis
        }
    }
}