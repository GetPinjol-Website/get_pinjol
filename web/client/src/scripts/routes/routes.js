import { Route } from 'react-router-dom';
import { LoginPage } from '../pages/login/LoginPage';
import { RegisterPage } from '../pages/register/RegisterPage';
import { LandingPage } from '../pages/landing/LandingPage';
import { EducationPage } from '../pages/education/EducationPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { AboutPage } from '../pages/about/AboutPage';

export const routes = [
    <Route key="home" path="/" element={<LandingPage />} />,
    <Route key="login" path="/login" element={<LoginPage />} />,
    <Route key="register" path="/register" element={<RegisterPage />} />,
    <Route key="education" path="/education" element={<EducationPage />} />,
    <Route key="dashboard" path="/dashboard" element={<DashboardPage />} />,
    <Route key="about" path="/about" element={<AboutPage />} />
];