import { getToken } from './login.js';

export function setupCategoriesButton() {
  const btnCategories = document.getElementById('btn-categories');
  const resultArea = document.getElementById('result-area');
  btnCategories.addEventListener('click', () => {
    resultArea.innerHTML = '';
    loadCategories();
  });
}

// --- Load & Render Categories ---
async function loadCategories() {
  const response = await fetch('https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/categories', {
    headers: { 'Authorization': 'Bearer ' + getToken() }
  });
  const categories = await response.json();
  console.log(categories)
  renderCategoriesTable(categories);
}

function renderCategoriesTable(categories) {
  const resultArea = document.getElementById('result-area');
  resultArea.innerHTML = `
    <button id="add-category-btn">Adaugă categorie</button>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nume categorie</th>
          <th>Slug</th>
          <th>Acțiuni</th>
        </tr>
      </thead>
      <tbody>
        ${categories.map(cat => `
          <tr>
            <td>${cat.id}</td>
            <td>${cat.name}</td>
            <td>${cat.slug}</td>
            <td>
              <button class="delete-cat-btn" data-id="${cat.id}">Șterge</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div id="category-modal" class="modal" style="display:none;"></div>
    <div id="confirm-modal" class="modal" style="display:none;"></div>
  `;

  document.getElementById('add-category-btn').addEventListener('click', () => openCategoryModal());

  document.querySelectorAll('.delete-cat-btn').forEach(btn =>
    btn.addEventListener('click', () => confirmDeleteCategory(parseInt(btn.dataset.id)))
  );
}

// --- Open Modal (Add Category) ---
function openCategoryModal() {
  const modal = document.getElementById('category-modal');
  modal.style.display = 'block';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close-btn" id="close-category-modal">X</button>
      <h3>Adaugă categorie</h3>
      <form class="product-form" id="category-form">
      <div class="form-inputs">
        <input type="text" name="name" placeholder="Nume categorie" required />
        <input type="text" name="slug" placeholder="Slug" readonly />
        <button type="submit">Creează categorie</button>
        </div
      </form>
    </div>
  `;

  document.getElementById('close-category-modal').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Generare slug automat din numele categoriei
  const nameInput = modal.querySelector('input[name="name"]');
  const slugInput = modal.querySelector('input[name="slug"]');
  nameInput.addEventListener('input', () => {
    slugInput.value = generateSlug(nameInput.value);
  });

  document.getElementById('category-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    console.log('payload',payload)
    const response = await fetch('https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken()
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert('Categorie creată cu succes!');
      modal.style.display = 'none';
      loadCategories();
    } else {
      const err = await response.json();
      alert('Eroare: ' + err.message);
    }
  });
}

// --- Confirmare ștergere categorie ---
function confirmDeleteCategory(categoryId) {
  const modal = document.getElementById('confirm-modal');
  modal.style.display = 'block';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close-btn" id="cancel-delete-category">X</button>
      <p>Sigur vrei să ștergi categoria?</p>
      <div class="delete-prod">
        <button id="confirm-delete-category">Șterge</button>
        <button id="cancel-delete-category">Anulează</button>
      </div>
    </div>
  `;

  document.getElementById('cancel-delete-category').addEventListener('click', () => modal.style.display = 'none');

  document.getElementById('confirm-delete-category').addEventListener('click', async () => {
    const response = await fetch(`https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/categories/${categoryId}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });

    if (response.ok) {
      alert('Categorie ștearsă!');
      modal.style.display = 'none';
      loadCategories();
    } else {
      alert('Eroare la ștergere.');
    }
  });
}

// --- Funcție pentru generarea slug-ului ---
function generateSlug(text) {
  return text.toString().toLowerCase().trim()
    .replace(/&/g, '-and-')
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export { loadCategories };