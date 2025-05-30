class ManagementEdukasiPresenter {
  constructor(model) {
    this.model = model;
  }

  getArticles() {
    return this.model.getArticles();
  }
}

export default ManagementEdukasiPresenter;