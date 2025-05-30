class LoginPageModel {
  validateForm(data) {
    return data.username && data.password;
  }
}

export default LoginPageModel;