// Variables globales
let allWorks = [];
let allCategories = [];

// Fonction pour charger les travaux
async function loadWorks() {
  const response = await fetch('http://localhost:5678/api/works');
  if (!response.ok) throw new Error('Erreur chargement travaux');
  allWorks = await response.json();
  displayWorks(allWorks);
}

async function loadCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  if (!response.ok) {
      throw new Error("Erreur lors de la récupération des catégories");
  }
  const data = await response.json();
  allCategories = data;
  return data;
}

//affichage des catégories dans le menu
async function displayCategories() {
  const categories = await loadCategories();
  const categoriesContainer = document.querySelector(".categories");
  if (categoriesContainer) {
      categoriesContainer.innerHTML = "";
  }

  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.classList.add("active");
  allButton.dataset.categoryId = 0;
  categoriesContainer.appendChild(allButton);
  categories.forEach(category => {
      const button = document.createElement("button");
      button.textContent = category.name;
      button.dataset.categoryId = category.id;
      categoriesContainer.appendChild(button);
  });

  // Ajouter les événements de clic pour filtrer
  const buttons = document.querySelectorAll(".categories button");
  buttons.forEach(button => {
      button.addEventListener("click", () => {
          buttons.forEach(btn => btn.classList.remove("active"));
          button.classList.add("active");
          const categoryId = parseInt(button.dataset.categoryId);
          if (categoryId === 0) {
              displayWorks(allWorks);
          } else {
              const filtered = allWorks.filter(work => work.categoryId === categoryId);
              displayWorks(filtered);
          }
      });
  });
}
// affichage des travaux dans la gallerie
function displayWorks(works) {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;

  gallery.innerHTML = ''; 

  works.forEach(work => {
    const figure = document.createElement('figure');
    figure.dataset.id = work.id; 
    figure.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}" crossorigin="anonymous">
      <figcaption>${work.title}</figcaption>
    `;
    gallery.appendChild(figure); 
  });
}
// Initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.gallery')) {
    loadWorks();
    displayCategories();
  }
});