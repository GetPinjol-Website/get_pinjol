class DashboardPagePresenter {
  constructor(model) {
    this.model = model;
  }

  getStats() {
    return this.model.getStats();
  }
}

export default DashboardPagePresenter;