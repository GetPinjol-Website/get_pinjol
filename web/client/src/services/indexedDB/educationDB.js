import { initDB } from './dbConfig';

// Simpan konten edukasi ke IndexedDB
export const saveEducation = async (education) => {
  try {
    const db = await initDB();
    const tx = db.transaction('educations', 'readwrite');
    const store = tx.objectStore('educations');
    await store.put({ ...education, updatedAt: new Date().toISOString() });
    await tx.done;
  } catch (error) {
    console.error('Gagal menyimpan edukasi ke IndexedDB:', error);
    throw new Error('Tidak dapat menyimpan edukasi secara lokal');
  }
};

// Mendapatkan konten edukasi berdasarkan ID dari IndexedDB
export const getEducation = async (id) => {
  try {
    const db = await initDB();
    const tx = db.transaction('educations', 'readonly');
    const store = tx.objectStore('educations');
    const education = await store.get(id);
    await tx.done;
    return education || null;
  } catch (error) {
    console.error('Gagal mengambil edukasi dari IndexedDB:', error);
    throw new Error('Tidak dapat mengambil edukasi dari database lokal');
  }
};

// Mendapatkan semua konten edukasi dari IndexedDB
export const getAllEducationsDB = async () => {
  try {
    const db = await initDB();
    const tx = db.transaction('educations', 'readonly');
    const store = tx.objectStore('educations');
    const educations = await store.getAll();
    await tx.done;
    return educations;
  } catch (error) {
    console.error('Gagal mengambil semua edukasi dari IndexedDB:', error);
    throw new Error('Tidak dapat mengambil edukasi dari database lokal');
  }
};

// Menghapus konten edukasi dari IndexedDB
export const deleteEducation = async (id) => {
  try {
    const db = await initDB();
    const tx = db.transaction('educations', 'readwrite');
    const store = tx.objectStore('educations');
    await store.delete(id);
    await tx.done;
  } catch (error) {
    console.error('Gagal menghapus edukasi dari IndexedDB:', error);
    throw new Error('Tidak dapat menghapus edukasi dari database lokal');
  }
};