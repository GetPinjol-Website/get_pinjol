exports.getDashboardStats = async (request, h) => {
    try {
        // Data statis untuk saat ini
        const stats = { totalReports: 150, pendingReports: 30 };
        return { data: stats };
    } catch (error) {
        return h.response({ error: 'Failed to fetch stats' }).code(500);
    }
};