import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export async function login(data) {
    const response = await axios.post(${ API_BASE_URL } / auth / login, data);
    return response.data;
}

export async function register(data) {
    const response = await axios.post(${ API_BASE_URL } / auth / register, data);
    return response.data;
}

export async function getArticles() {
    const response = await axios.get(${ API_BASE_URL } / education);
    return response.data;
}

export async function getDashboardStats() {
    const response = await axios.get(${ API_BASE_URL } / dashboard / stats);
    return response.data;
}