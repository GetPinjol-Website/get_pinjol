// Helper untuk memvalidasi format email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper untuk memvalidasi format username
export const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
  return usernameRegex.test(username);
};

// Helper untuk memvalidasi format tanggal
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// Helper untuk memformat tanggal ke string ISO
export const formatDate = (date) => {
  try {
    return new Date(date).toISOString();
  } catch (error) {
    return '';
  }
};

// Helper untuk menangani pesan error dari API
export const getErrorMessage = (error) => {
  return error.message || 'Terjadi kesalahan, silakan coba lagi';
};

// Helper untuk memeriksa status koneksi jaringan
export const isOnline = () => {
  return navigator.onLine;
};

// Helper untuk memvalidasi format URL
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return url.match(/^(https?:\/\/[^\s$.?#].[^\s]*)$/i);
  } catch {
    return false;
  }
};