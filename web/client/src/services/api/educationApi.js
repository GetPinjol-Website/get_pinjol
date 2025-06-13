import axios from 'axios';
import { BASE_URL } from '../../utils/constants';

const handleApiError = (err) => {
  const offline = !navigator.onLine || err.message.includes('Network Error');
  if (err.response) {
    return {
      status: err.response.data.status || 'error',
      message: err.response.data.pesan || 'Server error',
      code: err.response.status,
      isOffline: offline,
    };
  }
  return {
    status: 'error',
    message: offline ? 'Anda sedang offline, jadi tidak bisa melihat data' : err.message,
    code: 0,
    isOffline: offline,
  };
};

const withAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const createEducation = async (data, token) => {
  try {
    const res = await axios.post(`${BASE_URL}/education`, data, withAuth(token));
    return { status: res.data.status, message: res.data.pesan, data: res.data.data };
  } catch (e) {
    throw handleApiError(e);
  }
};

export const getAllEducation = async (filters = {}, token) => {
  try {
    const res = await axios.get(`${BASE_URL}/education`, {
      params: filters,
      ...withAuth(token),
    });
    return { status: res.data.status, data: res.data.data };
  } catch (e) {
    throw handleApiError(e);
  }
};

export const getEducationById = async (id, token) => {
  try {
    const res = await axios.get(`${BASE_URL}/education/${id}`, withAuth(token));
    return { status: res.data.status, data: res.data.data };
  } catch (e) {
    throw handleApiError(e);
  }
};

export const updateEducation = async (id, data, token) => {
  try {
    const res = await axios.put(`${BASE_URL}/education/${id}`, data, withAuth(token));
    return { status: res.data.status, message: res.data.pesan };
  } catch (e) {
    throw handleApiError(e);
  }
};

export const deleteEducation = async (id, token) => {
  try {
    const res = await axios.delete(`${BASE_URL}/education/${id}`, withAuth(token));
    return { status: res.data.status, message: res.data.pesan };
  } catch (e) {
    throw handleApiError(e);
  }
};