import axios from 'axios';
import { BASE_URL } from '../../utils/constants';

const handleApiError = (error) => {
  const isOffline = !navigator.onLine || error.message.includes('Network Error');
  if (error.response) {
    const { status, data } = error.response;
    return {
      status: data.status || 'error',
      message: data.message || 'Terjadi kesalahan pada server',
      code: status,
      isOffline,
    };
  }
  return {
    status: 'error',
    message: isOffline ? 'Anda sedang offline, jadi tidak bisa melihat data' : error.message || 'Kesalahan tidak diketahui',
    code: 0,
    isOffline,
  };
};

export const createWebReport = async (reportData, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/report/web`, reportData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      status: response.data.status,
      message: response.data.message,
      data: response.data.data,
      code: response.status,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createAppReport = async (reportData, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/report/app`, reportData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      status: response.data.status,
      message: response.data.message,
      data: response.data.data,
      code: response.status,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateWebReport = async (id, reportData, token) => {
  try {
    const response = await axios.put(`${BASE_URL}/report/web/${id}`, reportData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      status: response.data.status,
      message: response.data.message,
      data: response.data.data,
      code: response.status,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateAppReport = async (id, reportData, token) => {
  try {
    const response = await axios.put(`${BASE_URL}/report/app/${id}`, reportData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      status: response.data.status,
      message: response.data.message,
      data: response.data.data,
      code: response.status,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteWebReport = async (id, token) => {
  try {
    const response = await axios.delete(`${BASE_URL}/report/web/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      status: response.data.status,
      message: response.data.message,
      code: response.status,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteAppReport = async (id, token) => {
  try {
    const response = await axios.delete(`${BASE_URL}/report/app/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      status: response.data.status,
      message: response.data.message,
      code: response.status,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getReportById = async (id, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/report/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      status: response.data.status,
      data: response.data.data,
      code: response.status,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAllReports = async (filters = {}, token = null) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${BASE_URL}/reports`, { params: filters, headers });
    return {
      status: response.data.status,
      data: response.data.data,
      recommendation: response.data.recommendation,
      recommendationStatus: response.data.recommendationStatus,
      code: response.status,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAllReportsAdmin = async (filters = {}, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/reports/admin`, {
      params: filters,
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      status: response.data.status,
      data: response.data.data,
      code: response.status,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getUserReports = async (filters = {}, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/reports/user`, {
      params: filters,
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      status: response.data.status,
      data: response.data.data,
      code: response.status,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};