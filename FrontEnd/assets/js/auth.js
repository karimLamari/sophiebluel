// Stockage du token
let token = localStorage.getItem('token');

// Fonction de connexion
async function login(email, password) {
  const response = await fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error('Email ou mot de passe incorrect');
  }

  const data = await response.json();
  token = data.token;
  localStorage.setItem('token', token);
  return token;
}

// Fonction de déconnexion
function logout() {
  token = null;
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

// Mise à jour de l'interface
function updateInterface() {
  const loginLink = document.querySelector('.login');
  if (!loginLink) return;

  if (token) {
    loginLink.textContent = 'logout';
    loginLink.href = '#';
    loginLink.onclick = function(e) {
      e.preventDefault();
      logout();
    };
  } else {
    loginLink.textContent = 'login';
    loginLink.href = 'login.html';
    loginLink.onclick = null;
  }
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
  updateInterface();
  
  // Gestion du formulaire de login
  const loginForm = document.querySelector('.login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      try {
        await login(
          document.querySelector('#email').value,
          document.querySelector('#password').value
        );
        window.location.href = 'index.html';
      } catch (error) {
        alert(error.message);
      }
    });
  }
});