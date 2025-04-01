// Elemente HTML
const loginForm = document.getElementById('login-form');
const loginContainer = document.getElementById('login-container');
const adminContainer = document.getElementById('admin-container');
const loginError = document.getElementById('login-error');
const resultArea = document.getElementById('result-area');

// Butoane din sidebar
const btnOrders = document.getElementById('btn-orders');
const btnProducts = document.getElementById('btn-products');
const btnCategories = document.getElementById('btn-categories');
const btnUsers = document.getElementById('btn-users');
const usersSection = document.getElementById('users-section');

let token = '';
let userRole = '';

// Event listener pentru login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  console.log("Login: ", username, password);
  try {
    const response = await fetch('http://localhost:3002/api/admins/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (response.ok) {
      // Login reușit: stocăm token-ul și rolul
      token = data.token;
      userRole = data.role;
      loginContainer.style.display = 'none';
      adminContainer.style.display = 'block';
      if (userRole === 'root') {
        usersSection.style.display = 'block';
      }
    } else {
      loginError.textContent = data.message || 'Login failed';
    }
  } catch (err) {
    loginError.textContent = 'Error: ' + err.message;
  }
});

// Funcție generică (o poți păstra pentru alte secțiuni, dacă este nevoie)
async function fetchData(url, reverse = false) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    let data = await response.json();
    if (Array.isArray(data) && reverse) {
      data = data.reverse();
    }
    // Pentru secțiuni simple, afișăm JSON formatare; pentru Orders folosim renderOrders()
    resultArea.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    resultArea.textContent = 'Error: ' + err.message;
  }
}

// --- Secțiunea Orders ---
// Încarcă comenzile de la backend și le afișează într-un tabel cu opțiuni de update și toggle pentru detalii
async function loadOrders() {
  try {
    const response = await fetch('http://localhost:3002/api/orders', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    let orders = await response.json();
    renderOrders(orders);
  } catch (err) {
    alert('Error loading orders: ' + err.message);
  }
}

function renderOrders(orders) {
  // Sortează comenzile descrescător (ultima intrare apare prima)
  orders.sort((a, b) => b.id - a.id);
  resultArea.innerHTML = ''; // Curățăm zona de afișare

  // Creăm tabelul pentru comenzi
  const table = document.createElement('table');
  const header = document.createElement('tr');
  header.innerHTML = `
    <th>ID</th>
    <th>Client</th>
    <th>Email</th>
    <th>Total</th>
    <th>Status</th>
    <th>Acțiuni</th>
  `;
  table.appendChild(header);

  orders.forEach(order => {
    // Rândul principal pentru comandă
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.customer_name}</td>
      <td>${order.customer_email}</td>
      <td>${order.total_price}</td>
      <td>
        <select data-order-id="${order.id}" class="status-select">
          <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>pending</option>
          <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>processing</option>
          <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>shipped</option>
          <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>delivered</option>
          <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>cancelled</option>
        </select>
      </td>
      <td>
        <button class="update-status-btn" data-order-id="${order.id}">Actualizează</button>
        <button class="extend-btn" data-order-id="${order.id}">Extend</button>
      </td>
    `;
    table.appendChild(row);

    // Rândul pentru detalii (produse) – folosim produsele deja primite în obiectul comenzii
    const detailsRow = document.createElement('tr');
    detailsRow.classList.add('order-details');
    detailsRow.style.display = 'none';
    
    // Construim HTML-ul pentru produsele comenzii
    let productsHTML = '';
    if (order.products && Array.isArray(order.products) && order.products.length > 0) {
      productsHTML = '<ul>';
      order.products.forEach(prod => {
        productsHTML += `<li>ID Produs: ${prod.product_id}, Cantitate: ${prod.quantity}, Preț: ${prod.unit_price}</li>`;
      });
      productsHTML += '</ul>';
    } else {
      productsHTML = 'Nu sunt produse pentru această comandă.';
    }
    detailsRow.innerHTML = `<td colspan="6">${productsHTML}</td>`;
    table.appendChild(detailsRow);

    // Evenimentul pentru butonul "Extend": Toggle pentru afișarea detaliilor
    const extendBtn = row.querySelector('.extend-btn');
    extendBtn.addEventListener('click', function() {
      if (detailsRow.style.display === 'none') {
        detailsRow.style.display = 'table-row';
      } else {
        detailsRow.style.display = 'none';
      }
    });
  });

  resultArea.appendChild(table);

  // Evenimentul pentru butonul "Actualizează" pentru update-ul statusului
  document.querySelectorAll('.update-status-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
      const orderId = this.getAttribute('data-order-id');
      const select = document.querySelector(`select[data-order-id="${orderId}"]`);
      const newStatus = select.value;
      try {
        const response = await fetch(`http://localhost:3002/api/orders/${orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ status: newStatus })
        });
        if (response.ok) {
          alert('Status actualizat!');
          loadOrders();
        } else {
          const errData = await response.json();
          alert('Eroare: ' + errData.message);
        }
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });
  });
}

// Când se face click pe butonul "Comenzi intrate"
btnOrders.addEventListener('click', () => {
  resultArea.innerHTML = '';
  loadOrders();
});

// Alte secțiuni (Products, Categories, Users) pot fi tratate similar,
// folosind funcția fetchData sau implementări custom pentru a afișa datele într-un format dorit.