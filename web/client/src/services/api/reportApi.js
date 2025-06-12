import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import { saveReport, deleteReport } from '../indexedDB/reportDB';

const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    return {
      status: data.status || 'error',
      message: data.message || 'Terjadi kesalahan pada server',
      code: status,
    };
  }
  return {
    status: 'error',
    message: error.message || 'Koneksi jaringan gagal',
    code: 0,
  };
};

export const createWebReport = async (reportData, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/report/web`, reportData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await saveReport(response.data.data, 'web');
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
    await saveReport(response.data.data, 'app');
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
    await saveReport(response.data.data, 'web');
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
    const response = await axios.put(`${BASE_URL}/report/${id}`, reportData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await saveReport(response.data.data, 'app');
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
    await deleteReport(id, 'web');
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
    await deleteReport(id, 'app');
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
      headers: {
        cacheControl: response.headers['cache-control'],
        etag: response.headers['etag'],
        lastModified: response.headers['last-modified'],
      },
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
      code: response.status,
      headers: {
        cacheControl: response.headers['cache-control'],
        etag: response.headers['etag'],
        lastModified: response.headers['last-modified'],
      },
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
      headers: {
        cacheControl: response.headers['cache-control'],
        etag: response.headers['etag'],
        lastModified: response.headers['last-modified'],
      },
    };
  } catch (error) {
    throw handleApiError(error);
  }
};