// assets/script/main.js
import { getToken, setupLogin, getUserRole } from './login.js';
import { setupOrdersButton, loadOrders } from './orders.js';
import { setupProductsButton } from './products.js';
import {setupCategoriesButton} from './category.js'
import {setupUsersButton} from './users.js'

setupLogin();
setupOrdersButton();
setupProductsButton();
setupCategoriesButton();
setupUsersButton();

document.addEventListener('DOMContentLoaded', () => {
  // Obținem token-ul și elementele de login/admin din DOM
  const token = getToken();
  const loginContainer = document.getElementById('login-container');
  const adminContainer = document.getElementById('admin-container');
  const usersSection = document.getElementById('users-section');
  const logOutBtn = document.getElementById('log-out');

  logOutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userRole');
    window.location.reload();
  })

  if (token) {
    // Dacă există token, se face login automat
    loginContainer.style.display = 'none';
    adminContainer.style.display = 'block';
    setupOrdersButton()
    loadOrders()
    // Dacă rolul este "root", afișează secțiunea de utilizatori
    if (getUserRole() === 'root') {
      usersSection.style.display = 'block';
    } else {
      usersSection.style.display = 'none';
    }
  } else {
    // Dacă nu există token, afișează formularul de login
    loginContainer.style.display = 'flex';
    adminContainer.style.display = 'none';
    setupLogin();
  }
});