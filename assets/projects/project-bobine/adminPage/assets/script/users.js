import { getToken } from './login.js';

export function setupUsersButton() {
  const btnUsers = document.getElementById('btn-users');
  const resultArea = document.getElementById('result-area');

  // Când se apasă pe butonul "Utilizatori", afișăm lista
  btnUsers.addEventListener('click', () => {
    resultArea.innerHTML = '';
    loadUsers();
  });
}

// --- 1. Încărcare și afișare useri ---
async function loadUsers() {
  try {
    const response = await fetch('https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/admins', {
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    const users = await response.json();
    renderUsersTable(users);
  } catch (err) {
    alert('Eroare la încărcarea userilor: ' + err.message);
  }
}

// --- 2. Randează tabelul cu useri + buton de creare ---
function renderUsersTable(users) {
  const resultArea = document.getElementById('result-area');
  resultArea.innerHTML = `
    <button id="create-user-btn">Creează user</button>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Acțiuni</th>
        </tr>
      </thead>
      <tbody>
        ${users.map(u => `
          <tr>
            <td>${u.id}</td>
            <td>${u.username}</td>
            <td>${u.role}</td>
            <td>
              <button class="delete-user-btn" data-id="${u.id}">Șterge</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <!-- Modalele pentru creare/ștergere -->
    <div id="user-modal" class="modal" style="display:none;"></div>
    <div id="confirm-modal" class="modal" style="display:none;"></div>
  `;

  // Butonul de creare user
  document.getElementById('create-user-btn').addEventListener('click', () => openUserModal());

  // Butoane de ștergere pentru fiecare user
  document.querySelectorAll('.delete-user-btn').forEach(btn => {
    btn.addEventListener('click', () => confirmDeleteUser(parseInt(btn.dataset.id)));
  });
}

// --- 3. Deschide modal pentru creare user nou ---
function openUserModal() {
  const modal = document.getElementById('user-modal');
  modal.style.display = 'block';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close-btn" id="close-user-modal">X</button>
      <h3>Creează user nou</h3>
      <form class="product-form" id="user-form">
      
        <input type="text" name="username" placeholder="Email" required />
        <input type="text" name="password" placeholder="Parola" required />
        <select name="role" required>
          <option value="">Selectează rol</option>
          <option value="operator">Operator</option>
          <option value="manager">Manager</option>
          <option value="root">Root</option>
        </select>
        <button type="submit">Creează user</button>
      </form>
    </div>
  `;

  // Închide modalul
  document.getElementById('close-user-modal').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Submit formular: creează user nou
  document.getElementById('user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('User creat cu succes!');
        modal.style.display = 'none';
        loadUsers(); // Re-afișăm lista
      } else {
        const err = await response.json();
        alert('Eroare: ' + err.message);
      }
    } catch (err) {
      alert('Eroare la crearea userului: ' + err.message);
    }
  });
}

// --- 4. Confirmare ștergere user ---
function confirmDeleteUser(userId) {
  const modal = document.getElementById('confirm-modal');
  modal.style.display = 'block';
  modal.innerHTML = `
    <div class="modal-content">
      <p>Sigur vrei să ștergi acest user?</p>
      <button id="confirm-delete-user">Șterge</button>
      <button id="cancel-delete-user">Anulează</button>
    </div>
  `;

  document.getElementById('cancel-delete-user').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  document.getElementById('confirm-delete-user').addEventListener('click', async () => {
    try {
      const response = await fetch(`https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/admins/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });

      if (response.ok) {
        alert('User șters cu succes!');
        modal.style.display = 'none';
        loadUsers();
      } else {
        const errData = await response.json();
        alert('Eroare: ' + errData.message);
      }
    } catch (err) {
      alert('Eroare la ștergerea userului: ' + err.message);
    }
  });
}