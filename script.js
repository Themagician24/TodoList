// SELECTION DES ELEMENTS HTML

const input = document.querySelector("input"); // Sélectionne l'élément input pour entrer une nouvelle tâche
const addButton = document.querySelector(".add-button"); // Bouton pour ajouter une nouvelle tâche
const todosHtml = document.querySelector(".todos"); // Conteneur pour afficher les tâches
const emptyImage = document.querySelector(".empty-image"); // Image à afficher lorsque la liste est vide
let todosJson = JSON.parse(localStorage.getItem("todos")) || []; // Récupère les tâches depuis le localStorage ou initialise un tableau vide
const deleteAllButton = document.querySelector(".delete-all"); // Bouton pour supprimer toutes les tâches
const filters = document.querySelectorAll(".filter"); // Boutons de filtre pour afficher les tâches selon leur statut
let filter = ''; // Filtre actif (completed, pending, etc.)

// Affiche les tâches existantes lors du chargement initial
showTodos();

// FONCTION POUR GENERER LE HTML D'UNE TÂCHE

/**
 * Génère le code HTML pour une tâche.
 * @param {Object} todo - Objet représentant une tâche avec son nom et son statut.
 * @param {number} index - Index de la tâche dans le tableau.
 * @returns {string} - Code HTML de la tâche.
 */
function getTodoHtml(todo, index) {
  // Si un filtre est appliqué et que la tâche ne correspond pas, ne pas afficher
  if (filter && filter != todo.status) {
    return '';
  }

  // Vérifie si la tâche est complétée pour cocher la case
  let checked = todo.status == "completed" ? "checked" : "";
  
  // Retourne le HTML de la tâche
  return /* html */ `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span class="${checked}">${todo.name}</span>
      </label>
      <button class="delete-btn" data-index="${index}" onclick="remove(this)">
        <i class="fa fa-times"></i>
      </button>
    </li>
  `; 
}

// FONCTION POUR AFFICHER LES TÂCHES

/**
 * Affiche toutes les tâches dans le DOM.
 * Si la liste est vide, affiche une image "vide".
 */
function showTodos() {
  // Si aucune tâche, afficher une image et vider le conteneur des tâches
  if (todosJson.length == 0) {
    todosHtml.innerHTML = '';
    emptyImage.style.display = 'block'; // Affiche l'image lorsque la liste est vide
  } else {
    // Génère le HTML pour chaque tâche et masque l'image "vide"
    todosHtml.innerHTML = todosJson.map(getTodoHtml).join('');
    emptyImage.style.display = 'none'; // Masque l'image lorsque des tâches existent
  }
}

// FONCTION POUR AJOUTER UNE NOUVELLE TÂCHE

/**
 * Ajoute une nouvelle tâche à la liste et met à jour le localStorage.
 * @param {string} todo - Le nom de la nouvelle tâche à ajouter.
 */
function addTodo(todo)  {
  input.value = ""; // Vide le champ input après ajout
  todosJson.unshift({ name: todo, status: "pending" }); // Ajoute la nouvelle tâche avec le statut "pending" en début de liste
  localStorage.setItem("todos", JSON.stringify(todosJson)); // Sauvegarde la nouvelle liste dans le localStorage
  showTodos(); // Réaffiche les tâches
}

// EVENEMENTS POUR AJOUTER UNE TÂCHE (EN APPUYANT SUR ENTER OU EN CLIQUANT SUR LE BOUTON)

/**
 * Ajout d'une nouvelle tâche avec l'Enter.
 */
input.addEventListener("keyup", e => {
  let todo = input.value.trim(); // Récupère la valeur entrée, en retirant les espaces inutiles
  if (!todo || e.key != "Enter") { // Si la valeur est vide ou si la touche Enter n'est pas pressée, ne rien faire
    return;
  }
  addTodo(todo); // Ajoute la tâche
});

/**
 * Ajout d'une nouvelle tâche en cliquant sur le bouton "Ajouter".
 */
addButton.addEventListener("click", () => {
  let todo = input.value.trim(); // Récupère la valeur entrée, en retirant les espaces inutiles
  if (!todo) { // Si la valeur est vide, ne rien faire
    return;
  }
  addTodo(todo); // Ajoute la tâche
});

// FONCTION POUR METTRE À JOUR LE STATUT D'UNE TÂCHE

/**
 * Met à jour le statut d'une tâche (complétée ou en attente).
 * @param {HTMLElement} todo - L'élément de la case à cocher.
 */
function updateStatus(todo) {
  let todoName = todo.parentElement.lastElementChild; // Sélectionne l'élément du nom de la tâche
  if (todo.checked) {
    todoName.classList.add("checked"); // Ajoute la classe "checked" pour indiquer que la tâche est complétée
    todosJson[todo.id].status = "completed"; // Met à jour le statut de la tâche dans le tableau
  } else {
    todoName.classList.remove("checked"); // Retire la classe "checked" si la tâche est repassée à "pending"
    todosJson[todo.id].status = "pending"; // Met à jour le statut de la tâche
  }
  localStorage.setItem("todos", JSON.stringify(todosJson)); // Sauvegarde les changements dans le localStorage
}

// FONCTION POUR SUPPRIMER UNE TÂCHE

/**
 * Supprime une tâche de la liste.
 * @param {HTMLElement} todo - Le bouton de suppression de la tâche.
 */
function remove(todo) {
  const index = todo.dataset.index; // Récupère l'index de la tâche
  todosJson.splice(index, 1); // Supprime la tâche du tableau
  showTodos(); // Réaffiche la liste des tâches après suppression
  localStorage.setItem("todos", JSON.stringify(todosJson)); // Met à jour le localStorage après suppression
}

// GESTION DES FILTRES POUR LES TÂCHES

/**
 * Gestion des filtres (afficher toutes les tâches, seulement les complétées, ou seulement les en attente).
 */
filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    if (el.classList.contains('active')) {
      el.classList.remove('active'); // Désactive le filtre si déjà activé
      filter = ''; // Réinitialise le filtre
    } else {
      filters.forEach(tag => tag.classList.remove('active')); // Désactive tous les autres filtres
      el.classList.add('active'); // Active le filtre sélectionné
      filter = e.target.dataset.filter; // Récupère la valeur du filtre (completed/pending)
    }
    showTodos(); // Réaffiche les tâches en fonction du filtre
  });
});

// SUPPRIMER TOUTES LES TÂCHES

/**
 * Supprime toutes les tâches de la liste.
 */
deleteAllButton.addEventListener("click", () => {
  todosJson = []; // Vide le tableau des tâches
  localStorage.setItem("todos", JSON.stringify(todosJson)); // Met à jour le localStorage
  showTodos(); // Réaffiche la liste (qui sera vide)
});
