import {
  createEducation as apiCreate,
  getAllEducation as apiGetAll,
  getEducationById as apiGetById,
  updateEducation as apiUpdate,
  deleteEducation as apiDelete,
} from '../services/api/educationApi';

class EducationModel {
  static async createEducation(educationData, token) {
    try {
      const response = await apiCreate(educationData, token);
      if (response.status !== 'sukses') throw new Error(response.message);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getAllEducation(filters = {}, token) {
    try {
      const response = await apiGetAll(filters, token);
      if (response.status !== 'sukses') throw new Error(response.message);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getEducationById(id, token) {
    try {
      const response = await apiGetById(id, token);
      if (response.status !== 'sukses') throw new Error(response.message);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async updateEducation(id, educationData, token) {
    try {
      const response = await apiUpdate(id, educationData, token);
      if (response.status !== 'sukses') throw new Error(response.message);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async deleteEducation(id, token) {
    try {
      const response = await apiDelete(id, token);
      if (response.status !== 'sukses') throw new Error(response.message);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default EducationModel;