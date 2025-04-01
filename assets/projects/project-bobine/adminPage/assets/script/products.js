import { getToken } from './login.js';

export function setupProductsButton() {
  const btnProducts = document.getElementById('btn-products');
  const resultArea = document.getElementById('result-area');
  btnProducts.addEventListener('click', () => {
    resultArea.innerHTML = '';
    loadProducts();
  });
}

// --- Load & Render Products ---
async function loadProducts() {
  // Preluăm produsele (care includ proprietăți "categories" și "image_url")
  const response = await fetch('https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/products', {
    headers: { 'Authorization': 'Bearer ' + getToken() }
  });
  const products = await response.json();

  // Preluăm categoriile disponibile pentru formular
  const catResponse = await fetch('https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/categories', {
    headers: { 'Authorization': 'Bearer ' + getToken() }
  });
  const availableCategories = await catResponse.json();

  renderProductTable(products, availableCategories);
}

// --- Render Products Table cu Search Bar și Pagination ---
function renderProductTable(products, availableCategories) {
  const resultArea = document.getElementById('result-area');

  // Construcția containerului pentru search, tabel și paginare
  resultArea.innerHTML = `
    <input type="text" id="product-search" placeholder="Caută produse după nume sau slug..." style="width:30%; padding:8px; margin-bottom:10px;" />
    <button id="add-product-btn">Adaugă produs</button>
    <div id="products-table-container"></div>
    <div id="pagination-controls" style="margin-top:10px;"></div>
    <div id="product-modal" class="modal" style="display:none;"></div>
    <div id="confirm-modal" class="modal" style="display:none;"></div>
  `;

  // Variabile pentru paginare
  let currentPage = 1;
  const itemsPerPage = 10;

  // Funcția ce randează tabelul și butoanele de paginare în funcție de lista de produse primită
  function renderTable(filteredProducts) {
    const tableContainer = document.getElementById('products-table-container');

    filteredProducts.sort((a, b) => b.id - a.id);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageProducts = filteredProducts.slice(start, end);

    tableContainer.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nume</th>
            <th>Slug</th>
            <th>Preț</th>
            <th>Stoc</th>
            <th>Categorii</th>
            <th>Imagine</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          ${[...pageProducts].map(p => {
      const catNames = p.categories && p.categories.length > 0
        ? p.categories.map(c => c.name).join(', ')
        : '';
      return `
                <tr>
                  <td>${p.id}</td>
                  <td>${p.name}</td>
                  <td>${p.slug}</td>
                  <td>${p.price}</td>
                  <td>${p.stock}</td>
                  <td>${catNames}</td>
                  <td class="td-img"> ${p.image_url? `<img src="${p.image_url.startsWith('http') ? p.image_url : 'https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/' + p.image_url}" alt="${p.name}" style="max-height:100px;"    />` : ''} </td>
                 
                  <td class="control-btn">
                    <div class="prod-control-btn">
                      <button class="edit-btn" data-id="${p.id}">Modifică</button>
                      <button class="delete-btn" data-id="${p.id}">Șterge</button>
                    </div>
                  </td>
                </tr>
              `;
    }).join('')}
        </tbody>
      </table>
    `;

    // Atașează evenimentele pentru butoanele de editare și ștergere
    document.querySelectorAll('.edit-btn').forEach(btn =>
      btn.addEventListener('click', () => openProductModal(parseInt(btn.dataset.id)))
    );
    document.querySelectorAll('.delete-btn').forEach(btn =>
      btn.addEventListener('click', () => confirmDeleteProduct(parseInt(btn.dataset.id)))
    );

    // Construiește controalele de paginare
    const paginationContainer = document.getElementById('pagination-controls');
    let paginationHTML = '';
    if (totalPages > 1) {
      if (currentPage > 1) {
        paginationHTML += `<button id="prev-page">Prev</button>`;
      }
      paginationHTML += ` <span>Page ${currentPage} of ${totalPages}</span> `;
      if (currentPage < totalPages) {
        paginationHTML += `<button id="next-page">Next</button>`;
      }
    }
    paginationContainer.innerHTML = paginationHTML;

    if (document.getElementById('prev-page')) {
      document.getElementById('prev-page').addEventListener('click', () => {
        currentPage--;
        renderTable(filteredProducts);
      });
    }
    if (document.getElementById('next-page')) {
      document.getElementById('next-page').addEventListener('click', () => {
        currentPage++;
        renderTable(filteredProducts);
      });
    }
  }

  // Inițial, randează tabelul cu toate produsele
  renderTable(products);

  // Evenimentul pentru search bar: filtrează dinamic lista de produse și resetează pagina la 1
  const searchInput = document.getElementById('product-search');
  searchInput.addEventListener('input', function () {
    const query = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.slug.toLowerCase().includes(query)
      // Poți adăuga și alte câmpuri pentru filtrare, cum ar fi description sau categorii
    );
    currentPage = 1;
    renderTable(filteredProducts);
  });

  // Eveniment pentru butonul de adăugare produs
  document.getElementById('add-product-btn').addEventListener('click', () => openProductModal());
}

async function openProductModal(productId = null) {
  const modal = document.getElementById('product-modal');
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden'; // Dezactivează scroll-ul fundalului

  // Preluăm categoriile disponibile
  const categories = await fetch('https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/categories', {
    headers: { 'Authorization': 'Bearer ' + getToken() }
  }).then(res => res.json());

  let product = {
    name: '',
    slug: '',
    price: '',
    stock: '',
    description: '',
    categories: [],
    image_url: ''
  };

  if (productId) {
    const res = await fetch(`https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/products/${productId}`, {
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    product = await res.json();
  }

  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close-btn" id="close-modal">X</button>
      <h3>${productId ? 'Modifică produs' : 'Adaugă produs'}</h3>
      <form class="product-form" id="product-form">
        <div class="form-inputs">
          <input type="text" name="name" value="${product.name}" placeholder="Nume" required />
          <input type="text" name="slug" value="${product.slug}" placeholder="Slug" required />
          <input type="number" step="0.01" name="price" value="${product.price}" placeholder="Preț" required />
          <input type="number" name="stock" value="${product.stock}" placeholder="Stoc" required />
          <textarea name="description" placeholder="Descriere">${product.description || ''}</textarea>
        </div>
        <label>Categorii:</label>
        <!-- Search bar pentru categorii -->
        <input type="text" id="category-search" placeholder="Caută categorii după nume..." style="width:100%; padding:5px; margin-bottom:10px;" />
        <!-- Buton pentru adăugarea unei categorii noi -->
        <button type="button" id="add-new-cat-btn" style="margin-bottom:10px;">Adaugă categorie nouă</button>
        <!-- Formularul pentru noua categorie (ascuns inițial) -->
        <div id="new-category-form" style="display:none; margin-bottom:10px;">
          <input type="text" id="new-cat-name" placeholder="Nume categorie" style="width:80%; padding:5px; margin-right:5px;"  />
          <input type="text" id="new-cat-slug" placeholder="Slug" readonly style="width:15%; padding:5px;" required />
          <button type="button" id="submit-new-cat-btn">Salvează</button>
        </div>
        <div id="category-checkboxes">
          <div class="check-wraper">
            ${categories.map(cat => {
              const checked = product.categories?.some(c => c.id === cat.id) ? 'checked' : '';
              return `
                <label class="prod-checkbox">
                  <input type="checkbox" name="categoryIds" value="${cat.id}" ${checked} />${cat.name}
                </label>
              `;
            }).join('')}
          </div>
        </div>
        <label>Imagine produs:</label>
        <input type="file" id="product-image" name="image" accept="image/*" />
        ${product.image_url
          ? `<p>Imagine existentă:</p>
             <img src="${product.image_url.startsWith('http') ? product.image_url : 'https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/' + product.image_url}" alt="${product.name}" style="max-width:150px; margin-bottom:10px;" />`
          : ''
        }
        <p>Previzualizare nouă:</p>
        <img id="image-preview" src="" alt="Preview nou" style="display:none; max-width:150px; margin-bottom:10px;" />
        <button type="submit">${productId ? 'Salvează modificările' : 'Creează produs'}</button>
      </form>
    </div>
  `;

  // Buton de închidere modal
  document.getElementById('close-modal').addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Readuce scroll-ul pe body
  });

  // Actualizează slug-ul automat pe baza numelui (pentru produs)
  const nameInput = modal.querySelector('input[name="name"]');
  const slugInput = modal.querySelector('input[name="slug"]');
  nameInput.addEventListener('input', () => {
    slugInput.value = generateSlug(nameInput.value);
  });
  
  // Previzualizare imagine nouă
  const imageInput = document.getElementById('product-image');
  const imagePreview = document.getElementById('image-preview');
  if (imageInput) {
    imageInput.addEventListener('change', () => {
      const file = imageInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          imagePreview.src = e.target.result;
          imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      } else {
        imagePreview.src = '';
        imagePreview.style.display = 'none';
      }
    });
  }



