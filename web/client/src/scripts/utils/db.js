import { openDB } from 'idb';

const dbPromise = openDB('getpinjolDB', 1, {
  upgrade(db) {
    db.createObjectStore('users', { keyPath: 'id' });
    db.createObjectStore('offlineReports', { keyPath: 'id' });
    db.createObjectStore('offlineEducations', { keyPath: 'id' });
  },
});

export async function saveData(storeName, data) {
  const db = await dbPromise;
  await db.put(storeName, data);
}

export async function getAllData(storeName) {
  const db = await dbPromise;
  return await db.getAll(storeName);
}

export async function deleteData(storeName, key) {
  const db = await dbPromise;
  await db.delete(storeName, key);
}