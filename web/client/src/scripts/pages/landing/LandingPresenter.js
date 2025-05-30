import { useNavigate } from 'react-router-dom';

class LandingPagePresenter {
  constructor(model) {
    this.model = model;
    this.navigate = useNavigate();
  }

  navigateToRegister() {
    this.navigate('/register');
  }

  getWelcomeMessage() {
    return this.model.getWelcomeMessage();
  }
}

export default LandingPagePresenter;