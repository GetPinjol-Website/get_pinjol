import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:9000',
});

export async function register(userData) {
    try {
        const response = await api.post('/register', userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export async function login(credentials) {
    try {
        const response = await api.post('/login', credentials);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export async function getEducations() {
    try {
        const token = localStorage.getItem('token');
        const response = await api.get('/education', { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export async function getEducationById(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/education/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export async function getReports() {
    try {
        const token = localStorage.getItem('token');
        const response = await api.get('/reports', { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export async function createReportWeb(reportData) {
    try {
        const token = localStorage.getItem('token');
        const response = await api.post('/report/web', reportData, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export async function createReportApp(reportData) {
    try {
        const token = localStorage.getItem('token');
        const response = await api.post('/report/app', reportData, { headers: { Authorization: `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}