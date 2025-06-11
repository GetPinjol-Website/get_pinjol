import { createEducation, getAllEducation, getEducationById, updateEducation, deleteEducation } from '../services/api/educationApi';
import { saveEducation, getEducation, getAllEducationsDB, deleteEducation as deleteEducationDB } from '../services/indexedDB/educationDB';

class EducationModel {
    static async createEducation(educationData) {
        try {
            const response = await createEducation(educationData);
            if (response.status !== 'sukses') {
                throw new Error(response.message);
            }
            await saveEducation(response.data);
            return response.data;
        } catch (error) {
            if (error.message.includes('Koneksi jaringan gagal')) {
                const offlineEducation = { ...educationData, id: `offline-${Date.now()}`, updatedAt: new Date().toISOString() };
                await saveEducation(offlineEducation);
                return offlineEducation;
            }
            throw new Error(error.message || 'Gagal membuat konten edukasi');
        }
    }

    static async getAllEducation(filters = {}) {
        try {
            const response = await getAllEducation(filters);
            if (response.status !== 'sukses') {
                throw new Error(response.message);
            }
            return response.data;
        } catch (error) {
            if (error.message.includes('Koneksi jaringan gagal')) {
                const educations = await getAllEducationsDB();
                return educations.filter((edu) =>
                    (!filters.title || edu.title.toLowerCase().includes(filters.title.toLowerCase())) &&
                    (!filters.category || edu.category === filters.category)
                );
            }
            throw new Error(error.message || 'Gagal mengambil daftar edukasi');
        }
    }

    static async getEducationById(id) {
        try {
            const response = await getEducationById(id);
            if (response.status !== 'sukses') {
                throw new Error(response.message);
            }
            return response.data;
        } catch (error) {
            if (error.message.includes('Koneksi jaringan gagal')) {
                const education = await getEducation(id);
                if (education) return education;
            }
            throw new Error(error.message || 'Gagal mengambil konten edukasi');
        }
    }

    static async updateEducation(id, educationData) {
        try {
            const response = await updateEducation(id, educationData);
            if (response.status !== 'sukses') {
                throw new Error(response.message);
            }
            await saveEducation({ ...educationData, id });
            return response;
        } catch (error) {
            throw new Error(error.message || 'Gagal memperbarui konten edukasi');
        }
    }

    static async deleteEducation(id) {
        try {
            const response = await deleteEducation(id);
            if (response.status !== 'sukses') {
                throw new Error(response.message);
            }
            await deleteEducationDB(id);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Gagal menghapus konten edukasi');
        }
    }
}

export default EducationModel;