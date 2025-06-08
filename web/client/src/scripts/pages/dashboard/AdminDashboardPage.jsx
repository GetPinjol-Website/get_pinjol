export default function AdminDashboardPage() {
  const div = document.createElement('div');
  div.className = 'p-4';
  div.innerHTML = `
    <h1 class="text-2xl font-bold">Admin Dashboard</h1>
    <form id="eduForm" class="mt-4">
      <input type="text" name="title" placeholder="Title" class="border p-2 mb-2 w-full">
      <textarea name="content" placeholder="Content" class="border p-2 mb-2 w-full"></textarea>
      <input type="date" name="date" class="border p-2 mb-2 w-full">
      <button type="submit" class="bg-blue-500 text-white p-2">Add Education</button>
    </form>
    <ul id="eduList" class="mt-2"></ul>
    <p id="message" class="mt-2"></p>
  `;
  return div;
}