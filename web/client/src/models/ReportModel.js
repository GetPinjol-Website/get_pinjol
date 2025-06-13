import { REPORT_TYPES } from '../utils/constants';

// Definisikan BASE_URL untuk server backend
const BASE_URL = 'http://localhost:9000';

class ReportModel {
  static async createWebReport(data, token, role) {
    try {
      console.log('Sending token for createWebReport:', token); // Debugging
      const response = await fetch(`${BASE_URL}/report/web`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.pesan || 'Gagal membuat laporan web');
        error.response = { data: errorData };
        error.status = response.status;
        throw error;
      }
      return response.json();
    } catch (error) {
      error.isOffline = !navigator.onLine;
      throw error;
    }
  }

  static async createAppReport(data, token, role) {
    try {
      console.log('Sending token for createAppReport:', token); // Debugging
      const response = await fetch(`${BASE_URL}/report/app`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.pesan || 'Gagal membuat laporan aplikasi');
        error.response = { data: errorData };
        error.status = response.status;
        throw error;
      }
      return response.json();
    } catch (error) {
      error.isOffline = !navigator.onLine;
      throw error;
    }
  }

  static async updateWebReport(id, data, token, role) {
    try {
      console.log('Sending token for updateWebReport:', token); // Debugging
      const response = await fetch(`${BASE_URL}/report/web/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.pesan || 'Gagal memperbarui laporan web');
        error.response = { data: errorData };
        error.status = response.status;
        throw error;
      }
      return response.json();
    } catch (error) {
      error.isOffline = !navigator.onLine;
      throw error;
    }
  }

  static async updateAppReport(id, data, token, role) {
    try {
      console.log('Sending token for updateAppReport:', token); // Debugging
      const response = await fetch(`${BASE_URL}/report/app/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.pesan || 'Gagal memperbarui laporan aplikasi');
        error.response = { data: errorData };
        error.status = response.status;
        throw error;
      }
      return response.json();
    } catch (error) {
      error.isOffline = !navigator.onLine;
      throw error;
    }
  }

  static async deleteWebReport(id, token) {
    try {
      console.log('Sending token for deleteWebReport:', token); // Debugging
      const response = await fetch(`${BASE_URL}/report/web/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.pesan || 'Gagal menghapus laporan web');
        error.response = { data: errorData };
        error.status = response.status;
        throw error;
      }
      return response.json();
    } catch (error) {
      error.isOffline = !navigator.onLine;
      throw error;
    }
  }

  static async deleteAppReport(id, token) {
    try {
      console.log('Sending token for deleteAppReport:', token); // Debugging
      const response = await fetch(`${BASE_URL}/report/app/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.pesan || 'Gagal menghapus laporan aplikasi');
        error.response = { data: errorData };
        error.status = response.status;
        throw error;
      }
      return response.json();
    } catch (error) {
      error.isOffline = !navigator.onLine;
      throw error;
    }
  }

  static async getReportById(id, token, type, params = {}) {
    try {
      console.log('Sending token for getReportById:', token); // Debugging
      const query = new URLSearchParams(params).toString();
      const endpoint = type === REPORT_TYPES.APP ? `/report/app/${id}` : `/report/web/${id}`;
      const response = await fetch(`${BASE_URL}${endpoint}${query ? `?${query}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.pesan || 'Gagal mengambil laporan');
        error.response = { data: errorData };
        error.status = response.status;
        throw error;
      }
      return response.json();
    } catch (error) {
      error.isOffline = !navigator.onLine;
      throw error;
    }
  }

  static async getAllReports(filters, token, role) {
    try {
      console.log('Sending token for getAllReports:', token); // Debugging
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(`${BASE_URL}/reports${query ? `?${query}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.pesan || 'Gagal mengambil daftar laporan');
        error.response = { data: errorData };
        error.status = response.status;
        throw error;
      }
      return response.json();
    } catch (error) {
      error.isOffline = !navigator.onLine;
      throw error;
    }
  }

  static async getUserReports(filters, token, role) {
    try {
      console.log('Sending token for getUserReports:', token); // Debugging
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(`${BASE_URL}/reports/user${query ? `?${query}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Cek apakah respon adalah JSON
      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Server returned non-JSON response:', text);
        throw new Error('Respon server tidak valid: bukan JSON');
      }

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.pesan || 'Gagal mengambil daftar laporan pengguna');
        error.response = { data: errorData };
        error.status = response.status;
        throw error;
      }
      return response.json();
    } catch (error) {
      error.isOffline = !navigator.onLine;
      console.error('Error in getUserReports:', error.message);
      throw error;
    }
  }

  static async getAllApplications(filters, token, role) {
    try {
      console.log('Sending token for getAllApplications:', token); // Debugging
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(`${BASE_URL}/applications${query ? `?${query}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.pesan || 'Gagal mengambil daftar aplikasi');
        error.response = { data: errorData };
        error.status = response.status;
        throw error;
      }
      return response.json();
    } catch (error) {
      error.isOffline = !navigator.onLine;
      throw error;
    }
  }
}

export default ReportModel;