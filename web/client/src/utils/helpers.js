// Helper untuk memvalidasi format email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper untuk memvalidasi format tanggal (YYYY-MM-DD atau ISO 8601)
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