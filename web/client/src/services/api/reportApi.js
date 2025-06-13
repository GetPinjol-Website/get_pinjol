import axios from 'axios';
import { BASE_URL } from '../../utils/constants';

const handleApiError = (error) => {
  const isOffline = !navigator.onLine || error.message.includes('Network Error');
  if (error.response) {
    const { status, data } = error.response;
    console.error('Server error response:', data); // Logging untuk debugging
    let missingFieldsMessage = '';
    if (data.missingFields) {
      if (Array.isArray(data.missingFields)) {
        missingFieldsMessage = `Field yang hilang: ${data.missingFields.join(', ')}`;
      } else {
        missingFieldsMessage = `Field yang hilang: ${data.missingFields}`;
      }
    }
    return {
      status: data.status || 'gagal',
      message: data.pesan || data.message || missingFieldsMessage || 'Terjadi kesalahan pada server',
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
    console.log('Sending web report data:', reportData);
    const response = await axios.post(`${BASE_URL}/report/web`, reportData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Web report response:', response.data);
    return {
      status: response.data.status,
      message: response.data.message,
      data: response.data.data,
      code: response.status,
    };
  } catch (error) {
    const handledError = handleApiError(error);
    console.error('Error in createWebReport:', handledError);
    throw handledError;
  }
};

export const createAppReport = async (reportData, token) => {
  try {
    console.log('Sending app report data:', reportData);
    const response = await axios.post(`${BASE_URL}/report/app`, reportData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('App report response:', response.data);
    return {
      status: response.data.status,
      message: response.data.message,
      data: response.data.data,
      code: response.status,
    };
  } catch (error) {
    const handledError = handleApiError(error);
    console.error('Error in createAppReport:', handledError);
    throw handledError;
  }
};

export const updateWebReport = async (id, reportData, token) => {
  try {
    console.log('Updating web report ID:', id, 'with data:', reportData);
    const response = await axios.put(`${BASE_URL}/report/web/${id}`, reportData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Update web report response:', response.data);
    return {
      status: response.data.status,
      message: response.data.message,
      data: response.data.data,
      code: response.status,
    };
  } catch (error) {
    const handledError = handleApiError(error);
    console.error('Error in updateWebReport:', handledError);
    throw handledError;
  }
};

export const updateAppReport = async (id, reportData, token) => {
  try {
    console.log('Updating app report ID:', id, 'with data:', reportData);
    const response = await axios.put(`${BASE_URL}/report/app/${id}`, reportData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Update app report response:', response.data);
    return {
      status: response.data.status,
      message: response.data.message,
      data: response.data.data,
      code: response.status,
    };
  } catch (error) {
    const handledError = handleApiError(error);
    console.error('Error in updateAppReport:', handledError);
    throw handledError;
  }
};

export const deleteWebReport = async (id, token) => {
  try {
    console.log('Deleting web report ID:', id);
    const response = await axios.delete(`${BASE_URL}/report/web/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Delete web report response:', response.data);
    return {
      status: response.data.status,
      message: response.data.message,
      code: response.status,
    };
  } catch (error) {
    const handledError = handleApiError(error);
    console.error('Error in deleteWebReport:', handledError);
    throw handledError;
  }
};

export const deleteAppReport = async (id, token) => {
  try {
    console.log('Deleting app report ID:', id);
    const response = await axios.delete(`${BASE_URL}/report/app/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Delete app report response:', response.data);
    return {
      status: response.data.status,
      message: response.data.message,
      code: response.status,
    };
  } catch (error) {
    const handledError = handleApiError(error);
    console.error('Error in deleteAppReport:', handledError);
    throw handledError;
  }
};

export const getReportById = async (id, token) => {
  try {
    console.log('Fetching report ID:', id);
    const response = await axios.get(`${BASE_URL}/report/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Get report response:', response.data);
    return {
      status: response.data.status,
      data: response.data.data,
      code: response.status,
    };
  } catch (error) {
    const handledError = handleApiError(error);
    console.error('Error in getReportById:', handledError);
    throw handledError;
  }
};

export const getAllReports = async (filters = {}, token = null) => {
  try {
    console.log('Fetching all reports with filters:', filters);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${BASE_URL}/reports`, { params: filters, headers });
    console.log('Get all reports response:', response.data);
    return {
      status: response.data.status,
      data: response.data.data,
      recommendation: response.data.recommendation,
      recommendationStatus: response.data.recommendationStatus,
      code: response.status,
    };
  } catch (error) {
    const handledError = handleApiError(error);
    console.error('Error in getAllReports:', handledError);
    throw handledError;
  }
};

export const getAllReportsAdmin = async (filters = {}, token) => {
  try {
    console.log('Fetching all admin reports with filters:', filters);
    const response = await axios.get(`${BASE_URL}/reports/admin`, {
      params: filters,
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Get all admin reports response:', response.data);
    return {
      status: response.data.status,
      data: response.data.data,
      code: response.status,
    };
  } catch (error) {
    const handledError = handleApiError(error);
    console.error('Error in getAllReportsAdmin:', handledError);
    throw handledError;
  }
};

export const getUserReports = async (filters = {}, token) => {
  try {
    console.log('Fetching user reports with filters:', filters);
    const response = await axios.get(`${BASE_URL}/reports/user`, {
      params: filters,
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Get user reports response:', response.data);
    return {
      status: response.data.status,
      data: response.data.data,
      code: response.status,
    };
  } catch (error) {
    const handledError = handleApiError(error);
    console.error('Error in getUserReports:', handledError);
    throw handledError;
  }
};