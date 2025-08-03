// Fonction d'initialisation admin
function initAdmin() {
  const categories = document.querySelector('.categories');

  const token = localStorage.getItem('token');
    if (!token){
      categories.style.display = 'flex';
      return;
    };
    categories.style.display = 'none';
    // Bouton modifier
    const portfolioTitle = document.getElementById('portfolio-title');
    if (portfolioTitle) {
      const modifyButton = document.createElement('button');
      modifyButton.className = 'modify-button';
      modifyButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier';
      portfolioTitle.appendChild(modifyButton);
      modifyButton.addEventListener('click', createModal);
    }
  }
  
  // Nettoyage de l'interface admin
  function cleanAdminInterface() {
    document.querySelector('.modify-button')?.remove();
  }
  
function createModal() {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
  <div class="modal-content">
    <h2>Galerie photo</h2>
    <button class="close-modal">X</button>
    <div class="modal-content-photos"></div>
    <hr class="line">
    <button class="add-button">Ajouter une photo</button>
  `;
  document.body.appendChild(modal);

  //fermer modal  
  overlay.addEventListener('click', () => {
    overlay.remove();
    modal.remove();
  });
  modal.querySelector('.close-modal').addEventListener('click', () => {
    overlay.remove();
    modal.remove();
  });
   //chargement des photos
   getWorks(modal.querySelector('.modal-content-photos'));

   //ajouter une photo
   modal.querySelector('.add-button').addEventListener('click', () => {
    modal.remove();
    overlay.remove();
    createModalAddPhoto();
   });
}

async function getWorks(modalContentPhotos) {
  const gallery = await fetch('http://localhost:5678/api/works');
  const works = await gallery.json();
  modalContentPhotos.innerHTML = '';
  works.forEach(work => {
    workContainer = document.createElement('div');
    workContainer.className = 'work-container';
    workContainer.innerHTML = `
    <img src="${work.imageUrl}" alt="${work.title}">
    <button class="delete-button" data-id="${work.id}">X</button>
    `;
    modalContentPhotos.appendChild(workContainer);

    workContainer.querySelector('.delete-button').addEventListener('click', () => {
      deleteWork(work.id);
    });

  })

}
function createModalAddPhoto() {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
      <button class="prev-button"><i class="fa-solid fa-arrow-left"></i></button>
      <h2>Ajout photo</h2>
      <button class="close-modal">&times;</button>
    </div>
    <form id="add-photo-form">
      <div class="form-group">
        <div class="image-upload">
          <i class="fa-regular fa-image"></i>
          <input type="file" id="photo-input" accept="image/*">
          <button type="button" class="upload-btn">+ Ajouter photo</button>
          <p>jpg, png : 4mo max</p>
          <img id="image-preview" style="display:none;">
        </div>
      </div>
      <div class="form-group">
        <label for="title">Titre</label>
        <input type="text" id="title" required>
      </div>
      <div class="form-group">
        <label for="category">Catégorie</label>
        <select id="category" required></select>
      </div>
      <hr class="line">
      <button type="submit" class="submit-btn">Valider</button>
    </form>
  `;
  fetch('http://localhost:5678/api/categories')
  .then(response => response.json())
  .then(categories => {
    const select = modal.querySelector('#category');
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      select.appendChild(option);
    });
  });
  
  document.body.appendChild(modal);
  //bouton retour
  modal.querySelector('.prev-button').addEventListener('click', () => {
    modal.remove();
    overlay.remove();
    createModal();
  });
  //fermer modal
  modal.querySelector('.close-modal').addEventListener('click', () => {
    modal.remove();
    overlay.remove();
  });
  //ajouter une photo
  const button = modal.querySelector('.upload-btn');
  button.addEventListener('click', () => {
    const fileInput = modal.querySelector('#photo-input');
    fileInput.click();
  });
    // Gestion de la prévisualisation de l'image
    const photoInput = modal.querySelector('#photo-input');
    const imagePreview = modal.querySelector('#image-preview');
    const uploadIcon = modal.querySelector('.fa-image');
    const uploadBtn = modal.querySelector('.upload-btn');
    const uploadText = modal.querySelector('.image-upload p')
  photoInput.addEventListener('change', function(e) {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        uploadIcon.style.display = 'none';
        uploadBtn.style.display = 'none';
        uploadText.style.display = 'none';
      };
      reader.readAsDataURL(this.files[0]);
    }
  });
  modal.querySelector('#add-photo-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    console.log(photoInput.files[0]);
    formData.append('image', photoInput.files[0]);
    formData.append('title', modal.querySelector('#title').value);
    formData.append('category', modal.querySelector('#category').value);
    console.log([...formData.entries()]); // Pour déboguer

    addWork(formData);
  });
  }

async function deleteWork(id) {
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (response.ok) {
    alert('Photo supprimée avec succès');
    getWorks(modalContentPhotos);
  } else {
    alert('Erreur lors de la suppression de la photo');
  }
}
async function addWork(work) {
  const token = localStorage.getItem('token'); 
  const response = await fetch('http://localhost:5678/api/works', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: work
  });
  if (response.ok) {
    alert('Photo ajoutée avec succès');
    window.location.href = 'index.html';
    
  } else {
    alert('Erreur lors de l\'ajout de la photo');
  }
}
  // Initialisation au chargement
  document.addEventListener('DOMContentLoaded', function() {
    initAdmin();
  });