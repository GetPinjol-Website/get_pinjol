export class DashboardModel {
    constructor(data) {
        this.totalReports = data.totalReports;
        this.pendingReports = data.pendingReports;
    }
}