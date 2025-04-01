import { getToken } from './login.js';

export function setupOrdersButton() {
  const btnOrders = document.getElementById('btn-orders');
  const resultArea = document.getElementById('result-area');
  btnOrders.addEventListener('click', () => {
    // Setăm componenta activă ca "orders"
    resultArea.innerHTML = '';
    loadOrders();
   
  });
}

let i = 1
export async function loadOrders() {
  console.log('check', i++ )
  try {
    const response = await fetch('https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/orders', {
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    let orders = await response.json();
    console.log('order', orders)
    renderOrders(orders);
  } catch (err) {
    alert('Error loading orders: ' + err.message);
  }
}

function renderOrders(orders) {
  const resultArea = document.getElementById('result-area');
  orders.sort((a, b) => b.id - a.id);
  resultArea.innerHTML = '';

  const table = document.createElement('table');
  const header = document.createElement('tr');
  header.innerHTML = `
  <th>ID</th>
  <th>Client</th>
  <th>Email</th>
  <th>Telefon</th>
  <th>Adresă</th>
  <th>Total</th>
  <th>Status</th>
  <th>Acțiuni</th>
`;
  table.appendChild(header);

  orders.forEach(order => {
    
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.customer_name}</td>
      <td>${order.customer_email}</td>
      <td>${order.customer_phone || '-'}</td>
      <td>${order.customer_address || '-'}</td>
      <td>${order.total_price}</td>
      <td class="status-${order.status}">
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

    const detailsRow = document.createElement('tr');
    detailsRow.classList.add('order-details');
    detailsRow.style.display = 'none';

    let productsHTML = '';
    // Dacă order.products e un string, încearcă să-l parsezi
    if (order.products && typeof order.products === 'string') {
      try {
        order.products = JSON.parse(order.products);
      } catch (err) {
        console.error('Eroare la parsearea JSON:', err);
        order.products = [];
      }
    }
    
    if (order.products && Array.isArray(order.products) && order.products.length > 0) {
      productsHTML = `<ul style="list-style: none; padding: 0; margin: 0;">
  ${order.products.map(p => `
    <li style="margin: 10px 0;">
      <p style="width: 80vw; background-color: white; margin: 0; padding: 10px; box-sizing: border-box; color:black; font-size: 16px;">
        ID Produs: ${p.product_id}, Nume: ${p.name}, Cantitate: ${p.quantity}, Preț: ${p.unit_price}
      </p>
    </li>
  `).join('')}
</ul>`;
    } else {
      productsHTML = 'Nu sunt produse pentru această comandă.';
    }

    detailsRow.innerHTML = `<td colspan="8">${productsHTML}</td>`;
    table.appendChild(detailsRow);

    row.querySelector('.extend-btn').addEventListener('click', () => {
      detailsRow.style.display = detailsRow.style.display === 'none' ? 'table-row' : 'none';
    });
  });

  resultArea.appendChild(table);

  document.querySelectorAll('.update-status-btn').forEach(btn => {
    btn.addEventListener('click', async function () {
      const orderId = this.getAttribute('data-order-id');
      const select = document.querySelector(`select[data-order-id="${orderId}"]`);
      const newStatus = select.value;
      try {
        const response = await fetch(`https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/orders/${orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
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
