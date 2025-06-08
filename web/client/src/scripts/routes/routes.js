import { Route } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { LandingPage } from '../pages/landing/LandingPage';
import { EducationPage } from '../pages/education/EducationPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { AboutPage } from '../pages/about/AboutPage';

const routes = [
  <Route exact path="/" component={LandingPage} key="landing" />,
  <Route path="/register" component={RegisterPage} key="register" />,
  <Route path="/login" component={LoginPage} key="login" />,
  <Route path="/dashboard" component={DashboardPage} key="dashboard" />,
  <Route path="/admin-dashboard" component={DashboardPage} key="admin-dashboard" />, // Asumsikan DashboardPage bisa menangani keduanya
  <Route path="/education" component={EducationPage} key="education" />,
  <Route path="/education/:id" component={EducationPage} key="education-detail" />,
  <Route path="/report" component={EducationPage} key="report" />, // Asumsikan sementara, perlu ReportPage
  <Route path="/report/web" component={EducationPage} key="report-web" />, // Asumsikan sementara
  <Route path="/report/app" component={EducationPage} key="report-app" />, // Asumsikan sementara
  <Route path="/about" component={AboutPage} key="about" />,
  <Route component={LandingPage} key="not-found" />, // Fallback
];

export default routes;