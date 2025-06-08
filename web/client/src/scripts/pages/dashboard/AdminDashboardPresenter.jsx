import AdminDashboardPage from './AdminDashboardPage.jsx';
import { getEducations, createEducation, updateEducation, deleteEducation } from '../../utils/api.js';
import { saveData, getAllData } from '../../utils/db.js';

export default function () {
  const nav = createNavbar();
  document.getElementById('navbar').appendChild(nav);
  const page = AdminDashboardPage();
  const loadData = async () => {
    try {
      const response = await getEducations();
      const eduList = page.querySelector('#eduList');
      eduList.innerHTML = response.data.map(e => `<li>${e.title} <button data-id="${e.id}" class="delete-btn bg-red-500 text-white p-1">Delete</button></li>`).join('');
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          await deleteEducation(btn.dataset.id);
          loadData();
        });
      });
    } catch (error) {
      page.querySelector('#message').textContent = 'Error loading educations';
    }
  };
  const form = page.querySelector('#eduForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const educationData = {
      title: formData.get('title'),
      content: formData.get('content'),
      date: formData.get('date'),
    };
    if (!navigator.onLine) {
      await saveData('offlineEducations', { id: Date.now().toString(), ...educationData });
      page.querySelector('#message').textContent = 'Saved offline, will sync when online';
      return;
    }
    try {
      await createEducation(educationData);
      page.querySelector('#message').textContent = 'Education added';
      form.reset();
      loadData();
    } catch (error) {
      page.querySelector('#message').textContent = error.pesan || 'Error adding education';
    }
  });
  loadData();
  return page;
}