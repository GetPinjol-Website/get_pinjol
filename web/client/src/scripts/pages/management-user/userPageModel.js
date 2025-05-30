class ManagementUserModel {
  getUsers() {
    return [
      { username: 'admin', role: 'admin' },
      { username: 'user1', role: 'user' },
    ];
  }
}

export default ManagementUserModel;