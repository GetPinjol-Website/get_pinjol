import * as ReportApi from '../services/api/reportApi';
import { REPORT_TYPES } from '../utils/constants';

class ReportModel {
  static async createWebReport(data, token) {
    try {
      console.log('Creating web report with data:', data);
      const response = await ReportApi.createWebReport(data, token);
      return response;
    } catch (error) {
      console.error('Error in createWebReport:', error);
      throw error;
    }
  }

  static async createAppReport(data, token) {
    try {
      console.log('Creating app report with data:', data);
      const response = await ReportApi.createAppReport(data, token);
      return response;
    } catch (error) {
      console.error('Error in createAppReport:', error);
      throw error;
    }
  }

  static async updateWebReport(id, data, token) {
    try {
      console.log('Updating web report ID:', id, 'with data:', data);
      const response = await ReportApi.updateWebReport(id, data, token);
      return response;
    } catch (error) {
      console.error('Error in updateWebReport:', error);
      throw error;
    }
  }

  static async updateAppReport(id, data, token) {
    try {
      console.log('Updating app report ID:', id, 'with data:', data);
      const response = await ReportApi.updateAppReport(id, data, token);
      return response;
    } catch (error) {
      console.error('Error in updateAppReport:', error);
      throw error;
    }
  }

  static async deleteWebReport(id, token) {
    try {
      console.log('Deleting web report ID:', id);
      const response = await ReportApi.deleteWebReport(id, token);
      return response;
    } catch (error) {
      console.error('Error in deleteWebReport:', error);
      throw error;
    }
  }

  static async deleteAppReport(id, token) {
    try {
      console.log('Deleting app report ID:', id);
      const response = await ReportApi.deleteAppReport(id, token);
      return response;
    } catch (error) {
      console.error('Error in deleteAppReport:', error);
      throw error;
    }
  }

  static async getReportById(id, token, type, params = {}) {
    try {
      console.log('Fetching report ID:', id, 'Type:', type, 'Params:', params);
      const response = await ReportApi.getReportById(id, token);
      return response;
    } catch (error) {
      console.error('Error in getReportById:', error);
      throw error;
    }
  }

  static async getAllReports(filters, token) {
    try {
      console.log('Fetching all reports with filters:', filters);
      const response = await ReportApi.getAllReports(filters, token);
      return response;
    } catch (error) {
      console.error('Error in getAllReports:', error);
      throw error;
    }
  }

  static async getUserReports(filters, token) {
    try {
      console.log('Fetching user reports with filters:', filters);
      const response = await ReportApi.getUserReports(filters, token);
      return response;
    } catch (error) {
      console.error('Error in getUserReports:', error);
      throw error;
    }
  }

  static async getAllApplications(filters, token) {
    try {
      console.log('Fetching all applications with filters:', filters);
      const response = await ReportApi.getAllReports(filters, token);
      return response;
    } catch (error) {
      console.error('Error in getAllApplications:', error);
      throw error;
    }
  }
}

export default ReportModel;