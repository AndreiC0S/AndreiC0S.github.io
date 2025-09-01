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
  try {
    const response = await fetch('https://back-test-production-2884.up.railway.app/api/parent-categories', {
      headers: { 
        'Content-Type': 'application/json',
        'x-app-id': 'admin-client',
        'Authorization': 'Bearer ' + getToken()
       }
    });

    const data = await response.json();
    if (!Array.isArray(data)) {
      console.error('Failed to get parent categories', data);
      alert('Eroare la încărcarea categoriilor');
      return;
    }

    renderCategoriesTable(data);
  } catch (err) {
    console.error('Eroare loadCategories:', err);
    alert('Eroare la încărcarea categoriilor');
  }
}
function renderCategoriesTable(categories) {
  const resultArea = document.getElementById('result-area');
  resultArea.innerHTML = `
    <button id="add-parent-category-btn">Adaugă categorie părinte</button>
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
            <td>${cat.slug || ''}</td>
            <td>
              <button class="extend-cat-btn" data-id="${cat.id}">Extinde</button>
              <button class="delete-cat-btn" data-id="${cat.id}">Șterge</button>
              <button class="add-child-btn" data-id="${cat.id}">Adaugă categorie copil</button>
            </td>
          </tr>
          <tr id="child-row-${cat.id}" class="child-rows" style="display: none;">
            <td colspan="4">
              <ul>
                ${(cat.children || []).map(child => `
                  <li style="display: flex; justify-content: space-between; align-items: center; padding: 6px; border-bottom: 1px solid #eee; margin-bottom: 20px;">
                    <div style="display: flex; flex-direction: column; align-items: flex-start;">
                      <strong style="font-weight: 600;">${child.name}</strong>
                      <small style="color: gray;">${child.slug || ''}</small>
                    </div>
                    <div style="display: flex; gap: 8px;">
                      <button class="edit-child-btn" data-id="${child.id}">Modifică</button>
                      <button class="delete-child-btn" data-id="${child.id}">Șterge</button>
                    </div>
                  </li>
                `).join('')}
              </ul>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div id="category-modal" class="modal" style="display:none;"></div>
    <div id="confirm-modal" class="modal" style="display:none;"></div>
  `;

  document.getElementById('add-parent-category-btn').addEventListener('click', () => openParentCategoryModal());

  document.querySelectorAll('.delete-cat-btn').forEach(btn =>
    btn.addEventListener('click', () => confirmDeleteCategory(parseInt(btn.dataset.id)))
  );

  document.querySelectorAll('.extend-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = document.getElementById(`child-row-${btn.dataset.id}`);
      row.style.display = row.style.display === 'none' ? 'table-row' : 'none';
    });
  });

  document.querySelectorAll('.add-child-btn').forEach(btn => {
    btn.addEventListener('click', () => openChildCategoryModal(parseInt(btn.dataset.id)));
  });

  document.querySelectorAll('.edit-child-btn').forEach(btn => {
    btn.addEventListener('click', () => openEditChildCategoryModal(parseInt(btn.dataset.id)));
  });

  document.querySelectorAll('.delete-child-btn').forEach(btn => {
    btn.addEventListener('click', () => confirmDeleteChildCategory(parseInt(btn.dataset.id)));
  });
}

