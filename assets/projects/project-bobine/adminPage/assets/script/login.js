
export function getToken() {
  return sessionStorage.getItem("token");
}

export function getUserRole() {
  return sessionStorage.getItem("userRole");
}

export function setupLogin() {
  const loginForm = document.getElementById('login-form');
  const loginContainer = document.getElementById('login-container');
  const adminContainer = document.getElementById('admin-container');
  const loginError = document.getElementById('login-error');
  const usersSection = document.getElementById('users-section');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('https://example-app-bobine-d9f2bccd7968.herokuapp.com/api/admins/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok) {
        // Salvează tokenul și rolul în sessionStorage
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userRole", data.role);

        // Ascunde containerul de login și afișează cel de admin
        loginContainer.style.display = 'none';
        adminContainer.style.display = 'block';

        // Folosește funcția getUserRole() pentru a obține rolul curent
        if (getUserRole() === 'root') {
          usersSection.style.display = 'block';
        }
      } else {
        loginError.textContent = data.message || 'Login failed';
      }
    } catch (err) {
      loginError.textContent = 'Error: ' + err.message;
    }
  });
}