import { useNavigate } from 'react-router-dom';

class LoginPagePresenter {
  constructor(model) {
    this.model = model;
    this.navigate = useNavigate();
  }

  loginUser(data) {
    if (this.model.validateForm(data)) {
      // Simulasi panggil API (ganti dengan logika nyata)
      console.log('Logging in user:', data);
      this.navigate('/dashboard');
    } else {
      alert('Username dan password harus diisi!');
    }
  }
}

export default LoginPagePresenter;