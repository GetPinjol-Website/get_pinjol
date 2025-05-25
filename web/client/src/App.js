import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { LoginPage } from './pages/login/LoginPage';
import { RegisterPage } from './pages/register/RegisterPage';
import { LandingPage } from './pages/landing/LandingPage';
import { EducationPage } from './pages/education/EducationPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { AboutPage } from './pages/about/AboutPage';
import '../styles/global.css';

function App() {
    return (
        <TransitionGroup>
            <CSSTransition timeout={300} classNames="fade">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/education" element={<EducationPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/about" element={<AboutPage />} />
                </Routes>
            </CSSTransition>
        </TransitionGroup>
    );
}

export default App;