// --- Event listener pentru search bar-ul de categorii ---
const categorySearchInput = modal.querySelector('#category-search');
const addNewCatBtn = modal.querySelector('#add-new-cat-btn');

// Ascundem butonul implicit
addNewCatBtn.style.display = 'none';

categorySearchInput.addEventListener('input', function () {
  const query = this.value.toLowerCase().trim();
  let visibleCount = 0;
  // Reselectăm etichetele de categorii de fiecare dată (în caz că se modifică DOM-ul)
  const categoryCheckboxLabels = modal.querySelectorAll('.prod-checkbox');
  categoryCheckboxLabels.forEach(label => {
    // Curățăm textul (eventual, eliminăm spațiile inutile)
    const catName = label.textContent.toLowerCase().trim();
    if (catName.includes(query)) {
      label.style.display = '';
      visibleCount++;
    } else {
      label.style.display = 'none';
    }
  });
  // Afișează butonul "Adaugă categorie nouă" doar dacă există un query și nu s-au găsit rezultate
  addNewCatBtn.style.display = (query !== '' && visibleCount === 0) ? 'block' : 'none';
});
// Event listener pentru butonul de "Adaugă categorie nouă"
addNewCatBtn.addEventListener('click', async function () {
  const newCategoryName = categorySearchInput.value.trim();
  if (!newCategoryName) return;
  const newCategorySlug = generateSlug(newCategoryName);
  const payload = { name: newCategoryName, slug: newCategorySlug };

  const response = await fetch('https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getToken()
    },
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    
    // Reîmprospătăm lista de categorii
    const updatedCatResponse = await fetch('https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/categories', {
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    const updatedCategories = await updatedCatResponse.json();
    const checkWrapper = modal.querySelector('#category-checkboxes .check-wraper');
    checkWrapper.innerHTML = updatedCategories.map(cat => {
      // Verificăm dacă produsul are deja această categorie
      const isChecked = product.categories?.some(c => c.id === cat.id) ? 'checked' : '';
      return `
        <label class="prod-checkbox">
          <input type="checkbox" name="categoryIds" value="${cat.id}" ${isChecked} />${cat.name}
        </label>
      `;
    }).join('');
    // Actualizează lista de etichete pentru search și asigură-te că toate apar
    const newCheckboxLabels = modal.querySelectorAll('.prod-checkbox');
    newCheckboxLabels.forEach(label => {
      label.style.display = '';
    });
    // Ștergem query-ul și ascundem butonul
    categorySearchInput.value = '';
    addNewCatBtn.style.display = 'none';
  } else {
    const err = await response.json();
    alert('Eroare la crearea categoriei: ' + err.message);
  }
});

  // La submit, se creează/actualizează produsul și apoi se face uploadul imaginii (dacă există)
  document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    // Construim payload-ul pentru produs (fără imagine)
    const payload = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      price: parseFloat(formData.get('price')),
      stock: parseInt(formData.get('stock')),
      description: formData.get('description'),
      categoryIds: Array.from(form.querySelectorAll('input[name="categoryIds"]:checked'))
        .map(cb => parseInt(cb.value))
    };

    const method = productId ? 'PUT' : 'POST';
    const url = productId
      ? `https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/products/${productId}`
      : `https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/products`;

    // 1. Trimitem datele produsului (fără imagine)
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken()
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      let updatedProduct = await response.json();

      // 2. Dacă a fost selectată o imagine, o uploadăm
      const fileInput = document.getElementById('product-image');
      if (fileInput && fileInput.files[0]) {
        try {
          const productIdForImage = productId ? productId : updatedProduct.id;
          const imageData = new FormData();
          imageData.append('image', fileInput.files[0]);

          const imageMethod = productId ? 'PUT' : 'POST';
          const imageResponse = await fetch(
            `https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/products/${productIdForImage}/image`,
            {
              method: imageMethod,
              headers: {
                'Authorization': 'Bearer ' + getToken()
              },
              body: imageData
            }
          );
          if (imageResponse.ok) {
            const imageResult = await imageResponse.json();
            updatedProduct.image_url = imageResult.imageUrl;
          } else {
            console.error('Upload imagine a eșuat.');
          }
        } catch (err) {
          console.error(err);
          alert("Produsul a fost actualizat, dar imaginea nu a putut fi încărcată.");
        }
      }

      
      modal.style.display = 'none';
      document.body.style.overflow = ''; // Readuce scroll-ul
      loadProducts();
    } else {
      const err = await response.json();
      alert('Eroare: ' + err.message);
    }
  });
}

// --- Confirmare ștergere ---
function confirmDeleteProduct(productId) {
  const modal = document.getElementById('confirm-modal');
  modal.style.display = 'block';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close-btn" id="cancel-delete">X</button>
      <p>Sigur vrei să ștergi produsul?</p>
      <div class="delete-prod">
        <button id="confirm-delete">Șterge</button>
        <button id="cancel-delete">Anulează</button>
      </div>
    </div>
  `;

  document.getElementById('cancel-delete').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  document.getElementById('confirm-delete').addEventListener('click', async () => {
    const response = await fetch(`https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/products/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });

    if (response.ok) {
      
      modal.style.display = 'none';
      loadProducts();
    } else {
      alert('Eroare la ștergere.');
    }
  });

}
function generateSlug(text) {
  return text.toString().toLowerCase().trim()
    .replace(/&/g, '-and-')
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