// --- Open Modal (Add Parent Category) ---
function openParentCategoryModal() {
  const modal = document.getElementById('category-modal');
  modal.style.display = 'block';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close-btn" id="close-parent-category-modal">X</button>
      <h3>Adaugă categorie părinte</h3>
      <form class="product-form" id="parent-category-form">
        <div class="form-inputs">
          <input type="text" name="name" placeholder="Nume categorie" required />
          <input type="text" name="slug" placeholder="Slug" readonly />
          <button type="submit">Creează categorie părinte</button>
        </div>
      </form>
    </div>
  `;

  const nameInput = modal.querySelector('input[name="name"]');
  const slugInput = modal.querySelector('input[name="slug"]');
  nameInput.addEventListener('input', () => {
    slugInput.value = generateSlug(nameInput.value);
  });

  document.getElementById('close-parent-category-modal').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  document.getElementById('parent-category-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Form submitted',e.target);
    const formData = new FormData(e.target);
    
    
    const payload = Object.fromEntries(formData.entries());
    console.log('Payload:', payload);
    const response = await fetch('https://back-test-production-2884.up.railway.app/api/parent-categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': 'admin-client',
        'Authorization': 'Bearer ' + getToken()
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert('Categorie părinte creată!');
      modal.style.display = 'none';
      loadCategories();
    } else {
      const err = await response.json();
      alert('Eroare: ' + err.message);
    }
  });
}

// --- Open Modal (Add Child Category) ---
function openChildCategoryModal(parentId) {
  const modal = document.getElementById('category-modal');
  modal.style.display = 'block';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close-btn" id="close-child-category-modal">X</button>
      <h3>Adaugă categorie copil</h3>
      <form class="product-form" id="child-category-form">
        <div class="form-inputs">
          <input type="text" name="name" placeholder="Nume categorie" required />
          <input type="text" name="slug" placeholder="Slug" readonly />
          <input type="hidden" name="parent_category_id" value="${parentId}" />
          <button type="submit">Creează categorie copil</button>
        </div>
      </form>
    </div>
  `;

  document.getElementById('close-child-category-modal').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  const nameInput = modal.querySelector('input[name="name"]');
  const slugInput = modal.querySelector('input[name="slug"]');
  nameInput.addEventListener('input', () => {
    slugInput.value = generateSlug(nameInput.value);
  });

  document.getElementById('child-category-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    console.log('Payload:', payload);
    const response = await fetch('https://back-test-production-2884.up.railway.app/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': 'admin-client',
        'Authorization': 'Bearer ' + getToken()
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert('Categorie copil creată!');
      modal.style.display = 'none';
      loadCategories();
    } else {
      const err = await response.json();
      alert('Eroare: ' + err.message);
    }
  });
}

// --- Open Modal (Edit Child Category) ---
async function openEditChildCategoryModal(childId) {
  const modal = document.getElementById('category-modal');
  modal.style.display = 'block';

  const res = await fetch(`https://back-test-production-2884.up.railway.app/api/categories/${childId}`, {
    headers: { 'Authorization': 'Bearer ' + getToken() }
  });
  const data = await res.json();

  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close-btn" id="close-edit-child-modal">X</button>
      <h3>Modifică categorie copil</h3>
      <form class="product-form" id="edit-child-category-form">
        <div class="form-inputs">
          <input type="text" name="name" value="${data.name}" required />
          <input type="text" name="slug" placeholder="Slug" readonly />
          <button type="submit">Salvează modificările</button>
        </div>
      </form>
    </div>
  `;
  const nameInput = modal.querySelector('input[name="name"]');
  const slugInput = modal.querySelector('input[name="slug"]');
  nameInput.addEventListener('input', () => {
    slugInput.value = generateSlug(nameInput.value);
  });
  document.getElementById('close-edit-child-modal').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  document.getElementById('edit-child-category-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch(`https://back-test-production-2884.up.railway.app/api/categories/${childId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': 'admin-client',
        'Authorization': 'Bearer ' + getToken()
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert('Categorie modificată!');
      modal.style.display = 'none';
      loadCategories();
    } else {
      const err = await response.json();
      alert('Eroare: ' + err.message);
    }
  });
}

// --- Confirmare ștergere categorie copil ---
function confirmDeleteChildCategory(childId) {
  const modal = document.getElementById('confirm-modal');
  modal.style.display = 'block';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close-btn" id="cancel-delete-child">X</button>
      <p>Sigur vrei să ștergi această categorie copil?</p>
      <div class="delete-prod">
        <button id="confirm-delete-child">Șterge</button>
        <button id="cancel-delete-child">Anulează</button>
      </div>
    </div>
  `;

  document.getElementById('cancel-delete-child').addEventListener('click', () => modal.style.display = 'none');

  document.getElementById('confirm-delete-child').addEventListener('click', async () => {
    const response = await fetch(`https://back-test-production-2884.up.railway.app/api/categories/${childId}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });

    if (response.ok) {
      alert('Categorie copil ștearsă!');
      modal.style.display = 'none';
      loadCategories();
    } else {
      alert('Eroare la ștergere.');
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
    const response = await fetch(`https://back-test-production-2884.up.railway.app/api/parent-categories/${categoryId}`, {
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