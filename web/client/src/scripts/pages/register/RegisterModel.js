class RegisterPageModel {
  validateForm(data) {
    return data.username && data.email && data.password;
  }
}

export default RegisterPageModel;