import { useNavigate } from 'react-router-dom';

class RegisterPagePresenter {
  constructor(model) {
    this.model = model;
    this.navigate = useNavigate();
  }

  registerUser(data) {
    if (this.model.validateForm(data)) {
      // Simulasi panggil API (ganti dengan logika nyata)
      console.log('Registering user:', data);
      this.navigate('/login');
    } else {
      alert('Semua field harus diisi!');
    }
  }
}

export default RegisterPagePresenter;